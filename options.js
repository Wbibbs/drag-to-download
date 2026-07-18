document.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get('customFolder').then((result) => {
    if (result.customFolder) {
      document.getElementById('folderPath').value = result.customFolder;
    }
  });
});

document.getElementById('saveBtn').addEventListener('click', () => {
  let folder = document.getElementById('folderPath').value.trim();
  
  // Clean up back references or slashes
  folder = folder.replace(/\.\.\//g, '').replace(/\.\//g, '');
  folder = folder.replace(/^\/+|\/+$/g, '');

  browser.storage.local.set({ customFolder: folder }).then(() => {
    alert('Settings saved successfully!');
  });
});