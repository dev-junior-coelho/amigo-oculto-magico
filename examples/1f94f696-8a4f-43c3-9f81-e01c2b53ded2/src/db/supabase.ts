import { createClient } from '@supabase/supabase-js';
import type { Participant } from '../types/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const customFetch = async (
  input: string | Request | URL,
  init?: RequestInit
): Promise<Response> => {
  const urlParts = new URL(String(input));
  let url = urlParts.pathname + urlParts.search;
  if (!/bce.*.baidu.com$/.test(document.location.hostname)) {
    url = url.replace("/miaoda/backend/", "/miaoda/runtime/backend/");
  }
  return fetch(url, init);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: import.meta.env.VITE_SUPABASE_PROXY !== "false" ? customFetch : undefined
  }
});

export const api = {
  // 添加参与者
  async addParticipant(participant: Omit<Participant, 'id' | 'is_winner' | 'created_at'>) {
    const { data, error } = await supabase
      .from('participants')
      .insert([participant])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 获取所有参与者
  async getAllParticipants() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // 获取未中奖参与者
  async getEligibleParticipants() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('is_winner', false);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // 获取中奖者
  async getWinners() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('is_winner', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // 更新中奖状态
  async updateWinnerStatus(participantIds: string[]) {
    const { data, error } = await supabase
      .from('participants')
      .update({ is_winner: true })
      .in('id', participantIds)
      .select();
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // 重置所有中奖状态
  async resetAllWinners() {
    const { data, error } = await supabase
      .from('participants')
      .update({ is_winner: false })
      .eq('is_winner', true)
      .select();
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // 检查手机号是否已存在
  async checkPhoneExists(phone: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('id')
      .eq('phone', phone)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};