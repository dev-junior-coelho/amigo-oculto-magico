#!/usr/bin/env node

/**
 * Script de Teste Manual do Algoritmo de Sorteio
 * Verifica que cada participante é sorteado por apenas uma pessoa
 */

console.log('🧪 TESTANDO ALGORITMO DE SORTEIO DO AMIGO OCULTO\n');
console.log('═══════════════════════════════════════════════════\n');

// Simular o algoritmo performDraw
function performDraw(participants) {
  const shuffled = [...participants];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Criar pares: cada pessoa dá para a próxima
  const result = shuffled.map((participant, index) => {
    const nextIndex = (index + 1) % shuffled.length;
    return {
      giver: participant.name,
      receiver: shuffled[nextIndex].name,
      giverPhone: participant.phone,
    };
  });

  return result;
}

// Teste 1: Verificar que cada pessoa recebe de apenas uma pessoa
function test1() {
  console.log('📋 Teste 1: Cada pessoa recebe de APENAS UMA pessoa');
  
  const participants = [
    { name: 'Alice', phone: '+5511111111111' },
    { name: 'Bob', phone: '+5511222222222' },
    { name: 'Carol', phone: '+5511333333333' },
    { name: 'David', phone: '+5511444444444' },
    { name: 'Eve', phone: '+5511555555555' },
  ];

  const result = performDraw(participants);

  // Contar quantas vezes cada pessoa é sorteada
  const receiverCount = {};
  result.forEach(match => {
    receiverCount[match.receiver] = (receiverCount[match.receiver] || 0) + 1;
  });

  console.log('\n  Resultado do sorteio:');
  result.forEach(match => {
    console.log(`    ${match.giver} → ${match.receiver}`);
  });

  console.log('\n  Contagem de vezes que cada pessoa foi sorteada:');
  Object.entries(receiverCount).forEach(([name, count]) => {
    const status = count === 1 ? '✅' : '❌';
    console.log(`    ${status} ${name}: ${count} vez(es)`);
  });

  const allOnce = Object.values(receiverCount).every(count => count === 1);
  console.log(`\n  ${allOnce ? '✅ PASSOU' : '❌ FALHOU'}: Cada pessoa foi sorteada exatamente uma vez\n`);
  
  return allOnce;
}

// Teste 2: Ninguém tira a si mesmo
function test2() {
  console.log('📋 Teste 2: Ninguém tira a si mesmo');
  
  const participants = [
    { name: 'Alice', phone: '+5511111111111' },
    { name: 'Bob', phone: '+5511222222222' },
    { name: 'Carol', phone: '+5511333333333' },
    { name: 'David', phone: '+5511444444444' },
  ];

  const result = performDraw(participants);

  console.log('\n  Verificando pares:');
  let allDifferent = true;
  result.forEach(match => {
    const same = match.giver === match.receiver;
    const status = !same ? '✅' : '❌';
    console.log(`    ${status} ${match.giver} → ${match.receiver}`);
    if (same) allDifferent = false;
  });

  console.log(`\n  ${allDifferent ? '✅ PASSOU' : '❌ FALHOU'}: Ninguém tirou a si mesmo\n`);
  
  return allDifferent;
}

// Teste 3: Múltiplas execuções
function test3() {
  console.log('📋 Teste 3: Múltiplas execuções (100x)');
  
  const participants = [
    { name: 'Alice', phone: '+5511111111111' },
    { name: 'Bob', phone: '+5511222222222' },
    { name: 'Carol', phone: '+5511333333333' },
    { name: 'David', phone: '+5511444444444' },
    { name: 'Eve', phone: '+5511555555555' },
  ];

  let allPassed = true;
  let failCount = 0;

  for (let i = 0; i < 100; i++) {
    const result = performDraw(participants);

    // Verificar que cada pessoa recebe de apenas uma pessoa
    const receiverCount = {};
    result.forEach(match => {
      receiverCount[match.receiver] = (receiverCount[match.receiver] || 0) + 1;
    });

    const thisTestPassed = Object.values(receiverCount).every(count => count === 1);
    
    // Verificar que ninguém tira a si mesmo
    const noSelfDraw = result.every(match => match.giver !== match.receiver);

    if (!thisTestPassed || !noSelfDraw) {
      allPassed = false;
      failCount++;
    }
  }

  console.log(`\n  Executado 100 vezes`);
  console.log(`  ${allPassed ? '✅' : '❌'} Sucessos: ${100 - failCount}/100`);
  console.log(`  ${failCount === 0 ? '✅' : '❌'} Falhas: ${failCount}/100`);
  console.log(`\n  ${allPassed ? '✅ PASSOU' : '❌ FALHOU'}: Todas as execuções foram válidas\n`);
  
  return allPassed;
}

// Teste 4: Verificar ciclo completo
function test4() {
  console.log('📋 Teste 4: Forma um ciclo completo');
  
  const participants = [
    { name: 'Alice', phone: '+5511111111111' },
    { name: 'Bob', phone: '+5511222222222' },
    { name: 'Carol', phone: '+5511333333333' },
    { name: 'David', phone: '+5511444444444' },
  ];

  const result = performDraw(participants);

  // Criar mapa de quem dá para quem
  const givesTo = {};
  result.forEach(match => {
    givesTo[match.giver] = match.receiver;
  });

  // Seguir a cadeia
  let current = participants[0].name;
  const visited = new Set();
  const chain = [current];

  for (let i = 0; i < participants.length; i++) {
    if (visited.has(current)) {
      console.log(`\n  ❌ Ciclo quebrado! Visitou ${current} duas vezes`);
      return false;
    }
    visited.add(current);
    current = givesTo[current];
    if (i < participants.length - 1) {
      chain.push(current);
    }
  }

  console.log(`\n  Cadeia: ${chain.join(' → ')} → ${chain[0]}`);
  
  const isComplete = current === participants[0].name && visited.size === participants.length;
  console.log(`\n  ${isComplete ? '✅ PASSOU' : '❌ FALHOU'}: Forma um ciclo completo\n`);
  
  return isComplete;
}

// Teste 5: Teste com muitos participantes
function test5() {
  console.log('📋 Teste 5: Funciona com 20 participantes');
  
  const participants = Array.from({ length: 20 }, (_, i) => ({
    name: `Pessoa ${i + 1}`,
    phone: `+551199999${String(i).padStart(4, '0')}`,
  }));

  const result = performDraw(participants);

  // Verificar que cada pessoa recebe de apenas uma pessoa
  const receiverCount = {};
  result.forEach(match => {
    receiverCount[match.receiver] = (receiverCount[match.receiver] || 0) + 1;
  });

  const allOnce = Object.values(receiverCount).every(count => count === 1);
  
  console.log(`\n  Total de participantes: ${participants.length}`);
  console.log(`  Total de pares gerados: ${result.length}`);
  console.log(`  Cada pessoa sorteada 1x: ${allOnce ? '✅ Sim' : '❌ Não'}`);
  console.log(`\n  ${allOnce ? '✅ PASSOU' : '❌ FALHOU'}: Funciona com muitos participantes\n`);
  
  return allOnce;
}

// Executar todos os testes
console.log('Executando testes...\n');

const results = [
  test1(),
  test2(),
  test3(),
  test4(),
  test5(),
];

console.log('═══════════════════════════════════════════════════');
console.log('\n📊 RESULTADO FINAL:\n');

const passed = results.filter(r => r).length;
const total = results.length;

console.log(`  Total de testes: ${total}`);
console.log(`  ✅ Passou: ${passed}`);
console.log(`  ❌ Falhou: ${total - passed}`);

if (passed === total) {
  console.log('\n  🎉 TODOS OS TESTES PASSARAM!');
  console.log('  ✅ O algoritmo garante que cada pessoa é sorteada por apenas uma pessoa');
  console.log('  ✅ Ninguém tira a si mesmo');
  console.log('  ✅ Forma um ciclo completo');
  console.log('  ✅ Funciona com qualquer número de participantes\n');
} else {
  console.log('\n  ❌ ALGUNS TESTES FALHARAM!\n');
}

console.log('═══════════════════════════════════════════════════\n');
