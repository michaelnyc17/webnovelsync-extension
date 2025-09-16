// Wattpad ownership verification content script

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

  console.log('Wattpad verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'verifyWattpadOwnership') {
      console.log('Verifying Wattpad ownership for story ID:', message.storyId);
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
    
    if (message.action === 'checkWattpadSignIn') {
      console.log('Checking Wattpad sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  async function verifyOwnership(storyId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      
      if (!currentUrl.includes('/story/') || !currentUrl.includes(storyId)) {
        reject(new Error('Not on the correct story page'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 50;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        // Look for edit story button
        const editButton = document.querySelector('button[data-action="edit"], a[href*="edit"], .edit-story');
        if (editButton) {
          console.log('Found edit button - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Edit button found'
          });
          return;
        }
        
        // Look for story management options
        const manageButton = document.querySelector('.manage-story, .story-settings, button[data-action="manage"]');
        if (manageButton) {
          console.log('Found manage button - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Manage button found'
          });
          return;
        }
        
        // Look for add chapter button
        const addChapterButton = document.querySelector('button[data-action="add-chapter"], .add-chapter, a[href*="chapter"][href*="new"]');
        if (addChapterButton) {
          console.log('Found add chapter button - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Add chapter button found'
          });
          return;
        }
        
        // Check if story has loaded
        const storyContent = document.querySelector('.story-content, .chapter-text, .story-info');
        if (storyContent && checkAttempts > 10) {
          console.log('Story loaded but no ownership indicators');
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
      const loginButton = document.querySelector('button[data-action="login"], a[href*="login"], .login-btn');
      if (loginButton && loginButton.textContent.toLowerCase().includes('login')) {
        console.log('Found login button - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Login button found'
        };
      }
      
      // Look for user avatar
      const avatar = document.querySelector('.avatar, .user-avatar, .profile-pic');
      if (avatar) {
        console.log('Found user avatar - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User avatar found'
        };
      }
      
      // Look for user menu
      const userMenu = document.querySelector('.user-menu, .profile-menu, [data-action="user-menu"]');
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

  window.verifyWattpadOwnership = verifyOwnership;
  window.checkWattpadSignIn = checkSignInStatus;
})();