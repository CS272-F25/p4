
let currentUser = null;

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
}

function removeUser() {
    localStorage.removeItem('currentUser');
    currentUser = null;
}

function updateAuthUI() {
    const signinBtn = document.getElementById('signin-btn');
    const signoutBtn = document.getElementById('signout-btn');
    const userGreeting = document.getElementById('user-greeting');
    
    if (currentUser) {
        if (signinBtn) signinBtn.style.display = 'none';
        if (signoutBtn) signoutBtn.style.display = 'inline-block';
        if (userGreeting) {
            userGreeting.textContent = `Welcome, ${currentUser.username || currentUser.email}`;
            userGreeting.style.display = 'inline-block';
        }
    } else {
        if (signinBtn) signinBtn.style.display = 'inline-block';
        if (signoutBtn) signoutBtn.style.display = 'none';
        if (userGreeting) userGreeting.style.display = 'none';
    }
}

function showAuthModal() {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        const emailInput = document.getElementById('auth-email');
        if (emailInput) {
            setTimeout(() => emailInput.focus(), 100);
        }
    }
}

function hideAuthModal() {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        const form = document.getElementById('auth-form');
        if (form) {
            form.reset();
            clearErrors();
        }
    }
}

function clearErrors() {
    const errors = document.querySelectorAll('.auth-error');
    errors.forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function validateAuthForm() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    
    let isValid = true;
    clearErrors();
    
    if (!email) {
        showError('email', 'Email or username is required');
        isValid = false;
    }
    
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}

function signIn(email, password) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const user = users.find(u => 
        (u.email === email || u.username === email) && u.password === password
    );
    
    if (user) {
        const userSession = {
            id: user.id,
            email: user.email,
            username: user.username || user.email.split('@')[0],
            signInTime: new Date().toISOString()
        };
        saveUser(userSession);
        updateAuthUI();
        showNotification('Welcome back! Sign in successful.');
        return true;
    } else {
        showError('email', 'Invalid email/username or password');
        return false;
    }
}

function register(email, password, username = null) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    if (users.find(u => u.email === email)) {
        showError('email', 'An account with this email already exists');
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        email: email,
        username: username || email.split('@')[0],
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    const userSession = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        signInTime: new Date().toISOString()
    };
    saveUser(userSession);
    updateAuthUI();
    showNotification('Account created! Welcome to CineRewind!');
    return true;
}

function signOut() {
    removeUser();
    updateAuthUI();
    showNotification('You have been signed out. Thank you for visiting!');
}

    
    
function handleAuthSubmit(e) {
    e.preventDefault();
    
    if (!validateAuthForm()) {
        return;
    }
    
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const submitBtn = document.getElementById('auth-submit-btn');
    const isRegisterMode = submitBtn.dataset.mode === 'register';
    
    let success = false;
    
    if (isRegisterMode) {
        success = register(email, password);
    } else {
        success = signIn(email, password);
    }
    
    if (success) {
        hideAuthModal();
    }
}

function toggleAuthMode() {
    const submitBtn = document.getElementById('auth-submit-btn');
    const registerBtn = document.getElementById('auth-register-btn');
    const title = document.getElementById('auth-modal-title');
    const subtitle = document.querySelector('.auth-modal-subtitle');
    
    if (submitBtn.dataset.mode === 'register') {
        submitBtn.dataset.mode = 'signin';
        submitBtn.textContent = '▸▸ SIGN IN ▸▸';
        registerBtn.textContent = 'CREATE ACCOUNT';
        if (title) title.textContent = 'ACCESS GRANTED';
        if (subtitle) subtitle.textContent = 'Enter Your Credentials';
    } else {
        submitBtn.dataset.mode = 'register';
        submitBtn.textContent = '▸▸ CREATE ACCOUNT ▸▸';
        registerBtn.textContent = 'ALREADY HAVE ACCOUNT?';
        if (title) title.textContent = 'NEW USER REGISTRATION';
        if (subtitle) subtitle.textContent = 'Create Your Account';
    }
    
    clearErrors();
}

function initAuth() {
    currentUser = getCurrentUser();
    updateAuthUI();
    
    const signinBtn = document.getElementById('signin-btn');
    if (signinBtn) {
        signinBtn.addEventListener('click', () => {
            showAuthModal();
        });
    }
    
    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
            signOut();
        });
    }
    
    const closeBtn = document.getElementById('auth-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAuthModal);
    }
    
    const overlay = document.getElementById('auth-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideAuthModal();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('show')) {
            hideAuthModal();
        }
    });
    
    const form = document.getElementById('auth-form');
    if (form) {
        form.addEventListener('submit', handleAuthSubmit);
    }
    
    const registerBtn = document.getElementById('auth-register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', toggleAuthMode);
    }
    
    const submitBtn = document.getElementById('auth-submit-btn');
    if (submitBtn) {
        submitBtn.dataset.mode = 'signin';
    }
    
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value.trim() && !emailInput.value.includes('@') && emailInput.value.length < 3) {
                showError('email', 'Please enter a valid email or username');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const error = document.getElementById('password-error');
            if (error && passwordInput.value.length > 0 && passwordInput.value.length < 6) {
                showError('password', 'Password must be at least 6 characters');
            } else if (error && passwordInput.value.length >= 6) {
                error.classList.remove('show');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});
