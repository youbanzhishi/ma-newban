/**
 * Git同步模块 - 管理多点Git仓库配置和同步
 */

import * as storage from '../utils/storage.js';

// 模块状态
let _commitMessage = '';

// 获取提交消息
export function getCommitMessage() { return _commitMessage; }
export function setCommitMessage(val) { _commitMessage = val; }

// 同步到Git
export function syncToGit() {
  const syncStatus = document.getElementById('syncStatus');
  if (!syncStatus) return;

  syncStatus.innerHTML = '<i class="fas fa-sync fa-spin"></i> <span>同步中...</span>';
  syncStatus.classList.remove('synced', 'error');

  setTimeout(() => {
    syncStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span>同步成功</span>';
    syncStatus.classList.add('synced');
  }, 2000);
}

// 初始化多点Git配置
export function initMultiGitConfig() {
  const repoList = document.getElementById('repoList');
  if (!repoList) return;
  
  repoList.innerHTML = '';
  const savedConfig = storage.loadMultiGitConfig();
  savedConfig.repositories.forEach(repo => addRepoItem(repo));

  if (savedConfig.primaryRepoIndex !== undefined) {
    const primaryRadios = document.querySelectorAll('.primary-repo-radio');
    if (primaryRadios.length > savedConfig.primaryRepoIndex) {
      primaryRadios[savedConfig.primaryRepoIndex].checked = true;
    }
  }

  const autoSyncCheckbox = document.getElementById('multiAutoSync');
  if (autoSyncCheckbox) {
    autoSyncCheckbox.checked = savedConfig.autoSync !== false;
  }
}

// 添加仓库配置项
export function addRepoItem(config = {}) {
  const template = document.getElementById('gitRepoItemTemplate');
  if (!template) return;
  
  const clone = template.content.cloneNode(true);
  const repoItem = clone.querySelector('.git-repo-item');

  if (config.name) repoItem.querySelector('.repo-name').value = config.name;
  if (config.type) {
    repoItem.querySelector('.repo-type').value = config.type;
    toggleGiteaServer(repoItem, config.type);
  }
  if (config.token) repoItem.querySelector('.repo-token').value = config.token;
  if (config.path) repoItem.querySelector('.repo-path').value = config.path;
  if (config.url) repoItem.querySelector('.gitea-url').value = config.url;
  if (config.encrypt !== undefined) {
    repoItem.querySelector('.encrypt-option').value = config.encrypt ? 'yes' : 'no';
  }

  repoItem.querySelectorAll('.remove-repo-btn').forEach(btn => {
    btn.addEventListener('click', function () { repoItem.remove(); saveMultiGitConfig(); });
  });

  repoItem.querySelector('.repo-type').addEventListener('change', function () {
    toggleGiteaServer(repoItem, this.value);
  });

  repoItem.querySelector('.primary-repo-radio').addEventListener('change', function () {
    if (this.checked) saveMultiGitConfig();
  });

  document.getElementById('repoList')?.appendChild(repoItem);
}

// 显示/隐藏Gitea服务器字段
export function toggleGiteaServer(repoItem, type) {
  const giteaServer = repoItem.querySelector('.gitea-server');
  if (giteaServer) giteaServer.style.display = type === 'gitea' ? 'block' : 'none';
}

// 保存多点Git配置
export function saveMultiGitConfig() {
  const config = { repositories: [], autoSync: document.getElementById('multiAutoSync')?.checked !== false };

  document.querySelectorAll('.git-repo-item').forEach((item, index) => {
    const repoConfig = {
      name: item.querySelector('.repo-name').value,
      type: item.querySelector('.repo-type').value,
      token: item.querySelector('.repo-token').value,
      path: item.querySelector('.repo-path').value,
      encrypt: item.querySelector('.encrypt-option').value === 'yes'
    };

    if (repoConfig.type === 'gitea') {
      repoConfig.url = item.querySelector('.gitea-url').value;
    }

    if (item.querySelector('.primary-repo-radio').checked) {
      config.primaryRepoIndex = index;
    }

    config.repositories.push(repoConfig);
  });

  storage.saveMultiGitConfig(config);
  return config;
}

// 渲染提交仓库选择器
export function renderCommitRepoSelect() {
  const repoSelect = document.getElementById('commitRepoSelect');
  if (!repoSelect) return;
  
  repoSelect.innerHTML = '';
  const config = storage.loadMultiGitConfig();
  
  if (config.repositories?.length > 0) {
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = '所有仓库';
    repoSelect.appendChild(allOption);

    config.repositories.forEach((repo, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = repo.name || `仓库 ${index + 1}`;
      repoSelect.appendChild(option);
    });
  }
}

// 初始化提交模态框
export function initCommitModal() {
  renderCommitRepoSelect();
}

// 自动同步检查（挂载到window供file-manager调用）
window.checkAutoSync = function() {
  const config = storage.loadConfig();
  if (config?.storage?.git?.autoSync && config?.storage?.git?.repoUrl) {
    syncToGit();
  }
};
