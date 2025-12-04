// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Supabase Configuration - UPDATE THESE WITH YOUR VALUES
    SUPABASE_URL: '', // e.g., 'https://xxxxx.supabase.co'
    SUPABASE_ANON_KEY: '', // Your anon/public key

    // App Settings
    APP_NAME: 'NY Legal Paralegal Tool',
    VERSION: '2.0.0',

    // Practice Areas
    PRACTICE_AREAS: {
        'personal-injury': {
            name: 'Personal Injury',
            icon: 'fas fa-user-injured',
            color: '#e74c3c'
        },
        'family-law': {
            name: 'Family Law',
            icon: 'fas fa-users',
            color: '#9b59b6'
        },
        'real-estate': {
            name: 'Real Estate',
            icon: 'fas fa-home',
            color: '#27ae60'
        },
        'criminal-defense': {
            name: 'Criminal Defense',
            icon: 'fas fa-gavel',
            color: '#2c3e50'
        }
    },

    // User Roles
    ROLES: {
        admin: { name: 'Administrator', level: 100 },
        attorney: { name: 'Attorney', level: 80 },
        paralegal: { name: 'Paralegal', level: 60 },
        assistant: { name: 'Legal Assistant', level: 40 }
    },

    // Matter Statuses
    MATTER_STATUS: {
        active: { name: 'Active', color: '#27ae60' },
        pending: { name: 'Pending', color: '#f39c12' },
        closed: { name: 'Closed', color: '#95a5a6' },
        archived: { name: 'Archived', color: '#7f8c8d' }
    },

    // Task Statuses
    TASK_STATUS: {
        not_started: { name: 'Not Started', color: '#bdc3c7' },
        in_progress: { name: 'In Progress', color: '#3498db' },
        completed: { name: 'Completed', color: '#27ae60' },
        blocked: { name: 'Blocked', color: '#e74c3c' }
    }
};

// Check if Supabase is configured
function isSupabaseConfigured() {
    return CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, isSupabaseConfigured };
}
