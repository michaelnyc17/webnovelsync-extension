// Webnovel sign-in check content script

(function() {
  const noop = function() {};
  const originalConsole = console;
  
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;
  const originalDebug = console.debug;
  
  console.log = noop;
  console.error = noop;
  console.warn = noop;
  console.info = noop;
  console.debug = noop;
  
  console.enableLogging = function() {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    console.info = originalInfo;
    console.debug = originalDebug;
  };

  console.log('Webnovel sign-in check script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkWebnovelSignIn') {
      console.log('Checking Webnovel sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  function checkSignInStatus() {
    try {
      // Look for login button - if present, user is not signed in
      const loginButton = document.querySelector('button[class*="login"], a[href*="login"], .login-btn');
      if (loginButton && loginButton.textContent.toLowerCase().includes('login')) {
        console.log('Found login button - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Login button found'
        };
      }
      
      // Look for sign in button
      const signInButton = document.querySelector('button[class*="signin"], a[href*="signin"], .signin-btn');
      if (signInButton && signInButton.textContent.toLowerCase().includes('sign')) {
        console.log('Found sign in button - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Sign in button found'
        };
      }
      
      // Look for user avatar or profile
      const avatar = document.querySelector('.avatar, .user-avatar, .profile-avatar');
      if (avatar) {
        console.log('Found user avatar - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User avatar found'
        };
      }
      
      // Look for user menu or dropdown
      const userMenu = document.querySelector('.user-menu, .profile-menu, .user-dropdown');
      if (userMenu) {
        console.log('Found user menu - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User menu found'
        };
      }
      
      // Look for logout option
      const logoutOption = document.querySelector('a[href*="logout"], button[class*="logout"], .logout');
      if (logoutOption) {
        console.log('Found logout option - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'Logout option found'
        };
      }
      
      console.log('No clear indicators found - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No login button detected'
      };
      
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      return {
        isSignedIn: true,
        reason: 'Error during check - assuming signed in',
        error: error.message
      };
    }
  }

  window.checkWebnovelSignIn = checkSignInStatus;
})();