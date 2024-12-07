document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('toggleButton');
  
    // Get the current state of the extension (on/off)
    chrome.storage.local.get(['extensionEnabled'], function(result) {
      if (result.extensionEnabled === false) {
        button.classList.add('off');
        button.textContent = 'Turn On';
      } else {
        button.classList.remove('off');
        button.textContent = 'Turn Off';
      }
    });
  
    button.addEventListener('click', function () {
      // Toggle the state
      chrome.storage.local.get(['extensionEnabled'], function(result) {
        const newState = result.extensionEnabled === false;
        chrome.storage.local.set({ extensionEnabled: newState }, function() {
          if (newState) {
            button.classList.remove('off');
            button.textContent = 'Turn Off';
          } else {
            button.classList.add('off');
            button.textContent = 'Turn On';
          }
  
          // Send the updated state to the background script to enable/disable functionality
          chrome.runtime.sendMessage({ action: 'toggleExtension', enabled: newState });
        });
      });
    });
  });
  