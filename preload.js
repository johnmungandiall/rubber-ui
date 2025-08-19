const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Settings
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  
  // Data Processing
  processGroupData: (data) => ipcRenderer.invoke('process-group-data', data),
  
  // Events
  onElementEvent: (callback) => ipcRenderer.on('element-event', (_event, value) => callback(value)),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});