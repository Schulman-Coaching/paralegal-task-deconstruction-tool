// ============================================
// MAIN APPLICATION MODULE
// NY Legal Paralegal Tool
// ============================================

// Application state
let appInitialized = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('NY Legal Paralegal Tool initializing...');

    // Check if Supabase is configured
    const supabaseConfigured = typeof initSupabase === 'function' && isSupabaseConfigured();

    if (supabaseConfigured) {
        // Initialize Supabase (if configured)
        initSupabase();
        // Check for existing session
        const user = await checkAuth();
        if (user) {
            console.log('User authenticated:', user.email);
        } else {
            console.log('No active session, showing auth screen');
            showAuthScreen();
        }
    } else {
        console.log('Running in demo mode (Supabase not configured)');
        // In demo mode, show the app directly - no login required
        showAppContent();
    }

    // Set up global event listeners
    setupGlobalListeners();

    appInitialized = true;
    console.log('Application initialized');
});

// Show authentication screen
function showAuthScreen() {
    const authSection = document.getElementById('authSection');
    const appContent = document.getElementById('appContent');

    if (authSection) authSection.style.display = 'block';
    if (appContent) appContent.style.display = 'none';

    // Set up auth form handlers
    setupAuthForms();
}

// Show main app content
function showAppContent() {
    const authSection = document.getElementById('authSection');
    const appContent = document.getElementById('appContent');

    if (authSection) authSection.style.display = 'none';
    if (appContent) appContent.style.display = 'block';

    // Initialize dashboard
    if (typeof initDashboard === 'function') {
        initDashboard();
    }

    // Initialize existing task deconstruction features
    initTaskDeconstruction();
}

// Show demo mode notice (optional - can be enabled if desired)
function showDemoModeNotice() {
    // Disabled by default for cleaner demo experience
    // Uncomment below to show a banner when running in demo mode
    /*
    const notice = document.createElement('div');
    notice.className = 'demo-banner';
    notice.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>Running in Demo Mode - <a href="#" onclick="openSupabaseSetup()">Configure Supabase</a> to enable multi-user features</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    notice.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        z-index: 9999;
        font-size: 0.9rem;
    `;
    notice.querySelector('a').style.cssText = 'color: #fff; text-decoration: underline;';
    notice.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0 10px;
    `;

    document.body.insertBefore(notice, document.body.firstChild);
    document.body.style.paddingTop = '50px';
    */
}

// Set up authentication forms
function setupAuthForms() {
    // Auth tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const formType = tab.dataset.form;

            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding form
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(`${formType}Form`)?.classList.add('active');
        });
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('[name="email"]').value;
            const password = loginForm.querySelector('[name="password"]').value;

            const result = await signIn(email, password);
            if (!result.error) {
                showAppContent();
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);

            const result = await signUp(
                formData.get('email'),
                formData.get('password'),
                formData.get('fullName'),
                formData.get('firmName'),
                formData.get('role')
            );

            if (!result.error) {
                // Show success message, user needs to verify email
                showNotification('Account created! Check your email to verify.', 'success');
            }
        });
    }

    // Demo login button
    const demoLoginBtn = document.getElementById('demoLoginBtn');
    if (demoLoginBtn) {
        demoLoginBtn.addEventListener('click', () => {
            // Simulate demo login
            currentUser = { id: 'demo', email: 'demo@example.com' };
            currentProfile = { full_name: 'Demo User', role: 'paralegal' };
            showAppContent();
            showNotification('Logged in as Demo User', 'info');
        });
    }
}

// Set up global event listeners
function setupGlobalListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await signOut();
            showAuthScreen();
        });
    }

    // Settings toggle (for API keys)
    const settingsHeader = document.querySelector('.settings-header');
    if (settingsHeader) {
        settingsHeader.addEventListener('click', () => {
            const content = document.querySelector('.settings-content');
            const toggle = document.querySelector('.settings-toggle');
            content?.classList.toggle('open');
            toggle?.classList.toggle('open');
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.remove();
            });
            document.querySelectorAll('.side-panel.active').forEach(panel => {
                panel.classList.remove('active');
                document.querySelector('.side-panel-overlay')?.classList.remove('active');
            });
        }

        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-box input');
            if (searchInput) searchInput.focus();
        }
    });
}

// Initialize task deconstruction features (existing functionality)
function initTaskDeconstruction() {
    // Example buttons
    const exampleBtns = document.querySelectorAll('.example-btn');
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const taskInput = document.getElementById('taskInput');
            if (taskInput) {
                taskInput.value = btn.textContent;
            }
        });
    });

    // Deconstruct button
    const deconstructBtn = document.getElementById('deconstructBtn');
    if (deconstructBtn) {
        deconstructBtn.addEventListener('click', deconstructTask);
    }
}

// Open Supabase setup guide
function openSupabaseSetup() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal" style="max-width: 700px;">
            <div class="modal-header">
                <h3><i class="fas fa-database"></i> Set Up Supabase</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="setup-steps">
                    <div class="setup-step">
                        <h4>Step 1: Create Supabase Account</h4>
                        <p>Go to <a href="https://supabase.com" target="_blank">supabase.com</a> and sign up for a free account.</p>
                    </div>
                    <div class="setup-step">
                        <h4>Step 2: Create a New Project</h4>
                        <p>Click "New Project", choose a name (e.g., "paralegal-tool"), set a strong database password, and select a region.</p>
                    </div>
                    <div class="setup-step">
                        <h4>Step 3: Get Your API Keys</h4>
                        <p>Go to Project Settings &rarr; API. Copy the "Project URL" and "anon public" key.</p>
                    </div>
                    <div class="setup-step">
                        <h4>Step 4: Run Database Schema</h4>
                        <p>Go to SQL Editor and run the schema from <code>sql/schema.sql</code></p>
                    </div>
                    <div class="setup-step">
                        <h4>Step 5: Configure the App</h4>
                        <p>Update <code>js/config.js</code> with your Supabase URL and anon key:</p>
                        <pre style="background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto;">
SUPABASE_URL: 'https://your-project.supabase.co',
SUPABASE_ANON_KEY: 'your-anon-key-here'</pre>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Got It</button>
            </div>
        </div>
    `;

    // Style the steps
    const style = document.createElement('style');
    style.textContent = `
        .setup-steps { display: flex; flex-direction: column; gap: 20px; }
        .setup-step { padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--secondary-color); }
        .setup-step h4 { margin: 0 0 8px 0; color: var(--primary-color); }
        .setup-step p { margin: 0; color: #666; }
        .setup-step a { color: var(--secondary-color); }
        .setup-step code { background: #e9ecef; padding: 2px 6px; border-radius: 4px; }
    `;
    modal.appendChild(style);

    document.body.appendChild(modal);
}

// Export functions for global access
window.openSupabaseSetup = openSupabaseSetup;
window.showAppContent = showAppContent;
window.showAuthScreen = showAuthScreen;
