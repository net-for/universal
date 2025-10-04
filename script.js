/*
    BARLEY RP - CEF JavaScript
    Simple and Working
*/

// Debug function
function debug(message) {
    console.log('[CEF DEBUG] ' + message);
    // Also show in page for testing
    const debugDiv = document.getElementById('debug-info');
    if (debugDiv) {
        debugDiv.innerHTML += message + '<br>';
    }
}

// Get player name from URL
function getPlayerName() {
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('name') || urlParams.get('player') || 'Player';
    debug('Player name from URL: ' + playerName);
    return playerName;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    debug('Page loaded successfully');

    const playerName = getPlayerName();
    debug('Player name: ' + playerName);

    // Set player name in inputs
    const loginUsername = document.getElementById('loginUsername');
    const regUsername = document.getElementById('regUsername');

    if (loginUsername) {
        loginUsername.value = playerName;
        debug('Set login username to: ' + playerName);
    }
    if (regUsername) {
        regUsername.value = playerName;
        debug('Set register username to: ' + playerName);
    }

    // Check URL mode parameter
    checkMode();
});

function checkMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    debug('URL mode: ' + mode);

    if (mode === 'login') {
        debug('Showing login form');
        showLogin();
    } else if (mode === 'register') {
        debug('Showing register form');
        showRegister();
    } else if (mode === 'gender') {
        debug('Showing gender form');
        showGender();
    } else if (mode === 'spawn') {
        debug('Showing spawn form');
        showSpawn();
    } else {
        debug('Unknown mode: ' + mode + ', showing login by default');
        showLogin();
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

    debug('Login attempt - Password length: ' + password.length);

    if (password.length < 5) {
        alert('Password must be at least 5 characters!');
        debug('Login failed - password too short');
        return;
    }

    debug('Sending login event to SA-MP');
    showLoading();

    // Try different CEF methods
    if (typeof cef !== 'undefined') {
        debug('cef object found, trying different methods...');

        if (cef.emit) {
            debug('Trying cef.emit...');
            cef.emit('login', password);
        } else if (cef.trigger) {
            debug('Trying cef.trigger...');
            cef.trigger('login', password);
        } else if (cef.call) {
            debug('Trying cef.call...');
            cef.call('login', password);
        } else {
            debug('No suitable CEF method found!');
            alert('CEF plugin loaded but no communication method available!');
        }
    } else {
        debug('ERROR: cef object not found!');
        alert('CEF plugin not loaded! Please install SA-MP CEF plugin from forum.sa-mp.com');
        hideAll();
    }
}

// ============================================================================
// REGISTER
// ============================================================================

function handleRegister() {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regPasswordConfirm').value;

    debug('Register attempt - Password length: ' + password.length + ', Confirm length: ' + confirmPassword.length);

    if (password.length < 5 || password.length > 20) {
        alert('Password must be 5-20 characters!');
        debug('Register failed - invalid password length');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        debug('Register failed - passwords do not match');
        return;
    }

    debug('Sending register event to SA-MP');
    showLoading();

    // Try different CEF methods
    if (typeof cef !== 'undefined') {
        debug('cef object found, trying different methods...');

        if (cef.emit) {
            debug('Trying cef.emit...');
            cef.emit('register', password, confirmPassword);
        } else if (cef.trigger) {
            debug('Trying cef.trigger...');
            cef.trigger('register', password, confirmPassword);
        } else if (cef.call) {
            debug('Trying cef.call...');
            cef.call('register', password, confirmPassword);
        } else {
            debug('No suitable CEF method found!');
            alert('CEF plugin loaded but no communication method available!');
        }
    } else {
        debug('ERROR: cef object not found!');
        alert('CEF plugin not loaded! Please install SA-MP CEF plugin from forum.sa-mp.com');
        hideAll();
    }
}

// ============================================================================
// GENDER SELECTION
// ============================================================================

function selectGender(gender) {
    debug('Gender selected: ' + gender);

    showLoading();

    // Try different CEF methods
    if (typeof cef !== 'undefined') {
        debug('cef object found, trying different methods...');

        if (cef.emit) {
            debug('Trying cef.emit...');
            cef.emit('selectGender', gender);
        } else if (cef.trigger) {
            debug('Trying cef.trigger...');
            cef.trigger('selectGender', gender);
        } else if (cef.call) {
            debug('Trying cef.call...');
            cef.call('selectGender', gender);
        } else {
            debug('No suitable CEF method found!');
            alert('CEF plugin loaded but no communication method available!');
        }
    } else {
        debug('ERROR: cef object not found!');
        alert('CEF plugin not loaded! Please install SA-MP CEF plugin from forum.sa-mp.com');
        hideAll();
    }
}

// ============================================================================
// SPAWN SELECTION
// ============================================================================

function selectSpawn(spawnType) {
    debug('Spawn selected: ' + spawnType);

    showLoading();

    // Try different CEF methods
    if (typeof cef !== 'undefined') {
        debug('cef object found, trying different methods...');

        if (cef.emit) {
            debug('Trying cef.emit...');
            cef.emit('selectSpawn', spawnType);
        } else if (cef.trigger) {
            debug('Trying cef.trigger...');
            cef.trigger('selectSpawn', spawnType);
        } else if (cef.call) {
            debug('Trying cef.call...');
            cef.call('selectSpawn', spawnType);
        } else {
            debug('No suitable CEF method found!');
            alert('CEF plugin loaded but no communication method available!');
        }
    } else {
        debug('ERROR: cef object not found!');
        alert('CEF plugin not loaded! Please install SA-MP CEF plugin from forum.sa-mp.com');
        hideAll();
    }
}

// ============================================================================
// KEY HANDLERS
// ============================================================================

// Enter key handlers
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        debug('Enter key pressed');

        if (!document.getElementById('loginForm').classList.contains('hidden')) {
            debug('Login form visible, handling login');
            handleLogin();
        } else if (!document.getElementById('registerForm').classList.contains('hidden')) {
            debug('Register form visible, handling register');
            handleRegister();
        } else {
            debug('No form visible for enter key');
        }
    }
});

debug('CEF Script loaded successfully!');

// Check if cef object exists
setTimeout(() => {
    debug('Checking cef object after 1 second...');
    if (typeof cef !== 'undefined') {
        debug('cef object found: ' + typeof cef);
        if (cef.emit) {
            debug('cef.emit function found!');
        } else {
            debug('ERROR: cef.emit function not found!');
        }
    } else {
        debug('ERROR: cef object not found!');
    }
}, 1000);
