// ============================================
// AUTHENTICATION MODULE (Supabase)
// ============================================

let supabase = null;
let currentUser = null;
let currentProfile = null;
let currentTeam = null;

// Initialize Supabase client
function initSupabase() {
    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Running in demo mode.');
        return false;
    }

    supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            handleSignIn(session.user);
        } else if (event === 'SIGNED_OUT') {
            handleSignOut();
        }
    });

    return true;
}

// Check if user is logged in
async function checkAuth() {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        await handleSignIn(session.user);
        return currentUser;
    }
    return null;
}

// Handle sign in
async function handleSignIn(user) {
    currentUser = user;

    // Fetch or create profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profile) {
        currentProfile = profile;
    }

    // Fetch team membership
    const { data: teamMember } = await supabase
        .from('team_members')
        .select('*, teams(*)')
        .eq('user_id', user.id)
        .single();

    if (teamMember) {
        currentTeam = teamMember.teams;
    }

    // Update UI
    updateAuthUI(true);

    // Log activity
    logAudit('login', 'user', user.id);
}

// Handle sign out
function handleSignOut() {
    currentUser = null;
    currentProfile = null;
    currentTeam = null;
    updateAuthUI(false);
}

// Sign up new user
async function signUp(email, password, fullName, firmName, role = 'paralegal') {
    if (!supabase) {
        showNotification('Authentication not configured', 'error');
        return { error: 'Not configured' };
    }

    try {
        // Create auth user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        });

        if (error) throw error;

        // Create profile
        if (data.user) {
            await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: fullName,
                firm_name: firmName,
                role: role
            });

            // Create default team
            const { data: team } = await supabase.from('teams').insert({
                name: firmName || `${fullName}'s Team`,
                created_by: data.user.id
            }).select().single();

            // Add user as team owner
            if (team) {
                await supabase.from('team_members').insert({
                    team_id: team.id,
                    user_id: data.user.id,
                    role: 'owner'
                });
            }
        }

        showNotification('Account created! Please check your email to verify.', 'success');
        return { data };
    } catch (error) {
        showNotification(error.message, 'error');
        return { error };
    }
}

// Sign in existing user
async function signIn(email, password) {
    if (!supabase) {
        // Demo mode - simulate login
        currentUser = { id: 'demo', email: email };
        currentProfile = { full_name: 'Demo User', role: 'paralegal' };
        updateAuthUI(true);
        showNotification('Signed in (Demo Mode)', 'success');
        return { data: { user: currentUser } };
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        showNotification('Signed in successfully!', 'success');
        return { data };
    } catch (error) {
        showNotification(error.message, 'error');
        return { error };
    }
}

// Sign out
async function signOut() {
    if (supabase) {
        await supabase.auth.signOut();
    }
    handleSignOut();
    showNotification('Signed out', 'info');
}

// Reset password
async function resetPassword(email) {
    if (!supabase) {
        showNotification('Not available in demo mode', 'error');
        return { error: 'Not configured' };
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password'
        });

        if (error) throw error;

        showNotification('Password reset email sent!', 'success');
        return { success: true };
    } catch (error) {
        showNotification(error.message, 'error');
        return { error };
    }
}

// Update profile
async function updateProfile(updates) {
    if (!supabase || !currentUser) return { error: 'Not authenticated' };

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', currentUser.id)
            .select()
            .single();

        if (error) throw error;

        currentProfile = data;
        logAudit('updated', 'profile', currentUser.id);
        showNotification('Profile updated!', 'success');
        return { data };
    } catch (error) {
        showNotification(error.message, 'error');
        return { error };
    }
}

// Update UI based on auth state
function updateAuthUI(isLoggedIn) {
    const authSection = document.getElementById('authSection');
    const appContent = document.getElementById('appContent');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');

    if (isLoggedIn && currentProfile) {
        if (authSection) authSection.style.display = 'none';
        if (appContent) appContent.style.display = 'block';
        if (userInfo) userInfo.style.display = 'flex';
        if (userName) userName.textContent = currentProfile.full_name || currentUser.email;
        if (userRole) userRole.textContent = CONFIG.ROLES[currentProfile.role]?.name || 'User';

        // Initialize dashboard
        if (typeof initDashboard === 'function') {
            initDashboard();
        }
    } else {
        if (authSection) authSection.style.display = 'block';
        if (appContent) appContent.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Get current user info
function getCurrentUser() {
    return currentUser;
}

function getCurrentProfile() {
    return currentProfile;
}

function getCurrentTeam() {
    return currentTeam;
}

// Check if user has permission
function hasPermission(requiredLevel) {
    if (!currentProfile) return false;
    const userLevel = CONFIG.ROLES[currentProfile.role]?.level || 0;
    return userLevel >= requiredLevel;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSupabase, checkAuth, signUp, signIn, signOut, resetPassword,
        updateProfile, getCurrentUser, getCurrentProfile, getCurrentTeam, hasPermission
    };
}
