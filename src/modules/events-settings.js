/**
 * 事件绑定 - 设置与存储模块
 */

import * as settings from './settings.js';
import { saveImageHostConfig, addImageHostItem } from './image-host.js';
import { saveMultiGitConfig, addRepoItem } from './git-sync.js';
import * as sidebar from './sidebar.js';
import { getFolders, getTemplates, createNewFile } from './file-manager.js';

// 绑定新建文件事件
export function bindNewFileEvents() {
  document.getElementById('addFileBtn')?.addEventListener('click', function () {
    const folderSelect = document.getElementById('folderSelect');
    folderSelect.innerHTML = '<option value="">未分类</option>';
    const folders = getFolders();
    folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.id;
      option.textContent = folder.name;
      folderSelect.appendChild(option);
    });

    const templateSelect = document.getElementById('templateSelect');
    templateSelect.innerHTML = '<option value="">无模板</option>';
    const templates = getTemplates();
    templates.forEach((template, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = template.name;
      templateSelect.appendChild(option);
    });

    document.getElementById('newFileModal').style.display = 'flex';
  });

  document.getElementById('addFolderBtn')?.addEventListener('click', function () {
    const folderName = prompt('请输入文件夹名称');
    if (folderName && folderName.trim() !== '') {
      sidebar.createNewFolder(folderName.trim());
    }
  });

  document.getElementById('confirmNewFile')?.addEventListener('click', function () {
    const fileName = document.getElementById('fileNameInput')?.value?.trim();
    if (!fileName) {
      alert('请输入文件名');
      return;
    }

    const folderId = document.getElementById('folderSelect')?.value;
    const templateIndex = document.getElementById('templateSelect')?.value;
    let templateContent = '';
    const customVars = {};

    if (templateIndex !== '') {
      const template = getTemplates()[templateIndex];
      if (template) templateContent = template.content;
    }

    document.getElementById('newFileModal').style.display = 'none';
    createNewFile(fileName, templateContent, customVars, folderId);
  });

  document.getElementById('cancelNewFile')?.addEventListener('click', function () {
    document.getElementById('newFileModal').style.display = 'none';
  });
}

// 绑定设置相关事件
export function bindSettingsEvents(appConfig) {
  document.getElementById('savePref')?.addEventListener('click', function () {
    const theme = document.querySelector('input[name="theme"]:checked')?.value;
    const fontSize = parseInt(document.getElementById('fontSize')?.value || '16');

    appConfig.theme = theme;
    appConfig.fontSize = fontSize;
    settings.applyConfig(appConfig, document.getElementById('editor'));
    settings.saveSettings(appConfig);
    saveImageHostConfig();
    document.getElementById('prefModal').style.display = 'none';
  });

  document.getElementById('fontSize')?.addEventListener('input', function () {
    const valueEl = document.getElementById('fontSizeValue');
    if (valueEl) valueEl.textContent = this.value + 'px';
  });

  document.getElementById('saveView')?.addEventListener('click', function () {
    const viewMode = document.querySelector('input[name="viewMode"]:checked')?.value;
    appConfig.viewMode = viewMode;
    settings.updateViewMode(viewMode);
    settings.saveSettings(appConfig);
    document.getElementById('viewModal').style.display = 'none';
  });
}

// 绑定存储设置事件
export function bindStorageEvents(appConfig) {
  document.getElementById('saveStorage')?.addEventListener('click', function () {
    appConfig.storage.local.autoSave = document.getElementById('autoSave')?.checked;
    appConfig.storage.local.saveInterval = parseInt(document.getElementById('saveInterval')?.value || '30');
    appConfig.storage.git.repoUrl = document.getElementById('gitRepoUrl')?.value || '';
    appConfig.storage.git.branch = document.getElementById('gitBranch')?.value || 'master';
    appConfig.storage.git.token = document.getElementById('gitToken')?.value || '';
    appConfig.storage.git.autoSync = document.getElementById('gitAutoSync')?.checked;
    appConfig.storage.webdav.url = document.getElementById('webdavUrl')?.value || '';
    appConfig.storage.webdav.user = document.getElementById('webdavUser')?.value || '';
    appConfig.storage.webdav.pass = document.getElementById('webdavPass')?.value || '';
    appConfig.storage.webdav.path = document.getElementById('webdavPath')?.value || '/markdown';
    settings.saveSettings(appConfig);
    saveMultiGitConfig();
    settings.updateStorageStatus();
    document.getElementById('storageModal').style.display = 'none';
    alert('存储设置已保存！');
  });
}

// 绑定仓库和图床添加事件
export function bindRepoAndHostEvents() {
  document.getElementById('addRepoBtn')?.addEventListener('click', function () {
    addRepoItem();
    saveMultiGitConfig();
  });

  document.getElementById('addImageHostBtn')?.addEventListener('click', function () {
    addImageHostItem();
  });
}
