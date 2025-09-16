// RoyalRoad ownership verification content script

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

  console.log('RoyalRoad verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'verifyRoyalRoadOwnership') {
      console.log('Verifying RoyalRoad ownership for work ID:', message.workId);
      verifyOwnership(message.workId)
        .then(result => {
          console.log('Verification result:', result);
          sendResponse(result);
        })
        .catch(error => {
          console.error('Verification error:', error);
          sendResponse({
            success: false,
            isOwner: false,
            error: error.message
          });
        });
      
      return true;
    }
    
    if (message.action === 'checkRoyalRoadSignIn') {
      console.log('Checking RoyalRoad sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  async function verifyOwnership(workId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      
      if (!currentUrl.includes('/fiction/') || !currentUrl.includes(workId)) {
        reject(new Error('Not on the correct fiction page'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 50;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        // Look for edit fiction button
        const editButton = document.querySelector('a[href*="/manage"], button[class*="edit"], .edit-fiction');
        if (editButton) {
          console.log('Found edit button - user owns the fiction');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Edit button found'
          });
          return;
        }
        
        // Look for author tools
        const authorTools = document.querySelector('.author-tools, .fiction-management, .manage-fiction');
        if (authorTools) {
          console.log('Found author tools - user owns the fiction');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Author tools found'
          });
          return;
        }
        
        // Look for chapter management
        const chapterManagement = document.querySelector('a[href*="chapter"][href*="edit"], .chapter-management');
        if (chapterManagement) {
          console.log('Found chapter management - user owns the fiction');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Chapter management found'
          });
          return;
        }
        
        // Check if fiction page has loaded
        const fictionContent = document.querySelector('.fiction-info, .chapter-content, .description');
        if (fictionContent && checkAttempts > 10) {
          console.log('Fiction loaded but no ownership indicators');
          resolve({
            success: true,
            isOwner: false,
            reason: 'No ownership indicators found'
          });
          return;
        }

        if (checkAttempts >= maxAttempts) {
          console.log('Verification timeout');
          reject(new Error('Could not verify ownership - timeout'));
          return;
        }

        setTimeout(checkOwnership, 100);
      };

      checkOwnership();
    });
  }

  function checkSignInStatus() {
    try {
      // Look for login link
      const loginLink = document.querySelector('a[href*="login"], .login-link');
      if (loginLink && loginLink.textContent.toLowerCase().includes('login')) {
        console.log('Found login link - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Login link found'
        };
      }
      
      // Look for user profile
      const userProfile = document.querySelector('.user-profile, .profile-link, .avatar');
      if (userProfile) {
        console.log('Found user profile - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User profile found'
        };
      }
      
      // Look for logout option
      const logoutLink = document.querySelector('a[href*="logout"], .logout');
      if (logoutLink) {
        console.log('Found logout link - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'Logout link found'
        };
      }
      
      console.log('No clear indicators - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No login link detected'
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

  window.verifyRoyalRoadOwnership = verifyOwnership;
  window.checkRoyalRoadSignIn = checkSignInStatus;
})();