# Agenda de Cabeleleiro — Netlify + Supabase (JavaScript)

Este projeto foi preparado para rodar **tudo no Netlify** usando **Netlify Functions** (serverless) e **Supabase** como banco.

## Estrutura principal
- frontend/ (Next.js)
  - components/AgendaCabeleleiro.jsx
  - pages/index.jsx
- netlify/functions/
  - agendamentos-get.js
  - agendamentos-post.js
  - agendamentos-delete.js
- migrations/create_table.sql
- netlify.toml

## Passos para deploy

### 1) Criar tabela no Supabase
1. Crie um projeto em https://app.supabase.com
2. Em SQL Editor, rode o conteúdo de `migrations/create_table.sql` para criar a tabela `agendamentos`.

### 2) Pegar credenciais do Supabase
No painel do projeto Supabase:
- Settings → API → Project URL -> copie para `SUPABASE_URL`
- Settings → API → anon/public key -> copie para `SUPABASE_KEY`

### 3) Subir no GitHub e conectar ao Netlify
1. Faça push do repositório para GitHub.
2. No Netlify, crie um novo site a partir do GitHub repo.
3. Em Site settings → Build & deploy → Environment, adicione as variáveis:
   - `SUPABASE_URL` = sua URL do Supabase (ex.: https://xyz.supabase.co)
   - `SUPABASE_KEY` = sua anon/public key do Supabase

### 4) Build config no Netlify
- Build command: `npm run build`
- Publish directory: deixamos `.next` (o plugin Next cuida disso)
- Plugin: `@netlify/plugin-nextjs` (já listado no package.json de frontend)

### 5) Deploy
Após configurar as variáveis, clique em deploy. O frontend fará chamadas para as Netlify Functions, que por sua vez acessam o Supabase.

## Notas
- As Netlify Functions usam `fetch` para chamar o endpoint REST do Supabase.
- Em desenvolvimento local, você pode executar as funções com `netlify dev` (se tiver o CLI) e definir as variáveis de ambiente localmente.

