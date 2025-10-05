// Global variables
let currentForm = 'login';
let isLoading = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupEventListeners();
});

function initializeAuth() {
    // Set initial form
    switchForm('login');
    
    // Add smooth transitions
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
}

function setupEventListeners() {
    // Login form submission
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    
    // Register form submission
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Real-time validation
    setupRealTimeValidation();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function switchForm(formType) {
    if (isLoading) return;
    
    currentForm = formType;
    
    // Hide all forms
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    
    // Show selected form
    document.getElementById(formType + 'Form').classList.add('active');
    
    // Clear all inputs
    clearAllInputs();
    
    // Focus first input
    setTimeout(() => {
        const firstInput = document.querySelector(`#${formType}Form input`);
        if (firstInput) firstInput.focus();
    }, 300);
}

function handleLogin(e) {
    e.preventDefault();
    if (isLoading) return;
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validation
    if (!validateLoginInputs(username, password)) {
        return;
    }
    
    showLoading(true);
    
    // Simulate API call (replace with actual CEF communication)
    setTimeout(() => {
        // Send login data to server via CEF
        sendToServer('login', {
            username: username,
            password: password,
            rememberMe: rememberMe
        });
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    if (isLoading) return;
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!validateRegisterInputs(username, email, password, confirmPassword, agreeTerms)) {
        return;
    }
    
    showLoading(true);
    
    // Simulate API call (replace with actual CEF communication)
    setTimeout(() => {
        // Send register data to server via CEF
        sendToServer('register', {
            username: username,
            email: email,
            password: password
        });
    }, 1000);
}

function validateLoginInputs(username, password) {
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    if (!username) {
        showInputError('loginUsername', 'მომხმარებლის სახელი აუცილებელია');
        isValid = false;
    } else if (username.length < 3) {
        showInputError('loginUsername', 'მომხმარებლის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო');
        isValid = false;
    }
    
    if (!password) {
        showInputError('loginPassword', 'პაროლი აუცილებელია');
        isValid = false;
    } else if (password.length < 6) {
        showInputError('loginPassword', 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterInputs(username, email, password, confirmPassword, agreeTerms) {
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    if (!username) {
        showInputError('registerUsername', 'მომხმარებლის სახელი აუცილებელია');
        isValid = false;
    } else if (username.length < 3) {
        showInputError('registerUsername', 'მომხმარებლის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showInputError('registerUsername', 'მომხმარებლის სახელი შეიძლება შეიცავდეს მხოლოდ ასოებს, ციფრებს და _');
        isValid = false;
    }
    
    if (!email) {
        showInputError('registerEmail', 'ელ-ფოსტა აუცილებელია');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showInputError('registerEmail', 'შეიყვანეთ სწორი ელ-ფოსტის მისამართი');
        isValid = false;
    }
    
    if (!password) {
        showInputError('registerPassword', 'პაროლი აუცილებელია');
        isValid = false;
    } else if (password.length < 6) {
        showInputError('registerPassword', 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო');
        isValid = false;
    } else if (!isStrongPassword(password)) {
        showInputError('registerPassword', 'პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს და ასოს');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showInputError('confirmPassword', 'პაროლის გამეორება აუცილებელია');
        isValid = false;
    } else if (password !== confirmPassword) {
        showInputError('confirmPassword', 'პაროლები არ ემთხვევა');
        isValid = false;
    }
    
    if (!agreeTerms) {
        showNotification('გთხოვთ, დაეთანხმოთ წესებს და პირობებს', 'error');
        isValid = false;
    }
    
    return isValid;
}

function setupRealTimeValidation() {
    // Username validation
    const usernameInputs = ['loginUsername', 'registerUsername'];
    usernameInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                const value = this.value.trim();
                if (value.length > 0 && value.length < 3) {
                    showInputError(id, 'მინიმუმ 3 სიმბოლო');
                } else {
                    clearInputError(id);
                }
            });
        }
    });
    
    // Email validation
    const emailInput = document.getElementById('registerEmail');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (value.length > 0 && !isValidEmail(value)) {
                showInputError('registerEmail', 'შეიყვანეთ სწორი ელ-ფოსტა');
            } else {
                clearInputError('registerEmail');
            }
        });
    }
    
    // Password validation
    const passwordInputs = ['loginPassword', 'registerPassword'];
    passwordInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                const value = this.value;
                if (value.length > 0 && value.length < 6) {
                    showInputError(id, 'მინიმუმ 6 სიმბოლო');
                } else {
                    clearInputError(id);
                }
            });
        }
    });
    
    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerPasswordInput = document.getElementById('registerPassword');
    if (confirmPasswordInput && registerPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const value = this.value;
            const password = registerPasswordInput.value;
            if (value.length > 0 && value !== password) {
                showInputError('confirmPassword', 'პაროლები არ ემთხვევა');
            } else {
                clearInputError('confirmPassword');
            }
        });
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showLoading(show) {
    isLoading = show;
    const overlay = document.getElementById('loadingOverlay');
    const buttons = document.querySelectorAll('.auth-btn');
    
    if (show) {
        overlay.classList.add('active');
        buttons.forEach(btn => btn.disabled = true);
    } else {
        overlay.classList.remove('active');
        buttons.forEach(btn => btn.disabled = false);
    }
}

function showInputError(inputId, message) {
    const input = document.getElementById(inputId);
    const wrapper = input.parentElement;
    
    wrapper.classList.add('error');
    wrapper.classList.remove('success');
    
    // Remove existing error message
    const existingError = wrapper.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    wrapper.parentElement.appendChild(errorDiv);
}

function clearInputError(inputId) {
    const input = document.getElementById(inputId);
    const wrapper = input.parentElement;
    
    wrapper.classList.remove('error', 'success');
    
    const errorMessage = wrapper.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearErrors() {
    document.querySelectorAll('.input-wrapper').forEach(wrapper => {
        wrapper.classList.remove('error', 'success');
    });
    
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
}

function clearAllInputs() {
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
        input.type = input.type === 'text' ? 'text' : 'password';
    });
    
    document.querySelectorAll('.password-toggle i').forEach(icon => {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    });
    
    clearErrors();
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    text.textContent = message;
    
    // Set icon based on type
    const icon = notification.querySelector('i');
    icon.className = 'fas fa-info-circle';
    
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        notification.style.borderLeft = '4px solid #ff6b6b';
    } else if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        notification.style.borderLeft = '4px solid #51cf66';
    } else {
        notification.style.borderLeft = '4px solid #667eea';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function handleKeyboardShortcuts(e) {
    // Alt + L for login form
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        switchForm('login');
    }
    
    // Alt + R for register form
    if (e.altKey && e.key === 'r') {
        e.preventDefault();
        switchForm('register');
    }
    
    // Escape to clear loading
    if (e.key === 'Escape' && isLoading) {
        showLoading(false);
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    return /[A-Za-z]/.test(password) && /[0-9]/.test(password);
}

// CEF Communication Functions
function sendToServer(action, data) {
    // This function will communicate with the SA-MP server via CEF
    // The actual implementation depends on your CEF setup
    
    try {
        // Emit event to server
        if (typeof cef_emit_event === 'function') {
            cef_emit_event('auth_' + action, JSON.stringify(data));
        } else {
            // Fallback for testing
            console.log('Sending to server:', action, data);
            simulateServerResponse(action, data);
        }
    } catch (error) {
        console.error('Error sending to server:', error);
        showLoading(false);
        showNotification('შეცდომა სერვერთან კავშირში', 'error');
    }
}

function simulateServerResponse(action, data) {
    // Simulate server response for testing
    setTimeout(() => {
        showLoading(false);
        
        if (action === 'login') {
            if (data.username === 'test' && data.password === '123456') {
                showNotification('წარმატებით შეხვედით სისტემაში!', 'success');
                // Hide auth form after successful login
                setTimeout(() => {
                    document.querySelector('.auth-container').style.display = 'none';
                }, 2000);
            } else {
                showNotification('არასწორი მომხმარებლის სახელი ან პაროლი', 'error');
            }
        } else if (action === 'register') {
            showNotification('რეგისტრაცია წარმატებით დასრულდა!', 'success');
            setTimeout(() => {
                switchForm('login');
            }, 2000);
        }
    }, 1500);
}

// Server response handlers (called from SA-MP)
function handleServerResponse(response) {
    showLoading(false);
    
    try {
        const data = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (data.success) {
            showNotification(data.message || 'ოპერაცია წარმატებით დასრულდა!', 'success');
            
            if (data.action === 'login') {
                // Hide auth form after successful login
                setTimeout(() => {
                    document.querySelector('.auth-container').style.display = 'none';
                }, 2000);
            } else if (data.action === 'register') {
                // Switch to login form after successful registration
                setTimeout(() => {
                    switchForm('login');
                }, 2000);
            }
        } else {
            showNotification(data.message || 'შეცდომა მოხდა', 'error');
        }
    } catch (error) {
        console.error('Error parsing server response:', error);
        showNotification('შეცდომა სერვერის პასუხის დამუშავებაში', 'error');
    }
}

// Export functions for CEF communication
window.handleServerResponse = handleServerResponse;
window.sendToServer = sendToServer;
