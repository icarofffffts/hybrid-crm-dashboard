# Fluxos Iniciais n8n (MVP)

A automação principal do CRM será contida em dois fluxos simples que conectam o banco de dados Supabase e o painel da secretária. Estes fluxos operam com base na tabela `contacts` e alimentam a tabela `tasks`.

## 1. Fluxo de Varredura de Aniversários (CronDiário)

**Gatilho (Trigger):** `Schedule Trigger` (Roda todos os dias às 08:00 AM).

**Ações (Nodes):**
1. **Supabase / Postgres Node:** Executa query `SELECT * FROM events INNER JOIN contacts ON events.contact_id = contacts.id WHERE event_type = 'aniversario' AND EXTRACT(month from event_date) = EXTRACT(month from NOW()) AND EXTRACT(day from event_date) = EXTRACT(day from NOW());`
2. **If / Filter Node:** Verifica se encontrou algum aniversariante hoje. Se `true`, continua.
3. **Item Lists / Loop Node:** Para cada usuário aniversariante:
4. **LLM Node / Set Node:** Gera o texto da sugestão, ex: `"Passando para te desejar um feliz aniversário..."`.
5. **Supabase / Postgres Insert Node:** Insere na tabela `tasks`:
   - `title`: Mandar parabéns para + {{Nome}}
   - `contact_id`: {{ID}}
   - `suggested_message`: {{Texto Gerado}}
   - `status`: pendente

---

## 2. Fluxo de Alerta de Ausência de Relacionamento

**Gatilho (Trigger):** `Schedule Trigger` (Roda semanalmente, segundas às 09:00 AM).

**Ações (Nodes):**
1. **Supabase / Postgres Node:** Busca todos os contatos com prioridade `alta` ou `media` cuja data de criação seja > X dias e onde na tabela `interactions` não há nenhum registro nos últimos 90 dias.
   *Query exemplo:* `... WHERE id NOT IN (SELECT contact_id FROM interactions WHERE interaction_date > NOW() - INTERVAL '90 days')`
2. **Item Lists / Loop Node:** Pega a lista de contatos negligenciados e joga no Loop.
3. **Set Node:** Cria sugestão padrão `Retomar Contato`.
4. **Supabase / Postgres Insert Node:** Insere uma task "Pendente" para a secretária na `tasks`.

*Nota:* Como a infraestrutura está pronta e via MCP, será possível no passo seguinte exportar essas lógicas diretamente para o n8n usando os nós do Supabase do próprio servidor.
