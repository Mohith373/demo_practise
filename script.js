// Global variables
let currentForm = 'login';
let passwordRequirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
};

// DOM elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotForm = document.getElementById('forgotForm');
const successMessage = document.getElementById('successMessage');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupFormValidation();
    setupPasswordStrength();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Login form submission
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    
    // Signup form submission
    document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
    
    // Forgot password form submission
    document.getElementById('forgotFormElement').addEventListener('submit', handleForgotPassword);
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
    
    // Real-time password confirmation check
    document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);
    
    // Terms agreement checkbox
    document.getElementById('agreeTerms').addEventListener('change', validateSignupForm);
    
    // Input focus effects
    document.querySelectorAll('.input-icon input').forEach(input => {
        input.addEventListener('focus', addFocusClass);
        input.addEventListener('blur', removeFocusClass);
    });
}

// Form switching functions
function showLogin() {
    hideAllForms();
    loginForm.classList.remove('hidden');
    currentForm = 'login';
    animateFormTransition(loginForm);
}

function showSignup() {
    hideAllForms();
    signupForm.classList.remove('hidden');
    currentForm = 'signup';
    animateFormTransition(signupForm);
}

function showForgotPassword() {
    hideAllForms();
    forgotForm.classList.remove('hidden');
    currentForm = 'forgot';
    animateFormTransition(forgotForm);
}

function hideAllForms() {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    forgotForm.classList.add('hidden');
}

function animateFormTransition(form) {
    form.style.opacity = '0';
    form.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        form.style.transition = 'all 0.3s ease';
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
    }, 50);
}

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
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

// Password strength checking
function checkPasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    // Reset requirements
    passwordRequirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    // Update requirement indicators
    updateRequirementIndicators();
    
    // Calculate strength score
    const score = Object.values(passwordRequirements).filter(Boolean).length;
    let strength = '';
    let color = '';
    
    if (score === 0) {
        strength = 'Very Weak';
        color = '#ff4757';
        strengthFill.className = 'strength-fill';
    } else if (score === 1) {
        strength = 'Weak';
        color = '#ff4757';
        strengthFill.className = 'strength-fill weak';
    } else if (score === 2) {
        strength = 'Fair';
        color = '#ffa502';
        strengthFill.className = 'strength-fill fair';
    } else if (score === 3) {
        strength = 'Good';
        color = '#2ed573';
        strengthFill.className = 'strength-fill good';
    } else if (score === 4) {
        strength = 'Strong';
        color = '#2ed573';
        strengthFill.className = 'strength-fill strong';
    } else {
        strength = 'Very Strong';
        color = '#1e90ff';
        strengthFill.className = 'strength-fill strong';
    }
    
    strengthText.textContent = `Password strength: ${strength}`;
    strengthText.style.color = color;
    
    // Enable/disable signup button based on password strength
    validateSignupForm();
}

// Update requirement indicators
function updateRequirementIndicators() {
    const requirements = ['length', 'uppercase', 'lowercase', 'number', 'special'];
    
    requirements.forEach(req => {
        const element = document.getElementById(`req${req.charAt(0).toUpperCase() + req.slice(1)}`);
        const icon = element.querySelector('i');
        
        if (passwordRequirements[req]) {
            element.classList.add('met');
            icon.classList.remove('fa-circle');
            icon.classList.add('fa-check-circle');
        } else {
            element.classList.remove('met');
            icon.classList.remove('fa-check-circle');
            icon.classList.add('fa-circle');
        }
    });
}

// Check password match
function checkPasswordMatch() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.classList.add('input-error');
        showError(confirmInput, 'Passwords do not match');
    } else {
        confirmInput.classList.remove('input-error');
        hideError(confirmInput);
    }
    
    validateSignupForm();
}

// Form validation
function setupFormValidation() {
    // Email validation
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
    
    // Name validation
    document.getElementById('signupName').addEventListener('blur', validateName);
}

function validateEmail(event) {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        event.target.classList.add('input-error');
        showError(event.target, 'Please enter a valid email address');
        return false;
    } else {
        event.target.classList.remove('input-error');
        hideError(event.target);
        return true;
    }
}

function validateName(event) {
    const name = event.target.value.trim();
    
    if (name && name.length < 2) {
        event.target.classList.add('input-error');
        showError(event.target, 'Name must be at least 2 characters long');
        return false;
    } else {
        event.target.classList.remove('input-error');
        hideError(event.target);
        return true;
    }
}

function validateSignupForm() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    const isPasswordStrong = Object.values(passwordRequirements).filter(Boolean).length >= 4;
    const passwordsMatch = password === confirmPassword;
    const isNameValid = name.length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    const signupBtn = document.getElementById('signupBtn');
    
    if (isNameValid && isEmailValid && isPasswordStrong && passwordsMatch && agreeTerms) {
        signupBtn.disabled = false;
        signupBtn.classList.remove('disabled');
    } else {
        signupBtn.disabled = true;
        signupBtn.classList.add('disabled');
    }
}

// Error handling
function showError(input, message) {
    let errorDiv = input.parentElement.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        input.parentElement.appendChild(errorDiv);
    }
    
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    errorDiv.style.display = 'flex';
}

function hideError(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Form submission handlers
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Basic validation
    if (!email || !password) {
        showSuccessMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail({ target: document.getElementById('loginEmail') })) {
        return;
    }
    
    // Simulate login process
    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Simulate successful login
        showSuccessMessage('Login successful! Welcome back.', 'success');
        
        // In a real application, you would redirect to dashboard here
        // window.location.href = '/dashboard';
    }, 2000);
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showSuccessMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateName({ target: document.getElementById('signupName') })) {
        return;
    }
    
    if (!validateEmail({ target: document.getElementById('signupEmail') })) {
        return;
    }
    
    if (password !== confirmPassword) {
        showSuccessMessage('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showSuccessMessage('Please agree to the terms and conditions', 'error');
        return;
    }
    
    // Simulate signup process
    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Simulate successful signup
        showSuccessMessage('Account created successfully! Welcome aboard.', 'success');
        
        // Clear form
        event.target.reset();
        checkPasswordStrength();
        
        // In a real application, you might redirect to login or dashboard
        setTimeout(() => {
            showLogin();
        }, 2000);
    }, 2000);
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!email) {
        showSuccessMessage('Please enter your email address', 'error');
        return;
    }
    
    if (!validateEmail({ target: document.getElementById('forgotEmail') })) {
        return;
    }
    
    // Simulate password reset process
    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Simulate successful password reset
        showSuccessMessage('Password reset link sent to your email!', 'success');
        
        // Clear form
        event.target.reset();
        
        // Return to login
        setTimeout(() => {
            showLogin();
        }, 2000);
    }, 2000);
}

function handleSocialLogin(event) {
    event.preventDefault();
    
    const provider = event.currentTarget.classList.contains('google') ? 'Google' : 'Facebook';
    
    // Simulate social login
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Connecting...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        showSuccessMessage(`Connected with ${provider} successfully!`, 'success');
    }, 2000);
}

// Success message handling
function showSuccessMessage(message, type = 'success') {
    const successText = document.getElementById('successText');
    const successIcon = document.querySelector('.success-icon i');
    
    successText.textContent = message;
    
    if (type === 'error') {
        successIcon.className = 'fas fa-exclamation-circle';
        successIcon.style.color = '#ff4757';
    } else {
        successIcon.className = 'fas fa-check-circle';
        successIcon.style.color = '#2ed573';
    }
    
    successMessage.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideSuccessMessage();
    }, 5000);
}

function hideSuccessMessage() {
    successMessage.classList.add('hidden');
}

// Focus effects
function addFocusClass(event) {
    const inputGroup = event.target.closest('.input-group');
    inputGroup.classList.add('focused');
}

function removeFocusClass(event) {
    const inputGroup = event.target.closest('.input-group');
    inputGroup.classList.remove('focused');
}

// Password strength setup
function setupPasswordStrength() {
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced password strength with debouncing
const debouncedPasswordCheck = debounce(checkPasswordStrength, 300);

// Add enhanced password strength checking
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', debouncedPasswordCheck);
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideSuccessMessage();
    }
});

// Form accessibility improvements
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.target.type !== 'textarea') {
            event.preventDefault();
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    });
});

// Add loading states to all submit buttons
document.querySelectorAll('.submit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.disabled) {
            this.classList.add('loading');
        }
    });
});

// Auto-save form data (optional feature)
function saveFormData() {
    const formData = {
        loginEmail: document.getElementById('loginEmail')?.value || '',
        rememberMe: document.getElementById('rememberMe')?.checked || false
    };
    
    localStorage.setItem('authFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('authFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        if (formData.loginEmail) {
            document.getElementById('loginEmail').value = formData.loginEmail;
        }
        
        if (formData.rememberMe) {
            document.getElementById('rememberMe').checked = formData.rememberMe;
        }
    }
}

// Load saved form data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Save form data when user interacts with forms
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', saveFormData);
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add form reset functionality
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        
        // Reset password strength indicators
        if (formId === 'signupFormElement') {
            checkPasswordStrength();
            document.querySelectorAll('.requirement').forEach(req => {
                req.classList.remove('met');
                const icon = req.querySelector('i');
                icon.classList.remove('fa-check-circle');
                icon.classList.add('fa-circle');
            });
        }
        
        // Clear error states
        form.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });
        
        form.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
    }
}

// Add reset buttons to forms (optional)
document.querySelectorAll('form').forEach(form => {
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-btn';
    resetBtn.innerHTML = '<i class="fas fa-undo"></i> Reset';
    resetBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 5px;
        transition: all 0.3s ease;
    `;
    
    resetBtn.addEventListener('click', () => {
        resetForm(form.id);
    });
    
    form.style.position = 'relative';
    form.appendChild(resetBtn);
});

// Export functions for global access
window.showLogin = showLogin;
window.showSignup = showSignup;
window.showForgotPassword = showForgotPassword;
window.togglePassword = togglePassword;
window.checkPasswordStrength = checkPasswordStrength;
window.hideSuccessMessage = hideSuccessMessage;
