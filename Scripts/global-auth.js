// global-auth.js - Include this in ALL pages to handle login status

document.addEventListener('DOMContentLoaded', function() {
  updateHeaderAuthStatus();
});

async function updateHeaderAuthStatus() {
  try {
    // Determine the correct path to get_user_info.php based on current page
    const scriptPath = getScriptPath();
    
    const response = await fetch(scriptPath);
    const data = await response.json();
    
    updateHeaderButton(data.logged_in, data.user);
    
  } catch (error) {
    console.log('Could not check login status');
    // Keep default login/register button if there's an error
  }
}

function getScriptPath() {
  const currentPath = window.location.pathname;
  
  // If we're in the Pages directory
  if (currentPath.includes('/Pages/')) {
    return '../Scripts/get_user_info.php';
  }
  // If we're in the root directory (index.html)
  else {
    return 'Scripts/get_user_info.php';
  }
}

function updateHeaderButton(isLoggedIn, user) {
  // Find the header auth section - try different selectors
  let headerAuthSection = document.getElementById('header-account-section');
  
  // If no specific ID, look for the register button container
  if (!headerAuthSection) {
    const registerButton = document.querySelector('.register');
    if (registerButton && registerButton.parentElement) {
      headerAuthSection = registerButton.parentElement;
    }
  }
  
  if (!headerAuthSection) {
    console.log('Header auth section not found');
    return;
  }
  
  if (isLoggedIn && user) {
    // User is logged in - show welcome message and logout button
    const firstName = user.full_name.split(' ')[0];
    headerAuthSection.innerHTML = `
      <button class="register" onclick="logout()" style="background: #e74c3c; text-decoration: none;">Logout</button>
    `;
  } else {
    // User is not logged in - show login/register button
    const accountPath = getAccountPath();
    headerAuthSection.innerHTML = `
      <a href="${accountPath}"><button class="register">Login/Sign Up</button></a>
    `;
  }
}

function getAccountPath() {
  const currentPath = window.location.pathname;
  
  // If we're in the Pages directory
  if (currentPath.includes('/Pages/')) {
    return './account.html';
  }
  // If we're in the root directory
  else {
    return 'Pages/account.html';
  }
}

async function logout() {
  try {
    const logoutPath = getLogoutPath();
    await fetch(logoutPath);
    
    // Refresh the page to update the UI
    window.location.reload();
    
  } catch (error) {
    console.error('Logout failed:', error);
    // Force refresh anyway
    window.location.reload();
  }
}

function getLogoutPath() {
  const currentPath = window.location.pathname;
  
  // If we're in the Pages directory
  if (currentPath.includes('/Pages/')) {
    return '../Scripts/logout.php';
  }
  // If we're in the root directory
  else {
    return 'Scripts/logout.php';
  }
}