document.addEventListener('DOMContentLoaded', function() {
  updateHeaderAuthStatus();
});

async function updateHeaderAuthStatus() {
  try {
    const scriptPath = getScriptPath();
    
    const response = await fetch(scriptPath);
    const data = await response.json();
    
    updateHeaderButton(data.logged_in, data.user);
    
  } catch (error) {
    console.log('Could not check login status');
  }
}

function getScriptPath() {
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/Pages/')) {
    return '../Scripts/get_user_info.php';
  }
  else {
    return 'Scripts/get_user_info.php';
  }
}

function updateHeaderButton(isLoggedIn, user) {
  let headerAuthSection = document.getElementById('header-account-section');
  
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
    const firstName = user.full_name.split(' ')[0];
    headerAuthSection.innerHTML = `
      <button class="register" onclick="logout()" style="background: #e74c3c; text-decoration: none;">Logout</button>
    `;
  } else {
    const accountPath = getAccountPath();
    headerAuthSection.innerHTML = `
      <a href="${accountPath}"><button class="register">Login/Sign Up</button></a>
    `;
  }
}

function getAccountPath() {
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/Pages/')) {
    return './account.html';
  }
  else {
    return 'Pages/account.html';
  }
}

async function logout() {
  try {
    const logoutPath = getLogoutPath();
    await fetch(logoutPath);
    
    window.location.reload();
    
  } catch (error) {
    console.error('Logout failed:', error);
    window.location.reload();
  }
}

function getLogoutPath() {
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/Pages/')) {
    return '../Scripts/logout.php';
  }
  else {
    return 'Scripts/logout.php';
  }
}