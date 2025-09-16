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

  console.log('AO3 verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'verifyAO3Ownership') {
      console.log('Verifying AO3 ownership for work ID:', message.workId);
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
    
    if (message.action === 'checkAO3SignIn') {
      console.log('Checking AO3 sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  async function verifyOwnership(workId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      const expectedUrl = `https://archiveofourown.org/works/${workId}/edit`;
      
      if (!currentUrl.includes(`/works/${workId}/edit`)) {
        reject(new Error('Automatically redirected - you don\'t own this work'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 50;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        const errorMessage = document.querySelector('.flash.error');
        if (errorMessage) {
          const errorText = errorMessage.textContent || errorMessage.innerText;
          if (errorText.includes("Sorry, you don't have permission to access") || 
              errorText.includes("permission") ||
              errorText.includes("access")) {
            console.log('Found permission error message');
            resolve({
              success: true,
              isOwner: false,
              reason: 'No permission to access work edit page'
            });
            return;
          }
        }

        const navigationActions = document.querySelector('ul.navigation.actions[role="menu"]');
        if (navigationActions) {
          const addChapterLink = navigationActions.querySelector('a[href*="/chapters/new"]');
          if (addChapterLink) {
            console.log('Found navigation actions with Add Chapter link - user owns the work');
            resolve({
              success: true,
              isOwner: true,
              reason: 'Edit navigation found'
            });
            return;
          }
        }

        const editWorkHeading = document.querySelector('h2.heading');
        if (editWorkHeading) {
          const headingText = editWorkHeading.textContent || editWorkHeading.innerText;
          if (headingText.includes('Edit Work')) {
            console.log('Found "Edit Work" heading - user owns the work');
            resolve({
              success: true,
              isOwner: true,
              reason: 'Edit Work heading found'
            });
            return;
          }
        }

        const manageChaptersLink = document.querySelector('a[href*="/chapters/manage"]');
        if (manageChaptersLink) {
          console.log('Found "Manage Chapters" link - user owns the work');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Manage Chapters link found'
          });
          return;
        }

        const generalError = document.querySelector('.error, .error_msg, [class*="error"]');
        if (generalError) {
          const errorText = generalError.textContent || generalError.innerText;
          if (errorText.toLowerCase().includes('error') || 
              errorText.toLowerCase().includes('access') ||
              errorText.toLowerCase().includes('denied') ||
              errorText.toLowerCase().includes('permission')) {
            console.log('Found general error message');
            resolve({
              success: true,
              isOwner: false,
              reason: 'Access error or permission denied'
            });
            return;
          }
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
      const userActions = document.querySelector('p.user.actions');
      if (userActions) {
        const loginDropdown = userActions.querySelector('a#login-dropdown[href="/users/login"]');
        if (loginDropdown && loginDropdown.textContent.toLowerCase().includes('log in')) {
          console.log('Found AO3 guest login dropdown - user is NOT signed in');
          return {
            isSignedIn: false,
            reason: 'AO3 guest login dropdown found'
          };
        }
      }
      
      const signInLink = document.querySelector('a[href*="login"], a[href*="users/login"]');
      if (signInLink && (signInLink.textContent.toLowerCase().includes('log in') || 
                        signInLink.textContent.toLowerCase().includes('sign in'))) {
        console.log('Found sign-in link - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Sign-in link found on page'
        };
      }
      
      const joinLink = document.querySelector('a[href*="signup"], a[href*="users/new"]');
      if (joinLink && joinLink.textContent.toLowerCase().includes('join')) {
        console.log('Found join link - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Join link found on page'
        };
      }
      
      const userProfile = document.querySelector('.user, .greeting, [class*="user"]:not(.guest)');
      if (userProfile) {
        console.log('Found user profile element - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User profile elements found'
        };
      }
      
      const accountMenu = document.querySelector('a[href*="users/"], a[href*="profile"]');
      if (accountMenu) {
        console.log('Found account menu - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'Account menu found'
        };
      }
      
      console.log('No clear sign-in indicators found - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No sign-in link detected'
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

  window.verifyAO3Ownership = verifyOwnership;
  window.checkAO3SignIn = checkSignInStatus;
})();