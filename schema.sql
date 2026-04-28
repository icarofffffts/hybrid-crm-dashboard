-- Basic Supabase Schema for Hybrid CRM MVP (Migration Friendly)

-- 1. Categories Table (Re-criando para garantir tipo UUID)
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 2. Update Contacts Table
-- Adicionando colunas novas de forma segura
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='company') THEN
        ALTER TABLE contacts ADD COLUMN company TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='job_title') THEN
        ALTER TABLE contacts ADD COLUMN job_title TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='city') THEN
        ALTER TABLE contacts ADD COLUMN city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='how_met') THEN
        ALTER TABLE contacts ADD COLUMN how_met TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='date_met') THEN
        ALTER TABLE contacts ADD COLUMN date_met DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='category_id') THEN
        ALTER TABLE contacts ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='level') THEN
        ALTER TABLE contacts ADD COLUMN level TEXT CHECK (level IN ('A', 'B', 'C', 'D')) DEFAULT 'C';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='instagram') THEN
        ALTER TABLE contacts ADD COLUMN instagram TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='linkedin') THEN
        ALTER TABLE contacts ADD COLUMN linkedin TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='birthday') THEN
        ALTER TABLE contacts ADD COLUMN birthday DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='last_contact') THEN
        ALTER TABLE contacts ADD COLUMN last_contact TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='next_contact') THEN
        ALTER TABLE contacts ADD COLUMN next_contact TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='personal_notes') THEN
        ALTER TABLE contacts ADD COLUMN personal_notes TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='introduced_by') THEN
        ALTER TABLE contacts ADD COLUMN introduced_by TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='custom_fields') THEN
        ALTER TABLE contacts ADD COLUMN custom_fields JSONB DEFAULT '{}';
    END IF;
END $$;

-- 3. Profiles Table (Ensure columns exist)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));
    END IF;
END $$;

-- 4. Other tables (Ensure they exist)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    event_type TEXT CHECK (event_type IN ('aniversario', 'conquista', 'data_importante', 'lembrete')),
    event_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    interaction_type TEXT CHECK (interaction_type IN ('mensagem_enviada', 'ligacao', 'reuniao', 'evento')),
    notes TEXT,
    interaction_date TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT DEFAULT 'system'
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    suggested_message TEXT,
    status TEXT CHECK (status IN ('pendente', 'aprovada', 'cancelada', 'concluida')) DEFAULT 'pendente',
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);


