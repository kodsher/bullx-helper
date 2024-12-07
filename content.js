// Function to display the toast popup with a given message
function showToast(message) {
  const popup = document.createElement("div");
  popup.classList.add("toast-message");
  popup.innerHTML = message;
  document.body.appendChild(popup);

  // Remove the popup after 2 seconds
  setTimeout(() => {
    popup.remove();
  }, 2000);
}

document.addEventListener("click", function(event) {
  // Check if the clicked element is a button with class 'ant-btn ant-btn-text'
  const button = event.target.closest(".ant-btn.ant-btn-text");

  if (button) {
    showToast("Button with class 'ant-btn ant-btn-text' clicked.");

    // Retrieve the current state of the extension (enabled or disabled)
    chrome.storage.local.get(['extensionEnabled'], function(result) {
      if (result.extensionEnabled !== false) {  // If extension is enabled
        // Find the closest ancestor div with class 'flex flex-col ml-3 flex-1 overflow-hidden'
        const flexDiv = button.closest(".flex.flex-col.ml-3.flex-1.overflow-hidden");

        if (flexDiv) {
          showToast("Found closest ancestor div with class 'flex flex-col ml-3 flex-1 overflow-hidden'.");

          // Find the first <a> child element inside the pump-card ancestor
          const pumpCard = button.closest(".pump-card");
          if (pumpCard) {
            const firstLink = pumpCard.querySelector("a");
            if (firstLink && firstLink.href) {
              // Send the first link to the background script to open in Tab 2 first
              chrome.runtime.sendMessage({ action: "openInTab2", url: firstLink.href });
              showToast(`Opening first <a> child of pump-card in Tab 2: ${firstLink.href}`);
            }
          }

          // Find all <a> child elements inside the flex container
          const links = flexDiv.querySelectorAll("a");

          if (links.length > 0) {
            links.forEach(link => {
              if (link.href.includes("x.com")) {  // Check if the href contains "x.com"
                // Send the URL to the background script to open in Tab 1
                chrome.runtime.sendMessage({ action: "openInTab1", url: link.href });
                showToast(`Opening ${link.href} in Tab 1.`);
              }
            });
          } else {
            showToast("No <a> elements found inside the flex div.");
          }
        } else {
          showToast("No ancestor div with class 'flex flex-col ml-3 flex-1 overflow-hidden' found.");
        }
      } else {
        showToast("Extension is turned off. No action performed.");
      }
    });
  }
});
