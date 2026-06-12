/**
 * 历史版本模块 - 管理文档历史版本查看和恢复
 */

import * as sidebar from './sidebar.js';
import { getFiles, getCurrentFileId, setEditorContent, openFile } from './file-manager.js';

// 渲染历史文件选择
export function renderHistoryFileSelect() {
  const select = document.getElementById('localHistoryFileSelect');
  if (!select) return;
  
  select.innerHTML = '';
  const files = getFiles();
  files.forEach(file => {
    const option = document.createElement('option');
    option.value = file.id;
    option.textContent = file.name;
    select.appendChild(option);
  });

  if (files.length > 0) {
    const currentFileId = getCurrentFileId();
    select.value = currentFileId;
    renderHistoryList(currentFileId);
  }
}

// 渲染历史版本列表
export function renderHistoryList(fileId) {
  const historyList = document.getElementById('localHistoryList');
  if (!historyList) return;
  historyList.innerHTML = '';

  const files = getFiles();
  const file = files.find(f => f.id === fileId);
  if (!file?.history) file.history = [];

  if (file.history.length > 0) {
    file.history.forEach((version, index) => {
      const versionItem = document.createElement('div');
      versionItem.className = 'repo-item';
      versionItem.dataset.index = index;
      versionItem.innerHTML = `
        <input type="radio" name="historyVersion" id="version${index}" value="${index}">
        <label for="version${index}" class="repo-url">${sidebar.formatDate(version.savedAt)}</label>
      `;
      historyList.appendChild(versionItem);
    });
  } else {
    historyList.innerHTML = '<p>暂无历史版本</p>';
  }
}
