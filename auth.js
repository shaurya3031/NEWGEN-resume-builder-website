import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// Firebase configuration from instructions
const firebaseConfig = {
    apiKey: "AIzaSyAExPxIkQ3JIuy9Og8InjbknkcJ9Hqb_MA",
    authDomain: "the-archery-of-world.firebaseapp.com",
    databaseURL: "https://the-archery-of-world.firebaseio.com",
    projectId: "the-archery-of-world",
    storageBucket: "the-archery-of-world.firebasestorage.app",
    messagingSenderId: "559934106271",
    appId: "1:559934106271:web:8bfdfbddbdfc69a60450aa",
    measurementId: "G-0XV1M89HZN"
};

// Initialize Firebase App & Realtime Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 3D Flip Card DOM Elements
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const cardWrapper = document.getElementById('card-wrapper');

// Toggle animations
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cardWrapper.classList.remove('flipped'); // Signup is now front
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cardWrapper.classList.add('flipped'); // Login is now back
});

// Helper function to show messages
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
}

// ---------------------------
// SIGN UP LOGIC
// ---------------------------
const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('signup-message');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous message
    signupMessage.textContent = '';
    
    const username = document.getElementById('signup-username').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (!username || !password) {
        showMessage(signupMessage, 'Please fill in all fields', 'error');
        return;
    }
    
    // Only alphanumeric and underscores allowed for username
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showMessage(signupMessage, 'Username can only contain letters, numbers, and underscores.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage(signupMessage, 'Passwords do not match.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(signupMessage, 'Password must be at least 6 characters.', 'error');
        return;
    }

    const btn = signupForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Registering...';

    try {
        const dbRef = ref(db);
        // Check if username already exists in Realtime Database under 'users/' node
        const snapshot = await get(child(dbRef, `users/${username}`));
        
        if (snapshot.exists()) {
            showMessage(signupMessage, 'Username already exists. Please choose another one.', 'error');
        } else {
            // Save user info (username-based auth)
            await set(ref(db, `users/${username}`), {
                password: password, // Note: storing passwords in plain text is for demo purposes only!
                createdAt: new Date().toISOString()
            });
            
            showMessage(signupMessage, 'Signup successful! Redirecting...', 'success');
            
            // Set active user session
            localStorage.setItem('loggedInUser', username);
            
            // Redirect user directly to the app (Template selection page first)
            setTimeout(() => {
                window.location.href = 'templates.html'; 
            }, 1000);
        }
    } catch (error) {
        showMessage(signupMessage, `Error: ${error.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Register';
    }
});

// ---------------------------
// LOGIN LOGIC
// ---------------------------
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    loginMessage.textContent = '';
    
    const username = document.getElementById('login-username').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showMessage(loginMessage, 'Please fill in all fields.', 'error');
        return;
    }

    const btn = loginForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Authenticating...';

    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${username}`));
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            // Validate password against the stored string
            if (userData.password === password) {
                showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
                
                // Set active user session
                localStorage.setItem('loggedInUser', username);
                
                // Redirect user to resume builder interface (Template selection page first)
                setTimeout(() => {
                    window.location.href = 'templates.html'; 
                }, 1000);
            } else {
                showMessage(loginMessage, 'Invalid password!', 'error');
            }
        } else {
            showMessage(loginMessage, 'User not found!', 'error');
        }
    } catch (error) {
        showMessage(loginMessage, `Error: ${error.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Login';
    }
});
