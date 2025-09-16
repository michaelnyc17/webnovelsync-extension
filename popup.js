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

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  
  initializeTheme();
  
  class ToastManager {
    constructor() {
      this.container = document.getElementById('toastContainer');
      this.toasts = new Map();
      this.toastCounter = 0;
    }
    
    show(type, title, message, duration = 5000) {
      const toastId = `toast-${++this.toastCounter}`;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.id = toastId;
      
      toast.innerHTML = `
        <div class="toast-icon">${icons[type] || 'ℹ'}</div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" type="button">×</button>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
      `;
      
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.hide(toastId));
      
      this.container.appendChild(toast);
      this.toasts.set(toastId, toast);
      
      if (duration > 0) {
        setTimeout(() => this.hide(toastId), duration);
      }
      
      return toastId;
    }
    
    hide(toastId) {
      const toast = this.toasts.get(toastId);
      if (!toast) return;
      
      toast.style.animation = 'toastSlideOut 0.3s ease forwards';
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts.delete(toastId);
      }, 300);
    }
    
    success(title, message, duration) {
      return this.show('success', title, message, duration);
    }
    
    error(title, message, duration = 8000) {
      return this.show('error', title, message, duration);
    }
    
    warning(title, message, duration = 6000) {
      return this.show('warning', title, message, duration);
    }
    
    info(title, message, duration) {
      return this.show('info', title, message, duration);
    }
    
    clear() {
      this.toasts.forEach((toast, id) => this.hide(id));
    }
  }
  
  const toast = new ToastManager();
  
  // Upgrade prompts removed - all features now free
  
  window.showToast = toast;
  
  class FormValidator {
    constructor() {
      this.validators = new Map();
      this.validationResults = new Map();
    }
    
    addField(fieldId, validators) {
      const field = document.getElementById(fieldId);
      if (!field) return;
      
      this.validators.set(fieldId, validators);
      this.setupFieldValidation(field, validators);
    }
    
    setupFieldValidation(field, validators) {
      const fieldId = field.id;
      
      const inputGroup = field.closest('.input-group');
      
      if (inputGroup && !inputGroup.querySelector('.field-error')) {
        const errorMsg = document.createElement('span');
        errorMsg.className = 'field-error';
        inputGroup.appendChild(errorMsg);
      }
      
      field.addEventListener('input', () => this.validateField(fieldId));
      field.addEventListener('blur', () => this.validateField(fieldId));
    }
    
    validateField(fieldId) {
      const field = document.getElementById(fieldId);
      const validators = this.validators.get(fieldId);
      if (!field || !validators) return true;
      
      const value = field.value.trim();
      const inputGroup = field.closest('.input-group');
      const errorMsg = inputGroup?.querySelector('.field-error');
      
      field.classList.remove('error', 'success');
      errorMsg?.classList.remove('show');
      
      for (const validator of validators) {
        const result = validator(value, field);
        if (!result.isValid) {
          field.classList.add('error');
          if (errorMsg) {
            errorMsg.textContent = result.message;
            errorMsg.classList.add('show');
          }
          this.validationResults.set(fieldId, false);
          return false;
        }
      }
      
      field.classList.add('success');
      
      this.validationResults.set(fieldId, true);
      return true;
    }
    
    validateAll() {
      let allValid = true;
      for (const fieldId of this.validators.keys()) {
        if (!this.validateField(fieldId)) {
          allValid = false;
        }
      }
      return allValid;
    }
    
    isFieldValid(fieldId) {
      return this.validationResults.get(fieldId) === true;
    }
  }
  
  const validator = new FormValidator();
  
  validator.addField('startChapter', [
    (value) => {
      if (!value) return { isValid: false, message: 'Start chapter is required' };
      const num = parseInt(value);
      if (isNaN(num)) return { isValid: false, message: 'Must be a valid number' };
      if (num < 1) return { isValid: false, message: 'Must be at least 1' };
      if (num > 10000) return { isValid: false, message: 'Must be 10,000 or less' };
      return { isValid: true };
    }
  ]);
  
  validator.addField('endChapter', [
    (value) => {
      if (!value) return { isValid: false, message: 'End chapter is required' };
      const num = parseInt(value);
      if (isNaN(num)) return { isValid: false, message: 'Must be a valid number' };
      if (num < 1) return { isValid: false, message: 'Must be at least 1' };
      if (num > 10000) return { isValid: false, message: 'Must be 10,000 or less' };
      
      const startChapter = document.getElementById('startChapter');
      if (startChapter && startChapter.value) {
        const startNum = parseInt(startChapter.value);
        if (!isNaN(startNum) && num < startNum) {
          return { isValid: false, message: 'Must be greater than or equal to start chapter' };
        }
      }
      
      return { isValid: true };
    }
  ]);
  
  const storyIdFields = ['scribblehubStoryId', 'fanfictionStoryId', 'ao3WorkId', 'royalroadWorkId', 'webnovelStoryId', 'wattpadStoryId'];
  storyIdFields.forEach(fieldId => {
    validator.addField(fieldId, [
      (value, field) => {
        const platform = field.closest('.platform-box');
        const enabledToggle = platform?.querySelector('input[type="checkbox"]');
        
        if (enabledToggle && enabledToggle.checked) {
          if (!value) return { isValid: false, message: 'Story/Work ID is required when platform is enabled' };
          if (value.length < 2) return { isValid: false, message: 'ID seems too short' };
          if (!/^[a-zA-Z0-9_-]+$/.test(value)) return { isValid: false, message: 'ID contains invalid characters' };
        }
        
        return { isValid: true };
      }
    ]);
  });
  
  // All features available to everyone
  const ALL_FEATURES = {
    chaptersPerDay: -1,  // Unlimited
    batchSize: 10,       // Maximum batch size
    platforms: ['scribblehub', 'fanfiction', 'ao3', 'royalroad', 'webnovel', 'wattpad', 'inkitt']
  };
  
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const scanCurrentTabBtn = document.getElementById('scanCurrentTabBtn');
  const stopSyncBtn = document.getElementById('stopSyncBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const startChapterInput = document.getElementById('startChapter');
  const endChapterInput = document.getElementById('endChapter');
  const progressBar = document.getElementById('progressBar');
  const pendingCountEl = document.getElementById('pendingCount');
  const completedCountEl = document.getElementById('completedCount');
  const failedCountEl = document.getElementById('failedCount');
  const syncLogEl = document.getElementById('syncLog');
  const batchSizeSelect = document.getElementById('batchSizeSelect');
  const chapterTitleFormat = document.getElementById('chapterTitleFormat');
  const retryFailedBtn = document.getElementById('retryFailedBtn');
  const settingsToggle = document.getElementById('settingsToggle');
  const advancedSettings = document.getElementById('advancedSettings');
  
  
  
  const platforms = [
    {
      name: 'scribblehub',
      enabledToggle: document.getElementById('scribblehubEnabled'),
      detailsEl: document.getElementById('scribblehubDetails'),
      storyIdInput: document.getElementById('scribblehubStoryId'),
      lastChapterInput: document.getElementById('scribblehubLastChapter'),
      statusEl: document.getElementById('scribblehubStatus')
    },
    {
      name: 'fanfiction',
      enabledToggle: document.getElementById('fanfictionEnabled'),
      detailsEl: document.getElementById('fanfictionDetails'),
      storyIdInput: document.getElementById('fanfictionStoryId'),
      lastChapterInput: document.getElementById('fanfictionLastChapter'),
      statusEl: document.getElementById('fanfictionStatus')
    },
    {
      name: 'ao3',
      enabledToggle: document.getElementById('ao3Enabled'),
      detailsEl: document.getElementById('ao3Details'),
      storyIdInput: document.getElementById('ao3WorkId'),
      lastChapterInput: document.getElementById('ao3LastChapter'),
      statusEl: document.getElementById('ao3Status')
    },
    {
      name: 'royalroad',
      enabledToggle: document.getElementById('royalroadEnabled'),
      detailsEl: document.getElementById('royalroadDetails'),
      storyIdInput: document.getElementById('royalroadWorkId'),
      lastChapterInput: document.getElementById('royalroadLastChapter'),
      statusEl: document.getElementById('royalroadStatus')
    },
    {
      name: 'webnovel',
      enabledToggle: document.getElementById('webnovelEnabled'),
      detailsEl: document.getElementById('webnovelDetails'),
      storyIdInput: document.getElementById('webnovelStoryId'),
      lastChapterInput: document.getElementById('webnovelLastChapter'),
      statusEl: document.getElementById('webnovelStatus')
    },
    {
      name: 'wattpad',
      enabledToggle: document.getElementById('wattpadEnabled'),
      detailsEl: document.getElementById('wattpadDetails'),
      storyIdInput: document.getElementById('wattpadStoryId'),
      lastChapterInput: document.getElementById('wattpadLastChapter'),
      statusEl: document.getElementById('wattpadStatus')
    },
    {
      name: 'inkitt',
      enabledToggle: document.getElementById('inkittEnabled'),
      detailsEl: document.getElementById('inkittDetails'),
      storyIdInput: document.getElementById('inkittStoryId'),
      lastChapterInput: document.getElementById('inkittLastChapter'),
      statusEl: document.getElementById('inkittStatus')
    }
  ];
  
  function sendMessageToBackground(message) {
    console.log("Sending message to background:", message);
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, response => {
          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
            return;
          }
          
          if (!response) {
            console.error('No response received from background script');
            reject(new Error('No response from background script'));
            return;
          }
          
          console.log(`Response received for ${message.action}:`, response);
          resolve(response);
        });
      } catch (error) {
        console.error('Error sending message:', error);
        reject(error);
      }
    });
  }
  
  async function retryFailedChapters() {
    try {
      const enabledPlatforms = platforms
        .filter(p => p.enabledToggle && p.enabledToggle.checked)
        .map(p => p.name);
      
      // All features now free - no restrictions
      
      statusText.textContent = 'Retrying failed chapters...';
      statusIndicator.className = 'status-indicator syncing';
      retryFailedBtn.disabled = true;
      stopSyncBtn.disabled = false;
      
      let batchSize = batchSizeSelect ? parseInt(batchSizeSelect.value) : 1;
      
      // All batch sizes now available to everyone
      
      const result = await sendMessageToBackground({
        action: 'retryFailedChapters',
        batchSize: batchSize
      });
      
      if (result.success) {
        statusText.textContent = `Retry complete: ${result.completedCount} succeeded, ${result.failedCount} failed`;
        if (result.failedCount > 0) {
          statusIndicator.className = 'status-indicator error';
          toast.warning('Retry Completed', `${result.completedCount} chapters succeeded, ${result.failedCount} still failed.`);
        } else {
          statusIndicator.className = 'status-indicator active';
          toast.success('Retry Successful', `All ${result.completedCount} failed chapters were successfully retried.`);
        }
      } else {
        console.error('Error retrying chapters:', result.error);
        
        toast.error('Retry Failed', result.error);
        statusText.textContent = `Error: ${result.error}`;
        
        statusIndicator.className = 'status-indicator error';
      }
      
      if (result.failedCount > 0) {
        retryFailedBtn.disabled = false;
      }
      
      stopSyncBtn.disabled = true;
    } catch (error) {
      console.error('Error retrying failed chapters:', error);
      
      toast.error('Communication Error', `Unable to communicate with background script: ${error.message}`);
      statusText.textContent = 'Communication error';
      
      statusIndicator.className = 'status-indicator error';
      retryFailedBtn.disabled = false;
      stopSyncBtn.disabled = true;
    }
  }
  

  // All features now free
  async function checkSubscriptionStatus() {
    return {
      paid: true,
      email: 'free_user'
    };
  }

  // Payment functionality removed - all features now free

  window.addEventListener('focus', async function() {
    console.log('Window focused - checking status');
    
    await loadSettings();
    
  });
  (async function() {
    await loadSettings();
  })();
  
  
  checkSyncStatus();
  
  const statusInterval = setInterval(checkSyncStatus, 2000);
  
  if (batchSizeSelect) {
    batchSizeSelect.addEventListener('change', async function() {
      const selectedBatchSize = parseInt(this.value);
      console.log(`Batch size changed to ${selectedBatchSize}`);
    });
  }
  
  if (chapterTitleFormat) {
    chapterTitleFormat.addEventListener('change', async function() {
      const selectedFormat = this.value;
      await chrome.storage.local.set({ chapterTitleFormat: selectedFormat });
      console.log(`Chapter title format set to: ${selectedFormat}`);
    });
  }
  
  // Settings toggle functionality
  if (settingsToggle && advancedSettings) {
    settingsToggle.addEventListener('click', function() {
      const isExpanded = advancedSettings.style.display !== 'none';
      
      if (isExpanded) {
        // Hide settings
        advancedSettings.style.display = 'none';
        settingsToggle.classList.remove('expanded');
      } else {
        // Show settings
        advancedSettings.style.display = 'block';
        settingsToggle.classList.add('expanded');
      }
      
      // Save state
      chrome.storage.local.set({ advancedSettingsExpanded: !isExpanded });
    });
    
    // Load saved state
    chrome.storage.local.get(['advancedSettingsExpanded']).then(data => {
      if (data.advancedSettingsExpanded) {
        advancedSettings.style.display = 'block';
        settingsToggle.classList.add('expanded');
      }
    });
  }
  
  scanCurrentTabBtn.addEventListener('click', scanCurrentTab);
  stopSyncBtn.addEventListener('click', stopSync);
  retryFailedBtn.addEventListener('click', retryFailedChapters);
  
  const autoSaveInputs = [
    'startChapter', 'endChapter', 'scribblehubStoryId', 'scribblehubLastChapter',
    'fanfictionStoryId', 'fanfictionLastChapter', 'ao3WorkId', 'ao3LastChapter',
    'royalroadWorkId', 'royalroadLastChapter', 'webnovelStoryId', 'webnovelLastChapter',
    'wattpadStoryId', 'wattpadLastChapter'
  ];
  
  autoSaveInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', autoSave);
      input.addEventListener('change', autoSave);
    }
  });
  
  const autoSaveSelects = ['batchSizeSelect'];
  autoSaveSelects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (select) {
      select.addEventListener('change', autoSave);
    }
  });
  
  platforms.forEach(platform => {
    if (platform.enabledToggle) {
      platform.enabledToggle.addEventListener('change', autoSave);
    }
  });
  
  
  
  
  
  
  platforms.forEach(platform => {
    if (platform.enabledToggle) {
      platform.enabledToggle.addEventListener('change', function() {
        togglePlatformDetails(platform.detailsEl, this.checked);
        
        if (platform.storyIdInput) {
          validator.validateField(platform.storyIdInput.id);
        }
      });
    }
  });
  
  
  async function loadSettings() {
    try {
      const data = await chrome.storage.local.get(['platforms', 'batchSize', 'chapterTitleFormat', 'startChapter', 'endChapter']);
      
      console.log('LoadSettings - All features available');
      
      if (batchSizeSelect) {
        let savedBatchSize = data.batchSize || 1;
        batchSizeSelect.value = savedBatchSize;
        
        Array.from(batchSizeSelect.options).forEach(option => {
          option.disabled = false;
          option.text = option.text.replace(/ \(Upgrade Required\)$/, '');
        });
        
      }
      
      if (chapterTitleFormat) {
        const savedTitleFormat = data.chapterTitleFormat || 'with_number';
        chapterTitleFormat.value = savedTitleFormat;
      }
      
      if (startChapterInput && data.startChapter !== undefined) {
        startChapterInput.value = data.startChapter;
      }
      if (endChapterInput && data.endChapter !== undefined) {
        endChapterInput.value = data.endChapter;
      }
      
      // All platforms now available to everyone
      platforms.forEach(platform => {
        if (platform.enabledToggle) {
          platform.enabledToggle.disabled = false;
          const header = platform.enabledToggle.closest('.platform-header');
          if (header) {
            const labels = header.querySelectorAll('.pro-label, .basic-label');
            labels.forEach(label => label.remove());
          }
        }
      });
      
      const platformConfig = data.platforms || {
        scribblehub: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        fanfiction: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        ao3: { enabled: false, workId: '', lastSyncedChapter: 0 },
        royalroad: { enabled: false, workId: '', lastSyncedChapter: 0 },
        webnovel: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        wattpad: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        inkitt: { enabled: false, storyId: '', lastSyncedChapter: 0 }
      };
      
      platforms.forEach(platform => {
        const config = platformConfig[platform.name] || { enabled: false, storyId: '', lastSyncedChapter: 0 };
        if (platform.enabledToggle) platform.enabledToggle.checked = config.enabled;
        
        if (platform.name === 'ao3' || platform.name === 'royalroad') {
          if (platform.storyIdInput) platform.storyIdInput.value = config.workId || '';
        } else {
          if (platform.storyIdInput) platform.storyIdInput.value = config.storyId || '';
        }
        
        if (platform.lastChapterInput) platform.lastChapterInput.value = config.lastSyncedChapter || 0;
        if (platform.detailsEl && platform.enabledToggle) {
          togglePlatformDetails(platform.detailsEl, platform.enabledToggle.checked);
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  function togglePlatformDetails(element, isVisible) {
    if (!element) return;
    
    if (isVisible) {
      element.classList.add('visible');
    } else {
      element.classList.remove('visible');
    }
  }
  
  async function checkSyncStatus() {
    try {
      console.log("Checking sync status...");
      
      // Also directly check storage for sync log in case background script hasn't updated yet
      const storageData = await chrome.storage.local.get(['lastSyncLog']);
      console.log("Direct storage sync log:", storageData.lastSyncLog);
      
      const response = await sendMessageToBackground({ action: 'getStatus' });
      console.log("Received status response:", response);
      
      if (!response || !response.success) {
        console.error("Invalid status response:", response);
        // Fallback to direct storage data if available
        if (storageData.lastSyncLog && storageData.lastSyncLog.length > 0) {
          console.log("Using fallback storage sync log");
          updateSyncLog(storageData.lastSyncLog);
        }
        return;
      }
      
      const statusData = response.status || {};
      console.log("Status data:", statusData);
      
      const isSyncing = statusData.isSyncing || false;
      const scanningPhase = statusData.scanningPhase || false;
      const postingPhase = statusData.postingPhase || false;
      const queueConfig = statusData.queueConfig || {};
      
      console.log("Queue config:", queueConfig);
      
      const totalChapters = queueConfig.totalChapters || 0;
      const completedChapters = queueConfig.completedChapters || 0;
      const failedChapters = queueConfig.failedChapters || 0;
      const scannedChapters = queueConfig.scannedChapters || 0;
      const pendingChapters = totalChapters - completedChapters - failedChapters;
      
      console.log(`Status: isSyncing=${isSyncing}, scanning=${scanningPhase}, posting=${postingPhase}`);
      console.log(`Chapters: total=${totalChapters}, completed=${completedChapters}, failed=${failedChapters}, scanned=${scannedChapters}`);
      
      statusIndicator.className = 'status-indicator';
      
      if (isSyncing) {
        scanCurrentTabBtn.disabled = true;
        stopSyncBtn.disabled = false;
        
        if (scanningPhase) {
          statusIndicator.classList.add('scanning');
          statusText.textContent = `Scanning chapters: ${scannedChapters}/${totalChapters}`;
        } else if (postingPhase) {
          statusIndicator.classList.add('syncing');
          const chaptersToPost = Math.max(scannedChapters, totalChapters);
          statusText.textContent = `Posting chapters: ${completedChapters + failedChapters}/${chaptersToPost}`;
        } else {
          statusIndicator.classList.add('syncing');
          statusText.textContent = 'Preparing sync...';
        }
      } else if (totalChapters > 0 && pendingChapters === 0) {
        if (failedChapters > 0) {
          statusIndicator.classList.add('error');
          statusText.textContent = `Sync completed with ${failedChapters} errors`;
        } else {
          statusIndicator.classList.add('active');
          statusText.textContent = 'Sync completed successfully';
          
        }
        scanCurrentTabBtn.disabled = false;
        stopSyncBtn.disabled = true;
      } else {
        statusIndicator.classList.add(totalChapters > 0 ? 'active' : '');
        statusText.textContent = totalChapters > 0 ? 'Ready to sync' : 'No sync queue';
        scanCurrentTabBtn.disabled = false;
        stopSyncBtn.disabled = true;
      }
      
      retryFailedBtn.disabled = isSyncing || failedChapters === 0;
      
      pendingCountEl.textContent = pendingChapters;
      completedCountEl.textContent = completedChapters;
      failedCountEl.textContent = failedChapters;
      
      if (totalChapters > 0) {
        let progress;
        
        if (scanningPhase) {
          // During scanning: show scanning progress
          progress = Math.min((scannedChapters / totalChapters) * 100, 100);
        } else if (postingPhase) {
          // During posting: show posting progress based on scanned chapters
          const chaptersToPost = Math.max(scannedChapters, 1); // Avoid division by zero
          const processedChapters = completedChapters + failedChapters;
          progress = Math.min((processedChapters / chaptersToPost) * 100, 100);
        } else if (completedChapters + failedChapters > 0) {
          // Sync complete: show final progress
          progress = 100;
        } else {
          // No progress yet
          progress = 0;
        }
        
        // Ensure progress is never NaN or negative
        progress = Math.max(0, Math.min(100, progress || 0));
        
        console.log(`Progress bar: ${progress.toFixed(2)}% (scanning: ${scanningPhase}, posting: ${postingPhase}, scanned: ${scannedChapters}/${totalChapters}, posted: ${completedChapters + failedChapters})`);
        progressBar.style.width = `${progress}%`;
      } else {
        progressBar.style.width = '0%';
      }
      
      // Use the more complete sync log (either from response or direct storage)
      const responseSyncLog = statusData.lastSyncLog || [];
      const storageSyncLog = storageData.lastSyncLog || [];
      
      const syncLogToUse = storageSyncLog.length >= responseSyncLog.length ? storageSyncLog : responseSyncLog;
      
      console.log("Response sync log entries:", responseSyncLog.length);
      console.log("Storage sync log entries:", storageSyncLog.length);
      console.log("Using sync log with", syncLogToUse.length, "entries");
      
      updateSyncLog(syncLogToUse);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  }
  
  function updateSyncLog(logEntries) {
    console.log(`Updating sync log with ${logEntries.length} entries`);
    
    if (!logEntries || logEntries.length === 0) {
      syncLogEl.innerHTML = '<div class="empty-log">No sync history yet</div>';
      return;
    }
    
    syncLogEl.innerHTML = '';
    
    logEntries.forEach((entry, index) => {
      console.log(`Processing log entry ${index}:`, entry);
      
      if (!entry || !entry.timestamp) {
        console.warn("Invalid log entry:", entry);
        return;
      }
      
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      
      let timestamp;
      try {
        timestamp = new Date(entry.timestamp);
      } catch (e) {
        console.warn("Invalid timestamp:", entry.timestamp);
        timestamp = new Date();
      }
      
      const formattedTime = timestamp.toLocaleString();
      
      let platformsHtml = '';
      if (entry.results && Array.isArray(entry.results)) {
        entry.results.forEach(result => {
          if (!result) return;
          
          const statusClass = result.success ? 'log-success' : 'log-error';
          const statusText = result.success ? 'Success' : 'Failed';
          platformsHtml += `
            <div class="log-platform">
              <span class="${statusClass}">${result.platform || 'Unknown'}: ${statusText}</span>
              ${!result.success && result.message ? ` - ${result.message}` : ''}
            </div>
          `;
        });
      }
      
      logEntry.innerHTML = `
        <div class="log-timestamp">${formattedTime}</div>
        <div class="log-title">Chapter ${entry.chapterNumber || '?'}: ${entry.chapterTitle || 'Unknown'}</div>
        <div class="log-platforms">${platformsHtml || '<div>No platform details</div>'}</div>
      `;
      
      syncLogEl.appendChild(logEntry);
    });
  }
  
  async function scanCurrentTab() {
      const enabledPlatforms = platforms
        .filter(p => p.enabledToggle && p.enabledToggle.checked)
        .map(p => p.name);
      
      if (enabledPlatforms.length === 0) {
        toast.warning('No Platforms Selected', 'Please enable at least one platform to sync to.');
        return;
      }
    
    let missingIds = [];
    enabledPlatforms.forEach(platformName => {
      const platform = platforms.find(p => p.name === platformName);
      if (platform && platform.storyIdInput) {
        const hasId = platform.name === 'ao3'
          ? platform.storyIdInput.value.trim() !== ''
          : platform.storyIdInput.value.trim() !== '';
          
        if (!hasId) {
          missingIds.push(platformName);
        }
      }
    });
    
    if (missingIds.length > 0) {
      toast.error('Missing Story IDs', `Please enter story IDs for: ${missingIds.join(', ')}`);
      return;
    }
    
    if (!validator.validateAll()) {
      toast.error('Validation Failed', 'Please fix the errors shown below before continuing.');
      return;
    }
    
    const startChapter = parseInt(startChapterInput.value);
    const endChapter = parseInt(endChapterInput.value);
    
    saveSettings(false, async function() {
      try {
        statusText.textContent = 'Scanning current tab...';
        statusIndicator.className = 'status-indicator scanning';
        scanCurrentTabBtn.disabled = true;
        stopSyncBtn.disabled = false;
        
        let batchSize = batchSizeSelect ? parseInt(batchSizeSelect.value) : 1;
        
        const result = await sendMessageToBackground({
          action: 'scanCurrentTab',
          startChapter: startChapter,
          endChapter: endChapter,
          targetPlatforms: enabledPlatforms,
          batchSize: batchSize
        });
        
      if (!result.success) {
        console.error('Error scanning tab:', result.error);
        
        toast.error('Scan Failed', result.error);
        statusText.textContent = `Error: ${result.error}`;
        
        statusIndicator.className = 'status-indicator error';
        scanCurrentTabBtn.disabled = false;
        stopSyncBtn.disabled = true;
      }
      } catch (error) {
        console.error('Error scanning tab:', error);
        
      toast.error('Communication Error', `Unable to communicate with background script: ${error.message}`);
      statusText.textContent = 'Communication error';
        
        statusIndicator.className = 'status-indicator error';
        scanCurrentTabBtn.disabled = false;
        stopSyncBtn.disabled = true;
      }
    });
  }
  
  async function stopSync() {
    try {
      const result = await sendMessageToBackground({ action: 'stopProcessing' });
      
      console.log('Stop sync result:', result);
      
      statusText.textContent = 'Sync stopped';
      statusIndicator.classList.remove('syncing');
      statusIndicator.classList.remove('scanning');
      scanCurrentTabBtn.disabled = false;
      stopSyncBtn.disabled = true;
    } catch (error) {
      console.error('Error stopping sync:', error);
      
      toast.error('Communication Error', `Unable to stop sync: ${error.message}`);
      statusText.textContent = 'Communication error';
      
      statusIndicator.className = 'status-indicator error';
    }
  }
  
  function saveSettings(showConfirmation = false, callback = null) {
    const settings = {
      platforms: {},
      batchSize: batchSizeSelect ? parseInt(batchSizeSelect.value) || 1 : 1,
      startChapter: startChapterInput ? parseInt(startChapterInput.value) || 1 : 1,
      endChapter: endChapterInput ? parseInt(endChapterInput.value) || 10 : 10
    };
    
    platforms.forEach(platform => {
      if (!platform.enabledToggle || !platform.storyIdInput) return;
      
      settings.platforms[platform.name] = {
        enabled: platform.enabledToggle.checked,
        lastSyncedChapter: parseInt(platform.lastChapterInput?.value) || 0
      };
      if (platform.name === 'ao3' || platform.name === 'royalroad') {
        settings.platforms[platform.name].workId = platform.storyIdInput.value;
      } else {
        settings.platforms[platform.name].storyId = platform.storyIdInput.value;
      }
      
      console.log(`Auto-saving settings for ${platform.name}:`, settings.platforms[platform.name]);
    });
    
    chrome.storage.local.set(settings, function() {
      if (showConfirmation) {
        toast.success('Settings Saved', 'Your configuration has been saved successfully.');
      }
      
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  }
  
  let autoSaveTimeout;
  function autoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveSettings(false);
    }, 1000);
  }
  

  const tutorialSteps = [
    {
      title: "Welcome to WebnovelSync!",
      text: "This extension helps you sync chapters between different novel platforms. Let's take a quick tour to get you started!",
      target: null,
      highlight: false
    },
    {
      title: "Chapter Range",
      text: "First, set which chapters you want to sync. Enter the start and end chapter numbers here.",
      target: ".sync-range-container",
      highlight: true
    },
    {
      title: "Choose Platforms",
      text: "Enable the platforms you want to sync TO. Each platform requires its own Story/Work ID. All platforms are now free!",
      target: ".platform-settings",
      highlight: true
    },
    {
      title: "Advanced Settings",
      text: "Click 'Advanced Settings' to access batch size and chapter title formatting options. Larger batch sizes are faster but may cause errors.",
      target: ".settings-toggle-container",
      highlight: true
    },
    {
      title: "Ready to Sync!",
      text: "Navigate to a supported source (Webnovel, AO3, etc.), configure your settings, and click 'Scan Current Tab' to start!",
      target: "#scanCurrentTabBtn",
      highlight: true
    }
  ];

  let currentTutorialStep = 0;
  let tutorialActive = false;

  const tutorialOverlay = document.getElementById('tutorialOverlay');
  const tutorialTitle = document.getElementById('tutorialTitle');
  const tutorialText = document.getElementById('tutorialText');
  const tutorialStepCounter = document.getElementById('tutorialStepCounter');
  const tutorialProgressFill = document.getElementById('tutorialProgressFill');
  const tutorialHighlight = document.querySelector('.tutorial-highlight');
  const tutorialClearOverlay = document.getElementById('tutorialClearOverlay');
  const tutorialPrevBtn = document.getElementById('tutorialPrev');
  const tutorialNextBtn = document.getElementById('tutorialNext');
  const tutorialSkipBtn = document.getElementById('tutorialSkip');

  function checkIfNewUser() {
    chrome.storage.local.get(['tutorialCompleted', 'platforms'], function(data) {
      const hasCompletedTutorial = data.tutorialCompleted;
      const hasConfiguredPlatforms = data.platforms && Object.values(data.platforms).some(p => p.enabled);
      
      if (!hasCompletedTutorial && !hasConfiguredPlatforms) {
        setTimeout(() => startTutorial(), 1000);
      }
    });
  }

  function startTutorial() {
    if (tutorialActive) return;
    
    tutorialActive = true;
    currentTutorialStep = 0;
    document.body.classList.add('tutorial-active');
    tutorialOverlay.style.display = 'flex';
    updateTutorialStep();
  }

  function updateTutorialStep() {
    const step = tutorialSteps[currentTutorialStep];
    const totalSteps = tutorialSteps.length;
    
    tutorialTitle.textContent = step.title;
    tutorialText.textContent = step.text;
    tutorialStepCounter.textContent = `${currentTutorialStep + 1} / ${totalSteps}`;
    
    const progressPercent = ((currentTutorialStep + 1) / totalSteps) * 100;
    tutorialProgressFill.style.width = `${progressPercent}%`;
    
    tutorialPrevBtn.disabled = currentTutorialStep === 0;
    tutorialNextBtn.textContent = currentTutorialStep === totalSteps - 1 ? 'Finish' : 'Next';
    
    if (step.target && step.highlight) {
      highlightElement(step.target);
    } else {
      hideHighlight();
      positionTutorialContent();
    }
  }

  function highlightElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      hideHighlight();
      positionTutorialContent();
      return;
    }
    
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      
      tutorialHighlight.style.display = 'block';
      tutorialHighlight.style.top = `${rect.top - 4}px`;
      tutorialHighlight.style.left = `${rect.left - 4}px`;
      tutorialHighlight.style.width = `${rect.width + 8}px`;
      tutorialHighlight.style.height = `${rect.height + 8}px`;
      tutorialHighlight.classList.add('pulse');
      
      createClearOverlay(element, rect);
      
      positionTutorialContent(rect);
    }, 300);
  }
  
  function createClearOverlay(element, rect) {
    const clone = element.cloneNode(true);
    
    tutorialClearOverlay.innerHTML = '';
    tutorialClearOverlay.appendChild(clone);
    
    tutorialClearOverlay.style.display = 'block';
    tutorialClearOverlay.style.top = `${rect.top}px`;
    tutorialClearOverlay.style.left = `${rect.left}px`;
    tutorialClearOverlay.style.width = `${rect.width}px`;
    tutorialClearOverlay.style.height = `${rect.height}px`;
    
    const computedStyle = window.getComputedStyle(element);
    clone.style.margin = '0';
    clone.style.padding = computedStyle.padding;
    clone.style.border = computedStyle.border;
    clone.style.borderRadius = computedStyle.borderRadius;
    clone.style.background = computedStyle.background;
    clone.style.color = computedStyle.color;
    clone.style.fontSize = computedStyle.fontSize;
    clone.style.fontFamily = computedStyle.fontFamily;
    clone.style.fontWeight = computedStyle.fontWeight;
  }

  function hideHighlight() {
    tutorialHighlight.style.display = 'none';
    tutorialHighlight.classList.remove('pulse');
    tutorialClearOverlay.style.display = 'none';
    tutorialClearOverlay.innerHTML = '';
  }
  
  function positionTutorialContent(highlightRect = null) {
    const tutorialContent = document.querySelector('.tutorial-content');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const contentWidth = 320;
    const contentHeight = tutorialContent.offsetHeight;
    
    let left, top;
    
    if (highlightRect) {
      const margin = 20;
      
      if (highlightRect.right + margin + contentWidth <= viewportWidth) {
        left = highlightRect.right + margin;
        top = Math.max(20, Math.min(highlightRect.top, viewportHeight - contentHeight - 20));
      }
      else if (highlightRect.left - margin - contentWidth >= 0) {
        left = highlightRect.left - margin - contentWidth;
        top = Math.max(20, Math.min(highlightRect.top, viewportHeight - contentHeight - 20));
      }
      else if (highlightRect.top - margin - contentHeight >= 0) {
        left = Math.max(20, Math.min(highlightRect.left, viewportWidth - contentWidth - 20));
        top = highlightRect.top - margin - contentHeight;
      }
      else {
        left = Math.max(20, Math.min(highlightRect.left, viewportWidth - contentWidth - 20));
        top = Math.min(highlightRect.bottom + margin, viewportHeight - contentHeight - 20);
      }
    } else {
      left = (viewportWidth - contentWidth) / 2;
      top = (viewportHeight - contentHeight) / 2;
    }
    
    tutorialContent.style.left = `${left}px`;
    tutorialContent.style.top = `${top}px`;
  }

  function nextTutorialStep() {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      currentTutorialStep++;
      updateTutorialStep();
    } else {
      finishTutorial();
    }
  }

  function prevTutorialStep() {
    if (currentTutorialStep > 0) {
      currentTutorialStep--;
      updateTutorialStep();
    }
  }

  function finishTutorial() {
    tutorialActive = false;
    document.body.classList.remove('tutorial-active');
    tutorialOverlay.style.display = 'none';
    hideHighlight();
    
    chrome.storage.local.set({ 'tutorialCompleted': true });
  }

  function skipTutorial() {
    finishTutorial();
  }

  if (tutorialNextBtn) {
    tutorialNextBtn.addEventListener('click', nextTutorialStep);
  }

  if (tutorialPrevBtn) {
    tutorialPrevBtn.addEventListener('click', prevTutorialStep);
  }

  if (tutorialSkipBtn) {
    tutorialSkipBtn.addEventListener('click', skipTutorial);
  }

  tutorialOverlay.addEventListener('click', function(e) {
    if (e.target === tutorialOverlay || e.target.classList.contains('tutorial-backdrop')) {
      skipTutorial();
    }
  });

  checkIfNewUser();
  
  async function initializeTheme() {
    try {
      const result = await chrome.storage.local.get(['theme']);
      const savedTheme = result.theme || 'dark';
      
      setTheme(savedTheme);
      updateThemeIcon(savedTheme);
      
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
      }
    } catch (error) {
      console.error('Error initializing theme:', error);
      setTheme('dark');
      updateThemeIcon('dark');
    }
  }
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  async function toggleTheme() {
    try {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      setTheme(newTheme);
      updateThemeIcon(newTheme);
      
      await chrome.storage.local.set({ theme: newTheme });
      
      console.log(`Theme switched to: ${newTheme}`);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  }
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSyncLog') {
      updateSyncLog(request.logEntries);
    } else if (request.action === 'showToast') {
      showToast(request.message, request.type || 'info', request.duration || 5000);
    }
  });
  
});