// Default state is "enabled" (extension is on)
let extensionEnabled = true;

// Retrieve the state from local storage when the extension is loaded
chrome.storage.local.get(['extensionEnabled'], function(result) {
  if (result.extensionEnabled !== undefined) {
    extensionEnabled = result.extensionEnabled;
  } else {
    // Set default value if not found
    chrome.storage.local.set({ extensionEnabled: true });
  }
});

// Listen for the message to toggle the extension on/off
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleExtension') {
    extensionEnabled = message.enabled;
    // Update storage to reflect the new state
    chrome.storage.local.set({ extensionEnabled: extensionEnabled });
  }

  if (message.action === "openInTab2" && message.url) {
    chrome.tabs.query({ index: 1 }, (tabs) => {
      if (tabs.length > 0) {
        // If Tab 2 exists, open the URL there
        chrome.tabs.update(tabs[0].id, { url: message.url });
      } else {
        // If Tab 2 doesn't exist, create it and open the URL
        chrome.tabs.create({ url: message.url, index: 1 });
      }
    });
  }

  if (message.action === "openInTab1" && message.url) {
    chrome.tabs.query({ index: 0 }, (tabs) => {
      if (tabs.length > 0) {
        // If Tab 1 exists, open the URL there
        chrome.tabs.update(tabs[0].id, { url: message.url });
      } else {
        // If Tab 1 doesn't exist, create it and open the URL
        chrome.tabs.create({ url: message.url, index: 0 });
      }
    });
  }
});
