/**
 * 事件绑定核心模块 - 管理基础UI事件绑定
 */

import * as sidebar from './sidebar.js';
import * as editor from './editor.js';
import * as preview from './preview.js';
import * as settings from './settings.js';
import * as crypto from './crypto.js';
import { 
  getCurrentFileId, saveFile, getEditorContent 
} from './file-manager.js';

// 绑定编辑器相关事件
export function bindEditorEvents() {
  const editorEl = document.getElementById('editor');
  
  editorEl?.addEventListener('input', function () {
    const fileId = getCurrentFileId();
    if (fileId) {
      saveFile(fileId, this.value);
      preview.updatePreview(this.value);
      editor.updateWordCount();
    }
  });
}

// 绑定侧边栏事件
export function bindSidebarEvents() {
  document.getElementById('sidebarToggle')?.addEventListener('click', sidebar.toggleSidebar);
  document.getElementById('logo')?.addEventListener('click', sidebar.toggleSidebarMobile);
}

// 绑定键盘快捷键
export function bindKeyboardEvents() {
  document.addEventListener('keydown', function (e) {
    const isCtrlKey = e.ctrlKey && !e.metaKey;
    const isCmdKey = e.metaKey && !e.ctrlKey;
    if ((isCtrlKey || isCmdKey) && e.key === 's') {
      e.preventDefault();
      const fileId = getCurrentFileId();
      if (fileId) {
        saveFile(fileId, getEditorContent());
        settings.showStatusMessage('文档已保存');
      }
    }
  });
}

// 绑定模态框通用事件
export function bindModalEvents() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function () {
      this.closest('.modal').style.display = 'none';
    });
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
      const tabId = this.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(tabId + 'Tab')?.classList.add('active');
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
}

// 绑定登录事件
export function bindLoginEvents() {
  document.getElementById('loginBtn')?.addEventListener('click', function () {
    const password = document.getElementById('passwordInput')?.value;
    if (password) {
      crypto.setUserPassword(password);
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('header').style.display = 'flex';
      document.getElementById('editor-container').style.display = 'flex';
      document.getElementById('main-container').style.display = 'flex';
      document.getElementById('status-bar').style.display = 'flex';
    }
  });

  document.getElementById('passwordInput')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      document.getElementById('loginBtn')?.click();
    }
  });
}
