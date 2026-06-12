/**
 * 事件绑定 - 菜单与同步模块
 */

import * as settings from './settings.js';
import { renderHistoryFileSelect } from './history.js';
import { syncToGit, setCommitMessage, initCommitModal } from './git-sync.js';
import { confirmEditFile } from './edit-modal.js';
import * as fileOps from './file-ops.js';
import { getFiles, getCurrentFileId, createNewFile } from './file-manager.js';

// 绑定菜单事件
export function bindMenuEvents(appConfig) {
  document.getElementById('viewMenu')?.addEventListener('click', function () {
    const modes = ['edit', 'preview', 'split'];
    const currentIndex = modes.indexOf(appConfig.viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    appConfig.viewMode = modes[nextIndex];
    settings.updateViewMode(appConfig.viewMode);
    settings.saveSettings(appConfig);

    const modeName = { edit: '编辑模式', preview: '预览模式', split: '分屏模式' }[appConfig.viewMode];
    const tempMsg = document.createElement('div');
    tempMsg.textContent = `已切换到${modeName}`;
    tempMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:white;padding:10px 20px;border-radius:5px;z-index:1000;';
    document.body.appendChild(tempMsg);
    setTimeout(() => document.body.removeChild(tempMsg), 1500);
  });

  document.getElementById('prefMenu')?.addEventListener('click', function () {
    document.getElementById('prefModal').style.display = 'flex';
  });

  document.getElementById('historyMenu')?.addEventListener('click', function () {
    document.getElementById('historyModal').style.display = 'flex';
    renderHistoryFileSelect();
  });

  document.getElementById('storageMenu')?.addEventListener('click', function () {
    document.getElementById('storageModal').style.display = 'flex';
  });

  document.getElementById('dataMenu')?.addEventListener('click', function () {
    document.getElementById('dataModal').style.display = 'flex';
  });
}

// 绑定同步事件
export function bindSyncEvents() {
  document.getElementById('syncBtn')?.addEventListener('click', function () {
    document.getElementById('commitModal').style.display = 'flex';
    initCommitModal();
  });

  document.getElementById('confirmCommit')?.addEventListener('click', function () {
    setCommitMessage(document.getElementById('commitMessage')?.value || '更新文档');
    document.getElementById('commitModal').style.display = 'none';
    syncToGit();
  });
}

// 绑定导入导出事件
export function bindImportExportEvents() {
  document.getElementById('importType')?.addEventListener('change', function () {
    const type = this.value;
    document.getElementById('fileImportSection').style.display = type === 'file' ? 'block' : 'none';
    document.getElementById('gitImportSection').style.display = type === 'git' ? 'block' : 'none';
    document.getElementById('textImportSection').style.display = type === 'text' ? 'block' : 'none';
    document.getElementById('filesImportSection').style.display = type === 'files' ? 'block' : 'none';
    document.getElementById('folderImportSection').style.display = type === 'folder' ? 'block' : 'none';
    document.getElementById('zipImportSection').style.display = type === 'zip' ? 'block' : 'none';
    document.getElementById('jsonImportSection').style.display = type === 'json' ? 'block' : 'none';
  });

  document.getElementById('exportType')?.addEventListener('change', function () {
    const type = this.value;
    document.getElementById('singleExportSection').style.display = type === 'single' ? 'block' : 'none';
    document.getElementById('batchExportSection').style.display = type === 'batch' ? 'block' : 'none';
    document.getElementById('gitExportSection').style.display = type === 'git' ? 'block' : 'none';
  });

  document.getElementById('confirmData')?.addEventListener('click', function () {
    const activeTab = document.querySelector('.tab-content.active')?.id;
    if (activeTab === 'importTab') {
      const type = document.getElementById('importType')?.value;
      if (type === 'file' || type === 'files') {
        const fileInput = document.getElementById('fileInput');
        if (fileInput?.files?.length > 0) {
          fileOps.importFile(fileInput.files[0], createNewFile);
        }
      } else if (type === 'text') {
        const content = document.getElementById('textImportContent')?.value;
        if (content?.trim()) {
          const fileName = prompt('请输入文件名', '导入的文档.md');
          if (fileName) createNewFile(fileName, content);
        }
      }
    } else if (activeTab === 'exportTab') {
      const type = document.getElementById('exportType')?.value;
      if (type === 'single') {
        const format = document.getElementById('exportFormat')?.value;
        const fileName = document.getElementById('exportFileName')?.value?.trim() || 'document';
        const files = getFiles();
        const fileId = getCurrentFileId();
        const file = files.find(f => f.id === fileId);
        if (file) {
          if (format === 'md') fileOps.exportToMarkdown(fileName, file.content);
          else if (format === 'html') fileOps.exportToHTML(fileName, file.content);
          else if (format === 'pdf') fileOps.exportToPDF(fileName, file.content);
        }
      } else if (type === 'batch') {
        const format = document.getElementById('batchExportFormat')?.value;
        const files = getFiles();
        if (format === 'zip') fileOps.exportAllFilesAsZip(files);
        else if (format === 'json') fileOps.exportAllFilesAsJson(files);
      }
    }
    document.getElementById('dataModal').style.display = 'none';
  });
}

// 绑定编辑文件确认事件
export function bindEditFileEvents() {
  document.getElementById('confirmEditFile')?.addEventListener('click', confirmEditFile);
}
