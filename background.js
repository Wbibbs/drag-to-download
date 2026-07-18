browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadImage' && message.url) {
    
    let extension = '.jpg'; // Default fallback
    
    if (message.url.startsWith('data:image/')) {
      const match = message.url.match(/^data:image\/([a-zA-Z+]+);base64/);
      if (match && match[1]) {
        extension = `.${match[1] === 'jpeg' ? 'jpg' : match[1]}`;
      }
    } else {
      try {
        const cleanUrl = message.url.split('?')[0].split('#')[0];
        const extractedExt = cleanUrl.substring(cleanUrl.lastIndexOf('.')).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'].includes(extractedExt)) {
          extension = extractedExt === '.jpeg' ? '.jpg' : extractedExt;
        }
      } catch (e) {
        console.error("Error parsing URL extension:", e);
      }
    }

    const finalFilename = `${message.suggestedName}${extension}`;

    browser.storage.local.get('customFolder').then((result) => {
      let downloadPath = finalFilename;

      // If user defined a custom folder, prepend it to the path
      if (result.customFolder && result.customFolder !== '') {
        downloadPath = `${result.customFolder}/${finalFilename}`;
      }

      browser.downloads.download({
        url: message.url,
        filename: downloadPath,
        saveAs: false,
        conflictAction: 'uniquify' 
      }).then((downloadId) => {
        console.log("Successfully downloaded:", downloadPath);
      }).catch((error) => {
        console.error("Download failed:", error);
      });
    });
  }
});