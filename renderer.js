// Modern UI RPA Testing Panel - Renderer Script

// DOM Elements - Core
const addButton = document.getElementById('add-button');
const addInput = document.getElementById('add-input');
const addInputGroupBtn = document.getElementById('add-input-group');
const addText = document.getElementById('add-text');
const addRadio = document.getElementById('add-radio');
const addCheckbox = document.getElementById('add-checkbox');
const addDropdown = document.getElementById('add-dropdown');
const uiPanel = document.getElementById('ui-panel');
const eventLog = document.getElementById('event-log');

// DOM Elements - Controls
const clearLogBtn = document.getElementById('clear-log');
const clearPanelBtn = document.getElementById('clear-panel');
const exportLogBtn = document.getElementById('export-log');
const exportPanelBtn = document.getElementById('export-panel');
const themeToggleBtn = document.getElementById('theme-toggle');

// DOM Elements - Settings
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');
const cancelSettingsBtn = document.getElementById('cancel-settings');

// DOM Elements - Modal
const customModal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalIcon = document.getElementById('modal-icon');
const modalContentArea = document.getElementById('modal-content-area');
const modalOk = document.getElementById('modal-ok');
const modalCancel = document.getElementById('modal-cancel');
const modalClose = document.getElementById('modal-close');

// DOM Elements - Settings Inputs
const buttonTextAdd = document.getElementById('button-text-add');
const buttonTextInput = document.getElementById('button-text-input');
const buttonTextInputGroup = document.getElementById('button-text-input-group');
const buttonTextText = document.getElementById('button-text-text');
const buttonTextRadio = document.getElementById('button-text-radio');
const buttonTextCheckbox = document.getElementById('button-text-checkbox');
const buttonTextDropdown = document.getElementById('button-text-dropdown');
const panelWidth = document.getElementById('panel-width');
const panelHeight = document.getElementById('panel-height');
const themeLight = document.getElementById('theme-light');
const themeDark = document.getElementById('theme-dark');

// DOM Elements - Statistics
const elementsCount = document.getElementById('elements-count');
const eventsCount = document.getElementById('events-count');

// DOM Elements - Toast Container
const toastContainer = document.getElementById('toast-container');

// Application State
let currentSettings = {};
let elementCounter = 0;
let groupCounter = 0;
let eventCounter = 0;
let currentModalCallback = null;
let settingsBackup = {};

// Default settings
const defaultSettings = {
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

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeApp();
    setupEventListeners();
    await loadSettings();
    updateStatistics();
    showToast('Application initialized successfully', 'success');
    logEvent('UI RPA Testing Panel initialized');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showToast('Failed to initialize application', 'error');
    logEvent(`Initialization error: ${error.message}`);
  }
});

// Initialize application
async function initializeApp() {
  // Initialize Feather icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  
  // Check for required DOM elements
  const requiredElements = [
    'add-button', 'add-input', 'add-input-group', 'add-text', 'add-radio', 
    'add-checkbox', 'add-dropdown', 'ui-panel', 'event-log', 'clear-log', 
    'settings-btn', 'settings-panel'
  ];
  
  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  if (missingElements.length > 0) {
    console.warn('Missing DOM elements:', missingElements);
    throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
  }
  
  // Initialize panel placeholder visibility
  updatePanelPlaceholder();
  updateLogPlaceholder();
}

// Setup all event listeners
function setupEventListeners() {
  // Element creation buttons
  addButton?.addEventListener('click', handleAddButton);
  addInput?.addEventListener('click', handleAddInput);
  addInputGroupBtn?.addEventListener('click', handleAddInputGroup);
  addText?.addEventListener('click', handleAddText);
  addRadio?.addEventListener('click', handleAddRadio);
  addCheckbox?.addEventListener('click', handleAddCheckbox);
  addDropdown?.addEventListener('click', handleAddDropdown);
  
  // Control buttons
  clearLogBtn?.addEventListener('click', handleClearLog);
  clearPanelBtn?.addEventListener('click', handleClearPanel);
  exportLogBtn?.addEventListener('click', handleExportLog);
  exportPanelBtn?.addEventListener('click', handleExportPanel);
  themeToggleBtn?.addEventListener('click', handleThemeToggle);
  
  // Settings
  settingsBtn?.addEventListener('click', handleOpenSettings);
  closeSettingsBtn?.addEventListener('click', handleCloseSettings);
  saveSettingsBtn?.addEventListener('click', handleSaveSettings);
  resetSettingsBtn?.addEventListener('click', handleResetSettings);
  cancelSettingsBtn?.addEventListener('click', handleCancelSettings);
  
  // Modal
  modalOk?.addEventListener('click', handleModalOk);
  modalCancel?.addEventListener('click', handleModalCancel);
  modalClose?.addEventListener('click', handleModalCancel);
  
  // Settings tabs
  setupSettingsTabs();
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  // Click outside to close
  document.addEventListener('click', handleOutsideClick);
}

// Settings tabs functionality
function setupSettingsTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab panel
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.dataset.panel === targetTab) {
          panel.classList.add('active');
        }
      });
    });
  });
}

// Event Handlers
function handleAddButton() {
  const modalHTML = `
    <div class="form-group">
      <label for="button-name">Button Name:</label>
      <input type="text" id="button-name" name="buttonName" class="form-input" placeholder="My Button" required>
    </div>
    <div class="form-group">
      <label for="button-color">Button Color:</label>
      <select id="button-color" name="buttonColor" class="form-select">
        <option value="success">Green (Success)</option>
        <option value="primary">Blue (Primary)</option>
        <option value="warning">Orange (Warning)</option>
        <option value="danger">Red (Danger)</option>
      </select>
    </div>
  `;
  
  showModal('Add Button', 'square', modalHTML, (data) => {
    if (data.buttonName && data.buttonName.trim()) {
      addElement('button', data.buttonName.trim(), { color: data.buttonColor });
    }
  });
}

function handleAddInput() {
  const modalHTML = `
    <div class="form-group">
      <label for="input-label">Input Label:</label>
      <input type="text" id="input-label" name="inputLabel" class="form-input" placeholder="Enter text..." required>
    </div>
    <div class="form-group">
      <label for="input-type">Input Type:</label>
      <select id="input-type" name="inputType" class="form-select">
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="email">Email</option>
        <option value="password">Password</option>
        <option value="date">Date</option>
      </select>
    </div>
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="input-required" name="inputRequired" class="form-checkbox">
        <span class="checkbox-custom"></span>
        Required field
      </label>
    </div>
  `;
  
  showModal('Add Input', 'edit-3', modalHTML, (data) => {
    if (data.inputLabel && data.inputLabel.trim()) {
      addElement('input', data.inputLabel.trim(), {
        type: data.inputType,
        required: data.inputRequired === 'true'
      });
    }
  });
}

function handleAddInputGroup() {
  const modalHTML = `
    <div class="form-group">
      <label for="group-name">Group Name:</label>
      <input type="text" id="group-name" name="groupName" class="form-input" placeholder="My Input Group" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="input-count">Number of Inputs:</label>
        <input type="number" id="input-count" name="inputCount" class="form-input" min="1" max="20" value="3" required>
      </div>
      <div class="form-group">
        <label for="action-button-text">Action Button Text:</label>
        <input type="text" id="action-button-text" name="actionButtonText" class="form-input" placeholder="Submit" value="Submit">
      </div>
    </div>
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="include-action-button" name="includeActionButton" class="form-checkbox" checked>
        <span class="checkbox-custom"></span>
        Include Action Button
      </label>
    </div>
  `;
  
  showModal('Add Input Group', 'layers', modalHTML, (data) => {
    if (data.groupName && data.groupName.trim() && data.inputCount) {
      const count = parseInt(data.inputCount);
      if (count >= 1 && count <= 20) {
        addInputGroup(
          data.groupName.trim(),
          count,
          data.includeActionButton === 'true',
          data.actionButtonText || 'Submit'
        );
      }
    }
  });
}

function handleAddText() {
  const modalHTML = `
    <div class="form-group">
      <label for="text-content">Text Content:</label>
      <textarea id="text-content" name="textContent" class="form-input" rows="3" placeholder="Enter your text here..." required></textarea>
    </div>
    <div class="form-group">
      <label for="text-style">Text Style:</label>
      <select id="text-style" name="textStyle" class="form-select">
        <option value="normal">Normal</option>
        <option value="heading">Heading</option>
        <option value="subheading">Subheading</option>
        <option value="caption">Caption</option>
      </select>
    </div>
    <div class="form-group">
      <label for="text-color">Text Color:</label>
      <select id="text-color" name="textColor" class="form-select">
        <option value="default">Default</option>
        <option value="primary">Primary (Blue)</option>
        <option value="success">Success (Green)</option>
        <option value="warning">Warning (Orange)</option>
        <option value="danger">Danger (Red)</option>
        <option value="secondary">Secondary (Gray)</option>
      </select>
    </div>
  `;
  
  showModal('Add Text', 'type', modalHTML, (data) => {
    if (data.textContent && data.textContent.trim()) {
      addElement('text', data.textContent.trim(), {
        style: data.textStyle,
        color: data.textColor
      });
    }
  });
}

function handleAddRadio() {
  const modalHTML = `
    <div class="form-group">
      <label for="radio-group-name">Radio Group Name:</label>
      <input type="text" id="radio-group-name" name="radioGroupName" class="form-input" placeholder="Choose Option" required>
    </div>
    <div class="form-group">
      <label for="radio-options">Options (one per line):</label>
      <textarea id="radio-options" name="radioOptions" class="form-input" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" required></textarea>
    </div>
    <div class="form-group">
      <label for="radio-default">Default Selection:</label>
      <input type="number" id="radio-default" name="radioDefault" class="form-input" min="0" placeholder="0 for none, 1 for first option, etc.">
    </div>
  `;
  
  showModal('Add Radio Button', 'radio', modalHTML, (data) => {
    if (data.radioGroupName && data.radioGroupName.trim() && data.radioOptions && data.radioOptions.trim()) {
      const options = data.radioOptions.trim().split('\n').filter(opt => opt.trim());
      if (options.length > 0) {
        addElement('radio', data.radioGroupName.trim(), {
          options: options,
          defaultSelection: parseInt(data.radioDefault) || 0
        });
      }
    }
  });
}

function handleAddCheckbox() {
  const modalHTML = `
    <div class="form-group">
      <label for="checkbox-group-name">Checkbox Group Name:</label>
      <input type="text" id="checkbox-group-name" name="checkboxGroupName" class="form-input" placeholder="Select Options" required>
    </div>
    <div class="form-group">
      <label for="checkbox-options">Options (one per line):</label>
      <textarea id="checkbox-options" name="checkboxOptions" class="form-input" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" required></textarea>
    </div>
    <div class="form-group">
      <label for="checkbox-defaults">Default Selections (comma-separated numbers):</label>
      <input type="text" id="checkbox-defaults" name="checkboxDefaults" class="form-input" placeholder="1,3 (for first and third options)">
    </div>
  `;
  
  showModal('Add Checkbox', 'check-square', modalHTML, (data) => {
    if (data.checkboxGroupName && data.checkboxGroupName.trim() && data.checkboxOptions && data.checkboxOptions.trim()) {
      const options = data.checkboxOptions.trim().split('\n').filter(opt => opt.trim());
      if (options.length > 0) {
        const defaults = data.checkboxDefaults ? 
          data.checkboxDefaults.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)) : [];
        addElement('checkbox', data.checkboxGroupName.trim(), {
          options: options,
          defaultSelections: defaults
        });
      }
    }
  });
}

function handleAddDropdown() {
  const modalHTML = `
    <div class="form-group">
      <label for="dropdown-label">Dropdown Label:</label>
      <input type="text" id="dropdown-label" name="dropdownLabel" class="form-input" placeholder="Select an option" required>
    </div>
    <div class="form-group">
      <label for="dropdown-options">Options (one per line):</label>
      <textarea id="dropdown-options" name="dropdownOptions" class="form-input" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" required></textarea>
    </div>
    <div class="form-group">
      <label for="dropdown-default">Default Selection:</label>
      <input type="number" id="dropdown-default" name="dropdownDefault" class="form-input" min="0" placeholder="0 for none, 1 for first option, etc.">
    </div>
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="dropdown-required" name="dropdownRequired" class="form-checkbox">
        <span class="checkbox-custom"></span>
        Required field
      </label>
    </div>
  `;
  
  showModal('Add Dropdown', 'chevron-down', modalHTML, (data) => {
    if (data.dropdownLabel && data.dropdownLabel.trim() && data.dropdownOptions && data.dropdownOptions.trim()) {
      const options = data.dropdownOptions.trim().split('\n').filter(opt => opt.trim());
      if (options.length > 0) {
        addElement('dropdown', data.dropdownLabel.trim(), {
          options: options,
          defaultSelection: parseInt(data.dropdownDefault) || 0,
          required: data.dropdownRequired === 'true'
        });
      }
    }
  });
}

function handleClearLog() {
  eventLog.innerHTML = '';
  eventCounter = 0;
  updateLogPlaceholder();
  updateStatistics();
  showToast('Event log cleared', 'info');
}

function handleClearPanel() {
  if (confirm('Are you sure you want to clear all elements from the panel?')) {
    uiPanel.innerHTML = '';
    elementCounter = 0;
    groupCounter = 0;
    updatePanelPlaceholder();
    updateStatistics();
    logEvent('Panel cleared - all elements removed');
    showToast('Panel cleared', 'info');
  }
}

function handleExportLog() {
  const logEntries = Array.from(eventLog.children).map(entry => entry.textContent);
  const logData = logEntries.join('\n');
  
  if (logData.trim()) {
    downloadFile('event-log.txt', logData);
    showToast('Event log exported', 'success');
    logEvent('Event log exported');
  } else {
    showToast('No events to export', 'warning');
  }
}

function handleExportPanel() {
  const elements = Array.from(uiPanel.children);
  const panelData = {
    timestamp: new Date().toISOString(),
    elementCount: elements.length,
    elements: elements.map(el => ({
      type: el.dataset.elementType || 'unknown',
      id: el.id,
      content: el.textContent || el.value || '',
      className: el.className
    }))
  };
  
  downloadFile('panel-config.json', JSON.stringify(panelData, null, 2));
  showToast('Panel configuration exported', 'success');
  logEvent('Panel configuration exported');
}

function handleThemeToggle() {
  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  applyTheme(newTheme);
  currentSettings.theme = newTheme;
  
  if (currentSettings.autoSave) {
    saveSettings();
  }
  
  showToast(`Switched to ${newTheme} theme`, 'info');
  logEvent(`Theme changed to ${newTheme}`);
}

function handleOpenSettings() {
  settingsBackup = { ...currentSettings };
  settingsPanel.classList.remove('hidden');
  populateSettingsForm();
}

function handleCloseSettings() {
  settingsPanel.classList.add('hidden');
}

function handleCancelSettings() {
  currentSettings = { ...settingsBackup };
  applySettings();
  settingsPanel.classList.add('hidden');
  showToast('Settings changes cancelled', 'info');
}

function handleSaveSettings() {
  try {
    collectSettingsFromForm();
    applySettings();
    saveSettings();
    settingsPanel.classList.add('hidden');
    showToast('Settings saved successfully', 'success');
    logEvent('Settings saved');
  } catch (error) {
    console.error('Failed to save settings:', error);
    showToast('Failed to save settings', 'error');
  }
}

function handleResetSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    currentSettings = { ...defaultSettings };
    applySettings();
    populateSettingsForm();
    showToast('Settings reset to default', 'info');
    logEvent('Settings reset to default');
  }
}

// Modal Management
function showModal(title, icon, contentHTML, callback) {
  modalTitle.textContent = title;
  modalIcon.setAttribute('data-feather', icon);
  modalContentArea.innerHTML = contentHTML;
  currentModalCallback = callback;
  
  customModal.classList.remove('hidden');
  
  // Re-initialize Feather icons for the modal
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  
  // Focus first input
  const firstInput = modalContentArea.querySelector('input, select');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

function hideModal() {
  customModal.classList.add('hidden');
  currentModalCallback = null;
}

function handleModalOk() {
  if (currentModalCallback) {
    const formData = new FormData();
    const inputs = modalContentArea.querySelectorAll('input, select');
    
    inputs.forEach(input => {
      formData.append(input.name || input.id, input.type === 'checkbox' ? input.checked : input.value);
    });
    
    const data = Object.fromEntries(formData);
    currentModalCallback(data);
  }
  hideModal();
}

function handleModalCancel() {
  hideModal();
}

// Element Creation
function addElement(type, label, options = {}) {
  const elementId = `element-${elementCounter++}`;
  const element = document.createElement('div');
  element.className = 'element-wrapper';
  element.dataset.elementType = type;
  element.id = elementId;
  
  if (type === 'button') {
    const button = document.createElement('button');
    button.className = `dynamic-button btn-${options.color || 'success'}`;
    button.textContent = label;
    button.addEventListener('click', () => {
      logEvent(`Button clicked: ${label}`);
    });
    element.appendChild(button);
  } else if (type === 'input') {
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label + (options.required ? ' *' : '');
    labelEl.className = 'input-label';
    
    const input = document.createElement('input');
    input.className = 'dynamic-input';
    input.type = options.type || 'text';
    input.placeholder = `Enter ${label.toLowerCase()}`;
    input.required = options.required || false;
    
    input.addEventListener('input', (e) => {
      logEvent(`Input changed: ${label} = ${e.target.value}`);
    });
    
    inputWrapper.appendChild(labelEl);
    inputWrapper.appendChild(input);
    element.appendChild(inputWrapper);
  } else if (type === 'text') {
    const textElement = document.createElement('div');
    textElement.className = `dynamic-text text-${options.style || 'normal'} text-color-${options.color || 'default'}`;
    textElement.textContent = label;
    element.appendChild(textElement);
  } else if (type === 'radio') {
    const radioWrapper = document.createElement('div');
    radioWrapper.className = 'radio-wrapper';
    
    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.className = 'radio-group-label';
    radioWrapper.appendChild(labelEl);
    
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    
    options.options.forEach((option, index) => {
      const radioItem = document.createElement('div');
      radioItem.className = 'radio-item';
      
      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = `radio-${elementId}`;
      radioInput.value = option;
      radioInput.id = `${elementId}-option-${index}`;
      radioInput.className = 'radio-input';
      
      if (options.defaultSelection === index + 1) {
        radioInput.checked = true;
      }
      
      radioInput.addEventListener('change', (e) => {
        if (e.target.checked) {
          logEvent(`Radio selected: ${label} = ${option}`);
        }
      });
      
      const radioLabel = document.createElement('label');
      radioLabel.htmlFor = radioInput.id;
      radioLabel.className = 'radio-label';
      radioLabel.textContent = option;
      
      radioItem.appendChild(radioInput);
      radioItem.appendChild(radioLabel);
      radioContainer.appendChild(radioItem);
    });
    
    radioWrapper.appendChild(radioContainer);
    element.appendChild(radioWrapper);
  } else if (type === 'checkbox') {
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'checkbox-wrapper';
    
    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.className = 'checkbox-group-label';
    checkboxWrapper.appendChild(labelEl);
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';
    
    options.options.forEach((option, index) => {
      const checkboxItem = document.createElement('div');
      checkboxItem.className = 'checkbox-item';
      
      const checkboxInput = document.createElement('input');
      checkboxInput.type = 'checkbox';
      checkboxInput.value = option;
      checkboxInput.id = `${elementId}-option-${index}`;
      checkboxInput.className = 'checkbox-input';
      
      if (options.defaultSelections && options.defaultSelections.includes(index + 1)) {
        checkboxInput.checked = true;
      }
      
      checkboxInput.addEventListener('change', (e) => {
        const action = e.target.checked ? 'checked' : 'unchecked';
        logEvent(`Checkbox ${action}: ${label} - ${option}`);
      });
      
      const checkboxLabel = document.createElement('label');
      checkboxLabel.htmlFor = checkboxInput.id;
      checkboxLabel.className = 'checkbox-label';
      checkboxLabel.textContent = option;
      
      checkboxItem.appendChild(checkboxInput);
      checkboxItem.appendChild(checkboxLabel);
      checkboxContainer.appendChild(checkboxItem);
    });
    
    checkboxWrapper.appendChild(checkboxContainer);
    element.appendChild(checkboxWrapper);
  } else if (type === 'dropdown') {
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = 'dropdown-wrapper';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label + (options.required ? ' *' : '');
    labelEl.className = 'dropdown-label';
    
    const select = document.createElement('select');
    select.className = 'dynamic-dropdown';
    select.required = options.required || false;
    
    // Add empty option if not required or no default selection
    if (!options.required || options.defaultSelection === 0) {
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = 'Select an option...';
      emptyOption.selected = options.defaultSelection === 0;
      select.appendChild(emptyOption);
    }
    
    options.options.forEach((option, index) => {
      const optionEl = document.createElement('option');
      optionEl.value = option;
      optionEl.textContent = option;
      
      if (options.defaultSelection === index + 1) {
        optionEl.selected = true;
      }
      
      select.appendChild(optionEl);
    });
    
    select.addEventListener('change', (e) => {
      logEvent(`Dropdown changed: ${label} = ${e.target.value}`);
    });
    
    dropdownWrapper.appendChild(labelEl);
    dropdownWrapper.appendChild(select);
    element.appendChild(dropdownWrapper);
  }
  
  uiPanel.appendChild(element);
  updatePanelPlaceholder();
  updateStatistics();
  logEvent(`Added ${type}: ${label}`);
}

function addInputGroup(groupName, inputCount, includeActionButton, actionButtonText) {
  const groupId = `group-${groupCounter++}`;
  const groupContainer = document.createElement('div');
  groupContainer.className = 'input-group-container card';
  groupContainer.id = groupId;
  groupContainer.dataset.elementType = 'group';
  
  // Group header
  const groupHeader = document.createElement('div');
  groupHeader.className = 'group-header';
  groupHeader.innerHTML = `
    <h4><i data-feather="layers"></i>${groupName}</h4>
    <span class="group-count">${inputCount} inputs</span>
  `;
  groupContainer.appendChild(groupHeader);
  
  // Input container
  const inputsContainer = document.createElement('div');
  inputsContainer.className = 'inputs-container';
  
  // Create input fields
  const inputElements = [];
  for (let i = 0; i < inputCount; i++) {
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'form-group';
    
    const label = document.createElement('label');
    label.textContent = `${groupName} ${i + 1}:`;
    label.className = 'form-label';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-input';
    input.placeholder = `Enter ${groupName} ${i + 1}`;
    input.dataset.groupId = groupId;
    input.dataset.inputIndex = i;
    
    input.addEventListener('input', (e) => {
      logEvent(`Group ${groupName} - Input ${i + 1}: ${e.target.value}`);
    });
    
    inputWrapper.appendChild(label);
    inputWrapper.appendChild(input);
    inputsContainer.appendChild(inputWrapper);
    inputElements.push(input);
  }
  
  groupContainer.appendChild(inputsContainer);
  
  // Add action button if requested
  if (includeActionButton) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'group-actions';
    
    const actionButton = document.createElement('button');
    actionButton.className = 'btn btn-primary';
    actionButton.innerHTML = `<i data-feather="check"></i>${actionButtonText}`;
    
    actionButton.addEventListener('click', () => {
      const values = inputElements.map(input => ({
        index: parseInt(input.dataset.inputIndex),
        value: input.value
      }));
      
      const collectedData = {
        groupName,
        groupId,
        values,
        timestamp: new Date().toISOString()
      };
      
      logEvent(`Action button clicked for group "${groupName}": ${JSON.stringify(values.map(v => v.value))}`);
      handleGroupAction(collectedData);
    });
    
    buttonContainer.appendChild(actionButton);
    groupContainer.appendChild(buttonContainer);
  }
  
  uiPanel.appendChild(groupContainer);
  updatePanelPlaceholder();
  updateStatistics();
  logEvent(`Added input group: ${groupName} with ${inputCount} inputs${includeActionButton ? ' and action button' : ''}`);
  
  // Re-initialize Feather icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Group Action Handler
function handleGroupAction(data) {
  console.log('Group action triggered:', data);
  
  const formattedData = data.values.map(v => `${data.groupName} ${v.index + 1}: ${v.value}`).join(', ');
  logEvent(`Processed: ${formattedData}`);
  
  showToast(`Group "${data.groupName}" processed`, 'success');
  
  // Send data to main process if available
  if (window.electronAPI && window.electronAPI.processGroupData) {
    window.electronAPI.processGroupData(data);
  }
}

// Settings Management
function populateSettingsForm() {
  if (buttonTextAdd) buttonTextAdd.value = currentSettings.buttonTextAdd;
  if (buttonTextInput) buttonTextInput.value = currentSettings.buttonTextInput;
  if (buttonTextInputGroup) buttonTextInputGroup.value = currentSettings.buttonTextInputGroup;
  if (buttonTextText) buttonTextText.value = currentSettings.buttonTextText;
  if (buttonTextRadio) buttonTextRadio.value = currentSettings.buttonTextRadio;
  if (buttonTextCheckbox) buttonTextCheckbox.value = currentSettings.buttonTextCheckbox;
  if (buttonTextDropdown) buttonTextDropdown.value = currentSettings.buttonTextDropdown;
  if (panelWidth) panelWidth.value = currentSettings.panelWidth;
  if (panelHeight) panelHeight.value = currentSettings.panelHeight;
  
  // Theme radio buttons
  if (currentSettings.theme === 'light' && themeLight) {
    themeLight.checked = true;
  } else if (currentSettings.theme === 'dark' && themeDark) {
    themeDark.checked = true;
  }
  
  // Other settings
  const autoSaveCheckbox = document.getElementById('auto-save');
  const autoClearLogCheckbox = document.getElementById('auto-clear-log');
  const animationSpeedSelect = document.getElementById('animation-speed');
  const showTooltipsCheckbox = document.getElementById('show-tooltips');
  
  if (autoSaveCheckbox) autoSaveCheckbox.checked = currentSettings.autoSave;
  if (autoClearLogCheckbox) autoClearLogCheckbox.checked = currentSettings.autoClearLog;
  if (animationSpeedSelect) animationSpeedSelect.value = currentSettings.animationSpeed;
  if (showTooltipsCheckbox) showTooltipsCheckbox.checked = currentSettings.showTooltips;
}

function collectSettingsFromForm() {
  if (buttonTextAdd) currentSettings.buttonTextAdd = buttonTextAdd.value;
  if (buttonTextInput) currentSettings.buttonTextInput = buttonTextInput.value;
  if (buttonTextInputGroup) currentSettings.buttonTextInputGroup = buttonTextInputGroup.value;
  if (buttonTextText) currentSettings.buttonTextText = buttonTextText.value;
  if (buttonTextRadio) currentSettings.buttonTextRadio = buttonTextRadio.value;
  if (buttonTextCheckbox) currentSettings.buttonTextCheckbox = buttonTextCheckbox.value;
  if (buttonTextDropdown) currentSettings.buttonTextDropdown = buttonTextDropdown.value;
  if (panelWidth) currentSettings.panelWidth = parseInt(panelWidth.value);
  if (panelHeight) currentSettings.panelHeight = parseInt(panelHeight.value);
  
  // Theme
  if (themeLight && themeLight.checked) {
    currentSettings.theme = 'light';
  } else if (themeDark && themeDark.checked) {
    currentSettings.theme = 'dark';
  }
  
  // Other settings
  const autoSaveCheckbox = document.getElementById('auto-save');
  const autoClearLogCheckbox = document.getElementById('auto-clear-log');
  const animationSpeedSelect = document.getElementById('animation-speed');
  const showTooltipsCheckbox = document.getElementById('show-tooltips');
  
  if (autoSaveCheckbox) currentSettings.autoSave = autoSaveCheckbox.checked;
  if (autoClearLogCheckbox) currentSettings.autoClearLog = autoClearLogCheckbox.checked;
  if (animationSpeedSelect) currentSettings.animationSpeed = animationSpeedSelect.value;
  if (showTooltipsCheckbox) currentSettings.showTooltips = showTooltipsCheckbox.checked;
}

function applySettings() {
  // Update button texts
  const addButtonText = document.getElementById('add-button-text');
  const addInputText = document.getElementById('add-input-text');
  const addInputGroupText = document.getElementById('add-input-group-text');
  const addTextText = document.getElementById('add-text-text');
  const addRadioText = document.getElementById('add-radio-text');
  const addCheckboxText = document.getElementById('add-checkbox-text');
  const addDropdownText = document.getElementById('add-dropdown-text');
  
  if (addButtonText) addButtonText.textContent = currentSettings.buttonTextAdd;
  if (addInputText) addInputText.textContent = currentSettings.buttonTextInput;
  if (addInputGroupText) addInputGroupText.textContent = currentSettings.buttonTextInputGroup;
  if (addTextText) addTextText.textContent = currentSettings.buttonTextText;
  if (addRadioText) addRadioText.textContent = currentSettings.buttonTextRadio;
  if (addCheckboxText) addCheckboxText.textContent = currentSettings.buttonTextCheckbox;
  if (addDropdownText) addDropdownText.textContent = currentSettings.buttonTextDropdown;
  
  // Apply theme
  applyTheme(currentSettings.theme);
  
  // Apply panel dimensions
  if (uiPanel) {
    uiPanel.style.minWidth = `${currentSettings.panelWidth}px`;
    uiPanel.style.minHeight = `${currentSettings.panelHeight}px`;
  }
  
  // Apply animation speed
  document.documentElement.style.setProperty('--transition-speed', 
    currentSettings.animationSpeed === 'fast' ? '100ms' :
    currentSettings.animationSpeed === 'slow' ? '400ms' :
    currentSettings.animationSpeed === 'none' ? '0ms' : '250ms'
  );
}

function applyTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');
  
  // Update theme toggle icon
  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-feather', theme === 'dark' ? 'sun' : 'moon');
      if (typeof feather !== 'undefined') {
        feather.replace();
      }
    }
  }
}

async function loadSettings() {
  try {
    if (window.electronAPI && window.electronAPI.loadSettings) {
      const settings = await window.electronAPI.loadSettings();
      if (settings) {
        currentSettings = { ...defaultSettings, ...settings };
      } else {
        currentSettings = { ...defaultSettings };
      }
    } else {
      currentSettings = { ...defaultSettings };
    }
    applySettings();
  } catch (error) {
    console.error('Failed to load settings:', error);
    currentSettings = { ...defaultSettings };
    applySettings();
  }
}

async function saveSettings() {
  try {
    if (window.electronAPI && window.electronAPI.saveSettings) {
      await window.electronAPI.saveSettings(currentSettings);
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

// Event Logging
function logEvent(message) {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `
    <span class="log-timestamp">[${timestamp}]</span>
    <span class="log-message">${message}</span>
  `;
  
  // Insert new entries at the top instead of bottom
  eventLog.insertBefore(logEntry, eventLog.firstChild);
  
  eventCounter++;
  updateLogPlaceholder();
  updateStatistics();
  
  // Auto-clear log if enabled
  if (currentSettings.autoClearLog && eventCounter >= 100) {
    handleClearLog();
  }
}

// UI Updates
function updateStatistics() {
  const elementCount = uiPanel.children.length;
  if (elementsCount) elementsCount.textContent = elementCount;
  if (eventsCount) eventsCount.textContent = eventCounter;
}

function updatePanelPlaceholder() {
  const placeholder = uiPanel.querySelector('.panel-placeholder');
  const hasElements = uiPanel.children.length > 0 && 
                     Array.from(uiPanel.children).some(child => !child.classList.contains('panel-placeholder'));
  
  if (placeholder) {
    placeholder.style.display = hasElements ? 'none' : 'block';
  }
}

function updateLogPlaceholder() {
  const placeholder = eventLog.querySelector('.log-placeholder');
  const hasLogs = eventLog.children.length > 0 && 
                  Array.from(eventLog.children).some(child => !child.classList.contains('log-placeholder'));
  
  if (placeholder) {
    placeholder.style.display = hasLogs ? 'none' : 'flex';
  }
}

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'check-circle' :
               type === 'error' ? 'x-circle' :
               type === 'warning' ? 'alert-triangle' : 'info';
  
  toast.innerHTML = `
    <i data-feather="${icon}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Initialize Feather icons for the toast
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  
  // Auto-remove toast
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Utility Functions
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
  // Escape key
  if (e.key === 'Escape') {
    if (!customModal.classList.contains('hidden')) {
      handleModalCancel();
    } else if (!settingsPanel.classList.contains('hidden')) {
      handleCloseSettings();
    }
  }
  
  // Ctrl/Cmd + shortcuts
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'b':
        e.preventDefault();
        handleAddButton();
        break;
      case 'i':
        e.preventDefault();
        handleAddInput();
        break;
      case 'g':
        e.preventDefault();
        handleAddInputGroup();
        break;
      case 'l':
        e.preventDefault();
        handleClearLog();
        break;
      case ',':
        e.preventDefault();
        handleOpenSettings();
        break;
      case 't':
        e.preventDefault();
        handleThemeToggle();
        break;
    }
  }
}

// Click Outside Handler
function handleOutsideClick(e) {
  // Close settings panel when clicking overlay
  if (e.target.classList.contains('settings-overlay')) {
    handleCloseSettings();
  }
  
  // Close modal when clicking overlay
  if (e.target.classList.contains('modal-overlay')) {
    handleModalCancel();
  }
}

// Add slideOutRight animation to CSS if not present
if (!document.querySelector('style[data-toast-animations]')) {
  const style = document.createElement('style');
  style.setAttribute('data-toast-animations', 'true');
  style.textContent = `
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .log-entry {
      padding: 4px 0;
      border-bottom: 1px solid var(--border-primary);
    }
    
    .log-timestamp {
      color: var(--text-tertiary);
      font-size: 0.75rem;
    }
    
    .log-message {
      margin-left: 8px;
      color: var(--text-primary);
    }
    
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 8px 0;
    }
    
    .input-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .input-group-container {
      padding: 16px;
      margin: 8px 0;
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      background: var(--bg-primary);
    }
    
    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-primary);
    }
    
    .group-header h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 1rem;
      color: var(--text-primary);
    }
    
    .group-count {
      font-size: 0.75rem;
      color: var(--text-secondary);
      background: var(--bg-secondary);
      padding: 2px 8px;
      border-radius: 12px;
    }
    
    .inputs-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .group-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 8px;
      border-top: 1px solid var(--border-primary);
    }
  `;
  document.head.appendChild(style);
}