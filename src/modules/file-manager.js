/**
 * 文件管理器模块 - 管理文件的创建、打开、删除、保存等操作
 */

import * as storage from '../utils/storage.js';
import * as sidebar from './sidebar.js';
import * as preview from './preview.js';
import * as editor from './editor.js';

// 模块状态 - 通过getter/setter暴露
let _files = [];
let _currentFileId = null;
let _folders = [];
let _templates = [];

export function getFiles() { return _files; }
export function setFiles(val) { _files = val; }
export function getCurrentFileId() { return _currentFileId; }
export function setCurrentFileId(val) { _currentFileId = val; }
export function getFolders() { return _folders; }
export function setFolders(val) { _folders = val; }
export function getTemplates() { return _templates; }
export function setTemplates(val) { _templates = val; }

// 初始化文件数据
export function initFileData() {
  _files = storage.loadFiles();
  _folders = storage.loadFolders();
  _templates = storage.loadTemplates();
  return { files: _files, folders: _folders, templates: _templates };
}

// 创建新文件
export function createNewFile(name, content = '', customVars = {}, folderId = '') {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const fileNameWithoutExt = name.replace(/\.\w+$/, '');

  const builtInVars = {
    '{{date}}': formattedDate,
    '{{time}}': formattedTime,
    '{{datetime}}': `${formattedDate} ${formattedTime}`,
    '{{filename}}': fileNameWithoutExt,
    '{{year}}': now.getFullYear().toString(),
    '{{month}}': (now.getMonth() + 1).toString().padStart(2, '0'),
    '{{day}}': now.getDate().toString().padStart(2, '0')
  };

  let processedContent = content;
  for (const [key, value] of Object.entries(builtInVars)) {
    processedContent = processedContent.replace(new RegExp(key, 'g'), value);
  }

  for (const [key, value] of Object.entries(customVars)) {
    processedContent = processedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  const newFile = {
    id: Date.now().toString(),
    name: name,
    content: processedContent,
    createdAt: new Date(),
    updatedAt: new Date(),
    history: []
  };

  _files.push(newFile);
  storage.saveFiles(_files);

  if (folderId) {
    addFileToFolder(newFile.id, folderId);
  }

  sidebar.renderFileList();
  openFile(newFile.id);

  return newFile;
}

// 打开文件
export function openFile(fileId) {
  const file = _files.find(f => f.id === fileId);
  if (!file) return;

  _currentFileId = file.id;
  sidebar.setCurrentFileId(_currentFileId);
  
  const editorEl = document.getElementById('editor');
  const editorTitle = document.getElementById('editorTitle');
  
  if (editorEl) editorEl.value = file.content;
  if (editorTitle) editorTitle.textContent = file.name;

  preview.updatePreview(file.content);
  editor.updateWordCount();

  // 更新文件列表中的活动状态
  document.querySelectorAll('.file-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeItem = document.querySelector(`.file-item[data-id="${fileId}"]`);
  if (activeItem) activeItem.classList.add('active');

  storage.saveLastOpenFile(fileId);
}

// 删除文件
export function deleteFile(fileId) {
  if (_files.length <= 1) {
    alert('不能删除最后一个文件');
    return;
  }

  if (confirm('确定要删除此文件吗？')) {
    const index = _files.findIndex(f => f.id === fileId);
    if (index !== -1) {
      _files.splice(index, 1);
      storage.saveFiles(_files);
      sidebar.renderFileList();

      if (fileId === _currentFileId && _files.length > 0) {
        openFile(_files[0].id);
      }
    }
  }
}

// 保存文件
export function saveFile(fileId, content) {
  const file = _files.find(f => f.id === fileId);
  if (!file) return;

  if (file.content !== content) {
    if (!file.history) file.history = [];
    file.history.push({
      content: file.content,
      savedAt: new Date()
    });
    if (file.history.length > 10) file.history.shift();
  }

  file.content = content;
  file.updatedAt = new Date();
  storage.saveFiles(_files);

  const fileElement = document.querySelector(`.file-item[data-id="${fileId}"]`);
  if (fileElement) {
    const timeElement = fileElement.querySelector('.file-time');
    if (timeElement) timeElement.textContent = sidebar.formatDate(file.updatedAt);
  }

  // 触发自动同步检查
  if (window.checkAutoSync) {
    window.checkAutoSync();
  }
}

// 添加文件到文件夹
export function addFileToFolder(fileId, folderId) {
  const folder = _folders.find(f => f.id === folderId);
  if (!folder) return;
  if (!folder.files.includes(fileId)) {
    folder.files.push(fileId);
    folder.updatedAt = new Date();
    storage.saveFolders(_folders);
    sidebar.renderFileList();
  }
}

// 打开第一个文件
export function openFirstFile() {
  if (_files.length > 0) {
    const lastFileId = storage.loadLastOpenFile();
    if (lastFileId && _files.some(f => f.id === lastFileId)) {
      openFile(lastFileId);
    } else {
      openFile(_files[0].id);
    }
  }
}

// 渲染文件列表
export function renderFileList() {
  sidebar.setFiles(_files);
  sidebar.setFolders(_folders);
  sidebar.setCurrentFileId(_currentFileId);
  sidebar.renderFileList();
}

// 获取当前文件
export function getCurrentFile() {
  return _files.find(f => f.id === _currentFileId);
}

// 获取当前编辑器值
export function getEditorContent() {
  const editorEl = document.getElementById('editor');
  return editorEl?.value || '';
}

// 更新编辑器内容
export function setEditorContent(content) {
  const editorEl = document.getElementById('editor');
  if (editorEl) editorEl.value = content;
}
