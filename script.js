// ============================================================================
// BARLEY ROLEPLAY - CEF AUTHENTICATION SCRIPT
// ============================================================================

class BarleyAuth {
    constructor() {
        this.currentMode = 'login';
        this.playerName = '';
        this.cef = null;
        this.debugMode = false;
        
        this.init();
    }

    init() {
        console.log('Barley Auth System Initializing...');
        
        // Get player name from URL parameters
        this.playerName = this.getPlayerNameFromURL();
        console.log('Player name from URL:', this.playerName);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize CEF communication
        this.initCEF();
        
        // Show appropriate form based on URL mode
        this.showFormByMode();
        
        console.log('Barley Auth System Ready!');
    }

    getPlayerNameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('player') || 'Unknown';
    }

    setupEventListeners() {
        // Form switching
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });

        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('register');
        });

        // Form submissions
        document.querySelector('#loginForm form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.querySelector('#registerForm form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Gender selection
        document.querySelectorAll('.gender-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectGender(option);
            });
        });

        // Spawn selection
        document.querySelectorAll('.spawn-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectSpawn(option);
            });
        });

        // Debug toggle (F12)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12') {
                e.preventDefault();
                this.toggleDebug();
            }
        });
    }

    initCEF() {
        // Wait for CEF object to be available
        const checkCEF = () => {
            if (typeof cef !== 'undefined') {
                this.cef = cef;
                console.log('CEF object found and ready!');
                this.debug('CEF communication initialized');
            } else {
                console.log('Waiting for CEF object...');
                setTimeout(checkCEF, 100);
            }
        };
        
        checkCEF();
    }

    showFormByMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode') || 'login';
        
        this.currentMode = mode;
        this.showForm(mode);
        
        // Set player names
        this.setPlayerNames();
    }

    setPlayerNames() {
        document.getElementById('loginUsername').value = this.playerName;
        document.getElementById('registerUsername').value = this.playerName;
    }

    showForm(formType) {
        // Hide all forms
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('genderForm').style.display = 'none';
        document.getElementById('spawnForm').style.display = 'none';
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('successScreen').style.display = 'none';

        // Show selected form
        const formElement = document.getElementById(formType + 'Form');
        if (formElement) {
            formElement.style.display = 'block';
            formElement.classList.add('fade-in');
        }

        this.currentMode = formType;
        this.debug(`Showing form: ${formType}`);
    }

    handleLogin() {
        const password = document.getElementById('loginPassword').value;
        
        if (!password || password.length < 5) {
            this.showError('Password must be at least 5 characters long!');
            return;
        }

        this.debug(`Login attempt - Password length: ${password.length}`);
        this.sendToSAMP('cef:login', password);
        this.showLoading('Authenticating...');
    }

    handleRegister() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!password || password.length < 5) {
            this.showError('Password must be at least 5 characters long!');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match!');
            return;
        }

        this.debug(`Register attempt - Password length: ${password.length}`);
        this.sendToSAMP('cef:register', password);
        this.showLoading('Creating account...');
    }

    selectGender(option) {
        // Remove previous selection
        document.querySelectorAll('.gender-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        option.classList.add('selected');

        const gender = option.dataset.gender;
        const skin = parseInt(option.dataset.skin);
        
        this.debug(`Gender selected: ${gender} (Skin: ${skin})`);
        
        // Send to SA-MP after a short delay
        setTimeout(() => {
            this.sendToSAMP('cef:gender', skin.toString());
            this.showLoading('Setting up character...');
        }, 500);
    }

    selectSpawn(option) {
        // Remove previous selection
        document.querySelectorAll('.spawn-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        option.classList.add('selected');

        const spawnType = option.dataset.spawn;
        
        this.debug(`Spawn selected: ${spawnType}`);
        
        // Send to SA-MP after a short delay
        setTimeout(() => {
            this.sendToSAMP('cef:spawn', spawnType);
            this.showSuccess();
        }, 500);
    }

    sendToSAMP(event, data) {
        this.debug(`Sending to SA-MP: ${event} - ${data}`);
        
        // Try different CEF communication methods
        const methods = [
            () => { if (typeof cef !== 'undefined' && cef.emit) cef.emit(event, data); },
            () => { if (typeof cef !== 'undefined' && cef.trigger) cef.trigger(event, data); },
            () => { if (typeof cef !== 'undefined' && cef.call) cef.call(event, data); },
            () => { if (typeof cef !== 'undefined' && cef.send) cef.send(event, data); },
            () => { 
                // Try to call SA-MP directly
                if (typeof samp !== 'undefined' && samp.call) {
                    samp.call(event, data);
                }
            },
            () => {
                // Try window.postMessage as fallback
                window.postMessage({ type: event, data: data }, '*');
            }
        ];

        for (let method of methods) {
            try {
                method();
                this.debug(`CEF method succeeded: ${event}`);
                return;
            } catch (error) {
                this.debug(`CEF method failed: ${error.message}`);
            }
        }

        this.debug('All CEF communication methods failed!');
    }


    showLoading(message = 'Loading...') {
        document.getElementById('loadingScreen').style.display = 'block';
        document.querySelector('#loadingScreen h3').textContent = message;
        this.debug(`Showing loading: ${message}`);
    }

    showSuccess() {
        document.getElementById('successScreen').style.display = 'block';
        this.debug('Showing success screen');
        
        // Close CEF after success
        setTimeout(() => {
            this.sendToSAMP('cef:close', '');
        }, 2000);
    }

    showError(message) {
        this.debug(`Error: ${message}`);
        // You could add a toast notification here
        alert(message);
    }

    toggleDebug() {
        this.debugMode = !this.debugMode;
        const debugInfo = document.getElementById('debugInfo');
        debugInfo.style.display = this.debugMode ? 'block' : 'none';
        this.debug('Debug mode toggled');
    }

    debug(message) {
        if (this.debugMode) {
            const debugInfo = document.getElementById('debugInfo');
            const timestamp = new Date().toLocaleTimeString();
            debugInfo.innerHTML += `[${timestamp}] ${message}<br>`;
            debugInfo.scrollTop = debugInfo.scrollHeight;
        }
        console.log(`[BarleyAuth] ${message}`);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    window.barleyAuth = new BarleyAuth();
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.barleyAuth) {
            window.barleyAuth = new BarleyAuth();
        }
    });
} else {
    if (!window.barleyAuth) {
        window.barleyAuth = new BarleyAuth();
    }
}

// ============================================================================
// CEF EVENT HANDLERS
// ============================================================================

// Handle CEF events from SA-MP
window.addEventListener('message', (event) => {
    if (event.data && typeof event.data === 'object') {
        const { type, data } = event.data;
        
        if (type === 'cef:showForm') {
            window.barleyAuth?.showForm(data);
        } else if (type === 'cef:showError') {
            window.barleyAuth?.showError(data);
        } else if (type === 'cef:showLoading') {
            window.barleyAuth?.showLoading(data);
        } else if (type === 'cef:showSuccess') {
            window.barleyAuth?.showSuccess();
        }
    }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth' });
}

// Add loading states to buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    return () => {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// ============================================================================
// EXPORT FOR GLOBAL ACCESS
// ============================================================================

window.BarleyAuth = BarleyAuth;