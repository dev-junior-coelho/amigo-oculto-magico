# 🎁 Amigo Oculto Mágico

## Visão Geral

**Amigo Oculto Mágico** é um aplicativo web completo para organização de sorteios de Amigo Oculto (Secret Santa) com distribuição segura via WhatsApp. O sistema utiliza criptografia avançada e tokens mágicos únicos para garantir que cada participante descubra apenas quem tirou, mantendo o segredo até o momento da revelação.

## ✨ Funcionalidades Principais

### 🎯 Para Organizadores (Administradores)

1. **Criação de Grupo**
   - Defina um nome personalizado para o sorteio
   - Adicione participantes com nome e WhatsApp (com DDD)
   - Validação automática de números de telefone
   - Remoção individual de participantes antes do sorteio

2. **Sorteio Inteligente**
   - Algoritmo que garante que ninguém tire a si mesmo
   - Mínimo de 3 participantes para realizar o sorteio
   - Geração automática de tokens criptografados
   - Processo seguro e aleatório

3. **Distribuição via WhatsApp**
   - Botão direto para enviar mensagem via WhatsApp
   - Mensagem pré-formatada com link mágico personalizado
   - Opção de copiar link manualmente
   - Acesso ao painel de distribuição via token de administrador

### 🎁 Para Participantes

1. **Revelação Mágica**
   - Acesso direto via link recebido no WhatsApp
   - Opção de inserir token manualmente
   - Descriptografia automática e segura
   - Interface visual atraente com animações

2. **Segurança Total**
   - Cada participante só consegue ver quem tirou
   - Tokens únicos e não reutilizáveis
   - Criptografia AES-256-GCM
   - Dados protegidos no banco de dados

## 🎨 Design e Interface

### Paleta de Cores
- **Cor Principal**: Verde WhatsApp (#25D366 / HSL: 142 70% 49%)
- **Esquema**: Monocromático com variações de verde
- **Estilo**: Moderno, limpo e profissional
- **Tema**: Suporte a modo claro e escuro

### Elementos Visuais
- Cards com sombras suaves para profundidade
- Botões arredondados (border-radius: 8px)
- Ícones emoji integrados para maior expressividade
- Animações suaves de transição
- Layout responsivo para mobile e desktop

## 🔒 Segurança e Criptografia

### Sistema de Tokens

1. **Token de Administrador**
   - Gerado automaticamente ao criar o grupo
   - Permite acesso à página de distribuição
   - 48 caracteres hexadecimais únicos

2. **Tokens Mágicos dos Participantes**
   - Um token único para cada participante
   - 64 caracteres hexadecimais
   - Usado como chave de descriptografia

### Criptografia

- **Algoritmo**: AES-256-GCM (Advanced Encryption Standard)
- **Derivação de Chave**: PBKDF2 com 100.000 iterações
- **Salt**: 16 bytes aleatórios por registro
- **IV (Initialization Vector)**: 12 bytes aleatórios
- **Processo**:
  1. Dados do sorteio são criptografados no cliente
  2. Apenas dados criptografados são armazenados no banco
  3. Descriptografia ocorre apenas no dispositivo do participante
  4. Token mágico é a única chave de descriptografia

## 🗄️ Arquitetura do Banco de Dados

### Tabela: `groups`
```sql
- id (uuid): Identificador único do grupo
- name (text): Nome do sorteio
- admin_token (text): Token de acesso do administrador
- created_at (timestamp): Data de criação
```

### Tabela: `matches`
```sql
- id (uuid): Identificador único do match
- group_id (uuid): Referência ao grupo
- participant_name (text): Nome do participante
- participant_phone (text): WhatsApp com DDD
- encrypted_data (text): Dados criptografados
- token (text): Token mágico único
- created_at (timestamp): Data de criação
```

## 🚀 Fluxo de Uso

### Para o Organizador

1. **Acesse a página inicial**
   - Digite o nome do grupo
   - Adicione participantes (mínimo 3)
   - Clique em "Sortear e Gerar Links Mágicos"

2. **Distribua os links**
   - Você será redirecionado para a página de distribuição
   - Para cada participante, clique em "Enviar Link Mágico 🟢"
   - O WhatsApp abrirá com a mensagem pronta
   - Ou copie o link manualmente

3. **Guarde o link de administração**
   - Salve o link da página de distribuição
   - Use-o para acessar novamente se necessário

### Para o Participante

1. **Receba o link via WhatsApp**
   - Clique no link recebido
   - Ou acesse manualmente e cole o token

2. **Descubra quem você tirou**
   - O sistema descriptografa automaticamente
   - Veja o nome da pessoa sorteada
   - Mantenha segredo! 🤫

## 📱 Integração com WhatsApp

### Formato da Mensagem
```
🎁 *Amigo Oculto Mágico* 🎁

Olá [Nome do Participante]!

Você foi sorteado(a) no Amigo Oculto! 🎉

Clique no link abaixo para descobrir quem você tirou:
[Link Único]

✨ Mantenha segredo! ✨
```

### Funcionamento
- Utiliza o protocolo `wa.me` do WhatsApp
- Abre automaticamente o aplicativo ou WhatsApp Web
- Mensagem pré-preenchida, pronta para enviar
- Funciona em qualquer dispositivo

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **React Router** - Navegação entre páginas
- **Sonner** - Notificações toast elegantes
- **Lucide React** - Ícones SVG

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Web Crypto API** - Criptografia nativa do navegador

### Build & Deploy
- **Vite** - Build tool moderna e rápida
- **Biome** - Linter e formatter

## 🎯 Casos de Uso

1. **Amigo Oculto Familiar**
   - Organize o sorteio da família
   - Envie os links para todos via WhatsApp
   - Cada um descobre em seu próprio dispositivo

2. **Amigo Oculto Corporativo**
   - Sorteio entre colegas de trabalho
   - Distribuição rápida e segura
   - Sem necessidade de reunir todos

3. **Amigo Oculto de Amigos**
   - Grupos de amigos distantes
   - Coordenação via WhatsApp
   - Revelação individual e privada

4. **Eventos Especiais**
   - Festas de fim de ano
   - Aniversários
   - Confraternizações

## 🔐 Privacidade e Segurança

### Garantias
- ✅ Dados criptografados em repouso
- ✅ Descriptografia apenas no dispositivo do usuário
- ✅ Tokens únicos e não reutilizáveis
- ✅ Sem armazenamento de dados sensíveis em texto plano
- ✅ Sem rastreamento de usuários
- ✅ Sem coleta de dados pessoais além do necessário

### Limitações
- ⚠️ Guarde o link de administração em local seguro
- ⚠️ Não compartilhe tokens entre participantes
- ⚠️ Uma vez revelado, o resultado não pode ser alterado

## 📊 Validações Implementadas

### Validação de Participantes
- Nome não pode estar vazio
- WhatsApp deve estar no formato: +5511999999999
- Não permite números duplicados
- Mínimo de 3 participantes para sortear

### Validação de Tokens
- Tokens devem ter o formato correto
- Verificação de existência no banco de dados
- Validação de integridade dos dados criptografados
- Mensagens de erro claras e amigáveis

### Validação de Sorteio
- Algoritmo garante que ninguém tire a si mesmo
- Máximo de 100 tentativas de sorteio
- Fallback em caso de impossibilidade matemática

## 🎨 Responsividade

### Mobile (< 768px)
- Layout vertical otimizado
- Botões em largura total
- Texto e ícones redimensionados
- Espaçamento ajustado para telas pequenas

### Desktop (≥ 1280px)
- Layout horizontal quando apropriado
- Múltiplas colunas para formulários
- Maior densidade de informação
- Hover states e interações aprimoradas

## 🌟 Diferenciais

1. **Sem Cadastro Necessário**
   - Não precisa criar conta
   - Acesso direto via tokens
   - Experiência sem fricção

2. **Criptografia de Ponta a Ponta**
   - Segurança máxima
   - Privacidade garantida
   - Tecnologia bancária

3. **Integração Nativa com WhatsApp**
   - Distribuição instantânea
   - Familiar para todos os usuários
   - Alta taxa de entrega

4. **Interface Intuitiva**
   - Design limpo e moderno
   - Instruções claras
   - Feedback visual constante

5. **Totalmente Gratuito**
   - Sem custos ocultos
   - Sem limites de uso
   - Sem anúncios

## 📝 Notas Técnicas

### Performance
- Build otimizado com Vite
- Code splitting automático
- Lazy loading de rotas
- Imagens e assets otimizados

### Acessibilidade
- Semântica HTML adequada
- Labels em todos os inputs
- Contraste de cores adequado
- Navegação por teclado

### Manutenibilidade
- Código TypeScript tipado
- Componentes reutilizáveis
- Separação de responsabilidades
- Documentação inline

## 🎉 Conclusão

O **Amigo Oculto Mágico** é uma solução completa, segura e moderna para organizar sorteios de Amigo Oculto. Com foco em segurança, privacidade e experiência do usuário, o aplicativo torna o processo de sorteio divertido e sem complicações, permitindo que todos se concentrem no que realmente importa: a alegria de presentear! 🎁✨
