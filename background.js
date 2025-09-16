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
})();

// Payment features removed - all features now free

// All platforms available to all users
const AVAILABLE_PLATFORMS = ['scribblehub', 'fanfiction', 'ao3', 'royalroad', 'webnovel', 'wattpad', 'inkitt'];

// No limits on chapters or batch size
const NO_LIMITS = {
  chaptersPerDay: -1,  // Unlimited
  batchSize: 10,      // Max batch size available to everyone
  platforms: AVAILABLE_PLATFORMS
};

// All features available to everyone
async function getTierLimits() {
  return NO_LIMITS;
}

// Always return 'pro' since everything is free
async function getUserTier() {
  return 'pro';
}

async function verifyWebnovelOwnership(storyId) {
  console.log('Starting Webnovel ownership verification for story ID:', storyId);
  
  try {
    // Create a new tab to check ownership
    const verificationUrl = `https://inkstone.webnovel.com/novels/view/${storyId}`;
    console.log('Opening verification URL:', verificationUrl);
    
    const tab = await chrome.tabs.create({
      url: verificationUrl,
      active: false // Open in background
    });
    
    // Wait for the tab to load
    await new Promise(resolve => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
    
    // Give a moment for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send verification message to content script
    const result = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'verifyWebnovelOwnership',
        storyId: storyId
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Content script error: ${chrome.runtime.lastError.message}`));
          return;
        }
        resolve(response);
      });
    });
    
    // Close the verification tab
    await chrome.tabs.remove(tab.id);
    
    console.log('Verification completed:', result);
    return result;
    
  } catch (error) {
    console.error('Error during ownership verification:', error);
    throw new Error(`Failed to verify ownership: ${error.message}`);
  }
}

async function verifyScribbleHubOwnership(storyId) {
  console.log('Starting ScribbleHub ownership verification for story ID:', storyId);
  
  try {
    // Create a new tab to check ownership
    const verificationUrl = `https://www.scribblehub.com/editseries/${storyId}/`;
    console.log('Opening verification URL:', verificationUrl);
    
    const tab = await chrome.tabs.create({
      url: verificationUrl,
      active: false // Open in background
    });
    
    // Wait for the tab to load
    await new Promise(resolve => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
    
    // Give a moment for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send verification message to content script
    const result = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'verifyScribbleHubOwnership',
        storyId: storyId
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Content script error: ${chrome.runtime.lastError.message}`));
          return;
        }
        resolve(response);
      });
    });
    
    // Close the verification tab
    await chrome.tabs.remove(tab.id);
    
    console.log('Verification completed:', result);
    return result;
    
  } catch (error) {
    console.error('Error during ownership verification:', error);
    throw new Error(`Failed to verify ownership: ${error.message}`);
  }
}

async function verifyFanFictionOwnership(storyId) {
  console.log('Starting FanFiction.net ownership verification for story ID:', storyId);
  
  try {
    // Create a new tab to check ownership
    const verificationUrl = `https://www.fanfiction.net/story/story_edit_property.php?storyid=${storyId}`;
    console.log('Opening verification URL:', verificationUrl);
    
    const tab = await chrome.tabs.create({
      url: verificationUrl,
      active: false // Keep in background to prevent popup from closing
    });
    
    // Wait for the tab to load
    await new Promise(resolve => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
    
    // Give a moment for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send verification message to content script
    const result = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'verifyFanFictionOwnership',
        storyId: storyId
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Content script error: ${chrome.runtime.lastError.message}`));
          return;
        }
        resolve(response);
      });
    });
    
    // Close the verification tab
    await chrome.tabs.remove(tab.id);
    
    console.log('Verification completed:', result);
    return result;
    
  } catch (error) {
    console.error('Error during ownership verification:', error);
    throw new Error(`Failed to verify ownership: ${error.message}`);
  }
}

async function verifyAO3Ownership(workId) {
  console.log('Starting AO3 ownership verification for work ID:', workId);
  
  try {
    // Create a new tab to check ownership
    const verificationUrl = `https://archiveofourown.org/works/${workId}/edit`;
    console.log('Opening verification URL:', verificationUrl);
    
    const tab = await chrome.tabs.create({
      url: verificationUrl,
      active: false // Keep in background to prevent popup from closing
    });
    
    // Wait for the tab to load
    await new Promise(resolve => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
    
    // Give a moment for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send verification message to content script
    const result = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'verifyAO3Ownership',
        workId: workId
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Content script error: ${chrome.runtime.lastError.message}`));
          return;
        }
        resolve(response);
      });
    });
    
    // Close the verification tab
    await chrome.tabs.remove(tab.id);
    
    console.log('Verification completed:', result);
    return result;
    
  } catch (error) {
    console.error('Error during ownership verification:', error);
    throw new Error(`Failed to verify ownership: ${error.message}`);
  }
}

async function verifyRoyalRoadOwnership(fictionId) {
  console.log('Starting RoyalRoad ownership verification for fiction ID:', fictionId);
  
  try {
    // Step 1: Extract author profile link from current fiction page
    console.log('Step 1: Extracting author profile link from current fiction page');
    
    // Get the current active tab (should be the fiction page)
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab) {
      throw new Error('No active tab found');
    }
    
    // Extract author profile link from the fiction page
    const authorProfileResult = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(activeTab.id, {
        action: 'extractAuthorProfile'
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Content script error: ${chrome.runtime.lastError.message}`));
          return;
        }
        resolve(response);
      });
    });
    
    if (!authorProfileResult.success) {
      throw new Error(`Failed to extract author profile: ${authorProfileResult.error || 'Unknown error'}`);
    }
    
    if (!authorProfileResult.profileUrl) {
      throw new Error('No author profile URL found on the fiction page');
    }
    
    console.log('Author profile URL extracted:', authorProfileResult.profileUrl);
    
    // Step 2: Create a new tab to visit the author profile page
    console.log('Step 2: Opening author profile page for ownership verification');
    
    const tab = await chrome.tabs.create({
      url: authorProfileResult.profileUrl,
      active: false // Keep in background to prevent popup from closing
    });
    
    // Wait for the tab to load
    await new Promise(resolve => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
    
    // Give a moment for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Send verification message to the profile page to check for Edit Profile button
    console.log('Step 3: Checking for Edit Profile button on author profile page');
    
    const result = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'verifyRoyalRoadOwnership',
        fictionId: fictionId
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Content script error: ${chrome.runtime.lastError.message}`));
          return;
        }
        resolve(response);
      });
    });
    
    // Close the verification tab
    await chrome.tabs.remove(tab.id);
    
    console.log('Verification completed:', result);
    return result;
    
  } catch (error) {
    console.error('Error during ownership verification:', error);
    throw new Error(`Failed to verify ownership: ${error.message}`);
  }
}

async function verifyWattpadOwnership(tabId) {
  console.log('Starting Wattpad ownership verification for tab ID:', tabId);
  
  try {
    // Step 0: Check if user is logged in to Wattpad
    console.log('Step 0: Checking if user is logged in to Wattpad');
    
    const loginCheckResult = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        try {
          // Check for login/signup buttons in header - if they exist, user is not logged in
          const loginButton = document.querySelector('button:contains("Log in"), button:contains("Sign Up")');
          if (loginButton) {
            return { 
              success: false, 
              error: 'User is not logged in to Wattpad' 
            };
          }
          
          // Alternative check: look for login buttons with specific classes
          const loginButtonByClass = document.querySelector('button.Rer7C');
          if (loginButtonByClass && (loginButtonByClass.textContent.includes('Log in') || loginButtonByClass.textContent.includes('Sign Up'))) {
            return { 
              success: false, 
              error: 'User is not logged in to Wattpad' 
            };
          }
          
          // Alternative check: look for login link
          const loginLink = document.querySelector('a[href*="/login"]');
          if (loginLink) {
            return { 
              success: false, 
              error: 'User is not logged in to Wattpad' 
            };
          }
          
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: `Error checking login status: ${error.message}` 
          };
        }
      }
    });
    
    if (!loginCheckResult[0].result.success) {
      console.error('Login check failed:', loginCheckResult[0].result.error);
      return {
        success: false,
        error: 'You must be logged in to Wattpad to extract your own stories. Please log in and try again.'
      };
    }
    
    console.log('User is logged in to Wattpad, proceeding with verification');
    
    // Step 1: Extract author link from the current story page
    console.log('Step 1: Extracting author link from story page');
    
    const authorLinkResult = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        try {
          // Primary: Look for author link with class SjGa2 (main author link on story page)
          const authorLink = document.querySelector('a.SjGa2[href*="/user/"]');
          if (authorLink) {
            return { 
              success: true, 
              authorUrl: authorLink.href,
              authorName: authorLink.textContent.trim()
            };
          }
          
          // Fallback 1: Look for author link in the story badges section 
          const badgesAuthorLink = document.querySelector('[data-testid="story-badges"] a[href*="/user/"]');
          if (badgesAuthorLink) {
            return { 
              success: true, 
              authorUrl: badgesAuthorLink.href,
              authorName: badgesAuthorLink.textContent.trim()
            };
          }
          
          // Fallback 2: Look for any link containing /user/
          const anyAuthorLink = document.querySelector('a[href*="/user/"]');
          if (anyAuthorLink) {
            return { 
              success: true, 
              authorUrl: anyAuthorLink.href,
              authorName: anyAuthorLink.textContent.trim()
            };
          }
          
          return { 
            success: false, 
            error: 'Could not find author link on story page' 
          };
        } catch (error) {
          return { 
            success: false, 
            error: `Error finding author link: ${error.message}` 
          };
        }
      }
    });
    
    if (!authorLinkResult || !authorLinkResult[0] || !authorLinkResult[0].result.success) {
      const error = authorLinkResult?.[0]?.result?.error || 'Unknown error extracting author link';
      throw new Error(`Failed to extract author link: ${error}`);
    }
    
    const { authorUrl, authorName } = authorLinkResult[0].result;
    console.log(`Found author: ${authorName} at ${authorUrl}`);
    
    // Step 2: Navigate to author profile page
    console.log('Step 2: Opening author profile page');
    
    const authorTab = await chrome.tabs.create({
      url: authorUrl,
      active: false
    });
    
    // Wait for the author profile page to load
    await new Promise(resolve => {
      const listener = (tabId, changeInfo) => {
        if (tabId === authorTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
    
    // Give a moment for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Check for Edit Profile button on author profile page
    console.log('Step 3: Checking for Edit Profile button on author profile page');
    
    const verificationResult = await chrome.scripting.executeScript({
      target: { tabId: authorTab.id },
      function: () => {
        try {
          // Look for Edit Profile button - indicates user owns this profile
          const editProfileBtn = document.querySelector('.on-edit-profile');
          
          if (editProfileBtn) {
            return { 
              success: true, 
              message: 'Edit Profile button found - user owns this story' 
            };
          }
          
          // Also check for buttons containing "Edit Profile" text
          const buttons = document.querySelectorAll('button');
          for (const button of buttons) {
            if (button.textContent.includes('Edit Profile')) {
              return { 
                success: true, 
                message: 'Edit Profile button found - user owns this story' 
              };
            }
          }
          
          // Also check for settings button as alternative
          const settingsBtn = document.querySelector('button .fa-settings');
          if (settingsBtn) {
            return { 
              success: true, 
              message: 'Settings button found - user owns this story' 
            };
          }
          
          return { 
            success: false, 
            error: 'No Edit Profile button found - user does not own this story' 
          };
        } catch (error) {
          return { 
            success: false, 
            error: `Error checking profile ownership: ${error.message}` 
          };
        }
      }
    });
    
    // Close the author profile tab
    await chrome.tabs.remove(authorTab.id);
    
    if (!verificationResult || !verificationResult[0]) {
      throw new Error('No response from profile ownership check');
    }
    
    const result = verificationResult[0].result;
    if (!result.success) {
      throw new Error(result.error || 'Profile ownership verification failed');
    }
    
    console.log('Wattpad ownership verification successful:', result.message);
    return { success: true, message: result.message };
    
  } catch (error) {
    console.error('Wattpad ownership verification failed:', error);
    throw new Error(`You can only extract stories that you authored. Please make sure you are logged in to Wattpad and trying to extract your own story. Error: ${error.message}`);
  }
}

async function isPlatformAvailable(platform) {
  const limits = await getTierLimits();
  return limits.platforms.includes(platform);
}

async function getMaxBatchSize() {
  const limits = await getTierLimits();
  return limits.batchSize;
}


async function canDownloadMoreChapters(count) {
  // No daily limits - unlimited chapters allowed
  return true;
}



async function updateTimeSavedMetrics(chaptersPosted) {
  const data = await chrome.storage.local.get(['timeSavedMetrics']);
  const metrics = data.timeSavedMetrics || {
    totalChaptersPosted: 0,
    totalTimeSavedMinutes: 0,
    totalPlatformsReached: 0,
    startDate: new Date().toISOString(),
    lastToastShown: 0
  };
  
  // Estimate 5 minutes saved per chapter per platform (manual posting time)
  const averagePlatformsPerSync = 3; // Conservative estimate
  const minutesPerChapterPerPlatform = 5;
  const timeSavedThisSync = chaptersPosted * averagePlatformsPerSync * minutesPerChapterPerPlatform;
  
  metrics.totalChaptersPosted += chaptersPosted;
  metrics.totalTimeSavedMinutes += timeSavedThisSync;
  
  // Show toast at milestones: 25, 50, 100, 200, 500 chapters OR major time milestones
  const milestones = [25, 50, 100, 200, 500];
  const shouldShowToast = (
    milestones.includes(metrics.totalChaptersPosted) ||
    (metrics.totalTimeSavedMinutes >= 300 && (metrics.totalTimeSavedMinutes - timeSavedThisSync) < 300) || // 5 hours
    (metrics.totalTimeSavedMinutes >= 600 && (metrics.totalTimeSavedMinutes - timeSavedThisSync) < 600)    // 10 hours
  ) && (Date.now() - metrics.lastToastShown) > 7 * 24 * 60 * 60 * 1000; // Max once per week
  
  if (shouldShowToast) {
    metrics.lastToastShown = Date.now();
    await showTimeSavedToast(metrics);
  }
  
  await chrome.storage.local.set({ timeSavedMetrics: metrics });
}

async function showTimeSavedToast(metrics) {
  const hours = Math.floor(metrics.totalTimeSavedMinutes / 60);
  const minutes = metrics.totalTimeSavedMinutes % 60;
  
  let message = '';
  if (hours > 0) {
    message = `🎉 You've saved ${hours}h ${minutes}m by syncing ${metrics.totalChaptersPosted} chapters!`;
  } else {
    message = `🎉 You've saved ${minutes} minutes by syncing ${metrics.totalChaptersPosted} chapters!`;
  }
  
  
  // Send toast to popup if it's open
  try {
    chrome.runtime.sendMessage({
      action: 'showToast',
      message: message,
      type: 'success',
      duration: 8000
    });
  } catch (error) {
    // Popup might not be open, that's fine
  }
}


async function formatChapterTitle(originalTitle, chapterNumber) {
  const data = await chrome.storage.local.get(['chapterTitleFormat']);
  const format = data.chapterTitleFormat || 'with_number'; // Default to with number
  
  if (format === 'title_only') {
    // Remove any existing "Chapter X:" prefix if present
    return originalTitle.replace(/^Chapter\s+\d+[:\.\-\s]+/i, '').trim();
  } else {
    // Add "Chapter X:" prefix if not already present
    const hasChapterPrefix = originalTitle.match(/^Chapter\s+\d+[:\.\-\s]/i) !== null;
    return hasChapterPrefix ? originalTitle : `Chapter ${chapterNumber}: ${originalTitle}`;
  }
}


let scannedChapters = [];
let scanningInProgress = false;
let postingInProgress = false;
let failedChapters = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    platforms: {
      scribblehub: { enabled: false, storyId: '', lastSyncedChapter: 0 },
      fanfiction: { enabled: false, storyId: '', lastSyncedChapter: 0 },
      ao3: { enabled: false, workId: '', lastSyncedChapter: 0 },
      royalroad: { enabled: false, workId: '', lastSyncedChapter: 0 },
      webnovel: { enabled: false, storyId: '', lastSyncedChapter: 0 }
    },
    queueConfig: null,
    isSyncing: false,
    scanningPhase: false,
    postingPhase: false,
    lastSyncLog: [],
    chapterUrls: []
  });
  
  chrome.alarms.create('dailyCheck', {
    periodInMinutes: 1440
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyCheck') {
  }
});

function findChapterUrl(chapterUrls, chapterNumber) {
  if (!chapterUrls || chapterUrls.length === 0) {
    return null;
  }
  
  const exactMatch = chapterUrls.find(ch => ch.number === chapterNumber);
  if (exactMatch) {
    return exactMatch.url;
  }
  
  const index = chapterNumber - 1;
  if (index >= 0 && index < chapterUrls.length) {
    return chapterUrls[index].url;
  }
  
  return null;
}


async function scanCurrentTab(startChapter, endChapter, targetPlatforms, batchSize = 1) {
  try {
    console.log(`Starting scan from current tab for chapters ${startChapter} to ${endChapter} with batch size ${batchSize}`);
    console.log(`Target platforms: ${targetPlatforms.join(', ')}`);
    
    // All platforms are available to all users now
    console.log(`All platforms available: ${targetPlatforms.join(', ')}`);
    
    // No batch size limits - use requested size up to maximum of 10
    if (batchSize > 10) {
      batchSize = 10;
      console.log(`Batch size capped at maximum of ${batchSize}`);
    }
    
    // No daily chapter limits - all chapters allowed
    
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const activeTab = tabs[0];
    
    if (!activeTab) {
      throw new Error("No active tab found. Please open a Webnovel, ScribbleHub, AO3, FanFiction.net, RoyalRoad, Wattpad, or Inkitt page first.");
    }
    
    const isWebnovel = activeTab.url.includes("webnovel.com");
    const isScribbleHub = activeTab.url.includes("scribblehub.com");
    const isAO3 = activeTab.url.includes("archiveofourown.org");
    const isFanfiction = activeTab.url.includes("fanfiction.net");
    const isRoyalRoad = activeTab.url.includes("royalroad.com");
    const isWattpad = activeTab.url.includes("wattpad.com");
    // Removed Inkitt as source - only used as publishing target
    
    if (!isWebnovel && !isScribbleHub && !isAO3 && !isFanfiction && !isRoyalRoad && !isWattpad) {
      throw new Error("Active tab is not a supported source. Please navigate to Webnovel, ScribbleHub, AO3, FanFiction.net, RoyalRoad, or Wattpad page first.");
    }
    
    // For AO3, ensure we're on the navigate page
    if (isAO3 && !activeTab.url.includes('/navigate')) {
      throw new Error("Please navigate to the AO3 work's navigation page (URL should end with '/navigate') to see the chapter list.");
    }
    
    // For FanFiction.net, ensure we're on a chapter page
    if (isFanfiction && !activeTab.url.match(/\/s\/\d+\/\d+\//)) {
      throw new Error("Please navigate to any chapter page on FanFiction.net (URL should be like '/s/12345/1/Story-Title') to extract chapters.");
    }
    
    // For RoyalRoad, ensure we're on a fiction page
    if (isRoyalRoad && !activeTab.url.match(/\/fiction\/\d+\//)) {
      throw new Error("Please navigate to a RoyalRoad fiction page (URL should be like '/fiction/12345/story-title') to extract chapters.");
    }
    
    // Webnovel ownership verification
    if (isWebnovel) {
      console.log("Webnovel detected - checking sign-in status and ownership...");
      
      // First check if user is signed in to Webnovel
      try {
        const signInCheck = await chrome.tabs.sendMessage(activeTab.id, {
          action: 'checkWebnovelSignIn'
        });
        
        if (!signInCheck.isSignedIn) {
          throw new Error("You must be signed in to Webnovel to sync stories. Please sign in to your Webnovel account and try again.");
        }
        
        console.log("User is signed in to Webnovel");
        
      } catch (error) {
        if (error.message.includes("signed in")) {
          throw error; // Re-throw sign-in errors
        }
        console.error("Error checking sign-in status:", error);
        // Continue with ownership check if sign-in check fails (fallback)
      }
      
      // Extract story ID from the current URL
      // Format 1: https://www.webnovel.com/book/story-name_1234567890
      // Format 2: https://www.webnovel.com/book/32607996400289605
      let urlMatch = activeTab.url.match(/\/book\/[^_]+_(\d+)/);
      if (!urlMatch) {
        // Try the second format (direct ID)
        urlMatch = activeTab.url.match(/\/book\/(\d+)/);
      }
      if (!urlMatch) {
        throw new Error("Could not extract story ID from Webnovel URL. Please ensure you're on a valid story page (URL should be like '/book/story-name_12345' or '/book/12345').");
      }
      
      const storyId = urlMatch[1];
      console.log("Extracted story ID for verification:", storyId);
      
      try {
        const verificationResult = await verifyWebnovelOwnership(storyId);
        
        if (!verificationResult.success) {
          throw new Error(`Ownership verification failed: ${verificationResult.error || 'Unknown error'}`);
        }
        
        if (!verificationResult.isOwner) {
          throw new Error(`You must own this story to sync it. ${verificationResult.reason || 'You are not the owner of this Webnovel story'}. Only story authors can sync their own content.`);
        }
        
        console.log("Ownership verified successfully for story:", verificationResult.storyTitle || storyId);
        
      } catch (error) {
        console.error("Ownership verification failed:", error);
        throw new Error(`Ownership verification failed: ${error.message}`);
      }
    }
    
    // ScribbleHub ownership verification
    if (isScribbleHub) {
      console.log("ScribbleHub detected - checking sign-in status and ownership...");
      
      // First check if user is signed in to ScribbleHub
      try {
        const signInCheck = await chrome.tabs.sendMessage(activeTab.id, {
          action: 'checkScribbleHubSignIn'
        });
        
        if (!signInCheck.isSignedIn) {
          throw new Error("You must be signed in to ScribbleHub to sync stories. Please sign in to your ScribbleHub account and try again.");
        }
        
        console.log("User is signed in to ScribbleHub");
        
      } catch (error) {
        if (error.message.includes("signed in")) {
          throw error; // Re-throw sign-in errors
        }
        console.error("Error checking sign-in status:", error);
        // Continue with ownership check if sign-in check fails (fallback)
      }
      
      // Extract story ID from the current URL
      // Format: https://www.scribblehub.com/series/1299290/story-title/
      const urlMatch = activeTab.url.match(/\/series\/(\d+)\//);
      if (!urlMatch) {
        throw new Error("Could not extract story ID from ScribbleHub URL. Please ensure you're on a valid story page (URL should be like '/series/12345/story-title/').");
      }
      
      const storyId = urlMatch[1];
      console.log("Extracted story ID for verification:", storyId);
      
      try {
        const verificationResult = await verifyScribbleHubOwnership(storyId);
        
        if (!verificationResult.success) {
          throw new Error(`Ownership verification failed: ${verificationResult.error || 'Unknown error'}`);
        }
        
        if (!verificationResult.isOwner) {
          throw new Error(`You must own this story to sync it. ${verificationResult.reason || 'You are not the owner of this ScribbleHub story'}. Only story authors can sync their own content.`);
        }
        
        console.log("Ownership verified successfully for story:", verificationResult.storyTitle || storyId);
        
      } catch (error) {
        console.error("Ownership verification failed:", error);
        throw new Error(`Ownership verification failed: ${error.message}`);
      }
    }
    
    // FanFiction.net ownership verification
    if (isFanfiction) {
      console.log("FanFiction.net detected - checking sign-in status and ownership...");
      
      // First check if user is signed in to FanFiction.net
      try {
        const signInCheck = await chrome.tabs.sendMessage(activeTab.id, {
          action: 'checkFanFictionSignIn'
        });
        
        if (!signInCheck.isSignedIn) {
          throw new Error("You must be signed in to FanFiction.net to sync stories. Please sign in to your FanFiction.net account and try again.");
        }
        
        console.log("User is signed in to FanFiction.net");
        
      } catch (error) {
        if (error.message.includes("signed in")) {
          throw error; // Re-throw sign-in errors
        }
        console.error("Error checking sign-in status:", error);
        // Continue with ownership check if sign-in check fails (fallback)
      }
      
      // Extract story ID from the current URL
      // Format: https://www.fanfiction.net/s/14433734/1/Story-Title
      const urlMatch = activeTab.url.match(/\/s\/(\d+)\/\d+\//);
      if (!urlMatch) {
        throw new Error("Could not extract story ID from FanFiction.net URL. Please ensure you're on a valid chapter page (URL should be like '/s/12345/1/story-title').");
      }
      
      const storyId = urlMatch[1];
      console.log("Extracted story ID for verification:", storyId);
      
      try {
        const verificationResult = await verifyFanFictionOwnership(storyId);
        
        if (!verificationResult.success) {
          throw new Error(`Ownership verification failed: ${verificationResult.error || 'Unknown error'}`);
        }
        
        if (!verificationResult.isOwner) {
          throw new Error(`You must own this story to sync it. ${verificationResult.reason || 'You are not the owner of this FanFiction.net story'}. Only story authors can sync their own content.`);
        }
        
        console.log("Ownership verified successfully for story:", verificationResult.storyTitle || storyId);
        
      } catch (error) {
        console.error("Ownership verification failed:", error);
        throw new Error(`Ownership verification failed: ${error.message}`);
      }
    }
    
    // AO3 ownership verification
    if (isAO3) {
      console.log("AO3 detected - checking sign-in status and ownership...");
      
      // First check if user is signed in to AO3
      try {
        const signInCheck = await chrome.tabs.sendMessage(activeTab.id, {
          action: 'checkAO3SignIn'
        });
        
        if (!signInCheck.isSignedIn) {
          throw new Error("You must be signed in to AO3 to sync works. Please sign in to your AO3 account and try again.");
        }
        
        console.log("User is signed in to AO3");
        
      } catch (error) {
        if (error.message.includes("signed in")) {
          throw error; // Re-throw sign-in errors
        }
        console.error("Error checking sign-in status:", error);
        // Continue with ownership check if sign-in check fails (fallback)
      }
      
      // Extract work ID from the current URL
      // Format: https://archiveofourown.org/works/12345/navigate or https://archiveofourown.org/works/12345
      const urlMatch = activeTab.url.match(/\/works\/(\d+)(?:\/navigate)?/);
      if (!urlMatch) {
        throw new Error("Could not extract work ID from AO3 URL. Please ensure you're on a valid work page (URL should be like '/works/12345/navigate').");
      }
      
      const workId = urlMatch[1];
      console.log("Extracted work ID for verification:", workId);
      
      try {
        const verificationResult = await verifyAO3Ownership(workId);
        
        if (!verificationResult.success) {
          throw new Error(`Ownership verification failed: ${verificationResult.error || 'Unknown error'}`);
        }
        
        if (!verificationResult.isOwner) {
          throw new Error(`You must own this work to sync it. ${verificationResult.reason || 'You are not the owner of this AO3 work'}. Only work authors can sync their own content.`);
        }
        
        console.log("Ownership verified successfully for work:", verificationResult.workTitle || workId);
        
      } catch (error) {
        console.error("Ownership verification failed:", error);
        throw new Error(`Ownership verification failed: ${error.message}`);
      }
    }
    
    // RoyalRoad ownership verification
    if (isRoyalRoad) {
      console.log("RoyalRoad detected - checking sign-in status and ownership...");
      
      // First check if user is signed in to RoyalRoad
      try {
        const signInCheck = await chrome.tabs.sendMessage(activeTab.id, {
          action: 'checkRoyalRoadSignIn'
        });
        
        if (!signInCheck.isSignedIn) {
          throw new Error("You must be signed in to RoyalRoad to sync fictions. Please sign in to your RoyalRoad account and try again.");
        }
        
        console.log("User is signed in to RoyalRoad");
        
      } catch (error) {
        if (error.message.includes("signed in")) {
          throw error; // Re-throw sign-in errors
        }
        console.error("Error checking sign-in status:", error);
        // Continue with ownership check if sign-in check fails (fallback)
      }
      
      // Extract fiction ID from the current URL
      // Format: https://www.royalroad.com/fiction/12345/fiction-title
      const urlMatch = activeTab.url.match(/\/fiction\/(\d+)\//);
      if (!urlMatch) {
        throw new Error("Could not extract fiction ID from RoyalRoad URL. Please ensure you're on a valid fiction page (URL should be like '/fiction/12345/fiction-title').");
      }
      
      const fictionId = urlMatch[1];
      console.log("Extracted fiction ID for verification:", fictionId);
      
      try {
        const verificationResult = await verifyRoyalRoadOwnership(fictionId);
        
        if (!verificationResult.success) {
          throw new Error(`Ownership verification failed: ${verificationResult.error || 'Unknown error'}`);
        }
        
        if (!verificationResult.isOwner) {
          throw new Error(`You must own this fiction to sync it. ${verificationResult.reason || 'You are not the owner of this RoyalRoad fiction'}. Only fiction authors can sync their own content.`);
        }
        
        console.log("Ownership verified successfully for fiction:", verificationResult.fictionTitle || fictionId);
        
      } catch (error) {
        console.error("Ownership verification failed:", error);
        throw new Error(`Ownership verification failed: ${error.message}`);
      }
    }
    
    // Wattpad validation
    if (isWattpad) {
      console.log("Wattpad detected - validating URL format...");
      
      // For Wattpad, ensure we're on a story page with table of contents
      // URL format: https://www.wattpad.com/story/[story-id]-[story-slug]
      if (!activeTab.url.match(/\/story\/\d+/)) {
        throw new Error("Please navigate to a Wattpad story page (URL should be like '/story/123456-story-title') to extract chapters.");
      }
      
      console.log("Wattpad URL format validated");
      
      // Wattpad author verification - check if user owns this story
      console.log("Verifying Wattpad story ownership...");
      const authorVerification = await verifyWattpadOwnership(activeTab.id);
      if (!authorVerification.success) {
        throw new Error(authorVerification.error);
      }
      console.log("Wattpad story ownership verified");
    }
    
    // Inkitt removed as source platform
    
    console.log("Proceeding with chapter extraction...");
    
    const data = await chrome.storage.local.get(['platforms', 'isSyncing']);
    
    if (data.isSyncing) {
      throw new Error("Sync already in progress. Please stop it first.");
    }
    
    const totalChapters = endChapter - startChapter + 1;
    
    
    await chrome.storage.local.set({ 
      isSyncing: true,
      scanningPhase: true,
      postingPhase: false,
      queueConfig: {
        startChapter: startChapter,
        endChapter: endChapter,
        currentChapter: startChapter,
        targetPlatforms: targetPlatforms,
        totalChapters: totalChapters,
        completedChapters: 0,
        failedChapters: 0,
        scannedChapters: 0
      }
    });
    
    scannedChapters = [];
    scanningInProgress = true;
    failedChapters = [];
    
    console.log("Extracting chapter URLs from current tab...");
    const result = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        try {
          console.log('Extracting chapter URLs from current page');
          
          const chapterLinks = [];
          const seenUrls = new Set();
          const isScribbleHub = window.location.href.includes('scribblehub.com');
          const isWebnovel = window.location.href.includes('webnovel.com');
          const isAO3 = window.location.href.includes('archiveofourown.org');
          const isFanfiction = window.location.href.includes('fanfiction.net');
          const isRoyalRoad = window.location.href.includes('royalroad.com');
          const isWattpad = window.location.href.includes('wattpad.com');
          // Inkitt removed as source platform
          
          if (isScribbleHub) {
            console.log('Detected ScribbleHub, using ScribbleHub extraction strategy');
            
            // ScribbleHub extraction strategy
            const tocContainer = document.querySelector('.wi_fic_table.toc');
            if (!tocContainer) {
              return { 
                success: false, 
                error: 'Could not find table of contents container on ScribbleHub page. Please navigate to the series page with the chapter list.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
            const chapterItems = tocContainer.querySelectorAll('li.toc_w');
            console.log(`Found ${chapterItems.length} chapter items in ScribbleHub TOC`);
            
            chapterItems.forEach((item) => {
              const link = item.querySelector('a.toc_a');
              if (!link) return;
              
              const href = link.href;
              if (seenUrls.has(href)) return;
              seenUrls.add(href);
              
              // Get chapter number from order attribute
              let chapterNum = parseInt(item.getAttribute('order'), 10);
              if (isNaN(chapterNum)) {
                // Fallback: try to extract from URL
                const urlMatch = href.match(/\/chapter\/(\d+)\//);
                if (urlMatch) {
                  chapterNum = parseInt(urlMatch[1], 10);
                } else {
                  chapterNum = chapterLinks.length + 1;
                }
              }
              
              const title = link.textContent.trim();
              
              chapterLinks.push({
                number: chapterNum,
                title: title || `Chapter ${chapterNum}`,
                url: href
              });
            });
            
            if (chapterLinks.length === 0) {
              return { 
                success: false, 
                error: 'No chapter links found in ScribbleHub table of contents.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
          } else if (isAO3) {
            console.log('Detected AO3, using AO3 extraction strategy');
            
            // AO3 extraction strategy
            const chapterContainer = document.querySelector('ol.chapter.index.group');
            if (!chapterContainer) {
              return { 
                success: false, 
                error: 'Could not find chapter list container on AO3 page. Please navigate to the work\'s navigation page (URL should end with \'/navigate\').',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
            const chapterItems = chapterContainer.querySelectorAll('li');
            console.log(`Found ${chapterItems.length} chapter items in AO3 chapter list`);
            
            chapterItems.forEach((item, index) => {
              const link = item.querySelector('a');
              if (!link) return;
              
              const href = link.href;
              if (seenUrls.has(href)) return;
              seenUrls.add(href);
              
              const linkText = link.textContent.trim();
              
              // Extract chapter number from the beginning of the text
              let chapterNum = index + 1; // Default fallback
              const chapterMatch = linkText.match(/^(\d+)\./);
              if (chapterMatch) {
                chapterNum = parseInt(chapterMatch[1], 10);
              }
              
              // Extract title (everything after "number. ")
              let title = linkText;
              const titleMatch = linkText.match(/^\d+\.\s*(.+)$/);
              if (titleMatch) {
                title = titleMatch[1].trim();
              }
              
              chapterLinks.push({
                number: chapterNum,
                title: title || `Chapter ${chapterNum}`,
                url: href
              });
            });
            
            if (chapterLinks.length === 0) {
              return { 
                success: false, 
                error: 'No chapter links found in AO3 chapter list.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
          } else if (isFanfiction) {
            console.log('Detected FanFiction.net, using FanFiction.net extraction strategy');
            
            // FanFiction.net extraction strategy
            const chapterSelect = document.querySelector('select#chap_select');
            if (!chapterSelect) {
              return { 
                success: false, 
                error: 'Could not find chapter select dropdown on FanFiction.net page. Please navigate to any chapter page.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
            const chapterOptions = chapterSelect.querySelectorAll('option');
            console.log(`Found ${chapterOptions.length} chapter options in FanFiction.net dropdown`);
            
            // Extract base URL pattern from current page
            const currentUrl = window.location.href;
            const urlMatch = currentUrl.match(/^(https:\/\/www\.fanfiction\.net\/s\/\d+\/)\d+(\/.*)?$/);
            if (!urlMatch) {
              return { 
                success: false, 
                error: 'Could not parse FanFiction.net URL structure.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
            const baseUrl = urlMatch[1]; // e.g., "https://www.fanfiction.net/s/14433734/"
            const storySlug = urlMatch[2] || ''; // e.g., "/Harry-Potter-s-Return-from-the-Witcher-World"
            
            chapterOptions.forEach((option) => {
              const chapterNum = parseInt(option.value, 10);
              if (isNaN(chapterNum)) return;
              
              const chapterUrl = `${baseUrl}${chapterNum}${storySlug}`;
              if (seenUrls.has(chapterUrl)) return;
              seenUrls.add(chapterUrl);
              
              const optionText = option.textContent.trim();
              
              // Extract title (everything after "number. ")
              let title = optionText;
              const titleMatch = optionText.match(/^\d+\.\s*(.+)$/);
              if (titleMatch) {
                title = titleMatch[1].trim();
              }
              
              chapterLinks.push({
                number: chapterNum,
                title: title || `Chapter ${chapterNum}`,
                url: chapterUrl
              });
            });
            
            if (chapterLinks.length === 0) {
              return { 
                success: false, 
                error: 'No chapter options found in FanFiction.net dropdown.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
          } else if (isRoyalRoad) {
            console.log('Detected RoyalRoad, using RoyalRoad extraction strategy');
            
            // RoyalRoad extraction strategy
            const chaptersTable = document.querySelector('table#chapters');
            if (!chaptersTable) {
              return { 
                success: false, 
                error: 'Could not find chapters table on RoyalRoad page. Please navigate to a fiction page with chapters.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
            const chapterRows = chaptersTable.querySelectorAll('tr.chapter-row');
            console.log(`Found ${chapterRows.length} chapter rows in RoyalRoad table`);
            
            chapterRows.forEach((row, index) => {
              const link = row.querySelector('a');
              if (!link) return;
              
              const href = link.href;
              if (seenUrls.has(href)) return;
              seenUrls.add(href);
              
              const linkText = link.textContent.trim();
              
              // Extract chapter number from the beginning of the text
              let chapterNum = index + 1; // Default fallback
              const chapterMatch = linkText.match(/^(\d+)\./);
              if (chapterMatch) {
                chapterNum = parseInt(chapterMatch[1], 10);
              }
              
              // Extract title (everything after "number. ")
              let title = linkText;
              const titleMatch = linkText.match(/^\d+\.\s*(.+)$/);
              if (titleMatch) {
                title = titleMatch[1].trim();
              }
              
              chapterLinks.push({
                number: chapterNum,
                title: title || `Chapter ${chapterNum}`,
                url: href
              });
            });
            
            if (chapterLinks.length === 0) {
              return { 
                success: false, 
                error: 'No chapter rows found in RoyalRoad table.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
            // Note about pagination
            const pagination = document.querySelector('.pagination-small');
            if (pagination && pagination.querySelectorAll('li').length > 1) {
              console.log('Note: RoyalRoad pagination detected. Only extracting chapters from current page.');
            }
            
          } else if (isWebnovel) {
            console.log('Detected Webnovel, using Webnovel extraction strategies');
            
            // Original Webnovel extraction strategies
            const strategies = [
              () => {
                const containers = document.querySelectorAll('.j_catalog_list, .volume-item, .catalog-list, .chapter-list');
                let found = 0;
                
                containers.forEach(container => {
                  const links = container.querySelectorAll('a[href*="/book/"]');
                  links.forEach((link, index) => {
                    if (seenUrls.has(link.href)) return;
                    seenUrls.add(link.href);
                    
                    let chapterNum = index + 1;
                    const text = link.textContent.trim();
                    const chapterMatch = text.match(/Chapter\s+(\d+)/i);
                    if (chapterMatch) {
                      chapterNum = parseInt(chapterMatch[1], 10);
                    }
                    
                    found++;
                    chapterLinks.push({
                      number: chapterNum,
                      title: text || `Chapter ${chapterNum}`,
                      url: link.href
                    });
                  });
                });
                
                console.log(`Strategy 1 found ${found} chapter links`);
                return found;
              },
              
              () => {
                const allLinks = document.querySelectorAll('a[href*="/book/"]');
                let found = 0;
                
                allLinks.forEach((link, index) => {
                  if (seenUrls.has(link.href)) return;
                  
                  const href = link.href;
                  if (href.includes('/category/') || 
                      href.includes('/search/') || 
                      href.includes('/library/') ||
                      href === window.location.href) {
                    return;
                  }
                  
                  seenUrls.add(href);
                  
                  let chapterNum = index + 1;
                  const text = link.textContent.trim();
                  
                  const chapterPatterns = [
                    /Chapter\s+(\d+)/i,
                    /^(\d+)[:\.\s]/,
                    /[^\d](\d+)[:\.\s]/
                  ];
                  
                  for (const pattern of chapterPatterns) {
                    const match = text.match(pattern);
                    if (match) {
                      chapterNum = parseInt(match[1], 10);
                      break;
                    }
                  }
                  
                  const urlMatch = href.match(/_(\d+)$/);
                  if (urlMatch) {
                    chapterNum = parseInt(urlMatch[1], 10);
                  }
                  
                  found++;
                  chapterLinks.push({
                    number: chapterNum,
                    title: text || `Chapter ${chapterNum}`,
                    url: href
                  });
                });
                
                console.log(`Strategy 2 found ${found} chapter links`);
                return found;
              }
            ];
            
            let totalFound = 0;
            for (const strategy of strategies) {
              const found = strategy();
              totalFound += found;
              if (totalFound > 0) break;
            }
            
            if (totalFound === 0) {
              console.error("No chapter links found. Page HTML:", document.body.innerHTML.substring(0, 1000));
              return { 
                success: false, 
                error: 'No chapter links found on this page. Please navigate to the book\'s table of contents.',
                debug: { title: document.title, url: window.location.href }
              };
            }
          } else if (isWattpad) {
            console.log('Detected Wattpad, using Wattpad extraction strategy');
            
            // Look for table of contents in the new Wattpad layout
            let tocContainer = document.querySelector('[data-testid="toc"]');
            
            // Fallback to other possible TOC selectors
            if (!tocContainer) {
              tocContainer = document.querySelector('.pPt69[data-testid="toc"]');
            }
            if (!tocContainer) {
              tocContainer = document.querySelector('._01L-d .pPt69');
            }
            if (!tocContainer) {
              tocContainer = document.querySelector('.table-of-contents');
            }
            
            if (!tocContainer) {
              return { 
                success: false, 
                error: 'Could not find table of contents on this Wattpad page. Please navigate to the story main page that shows the chapter list.',
                debug: { title: document.title, url: window.location.href }
              };
            }
            
            console.log('Found table of contents container');
            
            // Look for chapter links in the TOC
            const chapterItems = tocContainer.querySelectorAll('li a[href*="/"]');
            console.log(`Found ${chapterItems.length} potential chapter links`);
            
            if (chapterItems.length === 0) {
              // Try alternative selectors for chapter links
              const altChapterItems = document.querySelectorAll('a[href*="wattpad.com/"][href*="-"]');
              console.log(`Found ${altChapterItems.length} alternative chapter links`);
              
              if (altChapterItems.length === 0) {
                return { 
                  success: false, 
                  error: 'No chapter links found in the table of contents. Please make sure you are on the story main page.',
                  debug: { title: document.title, url: window.location.href }
                };
              }
              
              // Process alternative chapter items
              let chapterNum = 1;
              altChapterItems.forEach((link) => {
                const href = link.href;
                if (seenUrls.has(href)) return;
                
                // Only include links that match Wattpad chapter pattern
                if (href.match(/wattpad\.com\/\d+-/)) {
                  seenUrls.add(href);
                  
                  const title = link.textContent.trim();
                  chapterLinks.push({
                    number: chapterNum,
                    title: title || `Chapter ${chapterNum}`,
                    url: href
                  });
                  chapterNum++;
                }
              });
            } else {
              // Process main chapter items
              let chapterNum = 1;
              chapterItems.forEach((link) => {
                const href = link.href;
                if (seenUrls.has(href)) return;
                seenUrls.add(href);
                
                // Extract chapter title
                const title = link.textContent.trim();
                
                chapterLinks.push({
                  number: chapterNum,
                  title: title || `Chapter ${chapterNum}`,
                  url: href
                });
                chapterNum++;
              });
            }
            
            if (chapterLinks.length === 0) {
              return { 
                success: false, 
                error: 'No valid chapter links found on this Wattpad page. Please make sure you are on the story main page with the chapter list visible.',
                debug: { title: document.title, url: window.location.href }
              };
            }
          // Inkitt removed as source platform
          } else {
            return { 
              success: false, 
              error: 'Unsupported source. Please navigate to Webnovel, ScribbleHub, AO3, FanFiction.net, RoyalRoad, or Wattpad.',
              debug: { title: document.title, url: window.location.href }
            };
          }
          
          const sortedLinks = [...chapterLinks].sort((a, b) => a.number - b.number);
          
          console.log(`Found ${sortedLinks.length} chapter links`);
          console.log("First 5 chapters:", sortedLinks.slice(0, 5));
          
          return { 
            success: true, 
            urls: sortedLinks,
            count: sortedLinks.length,
            source: isScribbleHub ? 'scribblehub' : (isAO3 ? 'ao3' : (isFanfiction ? 'fanfiction' : (isRoyalRoad ? 'royalroad' : (isWattpad ? 'wattpad' : 'webnovel'))))
          };
        } catch (error) {
          console.error('Error extracting chapter URLs:', error);
          return { success: false, error: error.toString() };
        }
      }
    });
    
    if (!result || !result[0]?.result) {
      throw new Error("Failed to execute chapter extraction script");
    }
    
    const extractResult = result[0].result;
    
    if (!extractResult.success) {
      throw new Error(`Failed to extract chapter URLs: ${extractResult.error}`);
    }
    
    console.log(`Extracted ${extractResult.urls.length} chapter URLs`);
    
    await chrome.storage.local.set({ chapterUrls: extractResult.urls });
    
    const chaptersToScan = [];
    for (let i = startChapter; i <= endChapter; i++) {
      chaptersToScan.push(i);
    }
    
    console.log(`Preparing to scan ${chaptersToScan.length} chapters`);
    
    const updateScannedCount = async (count) => {
      const queueConfig = (await chrome.storage.local.get('queueConfig')).queueConfig || {};
      await chrome.storage.local.set({
        queueConfig: {
          ...queueConfig,
          scannedChapters: count
        }
      });
    };
    
    for (const chapterNum of chaptersToScan) {
      try {
        const chapterUrl = findChapterUrl(extractResult.urls, chapterNum);
        
        if (!chapterUrl) {
          console.error(`No URL found for chapter ${chapterNum}`);
          scannedChapters.push({
            number: chapterNum,
            success: false,
            error: `No URL found for chapter ${chapterNum}`
          });
          
          await updateScannedCount(scannedChapters.length);
          continue;
        }
        
        console.log(`Scanning chapter ${chapterNum} from ${chapterUrl}`);
        
        const chapterData = await fetchChapterFromSource(chapterUrl);
        
        if (chapterData.success) {
          console.log(`Successfully scanned chapter ${chapterNum}: ${chapterData.chapter.title}`);
          
          scannedChapters.push({
            number: chapterNum,
            success: true,
            title: chapterData.chapter.title,
            content: chapterData.chapter.content
          });
        } else {
          console.error(`Failed to scan chapter ${chapterNum}: ${chapterData.error}`);
          
          scannedChapters.push({
            number: chapterNum,
            success: false,
            error: chapterData.error
          });
        }
        
        await updateScannedCount(scannedChapters.length);
      } catch (error) {
        console.error(`Error scanning chapter ${chapterNum}:`, error);
        
        scannedChapters.push({
          number: chapterNum,
          success: false,
          error: error.toString()
        });
        
        await updateScannedCount(scannedChapters.length);
      }
      
      const syncStatus = await chrome.storage.local.get('isSyncing');
      if (!syncStatus.isSyncing) {
        console.log("Scanning cancelled");
        scanningInProgress = false;
        return { success: false, message: "Scanning cancelled" };
      }
    }
    
    console.log(`Scanning phase complete. ${scannedChapters.filter(ch => ch.success).length} chapters scanned successfully.`);
    
    const validChapters = scannedChapters.filter(ch => ch.success);
    const failedScanChapters = scannedChapters.filter(ch => !ch.success);
    console.log(`Found ${validChapters.length} valid chapters ready for posting phase`);
    
    // If all chapters failed to scan, throw an error with details
    if (validChapters.length === 0 && scannedChapters.length > 0) {
      console.error("All chapters failed to scan. Failed chapters:", failedScanChapters);
      
      // Create a detailed error message
      const errorSummary = failedScanChapters.map(ch => 
        `Chapter ${ch.number}: ${ch.error || 'Unknown error'}`
      ).join('; ');
      
      throw new Error(`All chapters failed to scan. Errors: ${errorSummary}`);
    }
    
    // If no chapters were processed at all
    if (scannedChapters.length === 0) {
      throw new Error("No chapters were processed during scanning phase");
    }
    
    const queueConfig = (await chrome.storage.local.get('queueConfig')).queueConfig || {};
    await chrome.storage.local.set({ 
      scanningPhase: false,
      postingPhase: true,
      queueConfig: {
        ...queueConfig,
        scannedChapters: validChapters.length
      }
    });
    scanningInProgress = false;
    console.log(`Starting posting phase with batch size: ${batchSize} for platforms: ${targetPlatforms.join(', ')}`);
    const postResult = await startPostingPhase(targetPlatforms, batchSize);
    console.log("Posting phase result:", postResult);
    return postResult;


  } catch (error) {
    console.error("Error in scan phase:", error);
    scanningInProgress = false;
    
    await chrome.storage.local.set({ 
      isSyncing: false,
      scanningPhase: false,
      postingPhase: false
    });
    
    return { success: false, error: error.toString() };
  }
}

async function fetchChapterFromSource(chapterUrl) {
  let tab = null;
  
  try {
    console.log(`Fetching chapter from: ${chapterUrl}`);
    
    const isScribbleHub = chapterUrl.includes('scribblehub.com');
    const isWebnovel = chapterUrl.includes('webnovel.com');
    const isAO3 = chapterUrl.includes('archiveofourown.org');
    const isFanfiction = chapterUrl.includes('fanfiction.net');
    const isRoyalRoad = chapterUrl.includes('royalroad.com');
    const isWattpad = chapterUrl.includes('wattpad.com');
    // Inkitt removed as source platform
    
    tab = await chrome.tabs.create({ 
      url: chapterUrl, 
      active: true 
    });
    
    const tabId = tab.id;
    
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve('timeout'), 5000);
        
        const checkInterval = setInterval(async () => {
          try {
            const tabs = await chrome.tabs.query({});
            const tabExists = tabs.some(t => t.id === tabId);
            
            if (!tabExists) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              reject(new Error('Tab was closed prematurely'));
              return;
            }
            
            const result = await chrome.scripting.executeScript({
              target: { tabId: tabId },
              function: (isScribbleHub, isAO3, isFanfiction, isRoyalRoad, isWattpad) => {
                if (isScribbleHub) {
                  return {
                    ready: document.readyState === 'complete',
                    hasContent: document.querySelectorAll('.chapter-title, .chp_raw').length > 0
                  };
                } else if (isAO3) {
                  return {
                    ready: document.readyState === 'complete',
                    hasContent: document.querySelectorAll('h3.title, .userstuff.module').length > 0
                  };
                } else if (isFanfiction) {
                  return {
                    ready: document.readyState === 'complete',
                    hasContent: document.querySelectorAll('.storytext').length > 0
                  };
                } else if (isRoyalRoad) {
                  return {
                    ready: document.readyState === 'complete',
                    hasContent: document.querySelectorAll('h1.font-white.break-word, .chapter-inner.chapter-content').length > 0
                  };
                } else if (isWattpad) {
                  return {
                    ready: document.readyState === 'complete',
                    hasContent: document.querySelectorAll('h1.h2, pre').length > 0
                  };
                // Inkitt removed as source platform
                } else {
                  return {
                    ready: document.readyState === 'complete',
                    hasContent: document.querySelectorAll('h1, .cha-content, .chapter_content').length > 0
                  };
                }
              },
              args: [isScribbleHub, isAO3, isFanfiction, isRoyalRoad, isWattpad]
            });
            
            if (result && result[0] && result[0].result) {
              const {ready, hasContent} = result[0].result;
              if (ready && hasContent) {
                clearTimeout(timeout);
                clearInterval(checkInterval);
                resolve('loaded');
              }
            }
          } catch (err) {
            if (err.message && err.message.includes('No tab with id')) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              reject(new Error('Tab was closed or doesn\'t exist'));
            } else {
              console.error('Error checking page load:', err);
            }
          }
        }, 300);
      });
    } catch (loadError) {
      console.warn('Error during page load:', loadError);
    }
    
    const tabCheck = await chrome.tabs.query({});
    if (!tabCheck.some(t => t.id === tab.id)) {
      throw new Error('Tab no longer exists');
    }
    
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (isScribbleHub, isAO3, isFanfiction, isRoyalRoad, isWattpad) => {
        try {
          
          let title = null;
          let paragraphs = new Set();
          const seenParagraphs = new Set();
          
          // Function to convert AO3 HTML to properly formatted text
          function convertAO3HtmlToText(element) {
            try {
              if (!element) return '';
              
              // Clone the element to avoid modifying the original
              const clone = element.cloneNode(true);
              
              // Handle line breaks and paragraphs
              const lineBreaks = clone.querySelectorAll('br');
              lineBreaks.forEach(br => {
                br.outerHTML = '\n';
              });
              
              // Handle italic formatting - preserve with asterisks for FFN
              const italics = clone.querySelectorAll('em, i');
              italics.forEach(italic => {
                const text = italic.textContent;
                // Ensure spaces around italics are preserved
                const beforeSpace = italic.previousSibling && italic.previousSibling.nodeType === 3 && italic.previousSibling.textContent.endsWith(' ') ? '' : '';
                const afterSpace = italic.nextSibling && italic.nextSibling.nodeType === 3 && italic.nextSibling.textContent.startsWith(' ') ? '' : '';
                italic.outerHTML = `${beforeSpace}*${text}*${afterSpace}`;
              });
              
              // Handle bold formatting
              const bolds = clone.querySelectorAll('strong, b');
              bolds.forEach(bold => {
                const text = bold.textContent;
                const beforeSpace = bold.previousSibling && bold.previousSibling.nodeType === 3 && bold.previousSibling.textContent.endsWith(' ') ? '' : '';
                const afterSpace = bold.nextSibling && bold.nextSibling.nodeType === 3 && bold.nextSibling.textContent.startsWith(' ') ? '' : '';
                bold.outerHTML = `${beforeSpace}**${text}**${afterSpace}`;
              });
              
              // Get the text content
              let text = clone.textContent || clone.innerText || '';
              
              // Fix spacing issues that cause words to run together
              text = text
                .replace(/([a-zA-Z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase letters
                .replace(/([.!?])([A-Z])/g, '$1 $2')     // Add space after punctuation before capital letters
                .replace(/\s+/g, ' ')                     // Multiple spaces to single space
                .replace(/\s*\n\s*/g, '\n')              // Clean up line breaks
                .trim();
              
              return text;
            } catch (error) {
              console.error('Error in convertAO3HtmlToText:', error);
              // Fallback to simple text extraction
              return element ? (element.textContent || element.innerText || '').trim() : '';
            }
          }
          
          if (isScribbleHub) {
            // ScribbleHub extraction
            console.log('Extracting from ScribbleHub chapter page');
            
            // Get title from ScribbleHub
            const titleElement = document.querySelector('.chapter-title');
            if (titleElement) {
              title = titleElement.textContent.trim();
            }
            
            if (!title) {
              return { 
                success: false, 
                error: 'Could not find chapter title on ScribbleHub page' 
              };
            }
            
            // Get content from ScribbleHub
            const contentContainer = document.querySelector('.chp_raw');
            if (contentContainer) {
              const contentParagraphs = contentContainer.querySelectorAll('p');
              if (contentParagraphs.length > 0) {
                contentParagraphs.forEach(p => {
                  const text = p.textContent.trim();
                  if (text && !seenParagraphs.has(text)) {
                    seenParagraphs.add(text);
                    paragraphs.add(text);
                  }
                });
              } else {
                // Fallback: get all text content from the container
                const text = contentContainer.textContent.trim();
                if (text) {
                  // Split by line breaks and filter empty lines
                  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
                  lines.forEach(line => {
                    if (!seenParagraphs.has(line)) {
                      seenParagraphs.add(line);
                      paragraphs.add(line);
                    }
                  });
                }
              }
            }
            
          } else if (isAO3) {
            // AO3 extraction
            console.log('Extracting from AO3 chapter page');
            
            // Get title from AO3
            const titleElement = document.querySelector('h3.title');
            if (titleElement) {
              // Extract just the chapter title part, removing "Chapter X:" prefix if present
              const titleText = titleElement.textContent.trim();
              const titleMatch = titleText.match(/^Chapter\s+\d+:\s*(.+)$/i);
              if (titleMatch) {
                title = titleMatch[1].trim();
              } else {
                // If no "Chapter X:" pattern, use the full title but try to extract after ": " 
                const colonMatch = titleText.match(/^[^:]+:\s*(.+)$/);
                if (colonMatch) {
                  title = colonMatch[1].trim();
                } else {
                  title = titleText;
                }
              }
            }
            
            if (!title) {
              return { 
                success: false, 
                error: 'Could not find chapter title on AO3 page' 
              };
            }
            
            // Get author notes from AO3 (beginning and end)
            let beginningNotes = '';
            let endNotes = '';
            
            // Beginning notes - try multiple selectors
            const beginningSelectors = [
              '#notes .userstuff',
              '.chapter .notes.module .userstuff', 
              '.notes.module .userstuff'
            ];
            
            console.log('Checking for AO3 beginning notes...');
            for (const selector of beginningSelectors) {
              try {
                const container = document.querySelector(selector);
                if (container && container.textContent.trim()) {
                  beginningNotes = convertAO3HtmlToText(container);
                  console.log('Found AO3 beginning notes:', beginningNotes);
                  break;
                }
              } catch (error) {
                console.error('Error processing beginning notes with selector', selector, ':', error);
              }
            }
            
            // End notes - try multiple selectors for different patterns
            const endSelectors = [
              '#work_endnotes .userstuff',
              '[id*="endnotes"] .userstuff',
              '.end.notes.module .userstuff'
            ];
            
            console.log('Checking for AO3 end notes...');
            for (const selector of endSelectors) {
              try {
                const container = document.querySelector(selector);
                if (container && container.textContent.trim()) {
                  endNotes = convertAO3HtmlToText(container);
                  console.log('Found AO3 end notes:', endNotes);
                  break;
                }
              } catch (error) {
                console.error('Error processing end notes with selector', selector, ':', error);
              }
            }
            
            // Get content from AO3
            console.log('Looking for AO3 content container...');
            const contentContainer = document.querySelector('.userstuff.module[role="article"]');
            if (contentContainer) {
              console.log('Found AO3 content container');
              const contentParagraphs = contentContainer.querySelectorAll('p');
              console.log(`Found ${contentParagraphs.length} paragraphs in AO3 content`);
              
              if (contentParagraphs.length > 0) {
                contentParagraphs.forEach((p, index) => {
                  try {
                    // Convert HTML to properly formatted text
                    const text = convertAO3HtmlToText(p);
                    if (text && !seenParagraphs.has(text)) {
                      seenParagraphs.add(text);
                      paragraphs.add(text);
                      console.log(`Added paragraph ${index + 1}: ${text.substring(0, 50)}...`);
                    }
                  } catch (error) {
                    console.error(`Error processing paragraph ${index + 1}:`, error);
                  }
                });
              } else {
                console.log('No paragraphs found, using fallback extraction...');
                // Fallback: use the conversion function on the entire container
                try {
                  const text = convertAO3HtmlToText(contentContainer);
                  if (text) {
                    console.log('Fallback extraction successful, splitting into lines...');
                    // Split by line breaks and filter empty lines
                    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
                    console.log(`Found ${lines.length} lines from fallback extraction`);
                    lines.forEach((line, index) => {
                      if (!seenParagraphs.has(line)) {
                        seenParagraphs.add(line);
                        paragraphs.add(line);
                        console.log(`Added line ${index + 1}: ${line.substring(0, 50)}...`);
                      }
                    });
                  } else {
                    console.error('Fallback extraction returned empty text');
                  }
                } catch (error) {
                  console.error('Error in fallback content extraction:', error);
                }
              }
            } else {
              console.error('Could not find AO3 content container with selector .userstuff.module[role="article"]');
              // Try alternative selectors
              const alternativeSelectors = [
                '.userstuff.module',
                '.chapter .userstuff',
                '[role="article"]'
              ];
              
              for (const selector of alternativeSelectors) {
                console.log(`Trying alternative selector: ${selector}`);
                const altContainer = document.querySelector(selector);
                if (altContainer) {
                  console.log(`Found content with alternative selector: ${selector}`);
                  try {
                    const text = convertAO3HtmlToText(altContainer);
                    if (text) {
                      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
                      console.log(`Found ${lines.length} lines with alternative selector`);
                      lines.forEach(line => {
                        if (!seenParagraphs.has(line)) {
                          seenParagraphs.add(line);
                          paragraphs.add(line);
                        }
                      });
                      break;
                    }
                  } catch (error) {
                    console.error(`Error with alternative selector ${selector}:`, error);
                  }
                }
              }
            }
            
            // Add author notes to content if they exist
            console.log(`AO3 extraction complete. Found ${paragraphs.size} paragraphs before adding notes`);
            console.log('Converting paragraphs to array...');
            const paragraphsArray = Array.from(paragraphs);
            console.log(`Paragraphs array created with ${paragraphsArray.length} items`);
            
            // Add beginning notes at the start
            if (beginningNotes) {
              console.log('Adding beginning notes to content');
              const beginningNotesParagraph = `[Author's Note: ${beginningNotes}]`;
              paragraphsArray.unshift(beginningNotesParagraph);
              console.log('Beginning notes added successfully');
            } else {
              console.log('No beginning notes to add');
            }
            
            // Add end notes at the end
            console.log('Checking for end notes...');
            try {
              if (endNotes) {
                console.log('Adding end notes to content');
                const endNotesParagraph = `[End Note: ${endNotes}]`;
                paragraphsArray.push(endNotesParagraph);
                console.log('End notes added successfully');
              } else {
                console.log('No end notes to add');
              }
            } catch (error) {
              console.error('Error processing end notes:', error);
            }
            
            console.log('Converting array back to Set...');
            try {
              console.log('paragraphsArray type:', typeof paragraphsArray);
              console.log('paragraphsArray length:', paragraphsArray.length);
              paragraphs = new Set(paragraphsArray);
              console.log('Set conversion successful');
              console.log(`Final AO3 content has ${paragraphs.size} paragraphs total`);
            } catch (error) {
              console.error('Error converting array to Set:', error);
              console.error('paragraphsArray contents:', paragraphsArray);
            }
            
          } else if (isFanfiction) {
            // FanFiction.net extraction
            console.log('Extracting from FanFiction.net chapter page');
            
            // For FanFiction.net, we need to extract the title from the URL or page
            // The URL pattern is like: /s/14433734/1/Harry-Potter-s-Return-from-the-Witcher-World
            const urlMatch = window.location.href.match(/\/s\/\d+\/(\d+)\/(.+)$/);
            if (urlMatch) {
              const chapterNum = urlMatch[1];
              const storyTitle = urlMatch[2].replace(/[-_]/g, ' ');
              title = `Chapter ${chapterNum}`;
              
              // Try to get a more specific title from the page if available
              const pageTitle = document.title;
              const titleMatch = pageTitle.match(/Chapter \d+[:\s]*(.+?)\s*-/);
              if (titleMatch) {
                title = titleMatch[1].trim();
              }
            } else {
              title = 'Chapter';
            }
            
            if (!title) {
              return { 
                success: false, 
                error: 'Could not determine chapter title on FanFiction.net page' 
              };
            }
            
            // Get content from FanFiction.net
            const contentContainer = document.querySelector('.storytext');
            if (contentContainer) {
              const contentParagraphs = contentContainer.querySelectorAll('p');
              if (contentParagraphs.length > 0) {
                contentParagraphs.forEach(p => {
                  const text = p.textContent.trim();
                  if (text && !seenParagraphs.has(text)) {
                    seenParagraphs.add(text);
                    paragraphs.add(text);
                  }
                });
              } else {
                // Fallback: get all text content from the container
                const text = contentContainer.textContent.trim();
                if (text) {
                  // Split by line breaks and filter empty lines
                  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
                  lines.forEach(line => {
                    if (!seenParagraphs.has(line)) {
                      seenParagraphs.add(line);
                      paragraphs.add(line);
                    }
                  });
                }
              }
            }
            
          } else if (isRoyalRoad) {
            // RoyalRoad extraction
            console.log('Extracting from RoyalRoad chapter page');
            
            // Get title from RoyalRoad
            const titleElement = document.querySelector('h1.font-white.break-word');
            if (titleElement) {
              const titleText = titleElement.textContent.trim();
              // Extract just the chapter title part, removing "number. " prefix if present
              const titleMatch = titleText.match(/^\d+\.\s*(.+)$/);
              if (titleMatch) {
                title = titleMatch[1].trim();
              } else {
                title = titleText;
              }
            }
            
            if (!title) {
              return { 
                success: false, 
                error: 'Could not find chapter title on RoyalRoad page' 
              };
            }
            
            // Get content from RoyalRoad
            const contentContainer = document.querySelector('.chapter-inner.chapter-content');
            if (contentContainer) {
              const contentParagraphs = contentContainer.querySelectorAll('p');
              if (contentParagraphs.length > 0) {
                contentParagraphs.forEach(p => {
                  const text = p.textContent.trim();
                  if (text && !seenParagraphs.has(text)) {
                    seenParagraphs.add(text);
                    paragraphs.add(text);
                  }
                });
              } else {
                // Fallback: get all text content from the container
                const text = contentContainer.textContent.trim();
                if (text) {
                  // Split by line breaks and filter empty lines
                  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
                  lines.forEach(line => {
                    if (!seenParagraphs.has(line)) {
                      seenParagraphs.add(line);
                      paragraphs.add(line);
                    }
                  });
                }
              }
            }
            
          } else if (isWattpad) {
            // Wattpad extraction
            console.log('Extracting from Wattpad chapter page');
            
            // Get title from Wattpad - it's in h1.h2
            const titleElement = document.querySelector('h1.h2');
            if (titleElement) {
              title = titleElement.textContent.trim();
            }
            
            if (!title) {
              return { 
                success: false, 
                error: 'Could not find chapter title on Wattpad page. Looking for h1.h2 element.' 
              };
            }
            
            // Get content from Wattpad - it's inside a pre tag with p[data-p-id] elements
            const contentContainer = document.querySelector('pre');
            if (contentContainer) {
              // Find all paragraphs with data-p-id attributes
              const contentParagraphs = contentContainer.querySelectorAll('p[data-p-id]');
              if (contentParagraphs.length > 0) {
                contentParagraphs.forEach(p => {
                  // Clone the paragraph to avoid modifying the original DOM
                  const pClone = p.cloneNode(true);
                  
                  // Remove comment UI elements that contain "+" symbols
                  const uiElements = pClone.querySelectorAll('.component-wrapper, .btn-no-background, .comment-marker, .num-comment, .fa-comment-count, span.num-comment, button');
                  uiElements.forEach(el => el.remove());
                  
                  const text = pClone.textContent.trim();
                  if (text && !seenParagraphs.has(text)) {
                    seenParagraphs.add(text);
                    paragraphs.add(text);
                  }
                });
              } else {
                // Fallback: get all text content from the container, removing UI elements
                const containerClone = contentContainer.cloneNode(true);
                const uiElements = containerClone.querySelectorAll('.component-wrapper, .btn-no-background, .comment-marker, .num-comment, .fa-comment-count, span.num-comment, button');
                uiElements.forEach(el => el.remove());
                
                const text = containerClone.textContent.trim();
                if (text) {
                  // Split by line breaks and filter empty lines
                  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
                  lines.forEach(line => {
                    if (!seenParagraphs.has(line)) {
                      seenParagraphs.add(line);
                      paragraphs.add(line);
                    }
                  });
                }
              }
            } else {
              return { 
                success: false, 
                error: 'Could not find content container (pre tag) on Wattpad page' 
              };
            }
            
            
          } else {
            // Webnovel extraction (original logic)
            console.log('Extracting from Webnovel chapter page');
            
            const titleElements = [
              document.querySelector('h1[class*="dib"][class*="mb0"][class*="fw700"][class*="fs24"]'), 
              document.querySelector('.cha-tit h1'),
              document.querySelector('.cha-tit'),
              document.querySelector('.chapter_content h1'),
              document.querySelector('h1')
            ];
            
            for (const el of titleElements) {
              if (el && el.textContent.trim()) {
                title = el.textContent.trim();
                break;
              }
            }
            
            if (!title) {
              return { 
                success: false, 
                error: 'Could not find chapter title' 
              };
            }
            
            const contentElements = document.querySelectorAll('.cha-content p, .cha-paragraph');
            if (contentElements.length > 0) {
              contentElements.forEach(el => {
                const text = el.textContent.trim();
                if (text && !seenParagraphs.has(text)) {
                  seenParagraphs.add(text);
                  paragraphs.add(text);
                }
              });
            }
            
            if (paragraphs.size === 0) {
              const altContentElements = document.querySelectorAll(
                '.chapter_content p, .content p, div[class*="chapter"] p, div[class*="content"] p'
              );
              
              if (altContentElements.length > 0) {
                altContentElements.forEach(el => {
                  const text = el.textContent.trim();
                  if (text && !seenParagraphs.has(text)) {
                    seenParagraphs.add(text);
                    paragraphs.add(text);
                  }
                });
              } else {
                const contentDiv = document.querySelector(
                  '.cha-content, .chapter_content, .content, [class*="chapter"], [class*="content"]'
                );
                
                if (contentDiv) {
                  const walker = document.createTreeWalker(
                    contentDiv,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                  );
                  
                  let node;
                  while (node = walker.nextNode()) {
                    const text = node.textContent.trim();
                    if (text && !seenParagraphs.has(text)) {
                      seenParagraphs.add(text);
                      paragraphs.add(text);
                    }
                  }
                }
              }
            }
          }
          
          console.log(`Found ${paragraphs.size} unique paragraphs`);
          
          if (paragraphs.size === 0) {
            return { 
              success: false, 
              error: 'Could not find chapter content' 
            };
          }
          
          console.log('Converting paragraphs to HTML content...');
          console.log('Final paragraphs count:', paragraphs.size);
          console.log('Title to return:', title);
          
          const htmlContent = Array.from(paragraphs).map(p => `<p>${p}</p>`).join('');
          console.log('HTML content length:', htmlContent.length);
          
          console.log('Returning AO3 extraction success...');
          return { 
            success: true, 
            chapter: {
              title: title,
              content: htmlContent
            }
          };
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      },
      args: [isScribbleHub, isAO3, isFanfiction, isRoyalRoad, isWattpad]
    });
    
    try {
      const tabsCheck = await chrome.tabs.query({});
      if (tabsCheck.some(t => t.id === tab.id)) {
        await chrome.tabs.remove(tab.id);
      }
    } catch (closeError) {
      console.warn('Error closing tab (might already be closed):', closeError);
    }
    
    if (!result || !result[0] || !result[0].result) {
      console.error('Script execution failed - no result returned');
      return { success: false, error: 'Failed to execute script' };
    }
    
    const extractResult = result[0].result;
    console.log('Extraction success:', extractResult.success, 'Error:', extractResult.error);
    return extractResult;
  } catch (error) {
    try {
      if (tab && tab.id) {
        const tabsCheck = await chrome.tabs.query({});
        if (tabsCheck.some(t => t.id === tab.id)) {
          await chrome.tabs.remove(tab.id);
        }
      }
    } catch (closeError) {
      console.warn('Error during tab cleanup:', closeError);
    }
    
    return { success: false, error: error.toString() };
  }
}

async function postChapterToPlatforms(chapter, targetPlatforms, platforms) {
  try {
    console.log(`Posting chapter ${chapter.number} to platforms: ${targetPlatforms.join(', ')}`);
    
    const results = [];
    let allSuccess = true;
    const needsReordering = [];
    
    const orderedPlatforms = [];
    
    if (targetPlatforms.includes('scribblehub')) {
      orderedPlatforms.push('scribblehub');
    }
    
    targetPlatforms.forEach(platform => {
      if (platform !== 'scribblehub') {
        orderedPlatforms.push(platform);
      }
    });
    
    console.log(`Posting in order: ${orderedPlatforms.join(', ')}`);
    
    for (const platformName of orderedPlatforms) {
      const platformConfig = platforms[platformName];
      
      if (platformConfig && platformConfig.enabled) {
        try {
          const chapterData = {
            title: chapter.title,
            content: chapter.content
          };
          
          const result = await postChapterToPlatform(
            platformName,
            platformConfig,
            chapterData,
            chapter.number
          );
          
          results.push({
            platform: platformName,
            success: result.success,
            message: result.message || result.error
          });
          
          if (!result.success) {
            allSuccess = false;
          }
          
          if (platformName === 'scribblehub' && 
              (result.needsReordering || 
               (result.success && chapter.number === platformConfig.lastSyncedChapter + 1))) {
            needsReordering.push(platformName);
          }
          
          if (result.success) {
            platformConfig.lastSyncedChapter = Math.max(platformConfig.lastSyncedChapter, chapter.number);
          }
        } catch (error) {
          results.push({
            platform: platformName,
            success: false,
            message: error.toString()
          });
          allSuccess = false;
        }
      }
    }
    
    await chrome.storage.local.set({ platforms });
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      chapterNumber: chapter.number,
      chapterTitle: chapter.title || `Chapter ${chapter.number}`,
      results: results
    };
    
    const syncLog = (await chrome.storage.local.get('lastSyncLog')).lastSyncLog || [];
    syncLog.unshift(logEntry);
    await chrome.storage.local.set({ 
      lastSyncLog: syncLog.slice(0, 20)
    });
    
    return {
      success: allSuccess,
      needsReordering: needsReordering.length > 0 ? needsReordering : null,
      logEntry: logEntry
    };
  } catch (error) {
    console.error(`Error posting chapter ${chapter.number}:`, error);
    
    const errorLogEntry = {
      timestamp: new Date().toISOString(),
      chapterNumber: chapter.number,
      chapterTitle: chapter.title || `Chapter ${chapter.number}`,
      results: [{
        platform: 'system',
        success: false,
        message: `Error: ${error.toString()}`
      }]
    };
    
    const syncLog = (await chrome.storage.local.get('lastSyncLog')).lastSyncLog || [];
    syncLog.unshift(errorLogEntry);
    await chrome.storage.local.set({ 
      lastSyncLog: syncLog.slice(0, 20)
    });
    
    return {
      success: false,
      logEntry: errorLogEntry
    };
  }
}

async function startPostingPhase(targetPlatforms, batchSize = 1) {
  try {
    console.log(`Starting posting phase with batch size: ${batchSize}`);
    
    console.log("Current state - scanningInProgress:", scanningInProgress, "postingInProgress:", postingInProgress);
    console.log("Scanned chapters count:", scannedChapters.length);
    
    if (scanningInProgress) {
      throw new Error("Scanning still in progress");
    }
    
    const data = await chrome.storage.local.get(['platforms']);
    
    const validChapters = scannedChapters.filter(ch => ch.success);
    
    if (validChapters.length === 0) {
      throw new Error("No successfully scanned chapters to post");
    }
    
    console.log(`Starting posting phase for ${validChapters.length} chapters`);
    
    postingInProgress = true;
    
    const queueConfig = (await chrome.storage.local.get('queueConfig')).queueConfig || {};
    
    await chrome.storage.local.set({
      postingPhase: true,
      queueConfig: {
        ...queueConfig,
        completedChapters: 0,
        failedChapters: 0,
        scannedChapters: validChapters.length
      }
    });
    
    const needsReordering = new Set();
    
    // No batch size restrictions - allow up to maximum of 10
    if (batchSize > 10) {
      batchSize = 10;
    }
    
    batchSize = Math.max(1, Math.min(5, batchSize || 1));
    console.log(`Using batch size: ${batchSize} for processing chapters`);
    let completedCount = 0;
    let failedCount = 0;
    let newLogEntries = [];
    
    for (let i = 0; i < validChapters.length; i += batchSize) {
      const batch = validChapters.slice(i, i + batchSize);
      
      const batchPromises = batch.map(chapter =>
        postChapterToPlatforms(chapter, targetPlatforms, data.platforms)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      
      batchResults.forEach(async (result, index) => {
        const chapter = batch[index];
        
        if (result.status === 'fulfilled') {
          const postResult = result.value;
          newLogEntries.push(postResult.logEntry);
          
          if (postResult.success) {
            completedCount++;
          } else {
            failedCount++;
            failedChapters.push(chapter);
          }
          
          if (postResult.needsReordering) {
            postResult.needsReordering.forEach(platform => needsReordering.add(platform));
          }
        } else {
          failedCount++;
          
          failedChapters.push(chapter);
          
          newLogEntries.push({
            timestamp: new Date().toISOString(),
            chapterNumber: chapter.number,
            chapterTitle: chapter.title || `Chapter ${chapter.number}`,
            results: [{
              platform: 'system',
              success: false,
              message: `Error: ${result.reason}`
            }]
          });
        }
      });
      
      const currentQueueConfig = (await chrome.storage.local.get('queueConfig')).queueConfig || {};
      await chrome.storage.local.set({
        queueConfig: {
          ...currentQueueConfig,
          completedChapters: completedCount,
          failedChapters: failedCount,
          scannedChapters: validChapters.length
        }
      });
      
      
      const syncStatus = await chrome.storage.local.get('isSyncing');
      if (!syncStatus.isSyncing) {
        console.log("Posting cancelled");
        postingInProgress = false;
        return { success: false, message: "Posting cancelled" };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`Posting phase complete. ${completedCount} chapters posted successfully, ${failedCount} failed.`);
    
    if (needsReordering.size > 0) {
      console.log(`Platforms needing reordering: ${Array.from(needsReordering).join(', ')}`);
      
      if (needsReordering.has('scribblehub')) {
        const scribbleHubConfig = data.platforms.scribblehub;
        if (scribbleHubConfig && scribbleHubConfig.storyId) {
          try {
            console.log(`Reordering ScribbleHub chapters for story ID: ${scribbleHubConfig.storyId}`);
          } catch (reorderError) {
            console.error("Error reordering ScribbleHub chapters:", reorderError);
          }
        }
      }
    }
    
    postingInProgress = false;
    
    const finalQueueConfig = (await chrome.storage.local.get('queueConfig')).queueConfig || {};
    
    await chrome.storage.local.set({ 
      isSyncing: false,
      postingPhase: false,
      queueConfig: {
        ...finalQueueConfig,
        completedChapters: completedCount,
        failedChapters: failedCount,
        scannedChapters: validChapters.length,
        totalChapters: finalQueueConfig.totalChapters || validChapters.length
      }
    });
    
    return { 
      success: true, 
      completedCount, 
      failedCount,
      message: "Posting phase complete"
    };
    
  } catch (error) {
    console.error("Error in posting phase:", error);
    postingInProgress = false;
    
    await chrome.storage.local.set({ 
      isSyncing: false,
      postingPhase: false
    });
    
    return { success: false, error: error.toString() };
  }
}

async function postChapterToPlatform(platformName, platformConfig, chapterData, chapterNumber) {
  console.log(`Inside postChapterToPlatform for ${platformName}`);
  
  try {
    switch (platformName) {
      case 'scribblehub':
        if (!platformConfig.storyId) {
          console.error('ScribbleHub story ID not set');
          return { success: false, error: 'ScribbleHub story ID not set' };
        }
        try {
          const result = await postToScribbleHub(chapterData, platformConfig, chapterNumber);
          if (result.success) {
            return result;
          }
          
          if (result.error && result.error.includes("Couldn't find editor to set content")) {
            console.log("Regular method failed to find editor, trying workaround method...");
            return await postToScribbleHubWithWorkaround(chapterData, platformConfig, chapterNumber);
          }
          
          return result;
        } catch (error) {
          console.error("Error in ScribbleHub posting:", error);
          try {
            console.log("Trying ScribbleHub workaround method after error...");
            return await postToScribbleHubWithWorkaround(chapterData, platformConfig, chapterNumber);
          } catch (workaroundError) {
            console.error("Workaround method also failed:", workaroundError);
            return { success: false, error: error.toString() };
          }
        }
      case 'fanfiction':
        if (!platformConfig.storyId) {
          console.error('FanFiction story ID not set');
          return { success: false, error: 'FanFiction story ID not set' };
        }
        return await postToFanFiction(chapterData, platformConfig, chapterNumber);
      case 'ao3':
        if (!platformConfig.workId) {
          console.error('AO3 work ID not set');
          return { success: false, error: 'AO3 work ID not set' };
        }
        return await postToAO3(chapterData, platformConfig, chapterNumber);
      case 'royalroad':
        if (!platformConfig.workId) {
          console.error('RoyalRoad work ID not set');
          return { success: false, error: 'RoyalRoad work ID not set' };
        }
        return await postToRoyalRoad(chapterData, platformConfig, chapterNumber);
      case 'webnovel':
        if (!platformConfig.storyId) {
          console.error('Webnovel story ID not set');
          return { success: false, error: 'Webnovel story ID not set' };
        }
        return await postToWebnovel(chapterData, platformConfig, chapterNumber);
      case 'wattpad':
        if (!platformConfig.storyId) {
          console.error('Wattpad story ID not set');
          return { success: false, error: 'Wattpad story ID not set' };
        }
        return await postToWattpad(chapterData, platformConfig, chapterNumber);
      case 'inkitt':
        if (!platformConfig.storyId) {
          console.error('Inkitt story ID not set');
          return { success: false, error: 'Inkitt story ID not set' };
        }
        return await postToInkitt(chapterData, platformConfig, chapterNumber);
      default:
        console.error(`Unknown platform: ${platformName}`);
        return { success: false, error: `Unknown platform: ${platformName}` };
    }
  } catch (error) {
    console.error(`Error in postChapterToPlatform for ${platformName}:`, error);
    return { success: false, error: error.toString() };
  }
}

async function postToScribbleHub(chapterData, platformConfig, chapterNumber) {
  try {
    const storyId = platformConfig.storyId;
    console.log("ScribbleHub storyId:", storyId);
    
    if (!storyId) {
      console.error("ScribbleHub story ID is missing");
      return { success: false, error: 'ScribbleHub story ID is missing' };
    }
    
    const addChapterUrl = `https://www.scribblehub.com/addchapter/${storyId}/`;
    console.log(`Opening ScribbleHub add chapter page: ${addChapterUrl}`);
    
    const tab = await chrome.tabs.create({
      url: addChapterUrl,
      active: false
    });
    
    await new Promise(resolve => {
      const timeout = setTimeout(resolve, 5000);
      
      const checkInterval = setInterval(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            return {
              ready: document.readyState === 'complete',
              formReady: !!document.getElementById('chapter-title') ||
                       !!document.querySelector('input[name="chapterTitle"]') ||
                       !!document.querySelector('textarea[name="chapter"]'),
              editorReady: !!window.tinyMCE?.activeEditor ||
                         !!document.getElementById('edit_mycontent_chapter_ifr')?.contentDocument?.body ||
                         !!document.querySelector('textarea[name="chapter"]')
            };
          }
        }).then(result => {
          if (result && result[0] && result[0].result) {
            const {ready, formReady, editorReady} = result[0].result;
            if (ready && formReady && editorReady) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              resolve();
            }
          }
        }).catch(err => {
          console.error('Error checking page load:', err);
        });
      }, 300);
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const loginCheck = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const isLoggedIn = !document.body.textContent.includes('You need to be logged in') && 
                         !window.location.href.includes('/login');
        return { loggedIn: isLoggedIn };
      }
    });
    
    const isLoggedIn = loginCheck && loginCheck[0] && loginCheck[0].result && loginCheck[0].result.loggedIn;
    if (!isLoggedIn) {
      await chrome.tabs.remove(tab.id);
      return { success: false, error: 'Not logged in to ScribbleHub' };
    }
    
    // Format the chapter title according to user preference
    const formattedTitle = await formatChapterTitle(chapterData.title, chapterNumber);
    const chapterDataWithFormattedTitle = { ...chapterData, title: formattedTitle };
    
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (chapterData, number) => {
        try {
          console.log("Filling chapter form on ScribbleHub...");
          
          const chapterTitle = chapterData.title; // Title is already formatted
          
          console.log(`Setting chapter title: ${chapterTitle}`);
            
          const titleInput = document.getElementById('chapter-title');
          if (!titleInput) {
            console.error("Chapter title input not found");
            const altTitleInputs = [
              document.querySelector('input[name="chapterTitle"]'),
              document.querySelector('input[placeholder*="title" i]'),
              document.querySelector('input[type="text"]')
            ];
            
            for (const input of altTitleInputs) {
              if (input) {
                input.value = chapterTitle;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                console.log("Set title using alternative input");
                break;
              }
            }
          } else {
            titleInput.value = chapterTitle;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          
          
          let contentSet = false;
          
          if (window.tinyMCE) {
            console.log("TinyMCE detected, setting content");
            try {
              const editor = window.tinyMCE.activeEditor || window.tinyMCE.editors[0];
              
              if (editor) {
                editor.setContent(chapterData.content);
                console.log("Content set in TinyMCE editor");
                contentSet = true;
              } else {
                console.warn("TinyMCE editor not accessible, will try alternative methods");
              }
            } catch (e) {
              console.warn("Error setting content in TinyMCE:", e);
            }
          }
          
          if (!contentSet) {
            try {
              const editorIframe = document.getElementById('edit_mycontent_chapter_ifr');
              if (editorIframe && editorIframe.contentDocument) {
                console.log("Found editor iframe");
                const iframeDoc = editorIframe.contentDocument;
                const iframeBody = iframeDoc.body;
                
                if (iframeBody) {
                  iframeBody.innerHTML = chapterData.content;
                  console.log("Content set in editor iframe");
                  contentSet = true;
                }
              }
            } catch (e) {
              console.warn("Error setting content in iframe:", e);
            }
          }
          
          if (!contentSet) {
            try {
              const contentTextarea = document.querySelector('textarea[name="chapter"]');
              if (contentTextarea) {
                console.log("Found content textarea");
                contentTextarea.value = chapterData.content;
                contentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                contentSet = true;
              }
            } catch (e) {
              console.warn("Error setting content in textarea:", e);
            }
          }
          
          if (!contentSet) {
            try {
              const richTextEditors = document.querySelectorAll('.mce-content-body, [contenteditable="true"]');
              if (richTextEditors.length > 0) {
                console.log("Found rich text editor");
                richTextEditors[0].innerHTML = chapterData.content;
                contentSet = true;
              }
            } catch (e) {
              console.warn("Error setting content in rich text editor:", e);
            }
          }
          
          if (!contentSet) {
            try {
              const textareas = document.querySelectorAll('textarea');
              if (textareas.length > 0) {
                console.log("Found generic textarea");
                textareas[0].value = chapterData.content;
                textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
                contentSet = true;
              }
            } catch (e) {
              console.warn("Error setting content in generic textarea:", e);
            }
          }
          
          if (!contentSet) {
            console.error("No suitable content field found");
            return { success: false, error: "Couldn't find editor to set content" };
          }
          
          return { success: true, message: "Form filled, ready for publish" };
        } catch (error) {
          console.error("Error filling ScribbleHub form:", error);
          return { success: false, error: error.toString() };
        }
      },
      args: [chapterDataWithFormattedTitle, chapterNumber]
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const formFilled = result && result[0] && result[0].result && result[0].result.success;
    if (!formFilled) {
      const errorMsg = result && result[0] && result[0].result && result[0].result.error 
        ? result[0].result.error 
        : "Failed to fill the chapter form";
      
      await chrome.tabs.remove(tab.id);
      return { success: false, error: errorMsg };
    }
    
    const publishResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          console.log("Looking for publish button...");
          
          const publishButton = document.getElementById('pub_chp_btn');
          
          if (publishButton) {
            console.log("Found publish button by ID, clicking...");
            publishButton.click();
            return { success: true, message: "Publish button clicked" };
          }
          
          const buttonSelectors = [
            Array.from(document.querySelectorAll('button, input[type="submit"], a.button'))
              .filter(el => el.textContent.toLowerCase().includes('publish')),
            document.querySelector('.submit_btn, .publish_btn, .submitBtn, .publishBtn'),
            document.querySelector('form[action*="addchapter"] button[type="submit"]'),
            document.querySelector('[onclick*="publish"]')
          ];
          
          const buttons = buttonSelectors.flat().filter(Boolean);
          
          if (buttons.length > 0) {
            console.log(`Found publish button: ${buttons[0].outerHTML}`);
            buttons[0].click();
            return { success: true, message: "Publish button clicked" };
          }
          
          const form = document.querySelector('form[action*="addchapter"]');
          if (form) {
            console.log("No button found, submitting form directly");
            form.submit();
            return { success: true, message: "Form submitted directly" };
          }
          
          return { success: false, error: "Publish button not found" };
        } catch (error) {
          console.error("Error clicking publish button:", error);
          return { success: false, error: error.toString() };
        }
      }
    });
    
    const publishClicked = publishResult && publishResult[0] && publishResult[0].result && publishResult[0].result.success;
    
    await new Promise(resolve => {
      let attempts = 0;
      const maxAttempts = 20;
      
      const checkInterval = setInterval(async () => {
        attempts++;
        
        try {
          const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              const isSuccess = 
                window.location.href.includes('/series/') || 
                window.location.href.includes('/dashboard/') ||
                document.body.textContent.includes('successfully published') ||
                document.body.textContent.includes('Chapter Added');
              
              const errors = Array.from(document.querySelectorAll('.error, .alert-danger'))
                .map(el => el.textContent.trim())
                .filter(Boolean);
                
              const hasDuplicate = errors.some(msg => 
                msg.includes('duplicate') || msg.includes('already exists'));
                
              return { 
                done: isSuccess || hasDuplicate || errors.length > 0,
                success: isSuccess || hasDuplicate,
                errors: errors
              };
            }
          });
          
          if (result && result[0] && result[0].result) {
            const status = result[0].result;
            
            if (status.done || attempts >= maxAttempts) {
              clearInterval(checkInterval);
              resolve();
            }
          }
        } catch (error) {
          console.error('Error checking publish status:', error);
          if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            resolve();
          }
        }
      }, 500);
    });
    
    const checkResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          const isSuccess = 
            window.location.href.includes('/series/') || 
            window.location.href.includes('/dashboard/') ||
            
            document.body.textContent.includes('successfully published') ||
            document.body.textContent.includes('Chapter Added') ||
            document.body.textContent.includes('successfully added') ||
            document.body.textContent.includes('Chapter has been published') ||
            
            document.querySelectorAll('.dashboard, .my-series, .story-list').length > 0 ||
            
            document.querySelectorAll('.story-header, .fic_title').length > 0;
          
          const stillOnAddPage = window.location.href.includes('/addchapter/');
          const hasErrors = document.querySelectorAll('.error, .alert-danger, .alert-error').length > 0;
          
          const errorMessages = Array.from(document.querySelectorAll('.error, .alert-danger, .alert-error'))
            .map(el => el.textContent.trim())
            .filter(Boolean);
            
          const hasDuplicateWarning = errorMessages.some(msg => 
            msg.includes('duplicate') || 
            msg.includes('already exists') || 
            msg.includes('same title')
          );
          
          return { 
            success: isSuccess || (stillOnAddPage && !hasErrors) || hasDuplicateWarning,
            url: window.location.href,
            errorMessages: errorMessages,
            duplicate: hasDuplicateWarning
          };
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      }
    });
    
    if (formFilled && publishClicked) {
      const message = checkResult && checkResult[0] && checkResult[0].result && checkResult[0].result.duplicate ? 
        'Chapter published to ScribbleHub (duplicate detected but accepted)' :
        'Chapter successfully published to ScribbleHub';
      
      try {
        await chrome.tabs.remove(tab.id);
      } catch (closeError) {
        console.error('Error closing tab:', closeError);
      }
      
      return { success: true, message: message };
    } else if (formFilled) {
      return { success: false, error: 'Form filled but failed to click publish button' };
    } else {
      try {
        await chrome.tabs.remove(tab.id);
      } catch (closeError) {
        console.error('Error closing tab:', closeError);
      }
      return { success: false, error: result && result[0] && result[0].result ? result[0].result.error : 'Unknown error' };
    }
  } catch (error) {
    console.error('Error posting to ScribbleHub:', error);
    return { success: false, error: error.toString() };
  }
}

async function retryFailedChapters(batchSize = 1) {
  try {
    console.log(`Starting to retry ${failedChapters.length} failed chapters with batch size: ${batchSize}`);
    
    const syncStatus = await chrome.storage.local.get('isSyncing');
    if (syncStatus.isSyncing) {
      throw new Error("Sync already in progress. Please stop it first.");
    }
    
    if (failedChapters.length === 0) {
      throw new Error("No failed chapters to retry");
    }
    
    const data = await chrome.storage.local.get(['platforms', 'queueConfig']);
    const targetPlatforms = data.queueConfig?.targetPlatforms || [];
    
    if (targetPlatforms.length === 0) {
      throw new Error("No target platforms found. Please scan chapters first.");
    }
    
    await chrome.storage.local.set({ 
      isSyncing: true,
      scanningPhase: false,
      postingPhase: true,
      queueConfig: {
        ...data.queueConfig,
        completedChapters: data.queueConfig?.completedChapters || 0,
        failedChapters: failedChapters.length,
        totalChapters: (data.queueConfig?.totalChapters || 0)
      }
    });
    
    postingInProgress = true;
    
    let completedCount = 0;
    let stillFailedCount = 0;
    let newLogEntries = [];
    let chaptersToRetry = [...failedChapters];
    failedChapters = [];
    
    const needsReordering = new Set();
    
    // No batch size restrictions - allow up to maximum of 10  
    if (batchSize > 10) {
      batchSize = 10;
    }
    
    batchSize = Math.max(1, Math.min(5, batchSize || 1));
    console.log(`Using batch size: ${batchSize} for retrying chapters`);
    
    
    for (let i = 0; i < chaptersToRetry.length; i += batchSize) {
      const batch = chaptersToRetry.slice(i, i + batchSize);
      
      const batchPromises = batch.map(chapter =>
        postChapterToPlatforms(chapter, targetPlatforms, data.platforms)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      
      batchResults.forEach((result, index) => {
        const chapter = batch[index];
        
        if (result.status === 'fulfilled') {
          const postResult = result.value;
          newLogEntries.push(postResult.logEntry);
          
          if (postResult.success) {
            completedCount++;
          } else {
            stillFailedCount++;
            failedChapters.push(chapter);
          }
          
          if (postResult.needsReordering) {
            postResult.needsReordering.forEach(platform => needsReordering.add(platform));
          }
        } else {
          stillFailedCount++;
          failedChapters.push(chapter);
          newLogEntries.push({
            timestamp: new Date().toISOString(),
            chapterNumber: chapter.number,
            chapterTitle: chapter.title || `Chapter ${chapter.number}`,
            results: [{
              platform: 'system',
              success: false,
              message: `Error: ${result.reason}`
            }]
          });
        }
      });
      
      const totalCompleted = (data.queueConfig?.completedChapters || 0) + completedCount;
      
      await chrome.storage.local.set({
        queueConfig: {
          ...data.queueConfig,
          completedChapters: totalCompleted,
          failedChapters: stillFailedCount
        }
      });
      
      const currentSyncStatus = await chrome.storage.local.get('isSyncing');
      if (!currentSyncStatus.isSyncing) {
        console.log("Retry cancelled");
        postingInProgress = false;
        return { success: false, message: "Retry cancelled" };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`Retry complete. ${completedCount} chapters posted successfully, ${stillFailedCount} still failed.`);
    
    if (needsReordering.size > 0) {
      console.log(`Platforms needing reordering: ${Array.from(needsReordering).join(', ')}`);
      
      if (needsReordering.has('scribblehub')) {
        const scribbleHubConfig = data.platforms.scribblehub;
        if (scribbleHubConfig && scribbleHubConfig.storyId) {
          try {
            console.log(`Reordering ScribbleHub chapters for story ID: ${scribbleHubConfig.storyId}`);
          } catch (reorderError) {
            console.error("Error reordering ScribbleHub chapters:", reorderError);
          }
        }
      }
    }
    
    postingInProgress = false;
    
    await chrome.storage.local.set({ 
      isSyncing: false,
      postingPhase: false
    });
    
    return { 
      success: true, 
      completedCount, 
      failedCount: stillFailedCount,
      message: "Retry complete"
    };
    
  } catch (error) {
    console.error("Error in retry phase:", error);
    postingInProgress = false;
    
    await chrome.storage.local.set({ 
      isSyncing: false,
      postingPhase: false
    });
    
    return { success: false, error: error.toString() };
  }
}

async function postToScribbleHubWithWorkaround(chapterData, platformConfig, chapterNumber) {
  try {
    const storyId = platformConfig.storyId;
    console.log("ScribbleHub storyId for workaround:", storyId);
    
    if (!storyId) {
      return { success: false, error: 'ScribbleHub story ID is missing' };
    }
    
    const addChapterUrl = `https://www.scribblehub.com/addchapter/${storyId}/`;
    console.log(`Opening ScribbleHub add chapter page (workaround): ${addChapterUrl}`);
    
    const tab = await chrome.tabs.create({
      url: addChapterUrl,
      active: false
    });
    
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    const loginCheck = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const isLoggedIn = !document.body.textContent.includes('You need to be logged in') && 
                         !window.location.href.includes('/login');
        return { loggedIn: isLoggedIn };
      }
    });
    
    const isLoggedIn = loginCheck && loginCheck[0] && loginCheck[0].result && loginCheck[0].result.loggedIn;
    if (!isLoggedIn) {
      await chrome.tabs.remove(tab.id);
      return { success: false, error: 'Not logged in to ScribbleHub' };
    }
    
    // Format the chapter title according to user preference
    const formattedTitle = await formatChapterTitle(chapterData.title, chapterNumber);
    const chapterDataWithFormattedTitle = { ...chapterData, title: formattedTitle };
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (chapterData, number) => {
        try {
          console.log("Filling chapter form on ScribbleHub (workaround)...");
          
          const chapterTitle = chapterData.title; // Title is already formatted
          
          console.log(`Setting chapter title: ${chapterTitle}`);
          
          const titleInput = document.getElementById('chapter-title');
          if (titleInput) {
            titleInput.value = chapterTitle;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            const altTitleInputs = [
              document.querySelector('input[name="chapterTitle"]'),
              document.querySelector('input[placeholder*="title" i]'),
              document.querySelector('input[type="text"]')
            ];
            
            for (const input of altTitleInputs) {
              if (input) {
                input.value = chapterTitle;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                break;
              }
            }
          }
          
          if (window.tinyMCE) {
            const editor = window.tinyMCE.activeEditor || window.tinyMCE.editors[0];
            if (editor) {
              editor.setContent(chapterData.content);
            }
          } else {
            const editorIframe = document.getElementById('edit_mycontent_chapter_ifr');
            if (editorIframe && editorIframe.contentDocument) {
              const iframeBody = editorIframe.contentDocument.body;
              if (iframeBody) {
                iframeBody.innerHTML = chapterData.content;
              }
            } else {
              const contentTextarea = document.querySelector('textarea[name="chapter"]');
              if (contentTextarea) {
                contentTextarea.value = chapterData.content;
                contentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          }
          
          return { success: true };
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      },
      args: [chapterDataWithFormattedTitle, chapterNumber]
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    let updateResult = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      updateResult = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (chapterData, retryAttempt) => {
          try {
            console.log(`Setting content attempt #${retryAttempt+1}`);
            let contentSet = false;
            
            if (window.tinyMCE) {
              try {
                const editor = window.tinyMCE.activeEditor || window.tinyMCE.editors[0];
                if (editor) {
                  editor.setContent(chapterData.content);
                  console.log("Content set in TinyMCE editor");
                  contentSet = true;
                }
              } catch (e) {
                console.warn("Error setting content in TinyMCE:", e);
              }
            }
            
            if (!contentSet) {
              try {
                const editorIframe = document.getElementById('edit_mycontent_chapter_ifr');
                if (editorIframe && editorIframe.contentDocument) {
                  const iframeBody = editorIframe.contentDocument.body;
                  if (iframeBody) {
                    iframeBody.innerHTML = chapterData.content;
                    console.log("Content set in editor iframe");
                    contentSet = true;
                  }
                }
              } catch (e) {
                console.warn("Error setting content in iframe:", e);
              }
            }
            
            if (!contentSet) {
              try {
                const contentTextarea = document.querySelector('textarea[name="chapter"]');
                if (contentTextarea) {
                  contentTextarea.value = chapterData.content;
                  contentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                  console.log("Content set in textarea");
                  contentSet = true;
                }
              } catch (e) {
                console.warn("Error setting content in textarea:", e);
              }
            }
            
            if (!contentSet) {
              try {
                const richTextEditors = document.querySelectorAll('.mce-content-body, [contenteditable="true"]');
                if (richTextEditors.length > 0) {
                  richTextEditors[0].innerHTML = chapterData.content;
                  console.log("Content set in rich text editor");
                  contentSet = true;
                }
              } catch (e) {
                console.warn("Error setting content in rich text editor:", e);
              }
            }
            
            if (!contentSet) {
              try {
                const textareas = document.querySelectorAll('textarea');
                if (textareas.length > 0) {
                  textareas[0].value = chapterData.content;
                  textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
                  console.log("Content set in generic textarea");
                  contentSet = true;
                }
              } catch (e) {
                console.warn("Error setting content in generic textarea:", e);
              }
            }
            
            if (contentSet) {
              return { success: true };
            } else {
              return { success: false, error: "Could not update content" };
            }
          } catch (error) {
            return { success: false, error: error.toString() };
          }
        },
        args: [chapterDataWithFormattedTitle, retryCount]
      });
      
      if (updateResult && updateResult[0] && updateResult[0].result && updateResult[0].result.success) {
        break;
      }
      
      console.log(`Content setting attempt ${retryCount+1} failed, retrying...`);
      retryCount++;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const publishResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          console.log("Looking for publish button...");
          
          let buttonFound = false;
          
          const selectors = [
            '#pub_chp_btn',
            'button[type="submit"]',
            'input[type="submit"]',
            '.submit_btn',
            '.publish_btn',
            '[onclick*="publish"]',
            '[onclick*="submit"]',
            'button.btn-primary',
            'input.btn-primary'
          ];
          
          for (const selector of selectors) {
            try {
              const button = document.querySelector(selector);
              if (button) {
                console.log(`Found button with selector ${selector}, clicking...`);
                button.click();
                buttonFound = true;
                return { success: true, message: `Publish button clicked using selector: ${selector}` };
              }
            } catch (e) {
              console.warn(`Error with selector ${selector}:`, e);
            }
          }
          
          if (!buttonFound) {
            try {
              const allButtons = document.querySelectorAll('button, input[type="submit"], a.button');
              for (const button of allButtons) {
                const buttonText = (button.textContent || button.value || '').toLowerCase();
                if (buttonText.includes('publish') || buttonText.includes('submit') || buttonText.includes('save')) {
                  console.log(`Found button by text: ${buttonText}, clicking...`);
                  button.click();
                  buttonFound = true;
                  return { success: true, message: "Publish button found by text and clicked" };
                }
              }
            } catch (e) {
              console.warn("Error finding button by text:", e);
            }
          }
          
          const form = document.querySelector('form[action*="addchapter"]');
          if (form) {
            form.submit();
            return { success: true, message: "Form submitted directly" };
          }
          
          return { success: false, error: "Publish button not found" };
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    const checkResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          const isSuccess = 
            window.location.href.includes('/series/') || 
            window.location.href.includes('/dashboard/') ||
            document.body.textContent.includes('successfully published') ||
            document.body.textContent.includes('Chapter Added') ||
            document.body.textContent.includes('successfully added') ||
            document.body.textContent.includes('Chapter has been published');
          
          const hasDuplicateWarning = document.body.textContent.includes('duplicate') || 
                                    document.body.textContent.includes('already exists');
          
          return { 
            success: isSuccess || hasDuplicateWarning,
            url: window.location.href,
            duplicate: hasDuplicateWarning
          };
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      }
    });
    
    try {
      await chrome.tabs.remove(tab.id);
    } catch (err) {
      console.warn("Error closing tab:", err);
    }
    
    const checkStatus = checkResult && checkResult[0] && checkResult[0].result;
    
    if (checkStatus && checkStatus.success) {
      return { success: true, message: checkStatus.duplicate ? 
        'Chapter published to ScribbleHub (duplicate detected)' : 
        'Chapter successfully published to ScribbleHub' };
    } else {
      return { success: false, error: 'Failed to publish chapter to ScribbleHub' };
    }
    
  } catch (error) {
    console.error('Error in workaround posting to ScribbleHub:', error);
    return { success: false, error: error.toString() };
  }
}

async function postToFanFiction(chapterData, platformConfig, chapterNumber) {
  let docManagerTab = null;
  let storyTab = null;
  
  try {
    const storyId = platformConfig.storyId;
    console.log("FanFiction.net storyId:", storyId);
    
    if (!storyId) {
      console.error("FanFiction.net story ID is missing");
      return { success: false, error: 'FanFiction.net story ID is missing' };
    }
    
    // Format the chapter title according to user preference
    const chapterTitle = await formatChapterTitle(chapterData.title, chapterNumber);
    const contentHtml = chapterData.content;
    
    console.log("Opening FanFiction.net Doc Manager...");
    docManagerTab = await chrome.tabs.create({
      url: "https://www.fanfiction.net/docs/docs.php",
      active: false
    });
    
    await new Promise(resolve => {
      const timeout = setTimeout(resolve, 5000);
      const checkInterval = setInterval(() => {
        chrome.scripting.executeScript({
          target: { tabId: docManagerTab.id },
          function: () => {
            return {
              ready: document.readyState === 'complete',
              hasCopyPasteRadio: !!document.querySelector('#input_method_web, input[value="web"], input[onclick*="tinymce"]'),
              hasDocForm: !!document.querySelector('form'),
              pageTitle: document.title,
              url: window.location.href
            };
          }
        }).then(result => {
          if (result && result[0] && result[0].result) {
            const {ready, hasCopyPasteRadio, hasDocForm, pageTitle, url} = result[0].result;
            console.log(`Page loaded: ${pageTitle} at ${url}`);
            if (ready && (hasDocForm || hasCopyPasteRadio || url.includes("docs.php"))) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              resolve();
            }
          }
        }).catch(err => {
          console.error('Error checking Doc Manager page load:', err);
        });
      }, 500);
    });
    
    const loginCheck = await chrome.scripting.executeScript({
      target: { tabId: docManagerTab.id },
      function: () => {
        const notLoggedIn = document.body.textContent.includes('Please login to use this feature') || 
                          window.location.href.includes('/login.php');
        return { 
          loggedIn: !notLoggedIn,
          url: window.location.href,
          title: document.title
        };
      }
    });
    
    console.log("Login check:", loginCheck[0].result);
    
    const isLoggedIn = loginCheck && loginCheck[0] && loginCheck[0].result && loginCheck[0].result.loggedIn;
    if (!isLoggedIn) {
      await chrome.tabs.remove(docManagerTab.id);
      return { success: false, error: 'Not logged in to FanFiction.net' };
    }
    
    console.log("Selecting Copy-N-Paste method...");
    const selectMethodResult = await chrome.scripting.executeScript({
      target: { tabId: docManagerTab.id },
      function: () => {
        try {
          console.log("Document content:", document.body.innerHTML.substring(0, 200) + "...");
          
          const copyPasteRadioSelectors = [
            '#input_method_web',
            'input[name="method"][value="web"]',
            'input[onclick*="tinymce"]',
            'input[type="radio"]:nth-of-type(2)'
          ];
          
          let copyPasteRadio = null;
          for (const selector of copyPasteRadioSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              copyPasteRadio = element;
              console.log(`Found radio button with selector: ${selector}`);
              break;
            }
          }
          
          if (copyPasteRadio) {
            copyPasteRadio.checked = true;
            copyPasteRadio.dispatchEvent(new Event('change', { bubbles: true }));
            copyPasteRadio.click();
            
            if (copyPasteRadio.hasAttribute('onclick')) {
              const onclickAttr = copyPasteRadio.getAttribute('onclick');
              console.log(`Found onclick attribute: ${onclickAttr}`);
              
              if (onclickAttr.includes('activate_tinymce')) {
                try {
                  if (typeof window.activate_tinymce === 'function') {
                    window.activate_tinymce();
                    console.log("Called activate_tinymce()");
                  }
                } catch (e) {
                  console.warn("Failed to call activate_tinymce:", e);
                }
              }
            }
            
            return { success: true };
          } else {
            console.log("Available radio buttons:", 
              Array.from(document.querySelectorAll('input[type="radio"]'))
                .map(r => `${r.id || 'unnamed'}: ${r.value || 'no-value'}`)
                .join(', ')
            );
            return { success: false, error: "Copy-N-Paste option not found" };
          }
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      }
    });
    
    console.log("Select method result:", selectMethodResult[0].result);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Filling document title...");
    await chrome.scripting.executeScript({
      target: { tabId: docManagerTab.id },
      function: (title) => {
        try {
          const labelSelectors = [
            'input[name="title"]',
            'input[placeholder*="label"]',
            'input[placeholder*="title"]',
            'input[type="text"]'
          ];
          
          let labelInput = null;
          for (const selector of labelSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              labelInput = element;
              console.log(`Found title input with selector: ${selector}`);
              break;
            }
          }
          
          if (labelInput) {
            labelInput.value = title;
            labelInput.dispatchEvent(new Event('input', { bubbles: true }));
            return { success: true };
          } else {
            console.log("Available inputs:", 
              Array.from(document.querySelectorAll('input'))
                .map(i => `${i.name || 'unnamed'}: ${i.type}`)
                .join(', ')
            );
            return { success: false, error: "Document title input not found" };
          }
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      },
      args: [chapterTitle]
    });
    
    console.log("Setting content in TinyMCE editor...");
    const setContentResult = await chrome.scripting.executeScript({
      target: { tabId: docManagerTab.id },
      function: (htmlContent) => {
        try {
          let processedContent = "";
          
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            const paragraphs = Array.from(doc.querySelectorAll('p'));
            
            if (paragraphs.length > 0) {
              processedContent = paragraphs
                .map(p => p.textContent.trim())
                .filter(text => text.length > 0)
                .join('\n\n');
            } else {
              processedContent = htmlContent
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>\s*<p>/gi, '\n\n')
                .replace(/<[^>]*>/g, '');
            }
            
            console.log("Processed paragraphs:", processedContent.split('\n\n').length);
          } catch (parseError) {
            console.error("Error processing HTML:", parseError);
            processedContent = htmlContent.replace(/<[^>]*>/g, '');
          }
          
          console.log("Setting content with paragraphs:", processedContent.substring(0, 100) + "...");
          
          if (window.tinyMCE && window.tinyMCE.activeEditor) {
            console.log("Using TinyMCE API to set content");
            
            const formattedContent = processedContent.split('\n\n')
              .map(para => para.trim())
              .filter(para => para)
              .map(para => `<p>${para}</p>`)
              .join('');
            
            window.tinyMCE.activeEditor.setContent(formattedContent);
            return { success: true, method: "tinyMCE API" };
          }
          
          const editorIframe = document.querySelector('#webcontent_ifr');
          if (editorIframe && editorIframe.contentDocument) {
            console.log("Using iframe body directly");
            const iframeBody = editorIframe.contentDocument.body;
            if (iframeBody) {
              iframeBody.innerHTML = '';
              
              const paragraphs = processedContent.split('\n\n');
              
              paragraphs.forEach(paragraph => {
                if (paragraph.trim()) {
                  const p = document.createElement('p');
                  p.textContent = paragraph.trim();
                  iframeBody.appendChild(p);
                }
              });
              
              return { success: true, method: "iframe paragraphs", count: paragraphs.length };
            }
          }
          
          const iframes = document.querySelectorAll('iframe');
          for (const iframe of iframes) {
            try {
              if (iframe.contentDocument && iframe.contentDocument.body) {
                console.log("Found editor iframe:", iframe.id || "unnamed");
                
                const iframeBody = iframe.contentDocument.body;
                iframeBody.innerHTML = '';
                
                const paragraphs = processedContent.split('\n\n');
                
                paragraphs.forEach(paragraph => {
                  if (paragraph.trim()) {
                    const p = document.createElement('p');
                    p.textContent = paragraph.trim();
                    iframeBody.appendChild(p);
                  }
                });
                
                return { success: true, method: "other iframe", count: paragraphs.length };
              }
            } catch (e) {
            }
          }
          
          const textarea = document.querySelector('textarea[name="content"], textarea#content, textarea');
          if (textarea) {
            console.log("Using textarea for content");
            textarea.value = processedContent;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            return { success: true, method: "textarea" };
          }
          
          try {
            console.log("Trying window.content fallback");
            if (typeof window.content !== 'undefined') {
              window.content = processedContent;
              return { success: true, method: "window.content fallback" };
            }
          } catch (e) {
            console.warn("Window.content fallback failed:", e);
          }
          
          console.error("Unable to find editor to set content");
          return { 
            success: false, 
            error: "Could not find TinyMCE editor or textarea",
            details: {
              hasTinyMCE: !!window.tinyMCE,
              hasIframe: !!document.querySelector('iframe'),
              iframeCount: document.querySelectorAll('iframe').length,
              hasTextarea: !!document.querySelector('textarea')
            }
          };
        } catch (error) {
          console.error("Error setting content:", error);
          return { success: false, error: error.toString() };
        }
      },
      args: [contentHtml]
    });
    
    console.log("Content setting result:", setContentResult[0].result);
    
    console.log("Submitting document...");
    const submitResult = await chrome.scripting.executeScript({
      target: { tabId: docManagerTab.id },
      function: () => {
        try {
          const submitSelectors = [
            'button[type="submit"]', 
            'input[type="submit"]',
            'input.btn-primary',
            'button.btn-primary',
            'input[value="Submit Document"]',
            'button.btn',
            'input.btn',
            '#save_document'
          ];
          
          let submitButton = null;
          for (const selector of submitSelectors) {
            try {
              const elements = document.querySelectorAll(selector);
              if (elements.length > 0) {
                submitButton = elements[0];
                console.log(`Found submit button with selector: ${selector}`);
                break;
              }
            } catch (e) {
            }
          }
          
          if (!submitButton) {
            const buttons = document.querySelectorAll('button, input[type="submit"]');
            for (const btn of buttons) {
              const btnText = (btn.textContent || btn.value || '').toLowerCase();
              if (btnText.includes('submit') || btnText.includes('save')) {
                submitButton = btn;
                console.log(`Found submit button by text: ${btnText}`);
                break;
              }
            }
          }
          
          if (submitButton) {
            console.log("Found submit button, clicking:", submitButton.outerHTML);
            submitButton.click();
            return { success: true, message: "Submit button clicked" };
          } else {
            const form = document.querySelector('form');
            if (form) {
              console.log("Submitting form directly");
              form.submit();
              return { success: true, message: "Form submitted directly" };
            } else {
              console.log("Available buttons:", 
                Array.from(document.querySelectorAll('button, input[type="submit"]'))
                  .map(b => `${b.id || 'unnamed'}: ${b.textContent || b.value || 'no-text'}`)
                  .join(', ')
              );
              return { success: false, error: "Submit button and form not found" };
            }
          }
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      }
    });
    
    console.log("Submit result:", submitResult[0].result);
    
    let docSubmissionResult;
    let retryCount = 0;
    const maxRetries = 3;
    
    do {
      docSubmissionResult = await new Promise(resolve => {
        const timeout = setTimeout(() => resolve({ timedOut: true }), 10000);
        const checkInterval = setInterval(() => {
          chrome.scripting.executeScript({
            target: { tabId: docManagerTab.id },
            function: () => {
              const isDocList = !!document.querySelector('table.table-striped') ||
                             document.body.textContent.includes('Document Manager');
              
              const successMsg = document.body.textContent.includes('Document saved successfully') ||
                               document.body.textContent.includes('New document saved.') ||
                               document.querySelector('.panel_success');
              
              const errorMsg = document.querySelector('.panel_error') ||
                             document.body.textContent.includes('Processing Error') ||
                             document.body.textContent.includes('unable to process the document');
              
              return {
                ready: document.readyState === 'complete',
                isDocList: isDocList,
                success: successMsg,
                error: errorMsg,
                url: window.location.href,
                title: document.title
              };
            }
          }).then(result => {
            if (result && result[0] && result[0].result) {
              const {ready, isDocList, success, error, url, title} = result[0].result;
              console.log(`Doc submission check: ready=${ready}, isDocList=${isDocList}, success=${success}, error=${error}, url=${url}, title=${title}`);
              
              if (ready && (isDocList || url.includes('docs.php') || success || error)) {
                clearTimeout(timeout);
                clearInterval(checkInterval);
                resolve({ success, error, isDocList, url, title });
              }
            }
          }).catch(err => {
            console.error('Error checking Doc submission:', err);
          });
        }, 500);
      });
      
      console.log("Document submission result:", docSubmissionResult);
      
      // If we got an error and haven't exceeded max retries, try again
      if (docSubmissionResult.error && retryCount < maxRetries) {
        retryCount++;
        console.log(`Document submission failed with processing error. Retry attempt ${retryCount}/${maxRetries}`);
        
        // Click submit button again
        const retrySubmitResult = await chrome.scripting.executeScript({
          target: { tabId: docManagerTab.id },
          function: () => {
            try {
              const submitSelectors = [
                'button[type="submit"]', 
                'input[type="submit"]',
                'input.btn-primary',
                'button.btn-primary',
                'input[value="Submit Document"]',
                '.submit-btn',
                '.btn-submit',
                '#save_document'
              ];
              
              let submitButton = null;
              for (const selector of submitSelectors) {
                try {
                  const elements = document.querySelectorAll(selector);
                  if (elements.length > 0) {
                    submitButton = elements[0];
                    console.log(`Found submit button for retry with selector: ${selector}`);
                    break;
                  }
                } catch (e) {
                  // Continue to next selector
                }
              }
              
              if (!submitButton) {
                const buttons = document.querySelectorAll('button, input[type="submit"]');
                for (const btn of buttons) {
                  const btnText = (btn.textContent || btn.value || '').toLowerCase();
                  if (btnText.includes('submit') || btnText.includes('save')) {
                    submitButton = btn;
                    console.log(`Found submit button for retry by text: ${btnText}`);
                    break;
                  }
                }
              }
              
              if (submitButton) {
                console.log("Retrying document submission...");
                submitButton.click();
                return { success: true, message: "Retry submit button clicked" };
              } else {
                return { success: false, error: "Submit button not found for retry" };
              }
            } catch (error) {
              console.error("Error during retry submit:", error);
              return { success: false, error: error.toString() };
            }
          }
        });
        
        console.log("Retry submit result:", retrySubmitResult[0]?.result);
        
        // Wait a bit before checking result again
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } while (docSubmissionResult.error && retryCount < maxRetries);
    
    console.log(`Final document submission result after ${retryCount} retries:`, docSubmissionResult);
    
    // If we still have an error after all retries, fail the operation
    if (docSubmissionResult.error) {
      await chrome.tabs.remove(docManagerTab.id);
      return { 
        success: false, 
        error: `Document submission failed after ${retryCount} retries: Processing error - FanFiction.net was unable to process the document. This can happen due to formatting issues or server problems.` 
      };
    }
    
    
    console.log(`Opening story edit page for story ID ${storyId}...`);
    storyTab = await chrome.tabs.create({
      url: `https://www.fanfiction.net/story/story_edit_content.php?storyid=${storyId}`,
      active: false
    });
    
    const storyPageResult = await new Promise(resolve => {
      const timeout = setTimeout(() => resolve({ timedOut: true }), 8000);
      const checkInterval = setInterval(() => {
        chrome.scripting.executeScript({
          target: { tabId: storyTab.id },
          function: () => {
            const hasNewChapterLink = !!document.querySelector('a[href="#"]:is([onclick*="newchapter"],[onclick*="area_newchapter"])') || 
                                  !!document.querySelector('a:contains("Post New Chapter")');
            return {
              ready: document.readyState === 'complete',
              hasNewChapterLink: hasNewChapterLink,
              url: window.location.href,
              title: document.title
            };
          }
        }).then(result => {
          if (result && result[0] && result[0].result) {
            const {ready, hasNewChapterLink, url, title} = result[0].result;
            console.log(`Story page check: ready=${ready}, hasNewChapterLink=${hasNewChapterLink}, url=${url}, title=${title}`);
            
            if (ready && (hasNewChapterLink || url.includes('story_edit_content.php'))) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              resolve({ hasNewChapterLink, url, title });
            }
          }
        }).catch(err => {
          console.error('Error checking story edit page load:', err);
        });
      }, 500);
    });
    
    console.log("Story page result:", storyPageResult);
    
    if (storyPageResult.timedOut) {
      console.warn("Story page load timed out, but continuing anyway");
    }
    
    console.log("Opening new chapter form...");
    const newChapterResult = await chrome.scripting.executeScript({
      target: { tabId: storyTab.id },
      function: () => {
        try {
          console.log("Document content:", document.body.innerHTML.substring(0, 200) + "...");
          
          const newChapterLinks = [
            document.querySelector('a[onclick*="newchapter"]'),
            document.querySelector('a[onclick*="area_newchapter"]')
          ].filter(Boolean);
          
          if (newChapterLinks.length === 0) {
            const allLinks = document.querySelectorAll('a');
            console.log("All links:", Array.from(allLinks).map(l => `${l.textContent}: ${l.href || 'no-href'}`).join(', '));
            
            for (const link of allLinks) {
              if (link.textContent && link.textContent.trim().toLowerCase().includes('post new chapter')) {
                newChapterLinks.push(link);
                console.log("Found link by text content:", link.textContent);
                break;
              }
            }
          }
          
          if (newChapterLinks.length > 0) {
            console.log("Clicking new chapter link:", newChapterLinks[0].outerHTML);
            newChapterLinks[0].click();
            return { success: true };
          }
          
          return { 
            success: false, 
            error: "Post New Chapter link not found",
            availableLinks: Array.from(document.querySelectorAll('a')).map(l => l.textContent).join(', ')
          };
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      }
    });
    
    console.log("New chapter result:", newChapterResult[0].result);
    
    const chapterFormResult = await new Promise(resolve => {
      const timeout = setTimeout(() => resolve({ timedOut: true }), 8000);
      const checkInterval = setInterval(() => {
        chrome.scripting.executeScript({
          target: { tabId: storyTab.id },
          function: () => {
            const hasChapterTitleInput = !!document.querySelector('input[name="chaptertitle"]');
            const hasSelectDocDropdown = !!document.querySelector('select[name="docid"]');
            return {
              ready: document.readyState === 'complete',
              formReady: hasChapterTitleInput && hasSelectDocDropdown,
              hasTitle: hasChapterTitleInput,
              hasDropdown: hasSelectDocDropdown,
              url: window.location.href
            };
          }
        }).then(result => {
          if (result && result[0] && result[0].result) {
            const {ready, formReady, hasTitle, hasDropdown, url} = result[0].result;
            console.log(`Chapter form check: ready=${ready}, formReady=${formReady}, hasTitle=${hasTitle}, hasDropdown=${hasDropdown}, url=${url}`);
            
            if (ready && (formReady || url.includes("chapter_add"))) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              resolve({ formReady, hasTitle, hasDropdown, url });
            }
          }
        }).catch(err => {
          console.error('Error checking new chapter form:', err);
        });
      }, 500);
    });
    
    console.log("Chapter form result:", chapterFormResult);
    
    if (chapterFormResult.timedOut) {
      console.warn("Chapter form load timed out, but continuing anyway");
    }
    
    console.log("Filling and submitting new chapter form...");
    const submitChapterResult = await chrome.scripting.executeScript({
      target: { tabId: storyTab.id },
      function: (chapterTitle) => {
        try {
          console.log("Document content:", document.body.innerHTML.substring(0, 200) + "...");
          
          // Function to truncate title for FanFiction.net limits
          function truncateTitleForFanFiction(title) {
            const maxLength = 32; // FanFiction.net's chapter title character limit
            if (title.length <= maxLength) {
              return title;
            }
            
            // Try to truncate at a word boundary
            let truncated = title.substring(0, maxLength);
            const lastSpaceIndex = truncated.lastIndexOf(' ');
            
            if (lastSpaceIndex > maxLength * 0.7) { // If we can keep at least 70% of the length
              truncated = truncated.substring(0, lastSpaceIndex);
            }
            
            console.log(`Title truncated from "${title}" to "${truncated}" (${truncated.length} chars)`);
            return truncated;
          }
          
          const titleInput = document.querySelector('input[name="chaptertitle"]');
          if (titleInput) {
            console.log("Found chapter title input:", titleInput.outerHTML);
            
            // Truncate title if needed for FanFiction.net
            const truncatedTitle = truncateTitleForFanFiction(chapterTitle);
            
            titleInput.value = '';
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            titleInput.value = truncatedTitle;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            console.log("All inputs:", Array.from(document.querySelectorAll('input')).map(i => `${i.name}: ${i.type}`).join(', '));
            return { success: false, error: "Chapter title input not found" };
          }
          
const docSelect = document.querySelector('select[name="docid"]');
if (!docSelect) {
  console.log("All selects:", Array.from(document.querySelectorAll('select')).map(s => s.name).join(', '));
  return { success: false, error: "Document select dropdown not found" };
}

console.log("Found doc select:", docSelect.outerHTML);
console.log("Options:", Array.from(docSelect.options).map(o => `${o.value}: ${o.textContent}`).join(', '));

const docOptions = Array.from(docSelect.options);

// Function to normalize text for comparison (removes escape characters and normalizes)
function normalizeForComparison(text) {
  return text.toLowerCase()
    .trim()
    // Remove various escape patterns that FanFiction.net might add
    .replace(/\\+'/g, "'")       // \' or \\' -> '
    .replace(/\\+"/g, '"')       // \" or \\" -> "  
    .replace(/\\+/g, '')         // Remove remaining backslashes
    .replace(/\s+/g, ' ')        // Normalize spaces
    .trim();
}

const normalizedChapterTitle = normalizeForComparison(chapterTitle);
console.log("Looking for document matching:", normalizedChapterTitle);
console.log("Original chapter title:", chapterTitle);

let foundMatchingDoc = false;

for (let i = 1; i < docOptions.length; i++) {
  const optionText = docOptions[i].textContent;
  const normalizedOptionText = normalizeForComparison(optionText);
  console.log(`Checking option ${i}: "${optionText}" -> normalized: "${normalizedOptionText}"`);
  
  // Try exact normalized match first
  if (normalizedOptionText === normalizedChapterTitle) {
    console.log(`Found exact normalized match at index ${i}: ${optionText}`);
    docSelect.value = docOptions[i].value;
    docSelect.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("Selected option:", docOptions[i].textContent);
    foundMatchingDoc = true;
    break;
  }
  
  // Try substring match with normalized text
  if (normalizedOptionText.includes(normalizedChapterTitle)) {
    console.log(`Found substring match at index ${i}: ${optionText}`);
    docSelect.value = docOptions[i].value;
    docSelect.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("Selected option:", docOptions[i].textContent);
    foundMatchingDoc = true;
    break;
  }
  
  const chapterNumMatch = normalizedChapterTitle.match(/chapter\s+(\d+)/i);
  if (chapterNumMatch) {
    const chapterNum = chapterNumMatch[1];
    if (normalizedOptionText.includes(`chapter ${chapterNum}`) || 
        normalizedOptionText.includes(`ch ${chapterNum}`) ||
        normalizedOptionText.includes(`ch. ${chapterNum}`)) {
      console.log(`Found chapter number match at index ${i}: ${optionText}`);
      docSelect.value = docOptions[i].value;
      docSelect.dispatchEvent(new Event('change', { bubbles: true }));
      console.log("Selected option:", docOptions[i].textContent);
      foundMatchingDoc = true;
      break;
    }
  }
}

if (!foundMatchingDoc) {
  console.log("No exact match found, selecting newest document (index 1)");
  if (docOptions.length > 1) {
    docSelect.value = docOptions[1].value;
    docSelect.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("Selected newest option:", docOptions[1].textContent);
  } else {
    return { success: false, error: "No documents found in dropdown" };
  }
}
          

for (let i = 1; i < docOptions.length; i++) {
  const optionText = docOptions[i].textContent.toLowerCase().trim();
  console.log(`Checking option ${i}: ${optionText}`);
  
  if (optionText.includes(normalizedChapterTitle)) {
    console.log(`Found exact match at index ${i}: ${optionText}`);
    docSelect.value = docOptions[i].value;
    docSelect.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("Selected option:", docOptions[i].textContent);
    foundMatchingDoc = true;
    break;
  }
  
  const chapterNumMatch = normalizedChapterTitle.match(/chapter\s+(\d+)/i);
  if (chapterNumMatch) {
    const chapterNum = chapterNumMatch[1];
    if (normalizedOptionText.includes(`chapter ${chapterNum}`) || 
        normalizedOptionText.includes(`ch ${chapterNum}`) ||
        normalizedOptionText.includes(`ch. ${chapterNum}`)) {
      console.log(`Found chapter number match at index ${i}: ${optionText}`);
      docSelect.value = docOptions[i].value;
      docSelect.dispatchEvent(new Event('change', { bubbles: true }));
      console.log("Selected option:", docOptions[i].textContent);
      foundMatchingDoc = true;
      break;
    }
  }
}

if (!foundMatchingDoc) {
  console.log("No exact match found, selecting newest document (index 1)");
  if (docOptions.length > 1) {
    docSelect.value = docOptions[1].value;
    docSelect.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("Selected newest option:", docOptions[1].textContent);
  } else {
    return { success: false, error: "No documents found in dropdown" };
  }
}
          
          const submitButtonSelectors = [
            'button[type="submit"]', 
            'input[type="submit"]',
            'input.btn-primary',
            'button.btn-primary',
            'input[value*="Post"]',
            'button:contains("Post")'
          ];
          
          let submitButton = null;
          for (const selector of submitButtonSelectors) {
            try {
              const elements = document.querySelectorAll(selector);
              if (elements.length > 0) {
                submitButton = elements[0];
                console.log(`Found submit button with selector: ${selector}`);
                break;
              }
            } catch (e) {
            }
          }
          
          if (!submitButton) {
            const buttons = document.querySelectorAll('button, input[type="submit"]');
            console.log("All buttons:", Array.from(buttons).map(b => `${b.id || 'unnamed'}: ${b.textContent || b.value || 'no-text'}`).join(', '));
            
            for (const btn of buttons) {
              const text = (btn.textContent || btn.value || '').toLowerCase();
              if (text.includes('post') || text.includes('submit')) {
                submitButton = btn;
                console.log(`Found submit button by text: ${text}`);
                break;
              }
            }
          }
          
          if (submitButton) {
            console.log("Clicking submit button:", submitButton.outerHTML);
            submitButton.click();
            return { success: true, message: "Chapter form submitted" };
          } else {
            const form = document.querySelector('form');
            if (form) {
              console.log("Submitting form directly:", form.action || 'no-action');
              form.submit();
              return { success: true, message: "Form submitted directly" };
            } else {
              return { success: false, error: "Submit button not found" };
            }
          }
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      },
      args: [chapterTitle]
    });
    
    console.log("Submit chapter result:", submitChapterResult[0].result);
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await Promise.all([
      chrome.tabs.remove(docManagerTab.id),
      chrome.tabs.remove(storyTab.id)
    ]).catch(err => console.warn("Error closing tabs:", err));
    
    return { 
      success: true, 
      message: `Chapter ${chapterNumber} likely posted to FanFiction.net - check manually to confirm`,
      requiresManualCheck: true
    };
  } catch (error) {
    console.error('Error posting to FanFiction.net:', error);
    
    try {
      if (docManagerTab && docManagerTab.id) {
        await chrome.tabs.remove(docManagerTab.id);
      }
      if (storyTab && storyTab.id) {
        await chrome.tabs.remove(storyTab.id);
      }
    } catch (closeError) {
      console.warn('Error closing tabs:', closeError);
    }
    
    return { success: false, error: error.toString() };
  }
}

async function postToAO3(chapterData, platformConfig, chapterNumber) {
  let tab = null;
  
  try {
    const workId = platformConfig.workId;
    console.log("AO3 workId:", workId);
    
    if (!workId) {
      console.error("AO3 work ID is missing");
      return { success: false, error: 'AO3 work ID is missing' };
    }
    
    // Format the chapter title according to user preference
    const chapterTitle = await formatChapterTitle(chapterData.title, chapterNumber);
    const contentHtml = chapterData.content;
    
    console.log("Opening AO3 new chapter page...");
    const newChapterUrl = `https://archiveofourown.org/works/${workId}/chapters/new`;
    tab = await chrome.tabs.create({
      url: newChapterUrl,
      active: false
    });
    
    await new Promise(resolve => {
      const timeout = setTimeout(resolve, 5000);
      const checkInterval = setInterval(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            return {
              ready: document.readyState === 'complete',
              hasForm: !!document.querySelector('form.new_chapter'),
              hasTitle: !!document.querySelector('input[name="chapter[title]"]'),
              hasContent: !!document.querySelector('textarea#content'),
              url: window.location.href,
              title: document.title
            };
          }
        }).then(result => {
          if (result && result[0] && result[0].result) {
            const {ready, hasForm, hasTitle, hasContent, url, title} = result[0].result;
            console.log(`Page load check: ready=${ready}, hasForm=${hasForm}, hasTitle=${hasTitle}, hasContent=${hasContent}, url=${url}`);
            
            if (ready && (hasForm || hasTitle || hasContent)) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              resolve();
            }
          }
        }).catch(err => {
          console.error('Error checking AO3 page load:', err);
        });
      }, 500);
    });
    
    const loginCheck = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const notLoggedIn = document.body.textContent.includes('You must be logged in') || 
                          window.location.href.includes('/users/login');
        return { 
          loggedIn: !notLoggedIn,
          url: window.location.href,
          title: document.title
        };
      }
    });
    
    console.log("Login check:", loginCheck[0].result);
    
    const isLoggedIn = loginCheck && loginCheck[0] && loginCheck[0].result && loginCheck[0].result.loggedIn;
    if (!isLoggedIn) {
      await chrome.tabs.remove(tab.id);
      return { success: false, error: 'Not logged in to AO3' };
    }
    
    console.log("Filling chapter form...");
    const fillFormResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (chapterTitle, contentHtml) => {
        try {
          console.log("Filling AO3 chapter form...");
          
          const titleInput = document.querySelector('input[name="chapter[title]"]');
          if (titleInput) {
            titleInput.value = chapterTitle;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Title input filled");
          } else {
            const altTitleInputs = [
              document.querySelector('#chapter_title'),
              document.querySelector('input[id*="title"]'),
              document.querySelector('input.observe_textlength')
            ];
            
            for (const input of altTitleInputs) {
              if (input) {
                input.value = chapterTitle;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                console.log("Title input filled via alternative selector");
                break;
              }
            }
          }
          
          let contentFilled = false;
          
          const contentTextarea = document.querySelector('textarea#content');
          if (contentTextarea) {
            
            let processedContent = "";
            try {
              const parser = new DOMParser();
              const doc = parser.parseFromString(contentHtml, 'text/html');
              
              const paragraphs = Array.from(doc.querySelectorAll('p'));
              
              if (paragraphs.length > 0) {
                processedContent = paragraphs
                  .map(p => p.outerHTML)
                  .join('\n\n');
              } else {
                processedContent = contentHtml;
              }
            } catch (parseError) {
              console.error("Error processing HTML:", parseError);
              processedContent = contentHtml;
            }
            
            contentTextarea.value = processedContent;
            contentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            contentFilled = true;
            console.log("Content textarea filled");
          }
          
          if (!contentFilled && window.tinyMCE) {
            const editor = window.tinyMCE.get('content') || window.tinyMCE.activeEditor;
            if (editor) {
              editor.setContent(contentHtml);
              contentFilled = true;
              console.log("Content filled via TinyMCE");
            }
          }
          
          if (!contentFilled) {
            const anyTextarea = document.querySelector('textarea.mce-editor');
            if (anyTextarea) {
              anyTextarea.value = contentHtml;
              anyTextarea.dispatchEvent(new Event('input', { bubbles: true }));
              contentFilled = true;
              console.log("Content filled via generic textarea");
            }
          }
          
          if (!contentFilled) {
            const textareas = Array.from(document.querySelectorAll('textarea')).sort((a, b) => {
              const aArea = a.offsetWidth * a.offsetHeight;
              const bArea = b.offsetWidth * b.offsetHeight;
              return bArea - aArea;
            });
            
            if (textareas.length > 0) {
              textareas[0].value = contentHtml;
              textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
              contentFilled = true;
              console.log("Content filled via largest textarea");
            }
          }
          
          if (!contentFilled) {
            return { 
              success: false, 
              error: "Could not find content field" 
            };
          }
          
          return { success: true };
        } catch (error) {
          console.error("Error filling AO3 form:", error);
          return { success: false, error: error.toString() };
        }
      },
      args: [chapterTitle, contentHtml]
    });
    
    console.log("Form fill result:", fillFormResult[0].result);
    
    if (!fillFormResult[0].result.success) {
      await chrome.tabs.remove(tab.id);
      return { 
        success: false, 
        error: fillFormResult[0].result.error || "Failed to fill chapter form" 
      };
    }
    
    console.log("Submitting AO3 chapter form...");
    const submitResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          let postButton = null;
          
          const submitButtons = [
            document.querySelector('input[name="post_without_preview"][type="submit"]'),
            document.querySelector('input[value="Post"][type="submit"]'),
            document.querySelector('input[name="post"]'),
            document.querySelector('input.submit')
          ].filter(Boolean);
          
          if (submitButtons.length === 0) {
            const allButtons = document.querySelectorAll('button');
            for (const btn of allButtons) {
              if (btn.textContent && btn.textContent.includes('Post')) {
                submitButtons.push(btn);
                break;
              }
            }
          }
          
          if (submitButtons.length > 0) {
            postButton = submitButtons[0];
          } else {
            const buttons = document.querySelectorAll('input[type="submit"], button');
            for (const btn of buttons) {
              const text = (btn.value || btn.textContent || '').toLowerCase();
              if (text.includes('post') && !text.includes('preview')) {
                postButton = btn;
                break;
              }
            }
          }
          
          if (postButton) {
            console.log("Clicking post button:", postButton.outerHTML);
            postButton.click();
            return { success: true };
          } else {
            const form = document.querySelector('form.new_chapter');
            if (form) {
              console.log("Submitting form directly");
              form.submit();
              return { success: true };
            }
            
            return { 
              success: false, 
              error: "Could not find post button or form" 
            };
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          return { success: false, error: error.toString() };
        }
      }
    });
    
    console.log("Submit result:", submitResult[0].result);
    
    if (!submitResult[0].result.success) {
      await chrome.tabs.remove(tab.id);
      return { 
        success: false, 
        error: submitResult[0].result.error || "Failed to submit chapter form" 
      };
    }
    
    const submissionResult = await new Promise(resolve => {
      const timeout = setTimeout(() => resolve({ timedOut: true }), 10000);
      const checkInterval = setInterval(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            const successIndicators = [
              document.body.textContent.includes('Chapter was successfully posted'),
              document.body.textContent.includes('has a new chapter'),
              !document.querySelector('form.new_chapter'),
              document.querySelector('.chapter') !== null,
              window.location.href.includes('/chapters/') && !window.location.href.includes('/new')
            ];
            
            const isSuccess = successIndicators.some(indicator => indicator);
            
            return {
              ready: document.readyState === 'complete',
              success: isSuccess,
              url: window.location.href,
              title: document.title
            };
          }
        }).then(result => {
          if (result && result[0] && result[0].result) {
            const {ready, success, url, title} = result[0].result;
            console.log(`Submission check: ready=${ready}, success=${success}, url=${url}, title=${title}`);
            
            if (ready && (success || url.includes('/chapters/'))) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              resolve({ success, url, title });
            }
          }
        }).catch(err => {
          console.error('Error checking submission status:', err);
        });
      }, 500);
    });
    
    console.log("Submission result:", submissionResult);
    
    await chrome.tabs.remove(tab.id);
    
    if (submissionResult.timedOut) {
      return { 
        success: true, 
        message: `Chapter ${chapterNumber} likely posted to AO3 - check manually to confirm`,
        requiresManualCheck: true
      };
    } else if (submissionResult.success) {
      return { 
        success: true, 
        message: `Successfully posted chapter ${chapterNumber} to AO3` 
      };
    } else {
      return { 
        success: false, 
        error: 'Failed to post chapter to AO3 - verify manually' 
      };
    }
    
  } catch (error) {
    console.error('Error posting to AO3:', error);
    
    if (tab && tab.id) {
      try {
        await chrome.tabs.remove(tab.id);
      } catch (closeError) {
        console.warn('Error closing tab:', closeError);
      }
    }
    
    return { success: false, error: error.toString() };
  }
}

async function postToRoyalRoad(chapterData, platformConfig, chapterNumber) {
  let tab = null;
  
  try {
    const workId = platformConfig.workId;
    console.log("RoyalRoad workId:", workId);
    
    if (!workId) {
      console.error("RoyalRoad work ID is missing");
      return { success: false, error: 'RoyalRoad work ID is missing' };
    }
    
    // Format the chapter title according to user preference
    const chapterTitle = await formatChapterTitle(chapterData.title, chapterNumber);
    const contentHtml = chapterData.content;
    
    const newChapterUrl = `https://www.royalroad.com/author-dashboard/chapters/new/${workId}`;
    console.log(`Opening RoyalRoad new chapter page: ${newChapterUrl}`);
    
    tab = await chrome.tabs.create({
      url: newChapterUrl,
      active: false
    });
    
    await new Promise(resolve => {
      const timeout = setTimeout(() => {
        console.log("Page load timeout reached, continuing anyway");
        resolve();
      }, 5000);
      
      const checkInterval = setInterval(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            const hasTitleField = !!document.querySelector('input#Title') ||
                                !!document.querySelector('input[name="Title"]');
            
            const hasChapterContentEditor = !!document.querySelector('iframe#contentEditor_ifr') ||
                                          !!document.querySelector('body#tinymce.chapter-content') ||
                                          !!document.querySelector('.mce-content-body.chapter-content');
            
            const tinyMCEInitialized = typeof window.tinymce !== 'undefined' &&
                                     window.tinymce.editors &&
                                     Object.keys(window.tinymce.editors).length > 0;
            
            let chapterEditorFound = false;
            if (tinyMCEInitialized && window.tinymce.editors) {
              for (const editorId in window.tinymce.editors) {
                if (editorId === 'contentEditor' || editorId.includes('chapter')) {
                  chapterEditorFound = true;
                  break;
                }
              }
            }
            
            const isStable = document.readyState === 'complete' &&
                           !document.querySelector('.loading') &&
                           !document.querySelector('.spinner');
            
            return {
              ready: document.readyState === 'complete',
              isStable: isStable,
              hasTitleField: hasTitleField,
              hasChapterContentEditor: hasChapterContentEditor,
              tinyMCEInitialized: tinyMCEInitialized,
              chapterEditorFound: chapterEditorFound,
              url: window.location.href,
              title: document.title
            };
          }
        }).then(result => {
          if (result && result[0] && result[0].result) {
            const {ready, isStable, hasTitleField, hasChapterContentEditor,
                   tinyMCEInitialized, chapterEditorFound, url, title} = result[0].result;
            
            console.log(`Page load check: ready=${ready}, isStable=${isStable}, hasTitleField=${hasTitleField}, ` +
                       `hasChapterContentEditor=${hasChapterContentEditor}, tinyMCEInitialized=${tinyMCEInitialized}, ` +
                       `chapterEditorFound=${chapterEditorFound}, url=${url}, title=${title}`);
            
            if (ready && isStable && hasTitleField &&
                (hasChapterContentEditor || chapterEditorFound)) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              
              setTimeout(resolve, 500);
            }
          }
        }).catch(err => {
          console.error('Error checking RoyalRoad page load:', err);
        });
      }, 500);
    });
    
    const loginCheck = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const notLoggedIn = document.body.textContent.includes('Sign in') ||
                          document.body.textContent.includes('Log in') ||
                          window.location.href.includes('/login');
        return {
          loggedIn: !notLoggedIn,
          url: window.location.href,
          title: document.title
        };
      }
    });
    
    console.log("Login check:", loginCheck[0].result);
    
    const isLoggedIn = loginCheck && loginCheck[0] && loginCheck[0].result && loginCheck[0].result.loggedIn;
    if (!isLoggedIn) {
      await chrome.tabs.remove(tab.id);
      return { success: false, error: 'Not logged in to RoyalRoad' };
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Filling chapter form...");
    const fillFormResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (chapterTitle, contentHtml) => {
        try {
          console.log("Filling RoyalRoad chapter form...");
          
          const titleElement = document.querySelector('input#Title') ||
                             document.querySelector('input[name="Title"]') ||
                             document.querySelector('input[placeholder*="title" i]');
          if (titleElement) {
            titleElement.value = chapterTitle;
            titleElement.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Title set successfully");
          } else {
            console.error("Could not find title field");
            return { success: false, error: "Title field not found" };
          }
          
          console.log("Available iframes:", Array.from(document.querySelectorAll('iframe')).map(f => f.id || 'unnamed').join(', '));
          console.log("TinyMCE available:", typeof window.tinymce !== 'undefined');
          if (typeof window.tinymce !== 'undefined') {
            console.log("TinyMCE editors:", Object.keys(window.tinymce.editors || {}).join(', '));
            console.log("Active editor:", window.tinymce.activeEditor ? 'yes' : 'no');
          }
          
          let contentSet = false;
          
          if (window.tinymce && window.tinymce.editors) {
            try {
              const chapterEditorIds = ['contentEditor', 'chapterContent', 'chapterEditor'];
              
              for (const editorId of chapterEditorIds) {
                if (window.tinymce.editors[editorId]) {
                  window.tinymce.editors[editorId].setContent(contentHtml);
                  console.log(`Content set via specific TinyMCE editor: ${editorId}`);
                  contentSet = true;
                  break;
                }
              }
              
              if (!contentSet) {
                const editorIds = Object.keys(window.tinymce.editors);
                for (const editorId of editorIds) {
                  if (editorId.toLowerCase().includes('content') ||
                      editorId.toLowerCase().includes('chapter')) {
                    window.tinymce.editors[editorId].setContent(contentHtml);
                    console.log(`Content set via TinyMCE editor with chapter in ID: ${editorId}`);
                    contentSet = true;
                    break;
                  }
                }
              }
            } catch (e) {
              console.error("Error setting content via specific TinyMCE editors:", e);
            }
          }
          
          if (!contentSet) {
            try {
              const contentEditorIframe = document.querySelector('iframe#contentEditor_ifr');
              
              if (contentEditorIframe && contentEditorIframe.contentDocument) {
                const editorBody = contentEditorIframe.contentDocument.querySelector('body#tinymce');
                if (editorBody) {
                  editorBody.innerHTML = contentHtml;
                  console.log("Content set via specific contentEditor iframe");
                  contentSet = true;
                }
              }
            } catch (e) {
              console.error("Error setting content via specific iframe:", e);
            }
          }
          
          if (!contentSet) {
            try {
              const iframes = document.querySelectorAll('iframe');
              for (const iframe of iframes) {
                try {
                  if (iframe.contentDocument) {
                    const chapterBody = iframe.contentDocument.querySelector('body.chapter-content, #tinymce.chapter-content');
                    if (chapterBody) {
                      chapterBody.innerHTML = contentHtml;
                      console.log("Content set via iframe with chapter-content body");
                      contentSet = true;
                      break;
                    }
                  }
                } catch (e) {
                }
              }
            } catch (e) {
              console.error("Error setting content via iframes:", e);
            }
          }
          
          if (!contentSet) {
            try {
              const chapterEditableSelectors = [
                'div.mce-content-body.chapter-content[contenteditable="true"]',
                '[contenteditable="true"][data-id="contentEditor"]',
                '[contenteditable="true"][aria-label*="chapter" i]',
                '[contenteditable="true"][id*="chapter" i]',
                '[contenteditable="true"][id*="content" i]'
              ];
              
              for (const selector of chapterEditableSelectors) {
                const contentElement = document.querySelector(selector);
                if (contentElement) {
                  contentElement.innerHTML = contentHtml;
                  console.log(`Content set via chapter contenteditable element (${selector})`);
                  contentSet = true;
                  break;
                }
              }
            } catch (e) {
              console.error("Error setting content via chapter contenteditable:", e);
            }
          }
          
          if (!contentSet) {
            try {
              const script = document.createElement('script');
              script.textContent = `
                try {
                  // Try to find the chapter content editor
                  if (window.tinymce && window.tinymce.editors) {
                    const editorIds = ['contentEditor', 'chapterContent', 'chapterEditor'];
                    let editor = null;
                    
                    // First try specific editor IDs
                    for (const id of editorIds) {
                      if (window.tinymce.editors[id]) {
                        editor = window.tinymce.editors[id];
                        break;
                      }
                    }
                    
                    // If not found, look for editors with 'chapter' or 'content' in the ID
                    if (!editor) {
                      for (const id in window.tinymce.editors) {
                        if (id.toLowerCase().includes('chapter') || id.toLowerCase().includes('content')) {
                          editor = window.tinymce.editors[id];
                          break;
                        }
                      }
                    }
                    
                    // If still not found, use the second editor (assuming first is pre-chapter note)
                    if (!editor) {
                      const ids = Object.keys(window.tinymce.editors);
                      if (ids.length > 1) {
                        editor = window.tinymce.editors[ids[1]];
                      } else if (ids.length > 0) {
                        editor = window.tinymce.editors[ids[0]];
                      }
                    }
                    
                    if (editor) {
                      editor.setContent(${JSON.stringify(contentHtml)});
                      console.log("Content set via injected script for chapter editor");
                    }
                  }
                } catch(e) {
                  console.error("Error in injected script:", e);
                }
              `;
              document.head.appendChild(script);
              document.head.removeChild(script);
              
              console.log("Attempted to set content via injected script for chapter editor");
              contentSet = true;
            } catch (e) {
              console.error("Error injecting script:", e);
            }
          }
          
          if (!contentSet) {
            console.error("Could not find any way to set content");
            return { success: false, error: "Content field not found after trying multiple methods" };
          }
          
          return { success: true };
        } catch (error) {
          console.error("Error filling RoyalRoad form:", error);
          return { success: false, error: error.toString() };
        }
      },
      args: [chapterTitle, contentHtml]
    });
    
    if (!fillFormResult[0].result.success) {
      await chrome.tabs.remove(tab.id);
      return {
        success: false,
        error: fillFormResult[0].result.error || "Failed to fill chapter form"
      };
    }
    
    console.log("Clicking Publish button...");
    const publishResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          const publishButton = document.querySelector('button.btn.btn-primary[value="publish"]') ||
                              document.querySelector('button[value="publish"]') ||
                              Array.from(document.querySelectorAll('button.btn.btn-primary')).find(btn =>
                                btn.textContent.includes('Publish')
                              );
          
          if (publishButton) {
            console.log("Found Publish button, clicking...");
            publishButton.click();
            return { success: true };
          } else {
            console.error("Could not find publish button");
            return { success: false, error: "Publish button not found" };
          }
        } catch (error) {
          console.error("Error clicking Publish button:", error);
          return { success: false, error: error.toString() };
        }
      }
    });
    
    if (!publishResult[0].result.success) {
      await chrome.tabs.remove(tab.id);
      return {
        success: false,
        error: publishResult[0].result.error || "Failed to click Publish button"
      };
    }
    
    await new Promise(resolve => {
      let attempts = 0;
      const maxAttempts = 20;
      
      const checkInterval = setInterval(async () => {
        attempts++;
        
        try {
          const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              const isSuccess =
                document.body.textContent.includes('successfully') ||
                document.body.textContent.includes('Success') ||
                document.body.textContent.includes('Chapter added');
              
              const hasErrors = document.querySelectorAll('.error, .alert-danger, .alert-error').length > 0;
              
              const errorMessages = Array.from(document.querySelectorAll('.error, .alert-danger, .alert-error'))
                .map(el => el.textContent.trim())
                .filter(Boolean);
              
              return {
                done: isSuccess || hasErrors || attempts >= maxAttempts,
                success: isSuccess,
                errors: errorMessages
              };
            }
          });
          
          if (result && result[0] && result[0].result) {
            const status = result[0].result;
            
            if (status.done || attempts >= maxAttempts) {
              clearInterval(checkInterval);
              resolve();
            }
          }
        } catch (error) {
          console.error('Error checking publish status:', error);
          if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            resolve();
          }
        }
      }, 500);
    });
    
    const finalStatusResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          const isSuccess =
            document.body.textContent.includes('successfully') ||
            document.body.textContent.includes('Success') ||
            document.body.textContent.includes('Chapter added');
          
          return {
            success: isSuccess,
            url: window.location.href
          };
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      }
    });
    
    const isSuccess = finalStatusResult && finalStatusResult[0] && finalStatusResult[0].result && finalStatusResult[0].result.success;
    
    try {
      await chrome.tabs.remove(tab.id);
    } catch (closeError) {
      console.error('Error closing tab:', closeError);
    }
    
    if (isSuccess) {
      return { success: true, message: 'Chapter successfully published to RoyalRoad' };
    } else {
      return { success: false, error: 'Failed to publish chapter to RoyalRoad' };
    }
    
  } catch (error) {
    console.error('Error posting to RoyalRoad:', error);
    
    if (tab) {
      try {
        await chrome.tabs.remove(tab.id);
      } catch (closeError) {
        console.error('Error closing tab:', closeError);
      }
    }
    
    return { success: false, error: error.toString() };
  }
}

async function postToWebnovel(chapterData, platformConfig, chapterNumber) {
  let tab = null;
  
  try {
    const storyId = platformConfig.storyId;
    console.log("Webnovel storyId:", storyId);
    
    if (!storyId) {
      console.error("Webnovel story ID is missing");
      return { success: false, error: 'Webnovel story ID is missing' };
    }
    
    // Format the chapter title according to user preference
    const chapterTitle = await formatChapterTitle(chapterData.title, chapterNumber);
    const contentHtml = chapterData.content;
    
    const newChapterUrl = `https://inkstone.webnovel.com/novels/chapter/create/${storyId}`;
    console.log(`Opening Webnovel new chapter page: ${newChapterUrl}`);
    
    tab = await chrome.tabs.create({
      url: newChapterUrl,
      active: false
    });
    
    await new Promise(resolve => {
      const timeout = setTimeout(() => {
        console.log("Page load timeout reached, continuing anyway");
        resolve();
      }, 8000);
      
      const checkInterval = setInterval(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            const hasTitleField = !!document.querySelector('input.ant-input.input_title--yxd3l') ||
                                !!document.querySelector('input[placeholder="Title Here"]');
            
            const hasContentEditor = !!document.querySelector('.tox-tinymce') ||
                                    !!document.querySelector('#tiny-react_896397910681749744518638_ifr') ||
                                    !!document.querySelector('.tox.tox-tinymce iframe');
            
            const tinyMCEReady = typeof window.tinymce !== 'undefined' &&
                               window.tinymce.editors &&
                               Object.keys(window.tinymce.editors).length > 0;
            
            const isStable = document.readyState === 'complete' &&
                           !document.querySelector('.ant-spin-dot') &&
                           !document.querySelector('.loading');
            
            return {
              ready: document.readyState === 'complete',
              isStable: isStable,
              hasTitleField: hasTitleField,
              hasContentEditor: hasContentEditor,
              tinyMCEReady: tinyMCEReady,
              url: window.location.href,
              title: document.title
            };
          }
        }).then(result => {
          if (result && result[0] && result[0].result) {
            const {ready, isStable, hasTitleField, hasContentEditor, tinyMCEReady, url, title} = result[0].result;
            
            console.log(`Webnovel page load check: ready=${ready}, isStable=${isStable}, hasTitleField=${hasTitleField}, ` +
                       `hasContentEditor=${hasContentEditor}, tinyMCEReady=${tinyMCEReady}, url=${url}, title=${title}`);
            
            if (ready && isStable && hasTitleField && hasContentEditor) {
              clearInterval(checkInterval);
              clearTimeout(timeout);
              resolve();
            }
          }
        }).catch(error => {
          console.error("Error during page readiness check:", error);
        });
      }, 1000);
    });
    
    console.log("Filling Webnovel chapter form...");
    const fillFormResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (chapterTitle, contentHtml) => {
        try {
          console.log(`Setting title: ${chapterTitle}`);
          
          const titleInput = document.querySelector('input.ant-input.input_title--yxd3l') ||
                           document.querySelector('input[placeholder="Title Here"]');
          
          if (titleInput) {
            titleInput.value = chapterTitle;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
            titleInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("Title set successfully");
          } else {
            console.error("Title input not found");
            return { success: false, error: "Title input not found" };
          }
          
          console.log("Setting content...");
          let contentSet = false;
          
          if (window.tinymce && window.tinymce.editors) {
            for (const editorId in window.tinymce.editors) {
              const editor = window.tinymce.editors[editorId];
              if (editor && editor.setContent) {
                editor.setContent(contentHtml);
                
                // Trigger content change events to make Webnovel detect the content
                editor.fire('input');
                editor.fire('change');
                editor.fire('keyup');
                
                // Also trigger the save event if available
                if (editor.save) {
                  editor.save();
                }
                
                console.log(`Content set via TinyMCE editor with events: ${editorId}`);
                contentSet = true;
                break;
              }
            }
          }
          
          if (!contentSet) {
            const iframe = document.querySelector('#tiny-react_896397910681749744518638_ifr') ||
                         document.querySelector('.tox-tinymce iframe');
            
            if (iframe && iframe.contentDocument) {
              const editorBody = iframe.contentDocument.querySelector('body');
              if (editorBody) {
                editorBody.innerHTML = contentHtml;
                
                // Trigger events on the iframe content to simulate user input
                const inputEvent = new Event('input', { bubbles: true });
                const changeEvent = new Event('change', { bubbles: true });
                const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                
                editorBody.dispatchEvent(inputEvent);
                editorBody.dispatchEvent(changeEvent);
                editorBody.dispatchEvent(keyupEvent);
                
                // Also focus and blur to trigger validation
                editorBody.focus();
                editorBody.blur();
                
                console.log("Content set via iframe with events");
                contentSet = true;
              }
            }
          }
          
          if (!contentSet) {
            console.error("Could not find content editor");
            return { success: false, error: "Content editor not found" };
          }
          
          return { success: true };
        } catch (error) {
          console.error("Error filling Webnovel form:", error);
          return { success: false, error: error.toString() };
        }
      },
      args: [chapterTitle, contentHtml]
    });
    
    if (!fillFormResult[0].result.success) {
      await chrome.tabs.remove(tab.id);
      return {
        success: false,
        error: fillFormResult[0].result.error || "Failed to fill chapter form"
      };
    }
    
    console.log("Clicking Save button...");
    const saveResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          const saveButton = document.querySelector('button.ant-btn.ant-btn-primary.ant-btn-lg.ant-btn-background-ghost') ||
                           Array.from(document.querySelectorAll('button.ant-btn-background-ghost')).find(btn =>
                             btn.textContent.toLowerCase().includes('save')
                           );
          
          if (saveButton) {
            console.log("Found Save button, clicking...");
            saveButton.click();
            return { success: true };
          } else {
            console.error("Could not find save button");
            return { success: false, error: "Save button not found" };
          }
        } catch (error) {
          console.error("Error clicking Save button:", error);
          return { success: false, error: error.toString() };
        }
      }
    });
    
    if (!saveResult[0].result.success) {
      await chrome.tabs.remove(tab.id);
      return {
        success: false,
        error: saveResult[0].result.error || "Failed to click Save button"
      };
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("Clicking Publish button...");
    const publishResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          const publishButton = document.querySelector('button.ant-btn.ant-btn-primary.ant-btn-lg.ml16') ||
                              document.querySelector('button.ant-btn-primary:has(.anticon-check)') ||
                              Array.from(document.querySelectorAll('button.ant-btn-primary')).find(btn =>
                                btn.textContent.includes('Publish')
                              );
          
          if (publishButton) {
            console.log("Found Publish button, clicking...");
            publishButton.click();
            return { success: true };
          } else {
            console.error("Could not find publish button");
            return { success: false, error: "Publish button not found" };
          }
        } catch (error) {
          console.error("Error clicking Publish button:", error);
          return { success: false, error: error.toString() };
        }
      }
    });
    
    if (!publishResult[0].result.success) {
      await chrome.tabs.remove(tab.id);
      return {
        success: false,
        error: publishResult[0].result.error || "Failed to click Publish button"
      };
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("Clicking Confirm button...");
    const confirmResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          const confirmButton = document.querySelector('button.ant-btn.ant-btn-primary.ant-btn-lg .fvsc') ||
                              document.querySelector('button.ant-btn-primary:has(.fvsc)') ||
                              Array.from(document.querySelectorAll('button.ant-btn-primary')).find(btn =>
                                btn.textContent.includes('confirm')
                              );
          
          if (confirmButton) {
            console.log("Found Confirm button, clicking...");
            confirmButton.click();
            return { success: true };
          } else {
            console.error("Could not find confirm button");
            return { success: false, error: "Confirm button not found" };
          }
        } catch (error) {
          console.error("Error clicking Confirm button:", error);
          return { success: false, error: error.toString() };
        }
      }
    });
    
    if (!confirmResult[0].result.success) {
      await chrome.tabs.remove(tab.id);
      return {
        success: false,
        error: confirmResult[0].result.error || "Failed to click Confirm button"
      };
    }
    
    await new Promise(resolve => {
      let attempts = 0;
      const maxAttempts = 20;
      
      const checkInterval = setInterval(async () => {
        attempts++;
        
        try {
          const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              const isSuccess =
                document.body.textContent.includes('successfully') ||
                document.body.textContent.includes('Success') ||
                document.body.textContent.includes('published') ||
                window.location.href.includes('/chapter/');
              
              const hasErrors = document.querySelectorAll('.ant-message-error, .error').length > 0;
              
              const errorMessages = Array.from(document.querySelectorAll('.ant-message-error, .error'))
                .map(el => el.textContent.trim())
                .filter(Boolean);
              
              return {
                done: isSuccess || hasErrors || attempts >= maxAttempts,
                success: isSuccess,
                errors: errorMessages
              };
            }
          });
          
          if (result && result[0] && result[0].result) {
            const { done, success, errors } = result[0].result;
            
            if (done) {
              clearInterval(checkInterval);
              resolve({ success, errors });
            }
          }
        } catch (error) {
          console.error("Error checking publish status:", error);
          if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            resolve({ success: false, errors: [error.toString()] });
          }
        }
      }, 1000);
    });
    
    const finalStatusResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        try {
          const isSuccess =
            document.body.textContent.includes('successfully') ||
            document.body.textContent.includes('Success') ||
            document.body.textContent.includes('published') ||
            window.location.href.includes('/chapter/');
          
          return {
            success: isSuccess,
            url: window.location.href
          };
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      }
    });
    
    const isSuccess = finalStatusResult && finalStatusResult[0] && finalStatusResult[0].result && finalStatusResult[0].result.success;
    
    try {
      await chrome.tabs.remove(tab.id);
    } catch (closeError) {
      console.error('Error closing tab:', closeError);
    }
    
    if (isSuccess) {
      return { success: true, message: 'Chapter successfully published to Webnovel' };
    } else {
      return { success: false, error: 'Failed to publish chapter to Webnovel' };
    }
    
  } catch (error) {
    console.error('Error posting to Webnovel:', error);
    
    if (tab) {
      try {
        await chrome.tabs.remove(tab.id);
      } catch (closeError) {
        console.error('Error closing tab:', closeError);
      }
    }
    
    return { success: false, error: error.toString() };
  }
}

async function postToWattpad(chapterData, platformConfig, chapterNumber) {
  let tab = null;
  
  try {
    const storyId = platformConfig.storyId;
    console.log("Wattpad storyId:", storyId);
    
    if (!storyId) {
      console.error("Wattpad story ID is missing");
      return { success: false, error: "Wattpad story ID is required" };
    }
    
    console.log(`Posting chapter ${chapterNumber} to Wattpad story ${storyId}`);
    
    // Create or find Wattpad tab
    const wattpadUrl = `https://www.wattpad.com/myworks/${storyId}`;
    console.log(`Opening Wattpad myworks page: ${wattpadUrl}`);
    
    tab = await chrome.tabs.create({
      url: wattpadUrl,
      active: true
    });
    
    // Wait for tab to load
    await new Promise(resolve => {
      const checkReady = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(checkReady);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(checkReady);
    });
    
    // Additional wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("Wattpad page loaded, executing posting script");
    
    // Format the chapter title according to user preference
    const formattedChapterTitle = await formatChapterTitle(chapterData.title, chapterNumber);
    
    // Execute the posting script
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (chapterTitle, chapterContent, storyId) => {
        // This function runs in the Wattpad page context
        try {
          // Use the postChapterToWattpad function from wattpad_verification.js
          if (typeof window.postChapterToWattpad === 'function') {
            return await window.postChapterToWattpad(storyId, chapterTitle, chapterContent);
          } else {
            return { success: false, error: "Wattpad posting function not available" };
          }
        } catch (error) {
          console.error("Error in Wattpad posting:", error);
          return { success: false, error: error.message };
        }
      },
      args: [formattedChapterTitle, chapterData.content, storyId]
    });
    
    console.log("Wattpad posting script executed, results:", results);
    
    if (results && results[0] && results[0].result) {
      const result = results[0].result;
      
      if (result.success) {
        console.log(`Successfully posted chapter ${chapterNumber} to Wattpad`);
        return { success: true, platform: 'wattpad', message: result.message || 'Chapter posted successfully' };
      } else {
        console.error(`Failed to post chapter ${chapterNumber} to Wattpad:`, result.error);
        return { success: false, error: result.error || 'Unknown error posting to Wattpad' };
      }
    } else {
      console.error("No valid result from Wattpad posting script");
      return { success: false, error: 'No response from Wattpad posting script' };
    }
    
  } catch (error) {
    console.error('Error posting to Wattpad:', error);
    return { success: false, error: error.toString() };
  } finally {
    // Close the tab after posting
    if (tab && tab.id) {
      try {
        await chrome.tabs.remove(tab.id);
        console.log("Wattpad tab closed successfully");
      } catch (closeError) {
        console.error('Error closing Wattpad tab:', closeError);
      }
    }
  }
}

async function postToInkitt(chapterData, platformConfig, chapterNumber) {
  let tab = null;
  
  try {
    const storyId = platformConfig.storyId;
    console.log("Inkitt storyId:", storyId);
    
    if (!storyId) {
      console.error("Inkitt story ID is missing");
      return { success: false, error: "Inkitt story ID is required" };
    }
    
    console.log(`Posting chapter ${chapterNumber} to Inkitt story ${storyId}`);
    
    // Navigate to Inkitt edit page
    const editUrl = `https://www.inkitt.com/edit/${storyId}`;
    console.log(`Opening Inkitt edit page: ${editUrl}`);
    
    tab = await chrome.tabs.create({
      url: editUrl,
      active: true
    });
    
    // Wait for tab to load
    await new Promise(resolve => {
      const checkReady = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(checkReady);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(checkReady);
    });
    
    // Additional wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("Inkitt edit page loaded, starting chapter creation process");
    
    // Format the chapter title according to user preference
    const formattedChapterTitle = await formatChapterTitle(chapterData.title, chapterNumber);
    
    // Step 1: Submit chapter creation form only
    console.log("Step 1: Submitting chapter creation form");
    try {
      const createResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (chapterTitle) => {
          try {
            console.log('Filling and submitting chapter creation form');
            
            // Fill in the chapter name
            const chapterNameInput = document.querySelector('.new-chapter input.chapter-name');
            if (!chapterNameInput) {
              return { success: false, error: 'Could not find chapter name input field' };
            }
            
            console.log('Found chapter name input, filling with title:', chapterTitle);
            
            // Clear any existing value first
            chapterNameInput.value = '';
            chapterNameInput.focus();
            
            // Simulate typing the title character by character with delays
            for (let i = 0; i < chapterTitle.length; i++) {
              chapterNameInput.value = chapterTitle.substring(0, i + 1);
              
              // Dispatch input events during "typing"
              const typeEvent = new Event('input', { bubbles: true, cancelable: true });
              chapterNameInput.dispatchEvent(typeEvent);
              
              // Random delay between 50-150ms to simulate human typing
              await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
            }
            
            // Submit the form
            const createForm = document.querySelector('.new-chapter form[name="newchaptername"]');
            const createButton = document.querySelector('.new-chapter button.create-chapter');
            
            if (!createForm && !createButton) {
              return { success: false, error: 'Could not find create chapter form or button' };
            }
            
            console.log('Submitting chapter creation form with human-like interaction');
            
            // Simulate more human-like interaction
            // First, focus the input to simulate user interaction
            chapterNameInput.focus();
            
            // Dispatch input events to simulate typing
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            chapterNameInput.dispatchEvent(inputEvent);
            
            // Small delay to simulate human behavior
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Use button click instead of form submit to be more human-like
            if (createButton) {
              // Simulate mouse events
              const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
              const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
              const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
              
              createButton.dispatchEvent(mouseDownEvent);
              await new Promise(resolve => setTimeout(resolve, 50));
              createButton.dispatchEvent(mouseUpEvent);
              await new Promise(resolve => setTimeout(resolve, 50));
              createButton.dispatchEvent(clickEvent);
            } else if (createForm) {
              // Fallback to form submit with Enter key simulation
              const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter', 
                keyCode: 13,
                bubbles: true,
                cancelable: true
              });
              chapterNameInput.dispatchEvent(enterEvent);
            }
            
            return { success: true, message: 'Chapter creation form submitted' };
            
          } catch (error) {
            console.error("Error submitting chapter form:", error);
            return { success: false, error: error.message };
          }
        },
        args: [formattedChapterTitle]
      });
      
      if (!createResults || !createResults[0] || !createResults[0].result || !createResults[0].result.success) {
        const error = createResults?.[0]?.result?.error || 'Failed to submit chapter creation form';
        return { success: false, error: error };
      }
      
      console.log("Chapter creation form submitted, waiting for page to settle...");
      
    } catch (error) {
      console.error("Error in chapter creation step:", error);
      if (error.message && error.message.includes('Frame with ID')) {
        console.log("Page navigated during form submission - this is expected, continuing...");
      } else {
        return { success: false, error: error.toString() };
      }
    }
    
    // Step 2: Wait for page to settle and check if chapter was created
    console.log("Step 2: Waiting for chapter creation to complete");
    await new Promise(resolve => setTimeout(resolve, 5000)); // Give page time to settle
    
    // Step 3: Check if we can access the page and if chapter was created
    console.log("Step 3: Checking chapter creation status");
    let chapterCreated = false;
    let attempts = 0;
    const maxWaitAttempts = 20;
    
    while (!chapterCreated && attempts < maxWaitAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const statusCheck = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (expectedTitle) => {
            const editor = document.querySelector('#storyEditor .ql-editor');
            const chaptersList = document.querySelector('.chapters-list ul.nav-list');
            
            let newChapterInSidebar = false;
            if (chaptersList) {
              const chapterItems = chaptersList.querySelectorAll('li');
              for (const item of chapterItems) {
                const titleSpan = item.querySelector('.chapter-title');
                if (titleSpan && titleSpan.textContent.trim() === expectedTitle) {
                  newChapterInSidebar = true;
                  break;
                }
              }
            }
            
            return {
              hasEditor: !!editor,
              hasChapterInSidebar: newChapterInSidebar,
              ready: document.readyState === 'complete',
              url: window.location.href
            };
          },
          args: [formattedChapterTitle]
        });
        
        if (statusCheck && statusCheck[0] && statusCheck[0].result) {
          const { hasEditor, hasChapterInSidebar, ready, url } = statusCheck[0].result;
          console.log(`Attempt ${attempts}/${maxWaitAttempts}: editor=${hasEditor}, sidebar=${hasChapterInSidebar}, ready=${ready}`);
          console.log(`Current URL: ${url}`);
          
          if (hasEditor && hasChapterInSidebar && ready) {
            chapterCreated = true;
            console.log("Chapter created successfully!");
            break;
          }
        }
      } catch (error) {
        console.log(`Attempt ${attempts}/${maxWaitAttempts}: Page still loading or navigating...`);
      }
    }
    
    if (!chapterCreated) {
      return { success: false, error: 'Chapter creation timed out or failed' };
    }
    
    // Step 4: Fill content and submit
    console.log("Step 4: Filling content and submitting chapter");
    try {
      const contentResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (chapterContent) => {
          try {
            console.log('Adding content and submitting chapter');
          
          // Step 4: Find the Quill editor and paste content
          const editor = document.querySelector('#storyEditor .ql-editor');
          if (!editor) {
            return { success: false, error: 'Could not find chapter content editor' };
          }
          
          console.log('Found editor, setting content');
          
          // Try to access Quill instance first
          let quillInstance = null;
          
          // Look for Quill instance in various ways
          if (window.Quill && window.Quill.find) {
            quillInstance = window.Quill.find(editor);
          } else if (editor.__quill) {
            quillInstance = editor.__quill;
          } else if (editor.closest('.ql-container') && editor.closest('.ql-container').__quill) {
            quillInstance = editor.closest('.ql-container').__quill;
          }
          
          // Convert content to proper format
          const paragraphs = chapterContent.split('\n').filter(p => p.trim());
          
          console.log('Using type-first approach to activate editor');
          
          // Focus and click the editor
          editor.focus();
          editor.click();
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get the first word from the content
          const fullContent = paragraphs.join('\n\n');
          const firstWord = fullContent.split(' ')[0] || 'Chapter';
          
          console.log('Typing first word:', firstWord);
          
          // Clear any existing content first
          editor.innerHTML = '';
          
          // Type the first word character by character to activate the editor
          for (let i = 0; i < firstWord.length; i++) {
            const char = firstWord[i];
            
            // Simulate keydown event
            const keyDownEvent = new KeyboardEvent('keydown', {
              key: char,
              bubbles: true,
              cancelable: true
            });
            editor.dispatchEvent(keyDownEvent);
            
            // Add the character to the editor
            if (editor.textContent === '' || editor.innerHTML === '<p><br></p>') {
              editor.innerHTML = `<p>${char}</p>`;
            } else {
              const lastP = editor.querySelector('p:last-child');
              if (lastP) {
                lastP.textContent += char;
              } else {
                editor.innerHTML += char;
              }
            }
            
            // Trigger input event after each character
            const inputEvent = new Event('input', { bubbles: true });
            editor.dispatchEvent(inputEvent);
            
            // Small delay between characters
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          console.log('First word typed, now setting full content');
          
          // Now set the full content using the standard method
          editor.innerHTML = '';
          const htmlContent = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
          editor.innerHTML = htmlContent;
          
          // Remove blank class and trigger events
          editor.classList.remove('ql-blank');
          
          // Trigger multiple events to ensure detection
          const events = [
            new Event('input', { bubbles: true }),
            new Event('change', { bubbles: true }),
            new KeyboardEvent('keyup', { key: 'End', bubbles: true })
          ];
          
          events.forEach(event => editor.dispatchEvent(event));
          
          console.log('Full content set, waiting for processing...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Click save button to ensure content is saved
          const saveButton = document.querySelector('.save-button');
          if (saveButton) {
            console.log('Clicking save button');
            saveButton.click();
            
            // Wait for save to complete
            await new Promise(resolve => setTimeout(resolve, 3000));
          } else {
            console.log('Save button not found');
          }
          
          // Validate that content is properly detected
          let contentDetected = false;
          let contentText = '';
          
          if (quillInstance) {
            contentText = quillInstance.getText().trim();
            contentDetected = contentText.length > 0;
            console.log('Quill content length:', contentText.length);
          } else {
            contentText = editor.textContent || editor.innerText || '';
            contentDetected = contentText.trim().length > 0;
            console.log('DOM content length:', contentText.trim().length);
          }
          
          if (!contentDetected) {
            console.error('Content was not properly detected by editor');
            return { success: false, error: 'Content was not properly detected by the editor' };
          }
          
          console.log('Content successfully detected, first 100 chars:', contentText.substring(0, 100));
          
          // Step 6: Click submit chapter button
          const submitButton = document.querySelector('.publishing-buttons-group .publish-button');
          if (!submitButton) {
            return { success: false, error: 'Could not find submit chapter button' };
          }
          
          console.log('Clicking submit chapter button');
          submitButton.click();
          
          // Step 7: Wait for submission to complete and check for success
          console.log('Waiting for submission to process...');
          
          // Poll for submission completion with timeout
          let submitted = false;
          let submitAttempts = 0;
          const maxSubmitAttempts = 20; // 20 attempts * 1 second = 20 seconds max wait
          
          while (!submitted && submitAttempts < maxSubmitAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            submitAttempts++;
            
            // Check if submission was successful by looking for "Submitted" button or status changes
            const submittedButton = document.querySelector('.publishing-buttons-group .unpublish-button');
            const submitButton = document.querySelector('.publishing-buttons-group .publish-button');
            
            // Check if button text changed to indicate submission
            if (submittedButton && submittedButton.textContent.includes('Submitted')) {
              submitted = true;
              console.log('Chapter successfully submitted to Inkitt');
              return { success: true, message: 'Chapter posted and submitted successfully' };
            }
            
            // Also check if the submit button is disabled or changed
            if (submitButton && (submitButton.disabled || submitButton.textContent.includes('Submitting'))) {
              console.log(`Submission in progress... attempt ${submitAttempts}/${maxSubmitAttempts}`);
              continue;
            }
            
            // Check for other success indicators
            const successIndicators = [
              '.label-success',
              '.success-message', 
              '[class*="success"]',
              '.alert-success'
            ];
            
            for (const selector of successIndicators) {
              if (document.querySelector(selector)) {
                submitted = true;
                console.log('Found success indicator:', selector);
                return { success: true, message: 'Chapter posted successfully' };
              }
            }
            
            console.log(`Waiting for submission completion... attempt ${submitAttempts}/${maxSubmitAttempts}`);
          }
          
          if (!submitted) {
            console.log('Submission timeout reached, checking final status');
            // Final check after timeout
            const finalSubmittedButton = document.querySelector('.publishing-buttons-group .unpublish-button');
            if (finalSubmittedButton && finalSubmittedButton.textContent.includes('Submitted')) {
              return { success: true, message: 'Chapter posted and submitted successfully' };
            } else {
              return { success: false, error: 'Chapter created but submission timed out or status unclear' };
            }
          }
          
          } catch (error) {
            console.error("Error in content filling and submission:", error);
            return { success: false, error: error.message };
          }
        },
        args: [chapterData.content]
      });
      
      console.log("Content results:", contentResults);
      
      if (contentResults && contentResults[0] && contentResults[0].result) {
        const result = contentResults[0].result;
        
        if (result.success) {
          console.log(`Successfully posted chapter ${chapterNumber} to Inkitt`);
          return { success: true, platform: 'inkitt', message: result.message || 'Chapter posted successfully' };
        } else {
          console.error(`Failed to post chapter ${chapterNumber} to Inkitt:`, result.error);
          return { success: false, error: result.error || 'Unknown error posting to Inkitt' };
        }
      } else {
        console.error("No valid result from content filling script");
        return { success: false, error: 'No response from content filling script' };
      }
      
    } catch (error) {
      console.error("Error in content filling step:", error);
      return { success: false, error: error.toString() };
    }
    
  } catch (error) {
    console.error('Error posting to Inkitt:', error);
    return { success: false, error: error.toString() };
  } finally {
    // Close the tab after posting
    if (tab && tab.id) {
      try {
        await chrome.tabs.remove(tab.id);
        console.log("Inkitt tab closed successfully");
      } catch (closeError) {
        console.error('Error closing Inkitt tab:', closeError);
      }
    }
  }
}

/**
 * Reorders ScribbleHub chapters in the currently active tab
 * @param {string} storyId - The ScribbleHub story ID (used only for logging)
 * @returns {Promise} - Resolves when reordering is complete
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);
  
  const handleMessage = async () => {
    try {
      switch (message.action) {
        case 'getDailyQuotaInfo':
          console.log("Getting daily quota info");
          try {
            // All features now free with no limits
            sendResponse({
              success: true,
              usage: 0,
              limit: -1, // Unlimited
              userTier: 'pro',
              shouldShowLimitPrompt: false
            });
          } catch (error) {
            console.error("Error getting daily quota info:", error);
            sendResponse({
              success: false,
              error: error.toString()
            });
          }
          break;
          
        case 'scanCurrentTab':
          console.log("Scanning current tab with params:", message);
          try {
            const scanTabResult = await scanCurrentTab(
              message.startChapter,
              message.endChapter,
              message.targetPlatforms,
              message.batchSize || 1
            );
            sendResponse(scanTabResult);
          } catch (error) {
            console.error("Error in scanCurrentTab:", error);
            sendResponse({
              success: false,
              error: error.message
            });
          }
          break;
          
        case 'retryFailedChapters':
          console.log("Retrying failed chapters with params:", message);
          const retryResult = await retryFailedChapters(message.batchSize);
          console.log("Retry result:", retryResult);
          sendResponse(retryResult);
          break;
          
        case 'stopProcessing':
        case 'stopSync':
          console.log("Stopping queue processing");
          await chrome.storage.local.set({ isSyncing: false });
          console.log("Stopped processing, sending response");
          sendResponse({ success: true, message: 'Processing stopped' });
          break;
          
          
        case 'getStatus':
        case 'getSyncStatus':
          console.log("Getting sync status");
          
          const statusData = await chrome.storage.local.get([
            'queueConfig', 'isSyncing', 'lastSyncLog', 'scanningPhase', 'postingPhase'
          ]);
          
          console.log("Status data being sent:", statusData);
          
          if (!statusData.queueConfig) {
            statusData.queueConfig = {
              totalChapters: 0,
              completedChapters: 0,
              failedChapters: 0,
              scannedChapters: 0
            };
          }
          
          if (!statusData.lastSyncLog || !Array.isArray(statusData.lastSyncLog)) {
            statusData.lastSyncLog = [];
          }
          
          const statusResponse = {
            success: true,
            status: statusData
          };
          
          console.log("Sending status response:", statusResponse);
          sendResponse(statusResponse);
          break;
        
        default:
          console.warn(`Unknown message action: ${message.action}`);
          sendResponse({ success: false, error: `Unknown action: ${message.action}` });
      }
    } catch (error) {
      console.error(`Error handling message ${message.action}:`, error);
      sendResponse({ success: false, error: error.toString() });
    }
  };
  
  handleMessage();
  return true;
});

chrome.storage.local.get(['isSyncing', 'queueConfig', 'scanningPhase', 'postingPhase'], async (data) => {
  if (data.isSyncing && data.queueConfig) {
    console.log("Resuming sync after restart");
    setTimeout(() => {
      if (data.scanningPhase || data.postingPhase) {
        chrome.storage.local.set({ 
          isSyncing: false,
          scanningPhase: false,
          postingPhase: false
        });
      }
    }, 5000);
  }
});


console.log("Background service worker initialized");
