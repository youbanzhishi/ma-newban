/**
 * Storage Utils - localStorage封装工具
 */

// 文件存储
export function saveFiles(files) {
  localStorage.setItem('mdEditorFiles', JSON.stringify(files));
}

export function loadFiles() {
  const savedFiles = localStorage.getItem('mdEditorFiles');
  return savedFiles ? JSON.parse(savedFiles) : [];
}

// 文件夹存储
export function saveFolders(folders) {
  localStorage.setItem('mdEditorFolders', JSON.stringify(folders));
}

export function loadFolders() {
  const savedFolders = localStorage.getItem('mdEditorFolders');
  return savedFolders ? JSON.parse(savedFolders) : [];
}

// 配置存储
export function saveConfig(config) {
  localStorage.setItem('mdEditorConfig', JSON.stringify(config));
}

export function loadConfig() {
  const savedConfig = localStorage.getItem('mdEditorConfig');
  return savedConfig ? JSON.parse(savedConfig) : null;
}

// 模板存储
export function saveTemplates(templates) {
  localStorage.setItem('mdEditorTemplates', JSON.stringify(templates));
}

export function loadTemplates() {
  const savedTemplates = localStorage.getItem('mdEditorTemplates');
  return savedTemplates ? JSON.parse(savedTemplates) : [];
}

// 多Git配置存储
export function saveMultiGitConfig(config) {
  localStorage.setItem('multiGitConfig', JSON.stringify(config));
}

export function loadMultiGitConfig() {
  const savedConfig = localStorage.getItem('multiGitConfig');
  return savedConfig ? JSON.parse(savedConfig) : { repositories: [] };
}

// 图床配置存储
export function saveImageHostConfig(config) {
  localStorage.setItem('imageHostConfig', JSON.stringify(config));
}

export function loadImageHostConfig() {
  const savedConfig = localStorage.getItem('imageHostConfig');
  return savedConfig ? JSON.parse(savedConfig) : { hosts: [] };
}

// 加密文件存储
export function saveEncryptedFiles(encryptedData) {
  localStorage.setItem('encryptedFiles', encryptedData);
}

export function loadEncryptedFiles() {
  return localStorage.getItem('encryptedFiles');
}

// 最后打开的文件
export function saveLastOpenFile(fileId) {
  localStorage.setItem('lastOpenFile', fileId);
}

export function loadLastOpenFile() {
  return localStorage.getItem('lastOpenFile');
}

// 存储Tab状态
export function saveLastActiveStorageTab(tab) {
  localStorage.setItem('lastActiveStorageTab', tab);
}

export function loadLastActiveStorageTab() {
  return localStorage.getItem('lastActiveStorageTab') || 'local';
}
