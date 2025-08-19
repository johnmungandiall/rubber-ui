try {
  const electron = require('electron');
  console.log('Electron imported successfully:', !!electron);
  console.log('App object:', !!electron.app);
  console.log('BrowserWindow object:', !!electron.BrowserWindow);
  console.log('ipcMain object:', !!electron.ipcMain);
} catch (error) {
  console.error('Failed to import electron:', error.message);
}