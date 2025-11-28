/**
 * Testes para o algoritmo de sorteio do Amigo Oculto
 * Garante que cada participante seja sorteado por apenas uma pessoa
 */

import { performDraw } from './crypto';

interface Participant {
  name: string;
  phone: string;
}

describe('Algoritmo de Sorteio - Amigo Oculto', () => {
  
  test('Deve garantir que cada pessoa dá presente para exatamente uma pessoa', () => {
    const participants: Participant[] = [
      { name: 'Alice', phone: '+5511111111111' },
      { name: 'Bob', phone: '+5511222222222' },
      { name: 'Carol', phone: '+5511333333333' },
      { name: 'David', phone: '+5511444444444' },
      { name: 'Eve', phone: '+5511555555555' },
    ];

    const result = performDraw(participants);

    // Cada participante deve ter exatamente um resultado
    expect(result.length).toBe(participants.length);

    // Verificar que cada pessoa aparece exatamente uma vez como "giver"
    const givers = result.map(r => r.giver);
    const uniqueGivers = new Set(givers);
    expect(uniqueGivers.size).toBe(participants.length);
  });

  test('Deve garantir que cada pessoa recebe presente de exatamente uma pessoa', () => {
    const participants: Participant[] = [
      { name: 'Alice', phone: '+5511111111111' },
      { name: 'Bob', phone: '+5511222222222' },
      { name: 'Carol', phone: '+5511333333333' },
      { name: 'David', phone: '+5511444444444' },
      { name: 'Eve', phone: '+5511555555555' },
    ];

    const result = performDraw(participants);

    // Verificar que cada pessoa aparece exatamente uma vez como "receiver"
    const receivers = result.map(r => r.receiver);
    const uniqueReceivers = new Set(receivers);
    expect(uniqueReceivers.size).toBe(participants.length);

    // Contar quantas vezes cada pessoa é sorteada
    const receiverCount: Record<string, number> = {};
    receivers.forEach(receiver => {
      receiverCount[receiver] = (receiverCount[receiver] || 0) + 1;
    });

    // Cada pessoa deve ser sorteada exatamente uma vez
    Object.values(receiverCount).forEach(count => {
      expect(count).toBe(1);
    });
  });

  test('Ninguém deve tirar a si mesmo', () => {
    const participants: Participant[] = [
      { name: 'Alice', phone: '+5511111111111' },
      { name: 'Bob', phone: '+5511222222222' },
      { name: 'Carol', phone: '+5511333333333' },
      { name: 'David', phone: '+5511444444444' },
    ];

    const result = performDraw(participants);

    // Verificar que ninguém tirou a si mesmo
    result.forEach(match => {
      expect(match.giver).not.toBe(match.receiver);
    });
  });

  test('Deve funcionar com número mínimo de participantes (3)', () => {
    const participants: Participant[] = [
      { name: 'Alice', phone: '+5511111111111' },
      { name: 'Bob', phone: '+5511222222222' },
      { name: 'Carol', phone: '+5511333333333' },
    ];

    const result = performDraw(participants);

    expect(result.length).toBe(3);

    // Verificar unicidade de receivers
    const receivers = result.map(r => r.receiver);
    const uniqueReceivers = new Set(receivers);
    expect(uniqueReceivers.size).toBe(3);

    // Ninguém tira a si mesmo
    result.forEach(match => {
      expect(match.giver).not.toBe(match.receiver);
    });
  });

  test('Deve funcionar com muitos participantes (20)', () => {
    const participants: Participant[] = Array.from({ length: 20 }, (_, i) => ({
      name: `Pessoa ${i + 1}`,
      phone: `+551199999${String(i).padStart(4, '0')}`,
    }));

    const result = performDraw(participants);

    expect(result.length).toBe(20);

    // Verificar que cada pessoa recebe de exatamente uma pessoa
    const receivers = result.map(r => r.receiver);
    const receiverCount: Record<string, number> = {};
    receivers.forEach(receiver => {
      receiverCount[receiver] = (receiverCount[receiver] || 0) + 1;
    });

    Object.values(receiverCount).forEach(count => {
      expect(count).toBe(1);
    });
  });

  test('Deve criar um ciclo completo (todos conectados)', () => {
    const participants: Participant[] = [
      { name: 'Alice', phone: '+5511111111111' },
      { name: 'Bob', phone: '+5511222222222' },
      { name: 'Carol', phone: '+5511333333333' },
      { name: 'David', phone: '+5511444444444' },
    ];

    const result = performDraw(participants);

    // Criar mapa de quem dá para quem
    const givesTo: Record<string, string> = {};
    result.forEach(match => {
      givesTo[match.giver] = match.receiver;
    });

    // Verificar que existe um ciclo completo
    // Começar de qualquer pessoa e seguir a cadeia
    let current = participants[0].name;
    const visited = new Set<string>();

    for (let i = 0; i < participants.length; i++) {
      expect(visited.has(current)).toBe(false); // Não deve visitar a mesma pessoa duas vezes
      visited.add(current);
      current = givesTo[current];
    }

    // Deve voltar para a pessoa inicial
    expect(current).toBe(participants[0].name);
    // Deve ter visitado todos
    expect(visited.size).toBe(participants.length);
  });

  test('Múltiplas execuções devem produzir resultados válidos', () => {
    const participants: Participant[] = [
      { name: 'Alice', phone: '+5511111111111' },
      { name: 'Bob', phone: '+5511222222222' },
      { name: 'Carol', phone: '+5511333333333' },
      { name: 'David', phone: '+5511444444444' },
      { name: 'Eve', phone: '+5511555555555' },
    ];

    // Executar 100 vezes para garantir consistência
    for (let i = 0; i < 100; i++) {
      const result = performDraw(participants);

      // Verificar que cada pessoa recebe de exatamente uma pessoa
      const receivers = result.map(r => r.receiver);
      const receiverCount: Record<string, number> = {};
      receivers.forEach(receiver => {
        receiverCount[receiver] = (receiverCount[receiver] || 0) + 1;
      });

      Object.values(receiverCount).forEach(count => {
        expect(count).toBe(1);
      });

      // Ninguém tira a si mesmo
      result.forEach(match => {
        expect(match.giver).not.toBe(match.receiver);
      });
    }
  });

  test('Deve garantir que não há duplicatas de receivers', () => {
    const participants: Participant[] = [
      { name: 'Alice', phone: '+5511111111111' },
      { name: 'Bob', phone: '+5511222222222' },
      { name: 'Carol', phone: '+5511333333333' },
      { name: 'David', phone: '+5511444444444' },
      { name: 'Eve', phone: '+5511555555555' },
      { name: 'Frank', phone: '+5511666666666' },
    ];

    const result = performDraw(participants);

    const receivers = result.map(r => r.receiver);
    
    // Verificar que não há duplicatas
    for (let i = 0; i < receivers.length; i++) {
      for (let j = i + 1; j < receivers.length; j++) {
        expect(receivers[i]).not.toBe(receivers[j]);
      }
    }
  });

  test('Todos os participantes devem estar presentes como givers e receivers', () => {
    const participants: Participant[] = [
      { name: 'Alice', phone: '+5511111111111' },
      { name: 'Bob', phone: '+5511222222222' },
      { name: 'Carol', phone: '+5511333333333' },
      { name: 'David', phone: '+5511444444444' },
    ];

    const result = performDraw(participants);

    const participantNames = participants.map(p => p.name);
    const givers = result.map(r => r.giver);
    const receivers = result.map(r => r.receiver);

    // Todos os participantes devem ser givers
    participantNames.forEach(name => {
      expect(givers).toContain(name);
    });

    // Todos os participantes devem ser receivers
    participantNames.forEach(name => {
      expect(receivers).toContain(name);
    });
  });
});
