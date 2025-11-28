# 🚀 Guia de Deploy no Vercel - Amigo Oculto Mágico

## ✅ Pré-requisitos Verificados

- ✅ Código 100% funcional
- ✅ Banco de dados Supabase conectado
- ✅ Testes do algoritmo passando (5/5)
- ✅ Design moderno implementado
- ✅ Lint sem erros
- ✅ Build configurado
- ✅ Arquivo vercel.json criado

## 📋 Passo a Passo para Deploy

### 1. Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub" (recomendado)
4. Autorize o Vercel a acessar seus repositórios

### 2. Preparar o Repositório Git

Se ainda não tem um repositório Git, crie um:

```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: Amigo Oculto Mágico - Sistema completo"

# Criar repositório no GitHub e fazer push
# (siga as instruções do GitHub)
```

### 3. Importar Projeto no Vercel

#### Opção A: Via Interface Web (Mais Fácil)

1. No dashboard do Vercel, clique em "Add New..."
2. Selecione "Project"
3. Clique em "Import Git Repository"
4. Selecione seu repositório do GitHub
5. Clique em "Import"

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

### 4. Configurar Variáveis de Ambiente

**IMPORTANTE**: Configure estas 3 variáveis antes do deploy!

No painel do Vercel:

1. Vá em "Settings" → "Environment Variables"
2. Adicione as seguintes variáveis:

```
Nome: VITE_APP_ID
Valor: app-7vco8tnvi77l
Ambiente: Production, Preview, Development
```

```
Nome: VITE_SUPABASE_URL
Valor: https://ynkfknbenccgrnkvzmoo.supabase.co
Ambiente: Production, Preview, Development
```

```
Nome: VITE_SUPABASE_ANON_KEY
Valor: [copie do arquivo .env]
Ambiente: Production, Preview, Development
```

**Como copiar a chave do .env:**
```bash
cat .env | grep VITE_SUPABASE_ANON_KEY
```

### 5. Configurar Build Settings

O Vercel detecta automaticamente projetos Vite, mas verifique:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 6. Fazer o Deploy

1. Clique em "Deploy"
2. Aguarde 2-5 minutos
3. ✅ Deploy concluído!

Você receberá uma URL como:
```
https://seu-projeto.vercel.app
```

## 🔧 Configurações Adicionais (Opcional)

### Domínio Personalizado

1. Vá em "Settings" → "Domains"
2. Clique em "Add"
3. Digite seu domínio
4. Siga as instruções para configurar DNS

### Configurar Redirects

O arquivo `vercel.json` já está configurado para SPA routing.

### Analytics

1. Vá em "Analytics"
2. Ative "Web Analytics"
3. Monitore acessos em tempo real

## 🧪 Testar Após Deploy

### Checklist de Testes

1. **Página Inicial**
   - [ ] Abre corretamente
   - [ ] Pode adicionar participantes
   - [ ] Validações funcionam
   - [ ] Pode realizar sorteio

2. **Página de Distribuição**
   - [ ] Mostra todos os participantes
   - [ ] Botão WhatsApp abre corretamente
   - [ ] Copiar link funciona
   - [ ] Links estão corretos

3. **Página de Revelação**
   - [ ] Link direto funciona
   - [ ] Token manual funciona
   - [ ] Mostra resultado correto
   - [ ] Animação funciona

4. **WhatsApp**
   - [ ] Abre WhatsApp no mobile
   - [ ] Abre WhatsApp Web no desktop
   - [ ] Mensagem está formatada
   - [ ] Link está completo

5. **Banco de Dados**
   - [ ] Dados são salvos
   - [ ] Tokens funcionam
   - [ ] Criptografia funciona
   - [ ] Sem erros no console

## 🐛 Troubleshooting

### Erro: "Build Failed"

**Solução:**
1. Verifique se todas as dependências estão no `package.json`
2. Execute `npm run build` localmente
3. Corrija erros de TypeScript
4. Faça commit e push novamente

### Erro: "Environment Variables Not Found"

**Solução:**
1. Verifique se as 3 variáveis foram adicionadas
2. Certifique-se de que estão em "Production"
3. Faça um novo deploy

### Erro: "404 Not Found" em rotas

**Solução:**
- O arquivo `vercel.json` já está configurado
- Se o erro persistir, adicione em "Settings" → "Rewrites":
  - Source: `/(.*)`
  - Destination: `/index.html`

### Erro: "Database Connection Failed"

**Solução:**
1. Verifique se `VITE_SUPABASE_URL` está correta
2. Verifique se `VITE_SUPABASE_ANON_KEY` está correta
3. Teste a conexão no Supabase Dashboard
4. Verifique logs em "Deployments" → "Functions"

### WhatsApp não abre

**Solução:**
1. Verifique formato do número (+5511999999999)
2. Teste em dispositivo com WhatsApp instalado
3. Verifique se navegador permite pop-ups
4. Use botão "Copiar Link" como alternativa

## 📊 Monitoramento

### Logs do Vercel

1. Vá em "Deployments"
2. Clique no deployment ativo
3. Vá em "Functions" para ver logs
4. Vá em "Build Logs" para ver logs de build

### Logs do Supabase

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em "Logs" → "Database"
4. Monitore queries e erros

### Analytics

- Acessos: Vercel Analytics
- Erros: Browser Console + Vercel Logs
- Performance: Vercel Speed Insights

## 🔄 Atualizações Futuras

Para atualizar o aplicativo:

```bash
# Fazer alterações no código
git add .
git commit -m "feat: nova funcionalidade"
git push

# Vercel faz deploy automático!
```

## 🎯 URLs Importantes

Após o deploy, você terá:

- **URL Principal**: `https://seu-projeto.vercel.app`
- **URL de Distribuição**: `https://seu-projeto.vercel.app/distribuir/:token`
- **URL de Revelação**: `https://seu-projeto.vercel.app/revelar/:token`

## 📱 Compartilhar com Usuários

Envie apenas a URL principal:
```
https://seu-projeto.vercel.app
```

Os participantes receberão os links específicos via WhatsApp.

## 🔒 Segurança em Produção

✅ **Já Implementado:**
- HTTPS automático (Vercel)
- Criptografia AES-256-GCM
- Tokens únicos
- Variáveis de ambiente seguras
- Sem exposição de dados sensíveis

⚠️ **Recomendações:**
- Não compartilhe suas variáveis de ambiente
- Faça backup regular do Supabase
- Monitore uso e erros
- Mantenha dependências atualizadas

## 📈 Limites do Vercel (Free Tier)

- ✅ 100 GB de bandwidth/mês
- ✅ Deploy ilimitados
- ✅ HTTPS automático
- ✅ Domínio personalizado
- ✅ Analytics básico
- ✅ Suficiente para milhares de usuários

## 🎉 Pronto!

Seu aplicativo **Amigo Oculto Mágico** está no ar! 🚀

### Próximos Passos:

1. ✅ Teste todas as funcionalidades
2. ✅ Compartilhe a URL com amigos
3. ✅ Monitore o uso
4. ✅ Divirta-se! 🎁

---

## 📞 Suporte

### Problemas com Deploy?
- Documentação Vercel: https://vercel.com/docs
- Suporte Vercel: https://vercel.com/support

### Problemas com Banco de Dados?
- Documentação Supabase: https://supabase.com/docs
- Suporte Supabase: https://supabase.com/support

### Problemas com o Código?
- Verifique os logs no console do navegador (F12)
- Verifique os logs no Vercel Dashboard
- Execute `npm run lint` localmente

---

**Boa sorte com seu Amigo Oculto! 🎁✨**
