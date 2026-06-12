/**
 * Settings Module - 设置管理模块
 */

import { saveConfig, loadConfig, saveFolders, loadFolders } from '../utils/storage.js';

// 应用配置
export function applyConfig(config, editor) {
  // 应用主题
  if (config.theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  // 应用字体大小
  if (editor) {
    editor.style.fontSize = (config.fontSize || 16) + 'px';
  }
  
  const fontSizeValue = document.getElementById('fontSizeValue');
  if (fontSizeValue) {
    fontSizeValue.textContent = (config.fontSize || 16) + 'px';
  }

  // 更新单选按钮状态
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  themeRadios.forEach(radio => {
    radio.checked = radio.value === config.theme;
  });

  const viewModeRadios = document.querySelectorAll('input[name="viewMode"]');
  viewModeRadios.forEach(radio => {
    radio.checked = radio.value === config.viewMode;
  });
}

// 更新视图模式
export function updateViewMode(viewMode) {
  // 隐藏所有编辑器模式
  document.querySelectorAll('.editor-mode').forEach(mode => {
    mode.classList.remove('active');
  });

  // 移除分屏视图类
  const editorContent = document.querySelector('.editor-content');
  if (editorContent) {
    editorContent.classList.remove('split-view');
  }

  switch (viewMode) {
    case 'edit':
      document.getElementById('editMode')?.classList.add('active');
      break;
    case 'preview':
      document.getElementById('previewMode')?.classList.add('active');
      break;
    case 'split':
      if (editorContent) {
        editorContent.classList.add('split-view');
      }
      document.getElementById('editMode')?.classList.add('active');
      document.getElementById('previewMode')?.classList.add('active');
      break;
  }
}

// 获取默认应用配置
export function getDefaultAppConfig() {
  return {
    theme: 'light',
    fontSize: 16,
    viewMode: 'edit',
    storage: {
      local: {
        autoSave: true,
        saveInterval: 30
      },
      git: {
        repoUrl: '',
        branch: 'master',
        token: '',
        autoSync: true
      },
      webdav: {
        url: '',
        user: '',
        pass: '',
        path: '/markdown'
      }
    }
  };
}

// 保存设置
export function saveSettings(config) {
  saveConfig(config);
}

// 显示状态消息
export function showStatusMessage(message, type = 'success') {
  const statusBar = document.querySelector('.status-bar');
  if (!statusBar) return;
  
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.color = type === 'error' ? 'var(--error-color)' : 'var(--success-color)';
  messageElement.style.marginLeft = '15px';
  messageElement.style.animation = 'fadeOut 3s forwards';
  messageElement.classList.add('status-message');
  
  const oldMessage = statusBar.querySelector('.status-message');
  if (oldMessage) oldMessage.remove();
  
  statusBar.appendChild(messageElement);
  
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}

// 更新状态栏显示存储方式
export function updateStorageStatus() {
  const storageStatus = document.getElementById('storageStatus');
  const activeTab = localStorage.getItem('lastActiveStorageTab') || 'local';

  if (!storageStatus) return;

  let storageType = '本地存储';
  if (activeTab === 'git') storageType = 'Git存储';
  else if (activeTab === 'multigit') storageType = '多点Git存储';
  else if (activeTab === 'webdav') storageType = 'WebDAV存储';

  storageStatus.innerHTML = `存储方式: <span id="storageType">${storageType}</span>`;
}

// 初始化存储Tab状态
export function initStorageTabs() {
  const lastActiveTab = localStorage.getItem('lastActiveStorageTab') || 'local';
  const tabToActivate = document.querySelector(`.tab[data-tab="${lastActiveTab}"]`);

  if (tabToActivate) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    tabToActivate.classList.add('active');
    document.getElementById(`${lastActiveTab}Tab`)?.classList.add('active');
  }

  updateStorageStatus();
}
