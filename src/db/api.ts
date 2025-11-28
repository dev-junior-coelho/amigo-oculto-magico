// Database API functions

import { supabase } from './supabase';
import type { Group, Match, Participant, DrawResult, MatchWithToken } from '@/types/types';
import { generateMagicToken, generateAdminToken, encryptData, performDraw } from '@/lib/crypto';

/**
 * Cria um novo grupo e realiza o sorteio
 */
export async function createGroupAndDraw(
  groupName: string,
  participants: Participant[]
): Promise<DrawResult> {
  if (participants.length < 3) {
    throw new Error('É necessário pelo menos 3 participantes');
  }

  // Gera token de administrador
  const adminToken = generateAdminToken();

  // Cria o grupo
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({
      name: groupName,
      admin_token: adminToken
    })
    .select()
    .maybeSingle();

  if (groupError || !group) {
    console.error('Erro ao criar grupo:', groupError);
    throw new Error('Erro ao criar grupo. Tente novamente.');
  }

  // Realiza o sorteio
  const participantNames = participants.map(p => p.name);
  const drawResults = performDraw(participantNames);

  // Cria os matches criptografados
  const matchesData: MatchWithToken[] = [];
  const matchesToInsert: Omit<Match, 'id' | 'created_at'>[] = [];

  for (const participant of participants) {
    const assignedTo = drawResults.get(participant.name);
    if (!assignedTo) {
      throw new Error('Erro no sorteio');
    }

    const token = generateMagicToken();
    const encryptedData = await encryptData(assignedTo, token);

    matchesToInsert.push({
      group_id: group.id,
      participant_name: participant.name,
      participant_phone: participant.phone,
      encrypted_data: encryptedData,
      token: token
    });

    matchesData.push({
      participantName: participant.name,
      participantPhone: participant.phone,
      assignedTo: assignedTo,
      token: token
    });
  }

  // Insere todos os matches
  const { error: matchesError } = await supabase
    .from('matches')
    .insert(matchesToInsert);

  if (matchesError) {
    console.error('Erro ao criar matches:', matchesError);
    // Tenta limpar o grupo criado
    await supabase.from('groups').delete().eq('id', group.id);
    throw new Error('Erro ao salvar sorteio. Tente novamente.');
  }

  return {
    groupId: group.id,
    adminToken: adminToken,
    matches: matchesData
  };
}

/**
 * Busca os matches de um grupo usando o token de administrador
 */
export async function getGroupMatches(adminToken: string): Promise<MatchWithToken[]> {
  // Busca o grupo pelo admin token
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select('id')
    .eq('admin_token', adminToken)
    .maybeSingle();

  if (groupError || !group) {
    throw new Error('Grupo não encontrado');
  }

  // Busca os matches do grupo
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('*')
    .eq('group_id', group.id)
    .order('participant_name', { ascending: true });

  if (matchesError) {
    console.error('Erro ao buscar matches:', matchesError);
    throw new Error('Erro ao buscar participantes');
  }

  // Retorna os dados sem descriptografar (apenas para distribuição)
  return Array.isArray(matches) ? matches.map(m => ({
    participantName: m.participant_name,
    participantPhone: m.participant_phone,
    assignedTo: '', // Não revelamos aqui
    token: m.token
  })) : [];
}

/**
 * Busca e descriptografa o match de um participante usando o token mágico
 */
export async function revealMatch(token: string): Promise<{ participantName: string; assignedTo: string }> {
  // Busca o match pelo token
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('participant_name, encrypted_data')
    .eq('token', token)
    .maybeSingle();

  if (matchError || !match) {
    throw new Error('Token inválido ou não encontrado');
  }

  // Descriptografa os dados
  const { decryptData } = await import('@/lib/crypto');
  const assignedTo = await decryptData(match.encrypted_data, token);

  return {
    participantName: match.participant_name,
    assignedTo: assignedTo
  };
}
