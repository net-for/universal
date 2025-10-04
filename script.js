/*
    BARLEY RP - CEF JavaScript
    Simple and Working
*/

// Get player name from URL
function getPlayerName() {
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('name') || urlParams.get('player') || 'Player';
    console.log('[CEF] Player name from URL:', playerName);
    return playerName;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    const playerName = getPlayerName();
    console.log('[CEF] Player name:', playerName);
    
    // Set player name in inputs
    const loginUsername = document.getElementById('loginUsername');
    const regUsername = document.getElementById('regUsername');
    
    if (loginUsername) loginUsername.value = playerName;
    if (regUsername) regUsername.value = playerName;
    
    // Check URL mode parameter
    checkMode();
});

function checkMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    console.log('[CEF] Mode:', mode);
    
    if (mode === 'login') {
        showLogin();
    } else if (mode === 'register') {
        showRegister();
    } else if (mode === 'gender') {
        showGender();
    } else if (mode === 'spawn') {
        showSpawn();
    }
}

// Show/Hide functions
function showLogin() {
    hideAll();
    const form = document.getElementById('loginForm');
    if (form) form.classList.remove('hidden');
}

function showRegister() {
    hideAll();
    const form = document.getElementById('registerForm');
    if (form) form.classList.remove('hidden');
}

function showGender() {
    hideAll();
    const form = document.getElementById('genderForm');
    if (form) form.classList.remove('hidden');
}

function showSpawn() {
    hideAll();
    const form = document.getElementById('spawnForm');
    if (form) form.classList.remove('hidden');
}

function showLoading() {
    hideAll();
    const form = document.getElementById('loadingScreen');
    if (form) form.classList.remove('hidden');
}

function hideAll() {
    document.querySelectorAll('.form-container').forEach(el => {
        el.classList.add('hidden');
    });
}

// ============================================================================
// LOGIN
// ============================================================================

function handleLogin() {
    const password = document.getElementById('loginPassword').value;
    
    if (password.length < 5) {
        alert('Password must be at least 5 characters!');
        return;
    }
    
    console.log('[CEF] Login - Password length:', password.length);
    
    showLoading();
    
    // Send to SA-MP
    if (typeof cef !== 'undefined' && cef.emit) {
        console.log('[CEF] Sending login event with password:', password);
        cef.emit('login', password);
    } else {
        console.log('[CEF] ERROR: cef.emit not found!');
        alert('CEF plugin not loaded! Please install SA-MP CEF plugin.');
    }
}

// ============================================================================
// REGISTER
// ============================================================================

function handleRegister() {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regPasswordConfirm').value;

    if (password.length < 5 || password.length > 20) {
        alert('Password must be 5-20 characters!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    console.log('[CEF] Register - Password length:', password.length);

    showLoading();

    // Send to SA-MP
    if (typeof cef !== 'undefined' && cef.emit) {
        console.log('[CEF] Sending register event');
        cef.emit('register', password, confirmPassword);
    } else {
        console.log('[CEF] ERROR: cef.emit not found!');
        alert('CEF plugin not loaded! Please install SA-MP CEF plugin.');
    }
}

// ============================================================================
// GENDER SELECTION
// ============================================================================

function selectGender(gender) {
    console.log('[CEF] Gender selected:', gender);

    showLoading();

    // Send to SA-MP
    if (typeof cef !== 'undefined' && cef.emit) {
        console.log('[CEF] Sending gender event');
        cef.emit('selectGender', gender);
    } else {
        console.log('[CEF] ERROR: cef.emit not found!');
        alert('CEF plugin not loaded! Please install SA-MP CEF plugin.');
    }
}

// ============================================================================
// SPAWN SELECTION
// ============================================================================

function selectSpawn(spawnType) {
    console.log('[CEF] Spawn selected:', spawnType);

    showLoading();

    // Send to SA-MP
    if (typeof cef !== 'undefined' && cef.emit) {
        console.log('[CEF] Sending spawn event');
        cef.emit('selectSpawn', spawnType);
    } else {
        console.log('[CEF] ERROR: cef.emit not found!');
        alert('CEF plugin not loaded! Please install SA-MP CEF plugin.');
    }
}

// ============================================================================
// KEY HANDLERS
// ============================================================================

// Enter key handlers
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (!document.getElementById('loginForm').classList.contains('hidden')) {
            handleLogin();
        } else if (!document.getElementById('registerForm').classList.contains('hidden')) {
            handleRegister();
        }
    }
});

console.log('[CEF] Script loaded successfully!');
