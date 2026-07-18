document.addEventListener('dragend', (event) => {
  let target = event.target;

  if (target.tagName !== 'IMG') {
    target = target.querySelector('img') || target.closest('a')?.querySelector('img');
  }

  if (target && target.tagName === 'IMG' && target.src) {
    if (target.src.startsWith('http') || target.src.startsWith('data:')) {
      
      // 1. Get a clean base name from alt text, or fallback
      let baseName = target.alt ? target.alt.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'img';
      if (baseName.length > 20) baseName = baseName.substring(0, 20); // Keep it short

      // 2. Generate a unique timestamp (Format: YYYYMMDD_HHMMSS)
      const now = new Date();
      const timestamp = now.getFullYear() +
                        String(now.getMonth() + 1).padStart(2, '0') +
                        String(now.getDate()).padStart(2, '0') + '_' +
                        String(now.getHours()).padStart(2, '0') +
                        String(now.getMinutes()).padStart(2, '0') +
                        String(now.getSeconds()).padStart(2, '0');

      // Alternative: If you just want a tiny unique random string instead of a time:
      // const uniqueId = Math.random().toString(36).substring(2, 7);

      browser.runtime.sendMessage({ 
        action: 'downloadImage', 
        url: target.src,
        suggestedName: `${baseName}_${timestamp}` // e.g., "cute_cat_20260718_164800"
      });
    }
  }
}, true);