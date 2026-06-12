/**
 * 图床配置模块 - 管理GitHub/Gitee/自定义图床配置
 */

import * as storage from '../utils/storage.js';
import * as editor from './editor.js';

// 初始化图床配置
export function initImageHostConfig() {
  const imageHostList = document.getElementById('imageHostList');
  if (!imageHostList) return;
  
  imageHostList.innerHTML = '';
  const savedConfig = storage.loadImageHostConfig();
  savedConfig?.hosts?.forEach(host => {
    addImageHostItem(host);
  });

  if (savedConfig?.defaultHostIndex !== undefined) {
    const defaultRadios = document.querySelectorAll('.default-image-host-radio');
    if (defaultRadios.length > savedConfig.defaultHostIndex) {
      defaultRadios[savedConfig.defaultHostIndex].checked = true;
    }
  }
}

// 添加图床配置项
export function addImageHostItem(config = {}) {
  const template = document.getElementById('imageHostItemTemplate');
  if (!template) return;
  
  const clone = template.content.cloneNode(true);
  const hostItem = clone.querySelector('.image-host-item');

  if (config.type) {
    hostItem.querySelector('.image-host-type').value = config.type;
    toggleImageHostConfig(hostItem, config.type);
  }

  if (config.name) hostItem.querySelector('.image-host-name').value = config.name;

  if (config.github) {
    hostItem.querySelector('.github-username').value = config.github.username || '';
    hostItem.querySelector('.github-repo').value = config.github.repo || '';
    hostItem.querySelector('.github-branch').value = config.github.branch || 'main';
    hostItem.querySelector('.github-path').value = config.github.path || 'img';
    hostItem.querySelector('.github-token').value = config.github.token || '';
    hostItem.querySelector('.github-customDomain').value = config.github.customDomain || '';
  }

  if (config.gitee) {
    hostItem.querySelector('.gitee-username').value = config.gitee.username || '';
    hostItem.querySelector('.gitee-repo').value = config.gitee.repo || '';
    hostItem.querySelector('.gitee-branch').value = config.gitee.branch || 'master';
    hostItem.querySelector('.gitee-path').value = config.gitee.path || 'img';
    hostItem.querySelector('.gitee-token').value = config.gitee.token || '';
    hostItem.querySelector('.gitee-customDomain').value = config.gitee.customDomain || '';
  }

  if (config.custom) {
    hostItem.querySelector('.custom-api-url').value = config.custom.apiUrl || '';
    hostItem.querySelector('.custom-upload-path').value = config.custom.uploadPath || '';
    hostItem.querySelector('.custom-api-key').value = config.custom.apiKey || '';
    hostItem.querySelector('.custom-customDomain').value = config.custom.customDomain || '';
  }

  hostItem.querySelectorAll('.remove-image-host-btn').forEach(btn => {
    btn.addEventListener('click', function () { hostItem.remove(); });
  });

  hostItem.querySelector('.image-host-type').addEventListener('change', function () {
    toggleImageHostConfig(hostItem, this.value);
  });

  document.getElementById('imageHostList')?.appendChild(hostItem);
}

// 显示/隐藏图床配置
export function toggleImageHostConfig(hostItem, type) {
  hostItem.querySelector('.github-config').style.display = type === 'github' ? 'block' : 'none';
  hostItem.querySelector('.gitee-config').style.display = type === 'gitee' ? 'block' : 'none';
  hostItem.querySelector('.custom-config').style.display = type === 'custom' ? 'block' : 'none';
}

// 保存图床配置
export function saveImageHostConfig() {
  const config = { hosts: [], defaultHostIndex: 0 };

  document.querySelectorAll('.image-host-item').forEach((item, index) => {
    const hostConfig = {
      name: item.querySelector('.image-host-name').value,
      type: item.querySelector('.image-host-type').value
    };

    switch (hostConfig.type) {
      case 'github':
        hostConfig.github = {
          username: item.querySelector('.github-username').value,
          repo: item.querySelector('.github-repo').value,
          branch: item.querySelector('.github-branch').value,
          path: item.querySelector('.github-path').value,
          token: item.querySelector('.github-token').value,
          customDomain: item.querySelector('.github-customDomain').value
        };
        break;
      case 'gitee':
        hostConfig.gitee = {
          username: item.querySelector('.gitee-username').value,
          repo: item.querySelector('.gitee-repo').value,
          branch: item.querySelector('.gitee-branch').value,
          path: item.querySelector('.gitee-path').value,
          token: item.querySelector('.gitee-token').value,
          customDomain: item.querySelector('.gitee-customDomain').value
        };
        break;
      case 'custom':
        hostConfig.custom = {
          apiUrl: item.querySelector('.custom-api-url').value,
          uploadPath: item.querySelector('.custom-upload-path').value,
          apiKey: item.querySelector('.custom-api-key').value,
          customDomain: item.querySelector('.custom-customDomain').value
        };
        break;
    }

    if (item.querySelector('.default-image-host-radio').checked) {
      config.defaultHostIndex = index;
    }

    config.hosts.push(hostConfig);
  });

  storage.saveImageHostConfig(config);
  return config;
}

// 读取文件为Base64
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 上传到GitHub
async function uploadToGitHub(file, fileName, config) {
  const apiUrl = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${config.path}/${fileName}`;
  const fileContent = await readFileAsBase64(file);

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload image: ${fileName}`,
      content: fileContent.split(',')[1],
      branch: config.branch
    })
  });

  if (!response.ok) throw new Error(`GitHub API错误: ${response.status}`);
  const result = await response.json();
  return config.customDomain?.length > 1 ? config.customDomain + `/${fileName}` : result.content.download_url;
}

// 上传到Gitee
async function uploadToGitee(file, fileName, config) {
  const apiUrl = `https://gitee.com/api/v5/repos/${config.username}/${config.repo}/contents/${config.path}/${fileName}`;
  const fileContent = await readFileAsBase64(file);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: config.token,
      content: fileContent.split(',')[1],
      message: `Upload image: ${fileName}`,
      branch: config.branch
    })
  });

  if (!response.ok) throw new Error(`Gitee API错误: ${response.status}`);
  const result = await response.json();
  return config.customDomain?.length > 1 ? config.customDomain + `/${fileName}` : result.content.download_url;
}

// 上传到自定义图床
async function uploadToCustom(file, fileName, config) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);
  if (config.apiKey) formData.append('apiKey', config.apiKey);

  const response = await fetch(config.apiUrl, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(`自定义图床错误: ${response.status}`);
  const result = await response.json();
  return config.customDomain?.length > 1 ? config.customDomain + `/${fileName}` : result.url || result.data.url;
}

// 上传图片到图床
export async function uploadImageToImageHost(file, alt, needRepalceImageUrl = "") {
  const savedConfig = storage.loadImageHostConfig();
  if (!savedConfig.hosts || savedConfig.hosts.length < 1) {
    alert("请先配置图床");
    return;
  }

  const config = savedConfig.hosts[savedConfig.defaultHostIndex];
  const timestamp = new Date().getTime();
  const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
  const fileExtension = file.name.split('.').pop();
  const finalFileName = `${fileName}_${timestamp}.${fileExtension}`;

  let imageUrl = '';

  try {
    if (config.type === 'github') {
      imageUrl = await uploadToGitHub(file, finalFileName, config.github);
    } else if (config.type === 'gitee') {
      imageUrl = await uploadToGitee(file, finalFileName, config.gitee);
    } else if (config.type === 'custom') {
      imageUrl = await uploadToCustom(file, finalFileName, config.custom);
    }

    if (needRepalceImageUrl.length > 1 && window.currentContextImage) {
      editor.replaceImageUrl(needRepalceImageUrl, imageUrl);
    } else {
      editor.insertImage(alt, imageUrl);
    }

    document.getElementById('insertModal').style.display = 'none';
  } catch (error) {
    console.error('上传失败:', error);
    alert(`上传失败: ${error.message}`);
  }
}
