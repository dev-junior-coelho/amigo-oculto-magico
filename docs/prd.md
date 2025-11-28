# Aplicativo de Amigo Oculto - Documento de Requisitos

## 1. Visão Geral do Aplicativo

### 1.1 Nome do Aplicativo
Amigo Oculto Mágico

### 1.2 Descrição
Aplicativo web para organização de sorteios de Amigo Oculto com distribuição segura via WhatsApp, utilizando sistema de criptografia e tokens mágicos para revelação individual dos resultados.\n
## 2. Funcionalidades Principais
\n### 2.1 Painel do Administrador
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
## 4. Regras de Segurança do Firebase

### 4.1 Permissões de Criação
- groups e matches: allow create: if true (permite ao Admin criar eventos)
\n### 4.2 Permissões de Leitura
- matches: allow read: if true (permite participantes buscarem dados criptografados)

### 4.3 Restrições
- groups e matches: allow update, delete: if false (previne alterações após sorteio)

## 5. Implementação Técnica

### 5.1 Conexão com API do WhatsApp
- Utilizar WhatsApp Business API ou serviço de integração compatível
- Configurar credenciais de autenticação (API Key/Token)
- Implementar endpoint para envio de mensagens com links personalizados
- Formato da mensagem: texto pré-definido + link com token único
- Tratamento de erros de envio e confirmação de entrega

### 5.2 Conexão com Banco de Dados Firebase
- Configurar Firebase SDK no projeto
- Adicionar arquivo de configuração com credenciais do Firebase (firebaseConfig)\n- Inicializar Firestore Database
- Implementar funções de criação (groups e matches)
- Implementar funções de leitura (busca de dados criptografados)
- Aplicar regras de segurança definidas na seção 4

### 5.3 Deploy da Aplicação
- Plataforma recomendada: Firebase Hosting, Vercel ou Netlify
- Configurar variáveis de ambiente para credenciais sensíveis (Firebase Config, WhatsApp API Key)
- Build do projeto para produção
- Configurar domínio personalizado (opcional)
- Habilitar HTTPS para segurança
- Configurar regras de cache e otimização de performance
\n## 6. Estilo de Design

- Paleta de cores: Verde vibrante (#25D366 - cor do WhatsApp) como cor principal, combinado com branco e cinza claro para fundos, criando contraste limpo e moderno
- Layout: Design em cards para lista de participantes, com espaçamento generoso e hierarquia visual clara entre seções de setup e distribuição
- Elementos visuais: Botões arredondados (border-radius: 8px) comícones emoji integrados, sombras suaves (box-shadow) para profundidade nos cards
- Tipografia: Fonte sans-serif moderna, com peso bold para nomes de participantes e títulos, garantindo legibilidade em dispositivos móveis
- Feedback visual: Estados hover e active nos botões, animação de loading durante processo de sorteio e descriptografia