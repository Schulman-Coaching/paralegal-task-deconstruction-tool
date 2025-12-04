// ============================================
// DASHBOARD MODULE
// ============================================

let currentView = 'dashboard';
let currentPracticeArea = 'all';
let dashboardData = {
    clients: [],
    matters: [],
    tasks: [],
    recentActivity: []
};

// Initialize dashboard
async function initDashboard() {
    // Set up navigation
    setupNavigation();

    // Set up practice area filters
    setupPracticeAreaTabs();

    // Load initial data
    await loadDashboardData();

    // Render dashboard
    renderDashboard();
}

// Set up main navigation
function setupNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
            switchView(view);
        });
    });
}

// Switch between views
function switchView(view) {
    currentView = view;

    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected view
    const viewSection = document.getElementById(`${view}View`);
    if (viewSection) {
        viewSection.style.display = 'block';
    }

    // Load view-specific data
    switch(view) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'clients':
            renderClientsView();
            break;
        case 'matters':
            renderMattersView();
            break;
        case 'tasks':
            renderTasksView();
            break;
        case 'reports':
            renderReportsView();
            break;
    }
}

// Set up practice area filter tabs
function setupPracticeAreaTabs() {
    const tabs = document.querySelectorAll('.practice-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentPracticeArea = tab.dataset.area;

            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Re-render current view with filter
            renderMattersView();
        });
    });
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load all data in parallel
        const [clientsResult, mattersResult] = await Promise.all([
            getClients(),
            getMatters()
        ]);

        dashboardData.clients = clientsResult.data || [];
        dashboardData.matters = mattersResult.data || [];

        // Calculate stats
        calculateStats();

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

// Calculate dashboard statistics
function calculateStats() {
    const stats = {
        totalClients: dashboardData.clients.length,
        activeMatters: dashboardData.matters.filter(m => m.status === 'active').length,
        pendingMatters: dashboardData.matters.filter(m => m.status === 'pending').length,
        upcomingDeadlines: 0 // TODO: Calculate from tasks
    };

    // Count matters by practice area
    stats.byPracticeArea = {};
    Object.keys(CONFIG.PRACTICE_AREAS).forEach(area => {
        stats.byPracticeArea[area] = dashboardData.matters.filter(m => m.practice_area === area).length;
    });

    dashboardData.stats = stats;
}

// Render main dashboard
function renderDashboard() {
    const stats = dashboardData.stats || {};

    // Update stat cards
    updateStatCard('clientsCount', stats.totalClients || 0);
    updateStatCard('mattersCount', stats.activeMatters || 0);
    updateStatCard('tasksCount', stats.pendingMatters || 0);
    updateStatCard('deadlinesCount', stats.upcomingDeadlines || 0);

    // Render recent matters
    renderRecentMatters();

    // Render activity feed
    renderActivityFeed();
}

// Update a stat card value
function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Render recent matters list
function renderRecentMatters() {
    const container = document.getElementById('recentMattersList');
    if (!container) return;

    let filteredMatters = dashboardData.matters;
    if (currentPracticeArea !== 'all') {
        filteredMatters = filteredMatters.filter(m => m.practice_area === currentPracticeArea);
    }

    // Take only recent 10
    const recentMatters = filteredMatters.slice(0, 10);

    if (recentMatters.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No matters found. Create your first matter to get started.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recentMatters.map(matter => `
        <div class="matter-item" onclick="openMatter('${matter.id}')">
            <div class="matter-info">
                <div class="matter-name">${escapeHtml(matter.matter_name)}</div>
                <div class="matter-meta">
                    <span><i class="fas fa-user"></i> ${escapeHtml(matter.clients?.name || 'No client')}</span>
                    <span><i class="fas fa-tag"></i> ${CONFIG.PRACTICE_AREAS[matter.practice_area]?.name || matter.practice_area}</span>
                </div>
            </div>
            <span class="matter-badge ${matter.status}">${CONFIG.MATTER_STATUS[matter.status]?.name || matter.status}</span>
        </div>
    `).join('');
}

// Render activity feed
function renderActivityFeed() {
    const container = document.getElementById('activityFeed');
    if (!container) return;

    // For now, generate from recent matters
    const activities = dashboardData.matters.slice(0, 5).map(matter => ({
        icon: 'fa-folder',
        text: `Matter "${matter.matter_name}" was created`,
        time: formatRelativeTime(matter.created_at)
    }));

    if (activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No recent activity</p>
            </div>
        `;
        return;
    }

    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Render clients view
async function renderClientsView() {
    const container = document.getElementById('clientsView');
    if (!container) return;

    const { data: clients } = await getClients();

    container.innerHTML = `
        <div class="management-header">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search clients..." id="clientSearch" oninput="searchClients(this.value)">
            </div>
            <button class="btn btn-primary" onclick="openClientModal()">
                <i class="fas fa-plus"></i> New Client
            </button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Matters</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="clientsTableBody">
                ${renderClientRows(clients)}
            </tbody>
        </table>
    `;
}

// Render client table rows
function renderClientRows(clients) {
    if (!clients || clients.length === 0) {
        return `<tr><td colspan="5" class="empty-state">No clients found</td></tr>`;
    }

    return clients.map(client => `
        <tr>
            <td><strong>${escapeHtml(client.name)}</strong></td>
            <td>${escapeHtml(client.email || '-')}</td>
            <td>${escapeHtml(client.phone || '-')}</td>
            <td>${client.matters_count || 0}</td>
            <td>
                <div class="table-actions">
                    <button class="table-action-btn" onclick="editClient('${client.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="table-action-btn" onclick="viewClient('${client.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="table-action-btn danger" onclick="confirmDeleteClient('${client.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Search clients
function searchClients(query) {
    const filtered = dashboardData.clients.filter(client =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(query.toLowerCase()))
    );

    const tbody = document.getElementById('clientsTableBody');
    if (tbody) {
        tbody.innerHTML = renderClientRows(filtered);
    }
}

// Render matters view
async function renderMattersView() {
    const container = document.getElementById('mattersView');
    if (!container) return;

    let filters = {};
    if (currentPracticeArea !== 'all') {
        filters.practice_area = currentPracticeArea;
    }

    const { data: matters } = await getMatters(filters);

    container.innerHTML = `
        <div class="management-header">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search matters..." id="matterSearch" oninput="searchMatters(this.value)">
            </div>
            <div style="display: flex; gap: 10px;">
                <select class="btn btn-outline" onchange="filterMattersByStatus(this.value)">
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                </select>
                <button class="btn btn-primary" onclick="openMatterModal()">
                    <i class="fas fa-plus"></i> New Matter
                </button>
            </div>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Matter Name</th>
                    <th>Client</th>
                    <th>Practice Area</th>
                    <th>Status</th>
                    <th>Opened</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="mattersTableBody">
                ${renderMatterRows(matters)}
            </tbody>
        </table>
    `;
}

// Render matter table rows
function renderMatterRows(matters) {
    if (!matters || matters.length === 0) {
        return `<tr><td colspan="6" class="empty-state">No matters found</td></tr>`;
    }

    return matters.map(matter => `
        <tr onclick="openMatter('${matter.id}')" style="cursor: pointer;">
            <td><strong>${escapeHtml(matter.matter_name)}</strong></td>
            <td>${escapeHtml(matter.clients?.name || '-')}</td>
            <td>
                <span style="color: ${CONFIG.PRACTICE_AREAS[matter.practice_area]?.color || '#666'}">
                    <i class="${CONFIG.PRACTICE_AREAS[matter.practice_area]?.icon || 'fas fa-folder'}"></i>
                    ${CONFIG.PRACTICE_AREAS[matter.practice_area]?.name || matter.practice_area}
                </span>
            </td>
            <td><span class="matter-badge ${matter.status}">${CONFIG.MATTER_STATUS[matter.status]?.name || matter.status}</span></td>
            <td>${formatDate(matter.opened_date || matter.created_at)}</td>
            <td>
                <div class="table-actions" onclick="event.stopPropagation()">
                    <button class="table-action-btn" onclick="editMatter('${matter.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="table-action-btn" onclick="openMatter('${matter.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Search matters
function searchMatters(query) {
    const filtered = dashboardData.matters.filter(matter =>
        matter.matter_name.toLowerCase().includes(query.toLowerCase()) ||
        (matter.clients?.name && matter.clients.name.toLowerCase().includes(query.toLowerCase()))
    );

    const tbody = document.getElementById('mattersTableBody');
    if (tbody) {
        tbody.innerHTML = renderMatterRows(filtered);
    }
}

// Filter matters by status
function filterMattersByStatus(status) {
    let filtered = dashboardData.matters;

    if (currentPracticeArea !== 'all') {
        filtered = filtered.filter(m => m.practice_area === currentPracticeArea);
    }

    if (status) {
        filtered = filtered.filter(m => m.status === status);
    }

    const tbody = document.getElementById('mattersTableBody');
    if (tbody) {
        tbody.innerHTML = renderMatterRows(filtered);
    }
}

// Open matter detail view
async function openMatter(matterId) {
    const { data: matter, error } = await getMatter(matterId);
    if (error) {
        showNotification('Error loading matter', 'error');
        return;
    }

    // TODO: Implement matter detail view
    console.log('Opening matter:', matter);
    showNotification(`Opening matter: ${matter.matter_name}`, 'info');
}

// ============================================
// MODAL FUNCTIONS
// ============================================

// Open client modal
function openClientModal(client = null) {
    const isEdit = !!client;
    const modal = createModal({
        title: isEdit ? 'Edit Client' : 'New Client',
        content: `
            <form id="clientForm" class="modal-form">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" required value="${client?.name || ''}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${client?.email || ''}">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value="${client?.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value="${client?.address || ''}">
                </div>
                <div class="form-group" style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px;">
                    <div>
                        <label>City</label>
                        <input type="text" name="city" value="${client?.city || ''}">
                    </div>
                    <div>
                        <label>State</label>
                        <input type="text" name="state" value="${client?.state || 'NY'}" maxlength="2">
                    </div>
                    <div>
                        <label>ZIP</label>
                        <input type="text" name="zip_code" value="${client?.zip_code || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="date_of_birth" value="${client?.date_of_birth || ''}">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" rows="3">${client?.notes || ''}</textarea>
                </div>
            </form>
        `,
        buttons: [
            { text: 'Cancel', class: 'btn-secondary', action: 'close' },
            { text: isEdit ? 'Save Changes' : 'Create Client', class: 'btn-primary', action: 'submit' }
        ],
        onSubmit: async () => {
            const form = document.getElementById('clientForm');
            const formData = new FormData(form);
            const clientData = Object.fromEntries(formData);

            if (isEdit) {
                await updateClient(client.id, clientData);
            } else {
                await createClient(clientData);
            }

            await loadDashboardData();
            renderClientsView();
        }
    });

    document.body.appendChild(modal);
}

// Open matter modal
function openMatterModal(matter = null) {
    const isEdit = !!matter;

    // Build client options
    const clientOptions = dashboardData.clients.map(c =>
        `<option value="${c.id}" ${matter?.client_id === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`
    ).join('');

    // Build practice area options
    const practiceAreaOptions = Object.entries(CONFIG.PRACTICE_AREAS).map(([key, value]) =>
        `<option value="${key}" ${matter?.practice_area === key ? 'selected' : ''}>${value.name}</option>`
    ).join('');

    const modal = createModal({
        title: isEdit ? 'Edit Matter' : 'New Matter',
        content: `
            <form id="matterForm" class="modal-form">
                <div class="form-group">
                    <label>Matter Name *</label>
                    <input type="text" name="matter_name" required value="${matter?.matter_name || ''}">
                </div>
                <div class="form-group">
                    <label>Client *</label>
                    <select name="client_id" required>
                        <option value="">Select a client...</option>
                        ${clientOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Practice Area *</label>
                    <select name="practice_area" required>
                        ${practiceAreaOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Matter Number</label>
                    <input type="text" name="matter_number" value="${matter?.matter_number || ''}">
                </div>
                <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label>Court Name</label>
                        <input type="text" name="court_name" value="${matter?.court_name || ''}">
                    </div>
                    <div>
                        <label>Index Number</label>
                        <input type="text" name="index_number" value="${matter?.index_number || ''}">
                    </div>
                </div>
                <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label>Status</label>
                        <select name="status">
                            <option value="active" ${matter?.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="pending" ${matter?.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="closed" ${matter?.status === 'closed' ? 'selected' : ''}>Closed</option>
                        </select>
                    </div>
                    <div>
                        <label>Statute of Limitations</label>
                        <input type="date" name="statute_of_limitations" value="${matter?.statute_of_limitations || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="3">${matter?.description || ''}</textarea>
                </div>
            </form>
        `,
        buttons: [
            { text: 'Cancel', class: 'btn-secondary', action: 'close' },
            { text: isEdit ? 'Save Changes' : 'Create Matter', class: 'btn-primary', action: 'submit' }
        ],
        onSubmit: async () => {
            const form = document.getElementById('matterForm');
            const formData = new FormData(form);
            const matterData = Object.fromEntries(formData);

            if (isEdit) {
                await updateMatter(matter.id, matterData);
            } else {
                await createMatter(matterData);
            }

            await loadDashboardData();
            renderMattersView();
        }
    });

    document.body.appendChild(modal);
}

// Create modal helper
function createModal({ title, content, buttons, onSubmit }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${buttons.map(btn => `
                    <button class="btn ${btn.class}" data-action="${btn.action}">${btn.text}</button>
                `).join('')}
            </div>
        </div>
    `;

    // Handle button clicks
    overlay.querySelectorAll('.modal-footer .btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (btn.dataset.action === 'close') {
                overlay.remove();
            } else if (btn.dataset.action === 'submit') {
                await onSubmit();
                overlay.remove();
            }
        });
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    return overlay;
}

// Close modal
function closeModal(btn) {
    const overlay = btn.closest('.modal-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Confirm delete client
function confirmDeleteClient(clientId) {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
        deleteClient(clientId).then(() => {
            loadDashboardData();
            renderClientsView();
        });
    }
}

// Edit client
async function editClient(clientId) {
    const { data: client } = await getClient(clientId);
    if (client) {
        openClientModal(client);
    }
}

// View client
async function viewClient(clientId) {
    const { data: client } = await getClient(clientId);
    if (client) {
        // TODO: Implement client detail view
        showNotification(`Viewing client: ${client.name}`, 'info');
    }
}

// Edit matter
async function editMatter(matterId) {
    const { data: matter } = await getMatter(matterId);
    if (matter) {
        openMatterModal(matter);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format relative time
function formatRelativeTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return formatDate(dateString);
}

// Show notification toast
function showNotification(message, type = 'info') {
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info} notification-icon"></i>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Render tasks view (placeholder)
function renderTasksView() {
    const container = document.getElementById('tasksView');
    if (container) {
        container.innerHTML = `<p>Tasks view coming soon...</p>`;
    }
}

// Render reports view (placeholder)
function renderReportsView() {
    const container = document.getElementById('reportsView');
    if (container) {
        container.innerHTML = `<p>Reports view coming soon...</p>`;
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard, switchView, loadDashboardData,
        openClientModal, openMatterModal, openMatter,
        showNotification, escapeHtml, formatDate, formatRelativeTime
    };
}
