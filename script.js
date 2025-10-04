// ============================================================================
// BARLEY ROLEPLAY - CEF REGISTRATION/LOGIN SYSTEM
// JavaScript Functions & SAMP Integration
// ============================================================================

// Global Variables
let currentMode = 'login';
let playerName = '';

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setupEventListeners();
    createParticles();
    checkURLParameters();
});

function initializeSystem() {
    console.log('[CEF] System initialized');
    
    // Get player name from SA-MP (simulation)
    playerName = getPlayerNameFromSAMP();
    
    // Set player name in inputs
    document.getElementById('loginUsername').value = playerName;
    document.getElementById('regUsername').value = playerName;
}

function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const player = urlParams.get('player');
    
    if (mode === 'register') {
        showRegister();
    } else if (mode === 'login') {
        showLogin();
    } else if (mode === 'gender') {
        showGenderSelection();
    } else if (mode === 'spawn') {
        showSpawnSelection();
    }
    
    if (player) {
        console.log('[CEF] Player name:', player);
        // Update player name display
        const playerNameElements = document.querySelectorAll('.player-name');
        playerNameElements.forEach(el => {
            el.textContent = player;
        });
    }
}

// ============================================================================
// SAMP INTEGRATION
// ============================================================================

function getPlayerNameFromSAMP() {
    // Get player name from URL parameter (passed from SA-MP)
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('player');
    
    if (playerName) {
        console.log('[CEF] Player name from URL:', playerName);
        return playerName;
    }
    
    // SA-MP CEF fallback
    if (typeof cef !== 'undefined' && typeof cef.get_player_name === 'function') {
        return cef.get_player_name();
    }
    
    // RAGE:MP integration
    if (typeof mp !== 'undefined' && mp.trigger) {
        return mp.players.local.name;
    }
    
    // alt:V integration
    if (typeof alt !== 'undefined') {
        return alt.Player.local.name;
    }
    
    // Fallback for testing
    return 'Player_Name';
}

function sendToSAMP(event, data) {
    console.log('[CEF] Sending to SAMP:', event, data);
    console.log('[CEF] Event:', event);
    console.log('[CEF] Data:', data);
    
    // SA-MP CEF Plugin (CEFSAMP)
    if (typeof cef !== 'undefined' && typeof cef.emit === 'function') {
        console.log('[CEF] Using CEFSAMP plugin');
        
        // Different event handling for different pages
        if (event === 'cef:register') {
            cef.emit(event, data.password || '', data.passwordConfirm || '');
        } else if (event === 'cef:login') {
            cef.emit(event, data.password || '');
        } else if (event === 'cef:gender') {
            cef.emit(event, data.gender || '');
        } else if (event === 'cef:spawn') {
            cef.emit(event, data.spawn || 'city');
        } else if (event === 'cef:close') {
            cef.emit(event);
        } else {
            cef.emit(event, JSON.stringify(data));
        }
        
        return true;
    }
    
    // RAGE:MP
    if (typeof mp !== 'undefined' && mp.trigger) {
        mp.trigger(event, JSON.stringify(data));
        return true;
    }
    
    // alt:V
    if (typeof alt !== 'undefined' && alt.emit) {
        alt.emit(event, data);
        return true;
    }
    
    // Fallback for browser testing
    console.log('[CEF] No SAMP client found, running in browser mode');
    simulateSAMPResponse(event, data);
    return false;
}

function simulateSAMPResponse(event, data) {
    // Simulate SAMP responses for browser testing
    setTimeout(() => {
        if (event === 'cef:login') {
            handleLoginResponse(true, 'Warmatebit Shemoxvedit!');
        } else if (event === 'cef:register') {
            handleRegisterResponse(true, 'Warmatebit Daregistrirdit!');
        } else if (event === 'cef:gender') {
            handleGenderResponse(true);
        }
    }, 2000);
}

// ============================================================================
// FORM SWITCHING
// ============================================================================

function showLogin() {
    hideAllForms();
    document.getElementById('loginForm').classList.remove('hidden');
    currentMode = 'login';
}

function showRegister() {
    hideAllForms();
    document.getElementById('registerForm').classList.remove('hidden');
    currentMode = 'register';
}

function showGenderSelection() {
    hideAllForms();
    document.getElementById('genderForm').classList.remove('hidden');
    currentMode = 'gender';
}

function showSpawnSelection() {
    hideAllForms();
    const spawnForm = document.getElementById('spawnForm');
    if (spawnForm) {
        spawnForm.classList.remove('hidden');
    }
    currentMode = 'spawn';
}

function showLoading() {
    hideAllForms();
    document.getElementById('loadingScreen').classList.remove('hidden');
}

function showSuccess(message) {
    hideAllForms();
    document.getElementById('successText').textContent = message;
    document.getElementById('successMessage').classList.remove('hidden');
}

function hideAllForms() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('genderForm').classList.add('hidden');
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('successMessage').classList.add('hidden');
}

// ============================================================================
// LOGIN HANDLING
// ============================================================================

function handleLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('loginPassword').value;
    
    if (!password || password.length < 5) {
        showError('loginPassword', 'Paroli Unda Iyos Minchum 5 Simbolo!');
        return false;
    }
    
    showLoading();
    
    sendToSAMP('cef:login', {
        username: playerName,
        password: password
    });
    
    return false;
}

function handleLoginResponse(success, message) {
    if (success) {
        showSuccess(message);
        setTimeout(() => {
            sendToSAMP('cef:close', {});
        }, 2000);
    } else {
        showLogin();
        showError('loginPassword', message);
    }
}

// ============================================================================
// REGISTRATION HANDLING
// ============================================================================

function handleRegister(event) {
    event.preventDefault();
    
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    
    // Validate password length
    if (password.length < 5 || password.length > 20) {
        showError('regPassword', 'Paroli Unda Iyos 5-20 Simbolo!');
        return false;
    }
    
    // Validate password match
    if (password !== passwordConfirm) {
        showError('regPasswordConfirm', 'Parolebi Ar Emtkhveva!');
        return false;
    }
    
    // Validate password requirements
    if (!validatePassword(password)) {
        showError('regPassword', 'Paroli Ar Akmayofilebs Motkhovebs!');
        return false;
    }
    
    showLoading();
    
    sendToSAMP('cef:register', {
        username: playerName,
        password: password
    });
    
    return false;
}

function handleRegisterResponse(success, message) {
    if (success) {
        showSuccess(message);
        setTimeout(() => {
            showGenderSelection();
        }, 2000);
    } else {
        showRegister();
        showError('regPassword', message);
    }
}

// ============================================================================
// GENDER SELECTION
// ============================================================================

function selectGender(gender) {
    const cards = document.querySelectorAll('.gender-card');
    cards.forEach(card => {
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0.5';
    });
    
    event.target.closest('.gender-card').style.transform = 'scale(1.05)';
    event.target.closest('.gender-card').style.opacity = '1';
    
    setTimeout(() => {
        showLoading();
        sendToSAMP('cef:gender', {
            username: playerName,
            gender: gender
        });
    }, 500);
}

function selectSpawn(spawnChoice) {
    console.log('[CEF] Spawn selected:', spawnChoice);
    showLoading();
    
    sendToSAMP('cef:spawn', {
        username: playerName,
        spawn: spawnChoice
    });
}

function handleGenderResponse(success) {
    if (success) {
        showSuccess('Personazhi Sheikmna Warmatebit!');
        setTimeout(() => {
            sendToSAMP('cef:close', {});
        }, 2000);
    }
}

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const validLength = password.length >= 5 && password.length <= 20;
    
    return hasLetter && hasNumber && validLength;
}

function setupEventListeners() {
    // Password input validation
    const regPassword = document.getElementById('regPassword');
    if (regPassword) {
        regPassword.addEventListener('input', function() {
            updatePasswordRequirements(this.value);
        });
    }
    
    // Confirm password validation
    const regPasswordConfirm = document.getElementById('regPasswordConfirm');
    if (regPasswordConfirm) {
        regPasswordConfirm.addEventListener('input', function() {
            const password = document.getElementById('regPassword').value;
            if (this.value && this.value !== password) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                if (this.value === password && password.length > 0) {
                    this.classList.add('success');
                }
            }
        });
    }
}

function updatePasswordRequirements(password) {
    const reqLength = document.getElementById('req-length');
    const reqLetter = document.getElementById('req-letter');
    const reqNumber = document.getElementById('req-number');
    
    // Length check
    if (password.length >= 5 && password.length <= 20) {
        reqLength.classList.add('valid');
        reqLength.classList.remove('invalid');
    } else {
        reqLength.classList.remove('valid');
        reqLength.classList.add('invalid');
    }
    
    // Letter check
    if (/[a-zA-Z]/.test(password)) {
        reqLetter.classList.add('valid');
        reqLetter.classList.remove('invalid');
    } else {
        reqLetter.classList.remove('valid');
        reqLetter.classList.add('invalid');
    }
    
    // Number check
    if (/[0-9]/.test(password)) {
        reqNumber.classList.add('valid');
        reqNumber.classList.remove('invalid');
    } else {
        reqNumber.classList.remove('valid');
        reqNumber.classList.add('invalid');
    }
}

// ============================================================================
// PASSWORD VISIBILITY TOGGLE
// ============================================================================

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        input.classList.remove('error');
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 3000);
}

// ============================================================================
// PARTICLES ANIMATION
// ============================================================================

function createParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(173, 255, 47, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(173, 255, 47, ${0.2 - distance / 750})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================================================
// EXTERNAL API (Called from SA-MP)
// ============================================================================

function onLoginResult(success, message) {
    handleLoginResponse(success, message);
}

function onRegisterResult(success, message) {
    handleRegisterResponse(success, message);
}

function onGenderResult(success) {
    handleGenderResponse(success);
}

function setPlayerName(name) {
    playerName = name;
    document.getElementById('loginUsername').value = name;
    document.getElementById('regUsername').value = name;
}

// ============================================================================
// CONSOLE LOG
// ============================================================================

console.log(`
    ╔═══════════════════════════════════╗
    ║   BARLEY ROLEPLAY CEF SYSTEM     ║
    ║   Version: 1.0.0                 ║
    ║   Status: Initialized            ║
    ╚═══════════════════════════════════╝
`);

