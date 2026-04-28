-- Seed Data Premium para Demonstração Comercial B2B/B2C - CRM Híbrido

TRUNCATE TABLE tasks, interactions, events, contacts, categories RESTART IDENTITY CASCADE;

-- 0. Categories
INSERT INTO categories (id, name) VALUES
('f1a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'Amigo'),
('f2a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'Empresário'),
('f3a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'Investidor'),
('f4a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'Cliente'),
('f5a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'Mídia'),
('f6a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'Festa'),
('f7a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'Político');

-- 1. Contatos Estratégicos (Nível Comercial/Corporativo)
INSERT INTO contacts (id, name, category_id, level, phone, email, company, job_title) VALUES
('b5e9f8bd-3c13-4e4f-8cf7-295b77e8ba8d', 'Dr. Roberto Almeida', 'f2a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'A', '+55 11 99999-0001', 'roberto@almeidalaw.com.br', 'Almeida & Advogados', 'Sócio'),
('c7a8b9d0-2f3b-4c12-9e8a-7d4f9b8c0a1b', 'Mariana Lancaster', 'f4a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'A', '+55 11 99999-0002', 'm.lancaster@techsolutions.com', 'TechSolutions', 'CEO'),
('d8e9f0a1-4b2c-4d3e-8f9a-1c2b3d4e5f6a', 'Henrique Souza', 'f4a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'B', '+55 11 99999-0003', 'henrique@alpha.com', 'Alpha Imóveis', 'Diretor Comercial'),
('e9f0a1b2-5c3d-4e4f-9a0b-2d3e4f5a6b7c', 'Juliana Fernandes', 'f1a2b3c4-d5e6-4f7b-8b9a-0a1b2c3d4e5f', 'C', '+55 11 99999-0004', 'juliana@jf-arquitetura.com', 'Partners', 'Arquiteta');

-- 2. Eventos Ancorados (Para disparar automações de parabenização)
INSERT INTO events (contact_id, event_type, event_date, description) VALUES
('b5e9f8bd-3c13-4e4f-8cf7-295b77e8ba8d', 'aniversario', CURRENT_DATE, 'Aniversário do Dr. Roberto'),
('c7a8b9d0-2f3b-4c12-9e8a-7d4f9b8c0a1b', 'conquista', CURRENT_DATE - INTERVAL '10 days', 'TechSolutions captou nova rodada de investimento'),
('d8e9f0a1-4b2c-4d3e-8f9a-1c2b3d4e5f6a', 'lembrete', CURRENT_DATE + INTERVAL '5 days', 'Acompanhamento do fechamento de contrato');

-- 3. Tarefas Iniciais (Inbox do Secretário / IA Automation)
INSERT INTO tasks (contact_id, title, description, suggested_message, status) VALUES
('b5e9f8bd-3c13-4e4f-8cf7-295b77e8ba8d', 'Mandar felicitações para Roberto Almeida', 'n8n Automático: Detectado aniversário hoje.', 'Doutor Roberto, como vai? Passando para te desejar um excelente aniversário hoje! Muita saúde, vitórias nos tribunais e sucesso para todo o escritório. Um abraço grande!', 'pendente'),
('c7a8b9d0-2f3b-4c12-9e8a-7d4f9b8c0a1b', 'Aproximação Estratégica: Mariana', 'n8n Automático: Cliente VIP "TechSolutions" com grande novidade recente. Recomendado envio manual (touchpoint de valor).', 'Oi Mariana, tudo ótimo? Vi as notícias sobre a nova captação da TechSolutions na mídia recém-anunciada. Que orgulho acompanhar essa jornada! Gostaria de te mandar um vinho para celebrar. Em qual endereço posso entregar?', 'pendente');

-- 4. Timeline Histórica Enriquecida
INSERT INTO interactions (contact_id, interaction_type, notes, interaction_date, created_by) VALUES
('d8e9f0a1-4b2c-4d3e-8f9a-1c2b3d4e5f6a', 'mensagem_enviada', 'Enviado artigo sobre mercado imobiliário para nutrir o relacionamento. Cliente respondeu muito bem.', CURRENT_DATE - INTERVAL '15 days', 'Secretaria Executiva'),
('c7a8b9d0-2f3b-4c12-9e8a-7d4f9b8c0a1b', 'reuniao', 'Almoço de relacionamento (Fogo de Chão). Mapeamento de possíveis expansões de infraestrutura para eles.', CURRENT_DATE - INTERVAL '45 days', 'Diretoria'),
('b5e9f8bd-3c13-4e4f-8cf7-295b77e8ba8d', 'ligacao', 'Assessoria jurídica renovada. Relacionamento muito sólido.', CURRENT_DATE - INTERVAL '100 days', 'Sistema');
