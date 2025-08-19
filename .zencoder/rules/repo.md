---
description: Repository Information Overview
alwaysApply: true
---

# UI RPA Testing Panel Information

## Summary
A configurable UI panel application built with Electron for RPA (Robotic Process Automation) testing. The application provides a customizable interface with buttons and input dialogs that can be dynamically added and configured. It includes an event logging system to track user interactions.

## Structure
- **index.html**: Main HTML interface for the application
- **main.js**: Electron main process script handling application lifecycle
- **preload.js**: Preload script for secure IPC communication
- **renderer.js**: Frontend JavaScript for UI interactions
- **styles.css**: Application styling
- **package.json**: Project configuration and dependencies

## Language & Runtime
**Language**: JavaScript
**Runtime**: Node.js with Electron
**Version**: Electron 31.0.0
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- electron: ^31.0.0

**Development Dependencies**:
- electron: ^31.0.0
- electron-builder: ^24.0.0

## Build & Installation
```bash
# Install dependencies
npm install

# Run the application
npm start

# Build distributable packages
npm run build
```

## Application Structure
**Entry Point**: main.js
**Main Process**: Handles application lifecycle, window creation, and IPC communication
**Renderer Process**: Manages UI interactions through renderer.js
**IPC Communication**: Secure communication between processes via preload.js

## Features
- Dynamic creation of UI elements (buttons, input fields, input groups)
- Customizable panel dimensions and appearance
- Event logging system for tracking interactions
- Settings management with persistence
- Theme switching (light/dark)

## Configuration
**Settings Storage**: User settings are stored in the application's userData directory
**Default Configuration**:
- Panel dimensions: 800x400px
- Theme: Light
- Customizable button labels

## Testing
The application can be manually tested by:
1. Adding UI elements through the interface
2. Interacting with created elements
3. Verifying events in the event log
4. Modifying settings and confirming changes are applied