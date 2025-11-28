# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-7vco8tnvi77l

# 🎁 Amigo Oculto Mágico

> Aplicativo web moderno para organização de sorteios de Amigo Oculto com distribuição segura via WhatsApp

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/devjuniorcoelho/amigo-oculto-magico)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)

## ✨ Funcionalidades

### Para Organizadores
- 🎯 **Criar Grupos**: Configure seu Amigo Oculto com nome personalizado
- 👥 **Gerenciar Participantes**: Adicione participantes com nome e WhatsApp
- 🔀 **Sorteio Automático**: Algoritmo garante que cada pessoa tira apenas uma vez
- 📱 **Envio via WhatsApp**: Links mágicos enviados diretamente pelo WhatsApp
- 🔗 **Links Únicos**: Cada participante recebe um link exclusivo e criptografado
- 📋 **Painel de Distribuição**: Visualize todos os participantes e envie os links

### Para Participantes
- 🎁 **Revelação Mágica**: Abra o link e descubra quem você tirou
- 🔐 **100% Seguro**: Criptografia AES-256-GCM de nível militar
- 📱 **Responsivo**: Funciona perfeitamente em mobile e desktop
- ✨ **Animações Suaves**: Interface moderna com transições fluidas

## 🎨 Design Moderno

- **Gradientes Vibrantes**: Azul → Roxo → Magenta
- **Animações Fluidas**: Efeitos floating e pulse-glow
- **Cards Elegantes**: Bordas arredondadas com efeito glass
- **Sombras Profundas**: 5 níveis de profundidade
- **Responsivo**: Otimizado para todos os dispositivos

## 🔒 Segurança

✅ **Criptografia AES-256-GCM** (nível militar)  
✅ **PBKDF2** com 100.000 iterações  
✅ **Tokens únicos** e não reutilizáveis  
✅ **Dados criptografados** no banco de dados  
✅ **Descriptografia client-side** (servidor nunca vê os dados)  
✅ **HTTPS automático** via Vercel  

## 🧪 Testes

O algoritmo de sorteio foi testado rigorosamente:

```bash
node test-draw-algorithm.cjs
```

**Resultados:**
- ✅ Cada pessoa é sorteada por apenas uma pessoa (100%)
- ✅ Ninguém tira a si mesmo (100%)
- ✅ Forma um ciclo completo (100%)
- ✅ Funciona com 3 a 100+ participantes (100%)
- ✅ 100 execuções consecutivas sem falhas (100%)

## 🚀 Deploy Rápido

### 1. Deploy no Vercel (1 clique)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/devjuniorcoelho/amigo-oculto-magico)

### 2. Configurar Variáveis de Ambiente

No painel do Vercel, adicione:

```env
VITE_APP_ID=seu-app-id
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 3. Pronto! 🎉

Seu aplicativo estará no ar em 2-5 minutos.

📖 **Guia completo**: Veja [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

## 💻 Desenvolvimento Local

### Pré-requisitos

- Node.js 18+ 
- npm ou pnpm
- Conta no Supabase (gratuita)

### Instalação

```bash
# Clonar repositório
git clone https://github.com/devjuniorcoelho/amigo-oculto-magico.git
cd amigo-oculto-magico

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas credenciais
nano .env

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

## 🗄️ Banco de Dados

### Configurar Supabase

1. Crie uma conta em: https://supabase.com
2. Crie um novo projeto
3. Execute as migrations em `supabase/migrations/`
4. Copie as credenciais para `.env`

### Estrutura do Banco

**Tabela: groups**
- `id` (uuid): ID único do grupo
- `name` (text): Nome do grupo
- `admin_token` (text): Token de administração
- `created_at` (timestamp): Data de criação

**Tabela: matches**
- `id` (uuid): ID único do match
- `group_id` (uuid): Referência ao grupo
- `participant_token` (text): Token único do participante
- `encrypted_data` (text): Dados criptografados
- `created_at` (timestamp): Data de criação

## 📱 Como Usar

### 1. Criar Grupo

1. Acesse o aplicativo
2. Digite o nome do grupo (ex: "Amigo Oculto 2025")
3. Adicione participantes (mínimo 3):
   - Nome completo
   - WhatsApp com DDD (ex: +5511999999999)

### 2. Realizar Sorteio

1. Clique em "Sortear e Gerar Links Mágicos"
2. Aguarde o processamento
3. Você será redirecionado para a página de distribuição

### 3. Distribuir Links

1. Para cada participante, clique em "Enviar Link Mágico 🟢"
2. O WhatsApp abrirá com mensagem pré-formatada
3. Ou use "Copiar Link" para enviar manualmente

### 4. Revelação

1. Participante recebe link via WhatsApp
2. Clica no link
3. Vê automaticamente quem tirou
4. Ou insere o token manualmente

## 🛠️ Tecnologias

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Router** - Roteamento

### Backend
- **Supabase** - Banco de dados PostgreSQL
- **Supabase Auth** - Autenticação (opcional)

### Segurança
- **Web Crypto API** - Criptografia nativa
- **AES-256-GCM** - Algoritmo de criptografia
- **PBKDF2** - Derivação de chaves

### Deploy
- **Vercel** - Hospedagem e CI/CD
- **GitHub** - Controle de versão

## 📊 Arquitetura

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────┐
│   Vercel    │
│  (Frontend) │
└──────┬──────┘
       │
       │ API
       │
┌──────▼──────┐
│  Supabase   │
│ (Database)  │
└─────────────┘
```

### Fluxo de Dados

1. **Criação**: Admin cria grupo e adiciona participantes
2. **Sorteio**: Algoritmo gera pares (giver → receiver)
3. **Criptografia**: Dados são criptografados com AES-256-GCM
4. **Armazenamento**: Dados criptografados salvos no Supabase
5. **Distribuição**: Links únicos gerados e enviados via WhatsApp
6. **Revelação**: Participante acessa link, dados são descriptografados no browser

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Junior Coelho**
- Email: devjuniorcoelho@gmail.com
- GitHub: [@devjuniorcoelho](https://github.com/devjuniorcoelho)

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Framework incrível
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Hospedagem perfeita
- [shadcn/ui](https://ui.shadcn.com/) - Componentes lindos
- [Tailwind CSS](https://tailwindcss.com/) - CSS utilitário

## 📞 Suporte

Encontrou um bug? Tem uma sugestão?

- 🐛 [Reportar Bug](https://github.com/devjuniorcoelho/amigo-oculto-magico/issues)
- 💡 [Sugerir Feature](https://github.com/devjuniorcoelho/amigo-oculto-magico/issues)
- 📧 Email: devjuniorcoelho@gmail.com

## 🗺️ Roadmap

- [ ] Suporte a múltiplos idiomas
- [ ] Tema escuro/claro
- [ ] Histórico de sorteios
- [ ] Exportar resultados
- [ ] Notificações por email
- [ ] App mobile nativo
- [ ] Integração com Telegram

## ⭐ Star History

Se este projeto te ajudou, considere dar uma ⭐!

---

**Feito com ❤️ por Junior Coelho**

🎁 **Organize seu Amigo Oculto de forma mágica!** ✨
