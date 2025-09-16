// FanFiction.net ownership verification content script

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

  console.log('FanFiction.net verification script loaded');

  // Listen for verification requests from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'verifyFanFictionOwnership') {
      console.log('Verifying FanFiction.net ownership for story ID:', message.storyId);
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
      
      // Return true to indicate async response
      return true;
    }
    
    if (message.action === 'checkFanFictionSignIn') {
      console.log('Checking FanFiction.net sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  async function verifyOwnership(storyId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      
      // Check if we're on the story management page
      if (!currentUrl.includes('/s/') || !currentUrl.includes(storyId)) {
        reject(new Error('Not on the correct story page'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 50;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        // Look for edit controls that only owners would see
        const editButton = document.querySelector('button[value="Edit Chapter"], input[value="Edit Chapter"]');
        if (editButton) {
          console.log('Found Edit Chapter button - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Edit Chapter button found'
          });
          return;
        }
        
        // Look for story management links
        const manageLink = document.querySelector('a[href*="/myaccount_story"], a[href*="manage"]');
        if (manageLink) {
          console.log('Found story management link - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Story management link found'
          });
          return;
        }
        
        // Look for chapter management controls
        const chapterControls = document.querySelector('.chapter_controls, #chapter_controls');
        if (chapterControls) {
          console.log('Found chapter controls - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Chapter controls found'
          });
          return;
        }
        
        // Look for author tools
        const authorTools = document.querySelector('.author_tools, #author_tools');
        if (authorTools) {
          console.log('Found author tools - user owns the story');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Author tools found'
          });
          return;
        }
        
        // Check if page has loaded but no ownership indicators found
        const storyContent = document.querySelector('#storytext, .storytext, #story_text');
        if (storyContent && checkAttempts > 10) {
          console.log('Story content found but no ownership indicators - user likely does not own the story');
          resolve({
            success: true,
            isOwner: false,
            reason: 'No ownership indicators found on loaded page'
          });
          return;
        }

        if (checkAttempts >= maxAttempts) {
          console.log('Verification timeout - could not determine ownership');
          reject(new Error('Could not verify ownership - page did not load properly'));
          return;
        }

        setTimeout(checkOwnership, 100);
      };

      checkOwnership();
    });
  }

  function checkSignInStatus() {
    try {
      // Look for login link - if present, user is not signed in
      const loginLink = document.querySelector('a#login_link, a[href*="login"]');
      if (loginLink && loginLink.textContent.toLowerCase().includes('login')) {
        console.log('Found login link - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Login link found on page'
        };
      }
      
      // Look for user menu or account links
      const userMenu = document.querySelector('a[href*="myaccount"], a[href*="account"]');
      if (userMenu) {
        console.log('Found user account menu - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User account menu found'
        };
      }
      
      // Look for logout link
      const logoutLink = document.querySelector('a[href*="logout"]');
      if (logoutLink) {
        console.log('Found logout link - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'Logout link found'
        };
      }
      
      // Look for user profile elements
      const userProfile = document.querySelector('.user, .username, #username');
      if (userProfile) {
        console.log('Found user profile elements - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User profile elements found'
        };
      }
      
      console.log('No clear sign-in indicators found - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No login link detected'
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

  // Export functions for testing
  window.verifyFanFictionOwnership = verifyOwnership;
  window.checkFanFictionSignIn = checkSignInStatus;
})();