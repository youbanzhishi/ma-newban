/**
 * Sidebar Module - 侧边栏文件管理模块
 */

import { saveFolders, loadFolders } from '../utils/storage.js';

// 文件列表
let files = [];
let folders = [];
let currentFileId = null;

// 设置文件列表引用
export function setFiles(filesRef) {
  files = filesRef;
}

// 设置文件夹列表引用
export function setFolders(foldersRef) {
  folders = foldersRef;
}

// 设置当前文件ID引用
export function setCurrentFileId(idRef) {
  currentFileId = idRef;
}

// 格式化日期
export function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

// 渲染文件列表
export function renderFileList() {
  const fileList = document.getElementById('fileList');
  if (!fileList) return;
  
  fileList.innerHTML = '';

  // 渲染文件夹
  folders.forEach(folder => {
    const folderItem = createFolderElement(folder);
    fileList.appendChild(folderItem);
  });

  // 渲染未分类的文件
  const uncategorizedFiles = files.filter(file =>
    !folders.some(folder => folder.files.includes(file.id))
  );

  if (uncategorizedFiles.length > 0) {
    const uncategorizedHeader = document.createElement('div');
    uncategorizedHeader.className = 'uncategorized-header';
    uncategorizedHeader.textContent = '未分类文件';
    fileList.appendChild(uncategorizedHeader);

    uncategorizedFiles.forEach(file => {
      const fileItem = createFileElement(file);
      fileList.appendChild(fileItem);
    });
  }
}

// 创建文件夹元素
function createFolderElement(folder) {
  const folderItem = document.createElement('div');
  folderItem.className = 'folder-item';
  folderItem.dataset.id = folder.id;

  folderItem.innerHTML = `
    <div class="folder-header">
      <i class="fas fa-folder"></i>
      <div class="folder-name">${folder.name}</div>
      <div class="folder-count">${folder.files.length}个文件</div>
      <div class="folder-actions">
        <button class="folder-action-btn rename-btn"><i class="fas fa-pencil-alt"></i></button>
        <button class="folder-action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  `;

  // 文件夹点击事件
  folderItem.addEventListener('click', function (e) {
    if (!e.target.closest('.folder-action-btn')) {
      this.classList.toggle('open');
      renderFolderContents(folder.id);
    }
  });

  // 重命名按钮
  folderItem.querySelector('.rename-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    const newName = prompt('请输入新文件夹名称', folder.name);
    if (newName && newName.trim() !== '') {
      folder.name = newName.trim();
      saveFolders(folders);
      renderFileList();
    }
  });

  // 删除按钮
  folderItem.querySelector('.delete-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    if (confirm('确定要删除此文件夹吗？文件夹内的文件不会被删除')) {
      const index = folders.findIndex(f => f.id === folder.id);
      if (index !== -1) {
        folders.splice(index, 1);
        saveFolders(folders);
        renderFileList();
      }
    }
  });

  return folderItem;
}

// 创建文件元素
function createFileElement(file) {
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  if (file.id === currentFileId) {
    fileItem.classList.add('active');
  }
  fileItem.dataset.id = file.id;

  fileItem.innerHTML = `
    <i class="far fa-file-alt"></i>
    <div class="file-name">${file.name}</div>
    <div class="file-time">${formatDate(file.updatedAt)}</div>
    <div class="file-actions">
      <button class="file-action-btn rename-btn"><i class="fas fa-pencil-alt"></i></button>
      <button class="file-action-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;

  // 点击事件
  fileItem.addEventListener('click', function (e) {
    if (!e.target.closest('.file-action-btn')) {
      window.openFile(file.id);
    }
  });

  // 重命名按钮
  fileItem.querySelector('.rename-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    window.openEditFileModal(file.id);
  });

  // 删除按钮
  fileItem.querySelector('.delete-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    window.deleteFile(file.id);
  });

  return fileItem;
}

// 渲染文件夹内容
export function renderFolderContents(folderId) {
  const folder = folders.find(f => f.id === folderId);
  if (!folder) return;

  const folderItem = document.querySelector(`.folder-item[data-id="${folderId}"]`);
  if (!folderItem) return;

  // 如果已经渲染过内容
  const existingContents = folderItem.querySelector('.folder-contents');
  if (existingContents) {
    existingContents.style.display = existingContents.style.display === 'none' ? 'block' : 'none';
    return;
  }

  // 创建文件夹内容容器
  const contents = document.createElement('div');
  contents.className = 'folder-contents';

  // 渲染文件夹内的文件
  folder.files.forEach(fileId => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      const fileItem = createFileElement(file);
      contents.appendChild(fileItem);
    }
  });

  // 添加"添加文件"按钮
  const addFileBtn = document.createElement('button');
  addFileBtn.className = 'add-file-to-folder';
  addFileBtn.innerHTML = '<i class="fas fa-plus"></i> 添加文件';
  addFileBtn.addEventListener('click', function () {
    showAddFileToFolderDialog(folderId);
  });

  contents.appendChild(addFileBtn);
  folderItem.appendChild(contents);
}

// 显示添加文件到文件夹对话框
export function showAddFileToFolderDialog(folderId) {
  const dialog = document.createElement('div');
  dialog.className = 'folder-add-dialog';

  const currentFolder = folders.find(f => f.id === folderId);
  const currentFileIds = currentFolder ? currentFolder.files : [];

  const availableFiles = files.filter(file =>
    !folders.some(folder => folder.files.includes(file.id)) ||
    currentFileIds.includes(file.id)
  );

  dialog.innerHTML = `
    <div class="dialog-content">
      <h3>添加文件到文件夹</h3>
      <div class="file-list">
        ${availableFiles.map(file => `
          <div class="file-option" data-id="${file.id}">
            <input type="checkbox" id="file_${file.id}" 
                   ${currentFileIds.includes(file.id) ? 'checked' : ''}>
            <label for="file_${file.id}">${file.name}</label>
          </div>
        `).join('')}
      </div>
      <div class="dialog-actions">
        <button class="editor-btn secondary" id="cancelAddFile">取消</button>
        <button class="editor-btn" id="confirmAddFile">添加</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  // 确认按钮事件
  dialog.querySelector('#confirmAddFile').addEventListener('click', function () {
    const selectedFiles = dialog.querySelectorAll('input[type="checkbox"]:checked');
    const selectedFileIds = Array.from(selectedFiles).map(input =>
      input.closest('.file-option').dataset.id
    );

    if (currentFolder) {
      currentFolder.files = selectedFileIds;
      currentFolder.updatedAt = new Date();
      saveFolders(folders);
      renderFileList();
    }

    dialog.remove();
  });

  // 取消按钮事件
  dialog.querySelector('#cancelAddFile').addEventListener('click', function () {
    dialog.remove();
  });
}

// 创建新文件夹
export function createNewFolder(name) {
  const newFolder = {
    id: 'folder_' + Date.now(),
    name: name,
    files: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  folders.push(newFolder);
  saveFolders(folders);
  renderFileList();
}

// 从文件夹移除文件
export function removeFileFromFolder(fileId, folderId) {
  const folder = folders.find(f => f.id === folderId);
  if (folder) {
    const index = folder.files.indexOf(fileId);
    if (index !== -1) {
      folder.files.splice(index, 1);
      folder.updatedAt = new Date();
      saveFolders(folders);
      renderFileList();
    }
  }
}

// 添加文件到文件夹
export function addFileToFolder(fileId, folderId) {
  const folder = folders.find(f => f.id === folderId);
  if (folder && !folder.files.includes(fileId)) {
    folder.files.push(fileId);
    folder.updatedAt = new Date();
    saveFolders(folders);
    renderFileList();
  }
}

// 切换侧边栏
export function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
    const icon = sidebarToggle?.querySelector('i');
    if (icon) {
      if (sidebar.classList.contains('collapsed')) {
        icon.className = 'fas fa-chevron-right';
      } else {
        icon.className = 'fas fa-chevron-left';
      }
    }
  }
}

// 打开/关闭侧边栏（移动端）
export function toggleSidebarMobile() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}
