const { app, BrowserWindow, ipcMain } = require('electron');

// Disable hardware acceleration and force-disable GPU features to avoid
// GL surface / VSync errors on some systems. Call these before 'ready'
// and before creating BrowserWindow instances.
try {
  // Strongly disable GPU usage via command-line switches.
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-gpu-compositing');
  app.commandLine.appendSwitch('disable-software-rasterizer');
} catch (e) {
  // commandLine may not be available in some contexts; continue.
}

app.disableHardwareAcceleration();

// Helpful log for debugging startup GPU state.
console.log('GPU disabled: disable-gpu, disable-gpu-compositing, disable-software-rasterizer, and app.disableHardwareAcceleration() called');
const path = require('path');
const fs = require('fs').promises;

// Settings file path
let SETTINGS_FILE;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools for debugging
  // mainWindow.webContents.openDevTools();
};

// Initialize settings file path
function initializeSettingsFile() {
  if (!SETTINGS_FILE) {
    SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');
  }
  return SETTINGS_FILE;
}

// Get default settings
function getDefaultSettings() {
  return {
    buttonTextAdd: 'Add Button',
    buttonTextInput: 'Add Input Dialog',
    buttonTextInputGroup: 'Add Input Group',
    buttonTextText: 'Add Text',
    buttonTextRadio: 'Add Radio Button',
    buttonTextCheckbox: 'Add Checkbox',
    buttonTextDropdown: 'Add Dropdown',
    panelWidth: 800,
    panelHeight: 400,
    theme: 'light',
    autoSave: false,
    autoClearLog: false,
    animationSpeed: 'normal',
    showTooltips: true
  };
}

// Setup IPC handlers
function setupIpcHandlers() {
  // Handle saving settings with enhanced error handling
  ipcMain.handle('save-settings', async (event, settings) => {
    try {
      const settingsPath = initializeSettingsFile();
      
      // Ensure directory exists
      const settingsDir = path.dirname(settingsPath);
      await fs.mkdir(settingsDir, { recursive: true });
      
      await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Failed to save settings:', error);
      return { success: false, error: error.message };
    }
  });

  // Handle loading settings with enhanced error handling
  ipcMain.handle('load-settings', async () => {
    try {
      const settingsPath = initializeSettingsFile();
      
      try {
        await fs.access(settingsPath);
      } catch {
        // File doesn't exist, return defaults
        return getDefaultSettings();
      }
      
      const data = await fs.readFile(settingsPath, 'utf8');
      const settings = JSON.parse(data);
      
      // Validate settings structure
      return {
        ...getDefaultSettings(),
        ...settings
      };
    } catch (error) {
      console.error('Failed to load settings:', error);
      return getDefaultSettings();
    }
  });

  // Handle processing group data
  ipcMain.handle('process-group-data', async (event, data) => {
    try {
      console.log('Processing group data:', data);
      // Here you can add custom processing logic
      return { success: true, processed: data };
    } catch (error) {
      console.error('Failed to process group data:', error);
      return { success: false, error: error.message };
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setupIpcHandlers();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.