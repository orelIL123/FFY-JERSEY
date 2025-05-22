// Admin JavaScript for FFY JERSEY website

// DOM Elements
const adminLogin = document.getElementById('admin-login');
const adminPanel = document.getElementById('admin-panel');
const accessCodeInput = document.getElementById('access-code');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const errorMessage = document.getElementById('error-message');
const jerseyForm = document.getElementById('jersey-form');
const jerseyTitle = document.getElementById('jersey-title');
const jerseyPrice = document.getElementById('jersey-price');
const jerseySizes = document.getElementById('jersey-sizes');
const jerseyDescription = document.getElementById('jersey-description');
const jerseyImage = document.getElementById('jersey-image');
const generateBtn = document.getElementById('generate-btn');
const jsonOutput = document.getElementById('json-output');
const copyBtn = document.getElementById('copy-btn');

// Constants
const ACCESS_CODE = '9248'; // As specified by the user

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        showAdminPanel();
    }
    
    // Login button click
    loginBtn.addEventListener('click', handleLogin);
    
    // Access code input enter key
    accessCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Logout button click
    logoutBtn.addEventListener('click', handleLogout);
    
    // Generate JSON button click
    generateBtn.addEventListener('click', generateJerseyJSON);
    
    // Copy button click
    copyBtn.addEventListener('click', copyJSONToClipboard);
});

// Handle login
function handleLogin() {
    const enteredCode = accessCodeInput.value.trim();
    
    if (enteredCode === ACCESS_CODE) {
        // Successful login
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        errorMessage.textContent = '';
    } else {
        // Failed login
        errorMessage.textContent = 'קוד גישה לא תקין. אנא נסה שוב.';
        accessCodeInput.value = '';
        accessCodeInput.focus();
    }
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    hideAdminPanel();
    accessCodeInput.value = '';
}

// Show admin panel
function showAdminPanel() {
    adminLogin.style.display = 'none';
    adminPanel.style.display = 'block';
}

// Hide admin panel
function hideAdminPanel() {
    adminLogin.style.display = 'flex';
    adminPanel.style.display = 'none';
}

// Generate Jersey JSON
function generateJerseyJSON() {
    // Validate form
    if (!jerseyForm.checkValidity()) {
        alert('אנא מלא את כל השדות הנדרשים.');
        return;
    }
    
    // Get values from form
    const title = jerseyTitle.value.trim();
    const price = parseInt(jerseyPrice.value.trim());
    
    // Parse sizes from comma-separated string
    const sizesString = jerseySizes.value.trim();
    const sizes = sizesString.split(',').map(size => size.trim()).filter(size => size !== '');
    
    const description = jerseyDescription.value.trim();
    const imageName = jerseyImage.value.trim();
    const imageUrl = imageName ? `images/${imageName}` : '';
    
    // Create jersey object
    const jersey = {
        title,
        price,
        sizes,
        description,
        imageUrl
    };
    
    // Format JSON with indentation
    const jsonString = JSON.stringify(jersey, null, 2);
    
    // Display in output area
    jsonOutput.textContent = jsonString;
    
    // Show success message
    alert('נתוני החולצה נוצרו בהצלחה! לחץ על "העתק ללוח" כדי להעתיק את ה-JSON.');
}

// Copy JSON to clipboard
function copyJSONToClipboard() {
    const jsonText = jsonOutput.textContent;
    
    if (!jsonText || jsonText === '// נתוני החולצה יופיעו כאן') {
        alert('אין נתוני JSON להעתקה. אנא צור נתוני חולצה תחילה.');
        return;
    }
    
    // Create a temporary textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = jsonText;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        // Execute copy command
        document.execCommand('copy');
        alert('ה-JSON הועתק ללוח!');
    } catch (err) {
        console.error('Failed to copy JSON:', err);
        alert('ההעתקה נכשלה. אנא נסה שוב או העתק ידנית.');
    } finally {
        document.body.removeChild(textarea);
    }
}
