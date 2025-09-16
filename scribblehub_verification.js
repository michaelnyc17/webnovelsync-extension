// ScribbleHub ownership verification content script

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

  console.log('ScribbleHub verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'verifyScribbleHubOwnership') {
      console.log('Verifying ScribbleHub ownership for story ID:', message.storyId);
      verifyOwnership(message.storyId)
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
    
    if (message.action === 'checkScribbleHubSignIn') {
      console.log('Checking ScribbleHub sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  async function verifyOwnership(storyId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      
      if (!currentUrl.includes('/series/') || !currentUrl.includes(storyId)) {
        reject(new Error('Not on the correct story page'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 50;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        // Look for edit button that only owners see
        const editButton = document.querySelector('a[href*="/edit"], button[class*="edit"], .edit-button');
        if (editButton) {
          console.log('Found edit button - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Edit button found'
          });
          return;
        }
        
        // Look for author dashboard elements
        const authorDashboard = document.querySelector('.author-dashboard, .manage-story, .story-management');
        if (authorDashboard) {
          console.log('Found author dashboard - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Author dashboard found'
          });
          return;
        }
        
        // Look for chapter management links
        const chapterManagement = document.querySelector('a[href*="chapter"][href*="edit"], a[href*="manage"]');
        if (chapterManagement) {
          console.log('Found chapter management - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Chapter management found'
          });
          return;
        }
        
        // Check if story content has loaded
        const storyContent = document.querySelector('.chapter-content, .story-content, #content');
        if (storyContent && checkAttempts > 10) {
          console.log('Story loaded but no ownership indicators - user likely does not own story');
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
      // Look for login button
      const loginButton = document.querySelector('a[href*="login"], button[class*="login"]');
      if (loginButton && loginButton.textContent.toLowerCase().includes('login')) {
        console.log('Found login button - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Login button found'
        };
      }
      
      // Look for user avatar or profile
      const userAvatar = document.querySelector('.user-avatar, .profile-avatar, .avatar');
      if (userAvatar) {
        console.log('Found user avatar - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User avatar found'
        };
      }
      
      // Look for user menu
      const userMenu = document.querySelector('.user-menu, .profile-menu, .account-menu');
      if (userMenu) {
        console.log('Found user menu - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User menu found'
        };
      }
      
      console.log('No clear indicators - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No login button detected'
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

  window.verifyScribbleHubOwnership = verifyOwnership;
  window.checkScribbleHubSignIn = checkSignInStatus;
})();