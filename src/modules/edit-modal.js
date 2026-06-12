/**
 * 编辑文件弹窗模块 - 管理文件编辑模态框
 */

import * as storage from '../utils/storage.js';
import { getFolders, getFiles, setFiles, setFolders, getCurrentFileId } from './file-manager.js';
import { renderFileList } from './file-manager.js';

// 打开编辑文件模态框
export function openEditFileModal(fileId) {
  const files = getFiles();
  const folders = getFolders();
  const file = files.find(f => f.id === fileId);
  if (!file) return;

  document.getElementById('editFileName').value = file.name;

  const folderSelect = document.getElementById('editFolderSelect');
  folderSelect.innerHTML = '<option value="">未分类</option>';
  let currentFolderId = '';

  folders.forEach(folder => {
    const option = document.createElement('option');
    option.value = folder.id;
    option.textContent = folder.name;
    if (folder.files.includes(fileId)) {
      option.selected = true;
      currentFolderId = folder.id;
    }
    folderSelect.appendChild(option);
  });

  const editModal = document.getElementById('editFileModal');
  editModal.dataset.fileId = fileId;
  editModal.dataset.currentFolderId = currentFolderId;
  editModal.style.display = 'flex';
}

// 确认编辑文件
export function confirmEditFile() {
  const editModal = document.getElementById('editFileModal');
  const fileId = editModal.dataset.fileId;
  const currentFolderId = editModal.dataset.currentFolderId;
  const newName = document.getElementById('editFileName')?.value?.trim();
  const newFolderId = document.getElementById('editFolderSelect')?.value;

  if (!fileId || !newName) {
    alert('文件名不能为空');
    return;
  }

  const files = getFiles();
  const folders = getFolders();
  const fileIndex = files.findIndex(f => f.id === fileId);
  if (fileIndex === -1) return;

  files[fileIndex].name = newName;
  files[fileIndex].updatedAt = new Date();
  setFiles(files);
  storage.saveFiles(files);

  if (newFolderId !== currentFolderId) {
    if (currentFolderId) {
      const oldFolder = folders.find(f => f.id === currentFolderId);
      if (oldFolder) {
        const idx = oldFolder.files.indexOf(fileId);
        if (idx !== -1) oldFolder.files.splice(idx, 1);
      }
    }
    if (newFolderId) {
      const newFolder = folders.find(f => f.id === newFolderId);
      if (newFolder) newFolder.files.push(fileId);
    }
    setFolders(folders);
    storage.saveFolders(folders);
    renderFileList();
  }

  if (getCurrentFileId() === fileId) {
    document.getElementById('editorTitle').textContent = newName;
  }
  editModal.style.display = 'none';
}
