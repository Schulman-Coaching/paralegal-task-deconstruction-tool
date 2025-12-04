-- ============================================
-- NY Legal Paralegal Tool - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    firm_name TEXT,
    role TEXT DEFAULT 'paralegal' CHECK (role IN ('admin', 'attorney', 'paralegal', 'assistant')),
    bar_number TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- TEAMS TABLE
-- Law firms or work groups
-- ============================================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TEAM MEMBERS TABLE
-- Links users to teams
-- ============================================
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Team members can view their team
CREATE POLICY "Team members can view their team"
    ON teams FOR SELECT
    USING (
        id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

-- Team owners/admins can update team
CREATE POLICY "Team admins can update team"
    ON teams FOR UPDATE
    USING (
        id IN (
            SELECT team_id FROM team_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Users can create teams
CREATE POLICY "Users can create teams"
    ON teams FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Team members policies
CREATE POLICY "Team members can view team members"
    ON team_members FOR SELECT
    USING (
        team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can manage team members"
    ON team_members FOR ALL
    USING (
        team_id IN (
            SELECT team_id FROM team_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can join teams"
    ON team_members FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT DEFAULT 'NY',
    zip_code TEXT,
    date_of_birth DATE,
    ssn_last_four TEXT,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Clients visible to team members
CREATE POLICY "Team members can view clients"
    ON clients FOR SELECT
    USING (
        team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create clients"
    ON clients FOR INSERT
    WITH CHECK (
        team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can update clients"
    ON clients FOR UPDATE
    USING (
        team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can delete clients"
    ON clients FOR DELETE
    USING (
        team_id IN (
            SELECT team_id FROM team_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'attorney')
        )
    );

-- ============================================
-- MATTERS TABLE
-- Legal cases/matters
-- ============================================
CREATE TABLE matters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    matter_name TEXT NOT NULL,
    matter_number TEXT,
    practice_area TEXT NOT NULL CHECK (practice_area IN ('personal-injury', 'family-law', 'real-estate', 'criminal-defense')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'closed', 'archived')),
    opened_date DATE DEFAULT CURRENT_DATE,
    closed_date DATE,
    statute_of_limitations DATE,
    court_name TEXT,
    index_number TEXT,
    assigned_to UUID REFERENCES profiles(id),
    supervising_attorney UUID REFERENCES profiles(id),
    description TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE matters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view matters"
    ON matters FOR SELECT
    USING (
        team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create matters"
    ON matters FOR INSERT
    WITH CHECK (
        team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can update matters"
    ON matters FOR UPDATE
    USING (
        team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can delete matters"
    ON matters FOR DELETE
    USING (
        team_id IN (
            SELECT team_id FROM team_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'attorney')
        )
    );

-- ============================================
-- TASKS TABLE
-- Tasks within matters
-- ============================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,
    task_name TEXT,
    description TEXT,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'blocked')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    completed_date DATE,
    assigned_to UUID REFERENCES profiles(id),
    ny_statute_reference TEXT,
    ny_deadline_rule TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Tasks visible through matter's team
CREATE POLICY "Team members can view tasks"
    ON tasks FOR SELECT
    USING (
        matter_id IN (
            SELECT m.id FROM matters m
            JOIN team_members tm ON m.team_id = tm.team_id
            WHERE tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create tasks"
    ON tasks FOR INSERT
    WITH CHECK (
        matter_id IN (
            SELECT m.id FROM matters m
            JOIN team_members tm ON m.team_id = tm.team_id
            WHERE tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can update tasks"
    ON tasks FOR UPDATE
    USING (
        matter_id IN (
            SELECT m.id FROM matters m
            JOIN team_members tm ON m.team_id = tm.team_id
            WHERE tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can delete tasks"
    ON tasks FOR DELETE
    USING (
        matter_id IN (
            SELECT m.id FROM matters m
            JOIN team_members tm ON m.team_id = tm.team_id
            WHERE tm.user_id = auth.uid()
        )
    );

-- ============================================
-- TASK DATA TABLE
-- Form data and transcripts for tasks
-- ============================================
CREATE TABLE task_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    component_name TEXT NOT NULL,
    form_data JSONB DEFAULT '{}',
    transcript TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE task_data ENABLE ROW LEVEL SECURITY;

-- Task data visible through task's matter's team
CREATE POLICY "Team members can view task data"
    ON task_data FOR SELECT
    USING (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN matters m ON t.matter_id = m.id
            JOIN team_members tm ON m.team_id = tm.team_id
            WHERE tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create task data"
    ON task_data FOR INSERT
    WITH CHECK (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN matters m ON t.matter_id = m.id
            JOIN team_members tm ON m.team_id = tm.team_id
            WHERE tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can update task data"
    ON task_data FOR UPDATE
    USING (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN matters m ON t.matter_id = m.id
            JOIN team_members tm ON m.team_id = tm.team_id
            WHERE tm.user_id = auth.uid()
        )
    );

-- ============================================
-- AUDIT LOG TABLE
-- Track all actions for compliance
-- ============================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Audit logs visible to team admins
CREATE POLICY "Team admins can view audit logs"
    ON audit_log FOR SELECT
    USING (
        team_id IN (
            SELECT team_id FROM team_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'attorney')
        )
    );

CREATE POLICY "System can insert audit logs"
    ON audit_log FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_clients_team_id ON clients(team_id);
CREATE INDEX idx_matters_team_id ON matters(team_id);
CREATE INDEX idx_matters_client_id ON matters(client_id);
CREATE INDEX idx_matters_practice_area ON matters(practice_area);
CREATE INDEX idx_matters_status ON matters(status);
CREATE INDEX idx_matters_assigned_to ON matters(assigned_to);
CREATE INDEX idx_tasks_matter_id ON tasks(matter_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_data_task_id ON task_data(task_id);
CREATE INDEX idx_audit_log_team_id ON audit_log(team_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matters_updated_at
    BEFORE UPDATE ON matters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_data_updated_at
    BEFORE UPDATE ON task_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- NY-SPECIFIC REFERENCE DATA (Optional)
-- Can be used to populate dropdowns, etc.
-- ============================================

-- NY Courts reference
CREATE TABLE IF NOT EXISTS ny_courts (
    id SERIAL PRIMARY KEY,
    court_name TEXT NOT NULL,
    court_type TEXT,
    county TEXT,
    address TEXT
);

-- Insert some common NY courts
INSERT INTO ny_courts (court_name, court_type, county) VALUES
('Supreme Court, New York County', 'Supreme', 'New York'),
('Supreme Court, Kings County', 'Supreme', 'Kings'),
('Supreme Court, Queens County', 'Supreme', 'Queens'),
('Supreme Court, Bronx County', 'Supreme', 'Bronx'),
('Supreme Court, Richmond County', 'Supreme', 'Richmond'),
('Supreme Court, Nassau County', 'Supreme', 'Nassau'),
('Supreme Court, Suffolk County', 'Supreme', 'Suffolk'),
('Supreme Court, Westchester County', 'Supreme', 'Westchester'),
('Civil Court of the City of New York', 'Civil', 'New York City'),
('Family Court, New York County', 'Family', 'New York'),
('Family Court, Kings County', 'Family', 'Kings'),
('Surrogate''s Court, New York County', 'Surrogate', 'New York'),
('Criminal Court of the City of New York', 'Criminal', 'New York City');

-- Grant read access to ny_courts
ALTER TABLE ny_courts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view NY courts"
    ON ny_courts FOR SELECT
    USING (true);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth';
COMMENT ON TABLE teams IS 'Law firms or work groups';
COMMENT ON TABLE team_members IS 'Links users to teams with roles';
COMMENT ON TABLE clients IS 'Client information for the firm';
COMMENT ON TABLE matters IS 'Legal cases/matters linked to clients';
COMMENT ON TABLE tasks IS 'Tasks within matters, linked to NY practice areas';
COMMENT ON TABLE task_data IS 'Form data and transcripts for task components';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for compliance';
COMMENT ON TABLE ny_courts IS 'Reference table for New York courts';
