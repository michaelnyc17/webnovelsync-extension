// WebnovelSync - Background Service Worker
// Sync webnovel chapters across 7 platforms

// Configuration
const CONFIG = {
  BATCH_SIZE: 100,  // Unlimited batch processing
  DELAY_BETWEEN_BATCHES: 2000,
  MAX_RETRIES: 3
};

// Platform configurations
const PLATFORMS = {
  webnovel: {
    name: 'Webnovel',
    baseUrl: 'https://www.webnovel.com',
    checkSignIn: async () => {
      try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab.url.includes('webnovel.com')) return false;
        
        const results = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            return document.querySelector('.avatar') !== null;
          }
        });
        return results[0]?.result || false;
      } catch (error) {
        console.error('Webnovel sign-in check failed:', error);
        return false;
      }
    }
  },
  scribblehub: {
    name: 'ScribbleHub',
    baseUrl: 'https://www.scribblehub.com',
    checkSignIn: async () => {
      try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab.url.includes('scribblehub.com')) return false;
        
        const results = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            return document.querySelector('.user-avatar') !== null;
          }
        });
        return results[0]?.result || false;
      } catch (error) {
        console.error('ScribbleHub sign-in check failed:', error);
        return false;
      }
    }
  },
  fanfiction: {
    name: 'FanFiction.Net',
    baseUrl: 'https://www.fanfiction.net',
    checkSignIn: async () => {
      try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab.url.includes('fanfiction.net')) return false;
        
        const results = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            return document.querySelector('#login_link') === null;
          }
        });
        return results[0]?.result || false;
      } catch (error) {
        console.error('FanFiction.Net sign-in check failed:', error);
        return false;
      }
    }
  },
  ao3: {
    name: 'Archive of Our Own',
    baseUrl: 'https://archiveofourown.org',
    checkSignIn: async () => {
      try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab.url.includes('archiveofourown.org')) return false;
        
        const results = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            return document.querySelector('.user.dropdown') !== null;
          }
        });
        return results[0]?.result || false;
      } catch (error) {
        console.error('AO3 sign-in check failed:', error);
        return false;
      }
    }
  },
  royalroad: {
    name: 'Royal Road',
    baseUrl: 'https://www.royalroad.com',
    checkSignIn: async () => {
      try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab.url.includes('royalroad.com')) return false;
        
        const results = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            return document.querySelector('.user-profile') !== null;
          }
        });
        return results[0]?.result || false;
      } catch (error) {
        console.error('Royal Road sign-in check failed:', error);
        return false;
      }
    }
  },
  wattpad: {
    name: 'Wattpad',
    baseUrl: 'https://www.wattpad.com',
    checkSignIn: async () => {
      try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab.url.includes('wattpad.com')) return false;
        
        const results = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            return document.querySelector('.avatar') !== null;
          }
        });
        return results[0]?.result || false;
      } catch (error) {
        console.error('Wattpad sign-in check failed:', error);
        return false;
      }
    }
  },
  inkitt: {
    name: 'Inkitt',
    baseUrl: 'https://www.inkitt.com',
    checkSignIn: async () => {
      try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab.url.includes('inkitt.com')) return false;
        
        const results = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: () => {
            return document.querySelector('.user-menu') !== null;
          }
        });
        return results[0]?.result || false;
      } catch (error) {
        console.error('Inkitt sign-in check failed:', error);
        return false;
      }
    }
  }
};

// Storage helper functions
async function getStoredData(keys) {
  return new Promise(resolve => {
    chrome.storage.sync.get(keys, resolve);
  });
}

async function setStoredData(data) {
  return new Promise(resolve => {
    chrome.storage.sync.set(data, resolve);
  });
}

// User tier functions (simplified for free extension)
async function getUserTier() {
  return 'pro'; // Always return pro tier since extension is free
}

async function getTierLimits() {
  return {
    dailyChapters: Infinity,
    batchSize: CONFIG.BATCH_SIZE
  };
}

// Chapter processing functions
async function processChapterBatch(chapters, platform) {
  const results = [];
  
  for (let i = 0; i < chapters.length; i += CONFIG.BATCH_SIZE) {
    const batch = chapters.slice(i, i + CONFIG.BATCH_SIZE);
    
    try {
      const batchResults = await processBatch(batch, platform);
      results.push(...batchResults);
      
      // Add delay between batches
      if (i + CONFIG.BATCH_SIZE < chapters.length) {
        await sleep(CONFIG.DELAY_BETWEEN_BATCHES);
      }
    } catch (error) {
      console.error(`Batch processing failed:`, error);
      results.push(...batch.map(chapter => ({
        ...chapter,
        status: 'failed',
        error: error.message
      })));
    }
  }
  
  return results;
}

async function processBatch(chapters, platform) {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: syncChaptersToPlatform,
      args: [chapters, platform]
    }, (results) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(results[0]?.result || []);
      }
    });
  });
}

// Utility functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'getUserTier':
          const tier = await getUserTier();
          sendResponse({success: true, tier});
          break;

        case 'getTierLimits':
          const limits = await getTierLimits();
          sendResponse({success: true, limits});
          break;

        case 'checkSignIn':
          const platform = PLATFORMS[request.platform];
          if (platform) {
            const signedIn = await platform.checkSignIn();
            sendResponse({success: true, signedIn});
          } else {
            sendResponse({success: false, error: 'Unknown platform'});
          }
          break;

        case 'syncChapters':
          const {chapters, targetPlatform} = request;
          const results = await processChapterBatch(chapters, targetPlatform);
          sendResponse({success: true, results});
          break;

        case 'extractChapters':
          const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
          const extractResults = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: extractChaptersFromPage
          });
          sendResponse({success: true, chapters: extractResults[0]?.result || []});
          break;

        default:
          sendResponse({success: false, error: 'Unknown action'});
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({success: false, error: error.message});
    }
  })();
  
  return true; // Keep the messaging channel open for async response
});

// Content script injection functions
function syncChaptersToPlatform(chapters, platform) {
  // This function runs in the context of the webpage
  return new Promise((resolve) => {
    // Implementation varies by platform
    // Each platform has its own sync logic
    const results = chapters.map(chapter => ({
      ...chapter,
      status: 'synced',
      timestamp: Date.now()
    }));
    resolve(results);
  });
}

function extractChaptersFromPage() {
  // This function runs in the context of the webpage
  const chapters = [];
  
  // Extract chapter information from the current page
  // Implementation varies by platform
  
  return chapters;
}

// Initialization
chrome.runtime.onInstalled.addListener(() => {
  console.log('WebnovelSync extension installed');
  
  // Set up default storage
  setStoredData({
    extensionEnabled: true,
    syncSettings: {
      autoSync: false,
      syncDelay: 1000,
      batchSize: CONFIG.BATCH_SIZE
    }
  });
});

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  console.log('WebnovelSync extension started');
});