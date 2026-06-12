/**
 * Main Entry - 主入口文件
 * 只负责应用初始化和状态导出
 */

import './styles/main.css';

// 导入模块
import * as storage from './utils/storage.js';
import * as crypto from './modules/crypto.js';
import * as preview from './modules/preview.js';
import * as editor from './modules/editor.js';
import * as sidebar from './modules/sidebar.js';
import * as theme from './modules/theme.js';
import * as settings from './modules/settings.js';

// 导入新拆分模块
import * as fileManager from './modules/file-manager.js';
import * as gitSync from './modules/git-sync.js';
import * as imageHost from './modules/image-host.js';
import * as history from './modules/history.js';
import * as events from './modules/events.js';
import * as editModal from './modules/edit-modal.js';

// 应用状态
let appConfig = settings.getDefaultAppConfig();

// 挂载到window对象的导入数据
window.importData = { type: null, files: null, content: null };

// DOMContentLoaded入口
document.addEventListener('DOMContentLoaded', function () {
  initApplication();
  events.bindEvents(appConfig);
});

// 初始化应用
function initApplication() {
  // 加载数据
  const { files, folders, templates } = fileManager.initFileData();
  
  const savedConfig = storage.loadConfig();
  if (savedConfig) {
    appConfig = { ...appConfig, ...savedConfig };
  }

  // 如果没有文件，创建默认文件
  if (files.length === 0) {
    fileManager.createNewFile('欢迎使用.md', `# 欢迎使用Markdown编辑器

这是一个所见即所得的Markdown编辑器，灵感来源于Typora。

## 主要功能

- **实时渲染**：输入Markdown标签后回车即可看到渲染效果
- **文件管理**：左侧文件列表可管理多个文档
- **Git同步**：支持加密同步到多个Git仓库
- **导入导出**：支持导入和导出文档及配置

### 使用示例

\`\`\`javascript
function helloWorld() {
    console.log('Hello, Markdown Editor!');
}
\`\`\`

> 提示：尝试输入Markdown语法查看实时渲染效果

**加粗文本** 和 *斜体文本*

[这是一个链接](https://example.com)

| 功能         | 状态     |
|--------------|----------|
| 实时渲染     | 已启用   |
| Git同步      | 已配置   |
| 导入/导出    | 可用     |
`);
  }

  // 初始化预览
  preview.initMarked();
  preview.initImageContextMenu();

  // 初始化主题
  theme.initTheme();

  // 初始化设置
  settings.applyConfig(appConfig, document.getElementById('editor'));
  settings.initStorageTabs();

  // 渲染文件列表
  fileManager.renderFileList();

  // 打开第一个文件
  fileManager.openFirstFile();

  // 初始化图床配置
  imageHost.initImageHostConfig();

  // 初始化多点Git配置
  gitSync.initMultiGitConfig();
}

// 挂载到window的函数（保持兼容性）
window.createNewFile = fileManager.createNewFile;
window.openFile = fileManager.openFile;
window.deleteFile = fileManager.deleteFile;
window.saveFile = fileManager.saveFile;
window.openEditFileModal = editModal.openEditFileModal;
window.addFileToFolder = fileManager.addFileToFolder;
window.uploadImageToImageHost = imageHost.uploadImageToImageHost;

// 挂载状态（保持兼容性）
Object.defineProperty(window, 'files', {
  get: () => fileManager.getFiles(),
  set: (val) => fileManager.setFiles(val)
});

Object.defineProperty(window, 'currentFileId', {
  get: () => fileManager.getCurrentFileId(),
  set: (val) => fileManager.setCurrentFileId(val)
});

Object.defineProperty(window, 'folders', {
  get: () => fileManager.getFolders(),
  set: (val) => fileManager.setFolders(val)
});
