console.log('Testing Electron import...');

try {
  const electron = require('electron');
  console.log('Electron object:', electron);
  console.log('App object:', electron.app);
  console.log('BrowserWindow object:', electron.BrowserWindow);
  console.log('ipcMain object:', electron.ipcMain);
} catch (error) {
  console.error('Error importing Electron:', error);
}