// Inkstone verification content script

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

  console.log('Inkstone verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkInkstoneSignIn') {
      console.log('Checking Inkstone sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  function checkSignInStatus() {
    try {
      // Look for login/sign-in buttons
      const loginButton = document.querySelector('button[class*="login"], a[href*="login"], .login-btn, .signin-btn');
      if (loginButton && (loginButton.textContent.toLowerCase().includes('login') || 
                         loginButton.textContent.toLowerCase().includes('sign in'))) {
        console.log('Found login button - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Login button found'
        };
      }
      
      // Look for user avatar or profile elements
      const avatar = document.querySelector('.avatar, .user-avatar, .profile-pic, .user-icon');
      if (avatar) {
        console.log('Found user avatar - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User avatar found'
        };
      }
      
      // Look for user menu or account dropdown
      const userMenu = document.querySelector('.user-menu, .account-menu, .profile-dropdown');
      if (userMenu) {
        console.log('Found user menu - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User menu found'
        };
      }
      
      // Look for dashboard or author-specific elements
      const dashboard = document.querySelector('.dashboard, .author-panel, .writer-dashboard');
      if (dashboard) {
        console.log('Found dashboard - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'Dashboard found'
        };
      }
      
      console.log('No clear indicators - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No login indicators detected'
      };
      
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      return {
        isSignedIn: true,
        reason: 'Error during check',
        error: error.message
      };
    }
  }

  window.checkInkstoneSignIn = checkSignInStatus;
})();