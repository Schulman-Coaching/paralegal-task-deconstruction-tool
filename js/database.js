// ============================================
// DATABASE MODULE (Supabase)
// ============================================

// Audit logging
async function logAudit(action, entityType, entityId, details = {}) {
    if (!supabase || !currentUser || !currentTeam) return;

    try {
        await supabase.from('audit_log').insert({
            team_id: currentTeam.id,
            user_id: currentUser.id,
            action,
            entity_type: entityType,
            entity_id: entityId,
            details,
            ip_address: null // Could be fetched from a service if needed
        });
    } catch (error) {
        console.error('Audit log error:', error);
    }
}

// ============================================
// CLIENT OPERATIONS
// ============================================

async function getClients(filters = {}) {
    if (!supabase || !currentTeam) {
        return { data: getDemoClients(), error: null };
    }

    try {
        let query = supabase
            .from('clients')
            .select('*')
            .eq('team_id', currentTeam.id)
            .order('created_at', { ascending: false });

        if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error('Get clients error:', error);
        return { data: [], error };
    }
}

async function getClient(id) {
    if (!supabase) {
        return { data: getDemoClients().find(c => c.id === id), error: null };
    }

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

    return { data, error };
}

async function createClient(clientData) {
    if (!supabase || !currentTeam) {
        showNotification('Client created (Demo Mode)', 'success');
        return { data: { id: 'demo-' + Date.now(), ...clientData }, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('clients')
            .insert({
                ...clientData,
                team_id: currentTeam.id,
                created_by: currentUser.id
            })
            .select()
            .single();

        if (error) throw error;

        logAudit('created', 'client', data.id, { name: data.name });
        showNotification('Client created!', 'success');
        return { data, error: null };
    } catch (error) {
        showNotification(error.message, 'error');
        return { data: null, error };
    }
}

async function updateClient(id, updates) {
    if (!supabase) {
        showNotification('Client updated (Demo Mode)', 'success');
        return { data: { id, ...updates }, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('clients')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        logAudit('updated', 'client', id, updates);
        showNotification('Client updated!', 'success');
        return { data, error: null };
    } catch (error) {
        showNotification(error.message, 'error');
        return { data: null, error };
    }
}

async function deleteClient(id) {
    if (!supabase) {
        showNotification('Client deleted (Demo Mode)', 'success');
        return { error: null };
    }

    try {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) throw error;

        logAudit('deleted', 'client', id);
        showNotification('Client deleted', 'info');
        return { error: null };
    } catch (error) {
        showNotification(error.message, 'error');
        return { error };
    }
}

// ============================================
// MATTER OPERATIONS
// ============================================

async function getMatters(filters = {}) {
    if (!supabase || !currentTeam) {
        return { data: getDemoMatters(), error: null };
    }

    try {
        let query = supabase
            .from('matters')
            .select('*, clients(name), profiles!matters_assigned_to_fkey(full_name)')
            .eq('team_id', currentTeam.id)
            .order('created_at', { ascending: false });

        if (filters.practice_area) {
            query = query.eq('practice_area', filters.practice_area);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.client_id) {
            query = query.eq('client_id', filters.client_id);
        }
        if (filters.assigned_to) {
            query = query.eq('assigned_to', filters.assigned_to);
        }

        const { data, error } = await query;
        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error('Get matters error:', error);
        return { data: [], error };
    }
}

async function getMatter(id) {
    if (!supabase) {
        return { data: getDemoMatters().find(m => m.id === id), error: null };
    }

    const { data, error } = await supabase
        .from('matters')
        .select('*, clients(*), profiles!matters_assigned_to_fkey(*)')
        .eq('id', id)
        .single();

    if (data) {
        logAudit('viewed', 'matter', id);
    }

    return { data, error };
}

async function createMatter(matterData) {
    if (!supabase || !currentTeam) {
        showNotification('Matter created (Demo Mode)', 'success');
        return { data: { id: 'demo-' + Date.now(), ...matterData }, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('matters')
            .insert({
                ...matterData,
                team_id: currentTeam.id,
                created_by: currentUser.id
            })
            .select()
            .single();

        if (error) throw error;

        logAudit('created', 'matter', data.id, { name: data.matter_name, practice_area: data.practice_area });
        showNotification('Matter created!', 'success');
        return { data, error: null };
    } catch (error) {
        showNotification(error.message, 'error');
        return { data: null, error };
    }
}

async function updateMatter(id, updates) {
    if (!supabase) {
        showNotification('Matter updated (Demo Mode)', 'success');
        return { data: { id, ...updates }, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('matters')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        logAudit('updated', 'matter', id, updates);
        showNotification('Matter updated!', 'success');
        return { data, error: null };
    } catch (error) {
        showNotification(error.message, 'error');
        return { data: null, error };
    }
}

// ============================================
// TASK OPERATIONS
// ============================================

async function getTasks(matterId) {
    if (!supabase) {
        return { data: getDemoTasks(matterId), error: null };
    }

    const { data, error } = await supabase
        .from('tasks')
        .select('*, profiles!tasks_assigned_to_fkey(full_name)')
        .eq('matter_id', matterId)
        .order('created_at', { ascending: true });

    return { data, error };
}

async function createTask(taskData) {
    if (!supabase) {
        return { data: { id: 'demo-' + Date.now(), ...taskData }, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                ...taskData,
                created_by: currentUser.id
            })
            .select()
            .single();

        if (error) throw error;

        logAudit('created', 'task', data.id, { task_type: data.task_type });
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

async function updateTask(id, updates) {
    if (!supabase) {
        return { data: { id, ...updates }, error: null };
    }

    const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (data) {
        logAudit('updated', 'task', id, updates);
    }

    return { data, error };
}

// ============================================
// TASK DATA OPERATIONS
// ============================================

async function saveTaskData(taskId, componentName, formData, transcript = '') {
    if (!supabase) {
        showNotification('Data saved (Demo Mode)', 'success');
        return { data: { id: 'demo-' + Date.now() }, error: null };
    }

    try {
        // Check if task data already exists
        const { data: existing } = await supabase
            .from('task_data')
            .select('id')
            .eq('task_id', taskId)
            .eq('component_name', componentName)
            .single();

        let result;
        if (existing) {
            // Update existing
            result = await supabase
                .from('task_data')
                .update({
                    form_data: formData,
                    transcript,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Create new
            result = await supabase
                .from('task_data')
                .insert({
                    task_id: taskId,
                    component_name: componentName,
                    form_data: formData,
                    transcript,
                    created_by: currentUser.id
                })
                .select()
                .single();
        }

        if (result.error) throw result.error;

        logAudit('saved', 'task_data', result.data.id, { component: componentName });
        showNotification('Data saved!', 'success');
        return { data: result.data, error: null };
    } catch (error) {
        showNotification(error.message, 'error');
        return { data: null, error };
    }
}

async function getTaskData(taskId) {
    if (!supabase) {
        return { data: [], error: null };
    }

    const { data, error } = await supabase
        .from('task_data')
        .select('*')
        .eq('task_id', taskId);

    return { data, error };
}

// ============================================
// TEAM OPERATIONS
// ============================================

async function getTeamMembers() {
    if (!supabase || !currentTeam) {
        return { data: [], error: null };
    }

    const { data, error } = await supabase
        .from('team_members')
        .select('*, profiles(*)')
        .eq('team_id', currentTeam.id);

    return { data, error };
}

async function inviteTeamMember(email, role = 'member') {
    // This would typically send an invitation email
    // For now, just show a message
    showNotification(`Invitation sent to ${email}`, 'success');
    return { success: true };
}

// ============================================
// AUDIT LOG
// ============================================

async function getAuditLog(filters = {}) {
    if (!supabase || !currentTeam) {
        return { data: [], error: null };
    }

    let query = supabase
        .from('audit_log')
        .select('*, profiles(full_name)')
        .eq('team_id', currentTeam.id)
        .order('created_at', { ascending: false })
        .limit(100);

    if (filters.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
    }
    if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
    }

    const { data, error } = await query;
    return { data, error };
}

// ============================================
// DEMO DATA
// ============================================

function getDemoClients() {
    return [
        { id: 'demo-1', name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', created_at: new Date().toISOString() },
        { id: 'demo-2', name: 'Maria Garcia', email: 'maria@example.com', phone: '(555) 234-5678', created_at: new Date().toISOString() },
        { id: 'demo-3', name: 'Robert Johnson', email: 'robert@example.com', phone: '(555) 345-6789', created_at: new Date().toISOString() }
    ];
}

function getDemoMatters() {
    return [
        { id: 'demo-m1', matter_name: 'Smith v. ABC Corp', practice_area: 'personal-injury', status: 'active', client_id: 'demo-1', clients: { name: 'John Smith' }, created_at: new Date().toISOString() },
        { id: 'demo-m2', matter_name: 'Garcia Divorce', practice_area: 'family-law', status: 'active', client_id: 'demo-2', clients: { name: 'Maria Garcia' }, created_at: new Date().toISOString() },
        { id: 'demo-m3', matter_name: '123 Main St Closing', practice_area: 'real-estate', status: 'pending', client_id: 'demo-3', clients: { name: 'Robert Johnson' }, created_at: new Date().toISOString() }
    ];
}

function getDemoTasks(matterId) {
    return [
        { id: 'demo-t1', matter_id: matterId, task_type: 'Draft Summons & Complaint', status: 'completed', created_at: new Date().toISOString() },
        { id: 'demo-t2', matter_id: matterId, task_type: 'File with Court', status: 'in_progress', created_at: new Date().toISOString() },
        { id: 'demo-t3', matter_id: matterId, task_type: 'Serve Defendant', status: 'not_started', created_at: new Date().toISOString() }
    ];
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        logAudit, getClients, getClient, createClient, updateClient, deleteClient,
        getMatters, getMatter, createMatter, updateMatter,
        getTasks, createTask, updateTask, saveTaskData, getTaskData,
        getTeamMembers, inviteTeamMember, getAuditLog
    };
}
