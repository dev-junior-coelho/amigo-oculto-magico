# Aplicativo de Amigo Oculto - Documento de Requisitos

## 1. Visão Geral do Aplicativo

### 1.1 Nome do Aplicativo
Amigo Oculto Mágico\n
### 1.2 Descrição
Aplicativo web para organização de sorteios de Amigo Oculto com distribuição segura via WhatsApp, utilizando sistema de criptografia e tokens mágicos para revelação individual dos resultados.

## 2. Funcionalidades Principais

### 2.1 Painel do Administrador
\n#### 2.1.1 Tela de Setup (Home)
- Campos de entrada: Nome do Participante e WhatsApp (com DDD)
- Lista de participantes cadastrados com opção de remoção individual
- Botão 'Sortear e Gerar Links'
- Validação: Mínimo de 3 participantes para habilitar o sorteio\n
#### 2.1.2 Tela de Distribuição
- Listagem completa de todos os participantes com seus números de telefone
- Para cada participante: botão 'Enviar Link Mágico 🟢' que abre WhatsApp com mensagem pré-preenchida contendo o Token Mágico
- Botão alternativo 'Copiar Código' para copiar o Token Secreto manualmente\n
### 2.2 Interfacedo Participante

#### 2.2.1 Recebimento
- Participante recebe mensagem via WhatsApp com link contendo token

#### 2.2.2 Tela de Revelação
- Leitura automática do token quando acessado via link direto
- Campo manual para inserção do Token Mágico (caso acesso direto)
- Processo de descriptografia: utiliza ID_DO_DOC_NO_FIREBASE para buscar encryptedData no Firestore e CHAVE_SECRETA para descriptografar
- Exibição em destaque do nome do Amigo Oculto sorteado (Receiver)\n
## 3. Integração Técnica
\n### 3.1 Firebase Firestore
- Coleções: groups e matches
- Armazenamento de dados criptografados (encryptedData)
- Estrutura de Token: ID_DO_DOC_NO_FIREBASE + CHAVE_SECRETA
\n### 3.2 API do WhatsApp
- Integração para envio de links mágicos com mensagem pré-formatada

### 3.3 Sistema de Criptografia
- Criptografia dos dados de sorteio\n- Descriptografia client-side usando chave secreta do token\n
## 4. Algoritmo de Sorteio com Garantia de Unicidade\n
### 4.1 Lógica de Sorteio
- Implementar algoritmo de embaralhamento (Fisher-Yates shuffle) para garantir distribuição aleatória
- Cada participante (Giver) recebe exatamente um participante sorteado (Receiver)
- Cada participante (Receiver) é sorteado por exatamente um participante (Giver)
- Validação: Nenhum participante pode sortear a si mesmo
\n### 4.2 Estrutura de Dados
- Armazenar pares únicos (Giver → Receiver) no Firestore
- Cada documento em 'matches' contém: giverId, receiverId, encryptedData, timestamp
- Índice único composto por groupId + giverId para prevenir duplicatas

### 4.3 Validação de Integridade
- Antes de salvar no Firestore: verificar se todos os participantes aparecem exatamente uma vez como Receiver
- Implementar transação atômica para garantir consistência dos dados

## 5. Testes de Validação\n
### 5.1 Testes Unitários\n- Teste 1: Verificar se algoritmo de sorteio gera pares únicos (cada Receiver aparece apenas uma vez)
- Teste 2: Validar que nenhum participante sorteia a si mesmo
- Teste 3: Confirmar que número de pares gerados é igual ao número de participantes
- Teste 4: Testar embaralhamento com diferentes tamanhos de grupos (3, 5, 10, 50 participantes)

### 5.2 Testes de Integração
- Teste 5: Simular sorteio completo e verificar integridade dos dados no Firestore\n- Teste 6: Validar que tokens únicos são gerados para cada participante
- Teste 7: Testar descriptografia de múltiplos tokens simultaneamente
- Teste 8: Verificar comportamento em caso de tentativa de acesso com token inválido

### 5.3 Testes de Segurança
- Teste 9: Tentar acessar dados de outro participante usando token modificado
- Teste 10: Validar que regras de segurança do Firebase impedem leitura não autorizada
- Teste 11: Testar proteção contra ataques de força bruta em tokens

## 6. Regras de Segurança do Firebase

### 6.1 Permissões de Criação
- groups e matches: allow create: if true (permite ao Admin criar eventos)

### 6.2 Permissões de Leitura
- matches: allow read: if true (permite participantes buscarem dados criptografados)\n
### 6.3 Restrições
- groups e matches: allow update, delete: if false (previne alterações após sorteio)

### 6.4 Validação de Unicidade
- Implementar regra de índice único no Firestore para combinação groupId + giverId
- Rejeitar tentativas de criação de matches duplicados
\n## 7. Implementação Técnica

### 7.1 Conexão com API do WhatsApp
- Utilizar WhatsApp Business API ou serviço de integração compatível
- Configurar credenciais de autenticação (API Key/Token)
- Implementar endpoint para envio de mensagens com links personalizados
- Formato da mensagem: texto pré-definido + link com token único
- Tratamento de erros de envio e confirmação de entrega

### 7.2 Conexão com Banco de Dados Firebase
- Configurar Firebase SDK no projeto
- Adicionar arquivo de configuração com credenciais do Firebase (firebaseConfig)
- Inicializar Firestore Database
- Implementar funções de criação (groups e matches) com transações atômicas\n- Implementar funções de leitura (busca de dados criptografados)
- Aplicar regras de segurança definidas na seção 6\n- Configurar índices compostos para garantir unicidade

### 7.3 Integração com GitHub
- Conectar projeto ao repositório GitHub da conta: devjuniorcoelho@gmail.com
- Configurar repositório remoto como origin
- Estrutura de branches: main (produção), develop (desenvolvimento), feature/* (novas funcionalidades)
- Implementar workflow de commits com mensagens descritivas seguindo padrão Conventional Commits
- Configurar .gitignore para excluir node_modules, arquivos de ambiente (.env) e builds locais
- Habilitar GitHub Actions para CI/CD automático
- Configurar proteção de branch main (require pull request reviews)
- Sincronizar automaticamente com Vercel para deploy contínuo

### 7.4 Deploy da Aplicação no Vercel
- Plataforma de deploy: Vercel
- Configurar projeto no Vercel CLI ou via dashboard\n- Conectar repositório GitHub ao Vercel para deploy automático
- Adicionar variáveis de ambiente no painel do Vercel: Firebase Config (FIREBASE_API_KEY, FIREBASE_PROJECT_ID, etc.) e WhatsApp API Key\n- Build automático a partir do repositório Git (GitHub, GitLab ou Bitbucket)
- Configurar domínio personalizado (opcional)
- HTTPS habilitado automaticamente pelo Vercel
- Configurar regras de cache e otimização de performance (Vercel Edge Network)\n- Habilitar preview deployments para testes antes de produção

## 8. Estilo de Design
\n- Paleta de cores: Gradiente moderno de roxo profundo (#6B46C1) a azul vibrante (#3B82F6) como cores principais, com fundo em tons de cinza escuro (#1F2937) e elementos em branco puro para contraste máximo
- Layout: Design em grid responsivo com cards flutuantes, utilizando glassmorphism (fundo translúcido com blur) para elementos de destaque, espaçamento amplo e hierarquia visual baseada em tamanho e peso tipográfico
- Elementos visuais: Botões com border-radius de 12px e efeito de elevação (box-shadow: 0 4px 20px rgba(0,0,0,0.15)), ícones em linha com texto, micro-interações animadas (scale e opacity) em hover e click\n- Tipografia: Fonte sans-serif geométrica (Inter ou Poppins), com peso 600 para títulos, 500 para botões e 400 para corpo de texto, garantindo legibilidade em todos os tamanhos de tela
- Feedback visual: Animações de loading com spinner customizado, transições suaves (transition: all 0.3s ease), estados de sucesso com checkmark animado, estados de erro com shake animation, progress bar durante processo de sorteio
- Responsividade: Layout adaptativo com breakpoints para mobile (< 640px), tablet (640px - 1024px) e desktop (> 1024px), com componentes empilhados verticalmente em mobile e disposição horizontal em telas maiores