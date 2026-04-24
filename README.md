# Hybrid CRM Dashboard

Painel de supervisão e relacionamento híbrido, construído para atuar de forma nativa com **Supabase** (banco de dados) e **n8n** (motor de inteligência e automação).

## 🚀 Como Iniciar o Projeto (Onboarding para Novos Devs)

Se você acabou de entrar no projeto e precisa rodá-lo na sua máquina, siga os passos estritamente:

### 1. Requisitos
- Node.js (versão 18+ recomendada)
- Git

### 2. Instalação
Clone o repositório (via GitHub) e instale as dependências:
```bash
git clone https://github.com/SEU_USUARIO/hybrid-crm-dashboard.git
cd hybrid-crm-dashboard
npm install
```

### 3. Variáveis de Ambiente
Você não encontrará o arquivo `.env.local` no repositório por questões de segurança. Solicite-o ao administrador do projeto ou crie um arquivo `.env.local` na raiz do repositório baseado no modelo abaixo:

```env
# URL oficial do projeto Supabase 
NEXT_PUBLIC_SUPABASE_URL=https://SUA_URL.supabase.co
# Chave anon (public) do Supabase para requisições no front-end
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
```

### 4. Rodando Localmente
Após configurar o `.env.local`, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o painel rodando e consumindo o banco ao vivo.

---

## 🛠 Arquitetura do Sistema

- **Framework:** Next.js (App Router `src/app`).
- **Banco de Dados (BaaS):** Supabase (Tabelas: `contacts`, `tasks`, `interactions`).
- **Automação de Background:** n8n (Fica encarregado de rodar webhooks noturnos que vigiam banco de dados e injetam pendências na tabela `tasks`).
- **UI/UX:** Tailwind CSS com Glassmorphism (tema noturno luxuoso padrão B2B).
- **Abordagem de Dados:** Os componentes deste projeto desativam o cache estático (`export const revalidate = 0;`) com o objetivo de refletirem dados estritamente em tempo real de forma "SaaS-like".
