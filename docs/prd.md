# Aplicativo de Amigo Oculto - Documento de Requisitos

## 1. Visão Geral do Aplicativo

### 1.1 Nomedo Aplicativo
Amigo Oculto Mágico

### 1.2 Descrição\nAplicativo web para organização de sorteios de Amigo Oculto com distribuição segura via WhatsApp, utilizando sistema de criptografia e tokens mágicos para revelação individual dos resultados.

## 2. Funcionalidades Principais

### 2.1 Painel do Administrador
\n#### 2.1.1 Tela de Setup (Home)
- Campos de entrada: Nome do Participante e WhatsApp (com DDD)
- Lista de participantes cadastrados com opção de remoção individual
- Botão 'Sortear e Gerar Links'
- Validação: Mínimo de 3 participantes para habilitar o sorteio

#### 2.1.2 Tela de Distribuição\n- Listagem completa de todos os participantes com seus números de telefone
- Para cada participante: botão 'Enviar Link Mágico 🟢' que abre WhatsApp com mensagem pré-preenchida contendo o Token Mágico\n- Botão alternativo 'Copiar Código' para copiar o Token Secreto manualmente

### 2.2 Interfacedo Participante

#### 2.2.1 Recebimento\n- Participante recebe mensagem via WhatsApp com link contendo token\n\n#### 2.2.2 Tela de Revelação
- Leitura automática do token quando acessado via link direto
- Campo manual para inserção do Token Mágico (caso acesso direto)\n- Processo de descriptografia: utiliza ID_DO_DOC_NO_FIREBASE para buscar encryptedData no Firestore e CHAVE_SECRETA para descriptografar
- Exibição em destaque do nome do Amigo Oculto sorteado (Receiver)

## 3. Integração Técnica

### 3.1 Firebase Firestore
- Coleções: groups e matches
- Armazenamento de dados criptografados (encryptedData)\n- Estrutura de Token: ID_DO_DOC_NO_FIREBASE + CHAVE_SECRETA\n\n### 3.2 APIdo WhatsApp
- Integração para envio de links mágicos com mensagem pré-formatada
\n### 3.3 Sistema de Criptografia
- Criptografia dos dados de sorteio
- Descriptografia client-side usando chave secreta do token
\n## 4. Regras de Segurança do Firebase

### 4.1 Permissões de Criação
- groups e matches: allow create: if true (permite ao Admin criar eventos)

### 4.2 Permissões de Leitura
- matches: allow read: if true (permite participantes buscarem dados criptografados)

### 4.3 Restrições\n- groups e matches: allow update, delete: if false (previne alterações após sorteio)

## 5. Estilo de Design

- Paleta de cores: Verde vibrante (#25D366 - cordo WhatsApp) como cor principal, combinado com branco e cinza claro para fundos, criando contraste limpo e moderno
- Layout: Design em cards para lista de participantes, com espaçamento generoso e hierarquia visual clara entre seções de setup e distribuição
- Elementos visuais: Botões arredondados (border-radius: 8px) comícones emoji integrados, sombras suaves (box-shadow) para profundidade nos cards\n- Tipografia: Fonte sans-serif moderna, com peso bold para nomes de participantes e títulos, garantindo legibilidade em dispositivos móveis
- Feedback visual: Estados hover e active nos botões, animação de loading durante processo de sorteio e descriptografia