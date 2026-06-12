/**
 * 事件绑定 - 插入功能模块
 */

import * as editor from './editor.js';
import * as fileOps from './file-ops.js';
import { uploadImageToImageHost } from './image-host.js';
import { getFiles, getCurrentFileId, createNewFile } from './file-manager.js';

// 绑定插入内容事件
export function bindInsertEvents() {
  document.getElementById('insertBtn')?.addEventListener('click', function () {
    document.getElementById('insertModal').style.display = 'flex';
    document.getElementById('imageUpload').value = '';
    document.getElementById('imageUrl').value = '';
    document.getElementById('imageAlt').value = '';
  });

  document.getElementById('insertImageBtn')?.addEventListener('click', function () {
    const fileInput = document.getElementById('imageUpload');
    const urlInput = document.getElementById('imageUrl');
    const alt = document.getElementById('imageAlt')?.value || '图片';

    if (fileInput?.files?.length > 0) {
      uploadImageToImageHost(fileInput.files[0], alt);
    } else if (urlInput?.value) {
      editor.insertImage(alt, urlInput.value);
      document.getElementById('insertModal').style.display = 'none';
    } else {
      alert('请选择图片或输入图片URL');
    }
  });

  document.getElementById('insertVideoBtn')?.addEventListener('click', function () {
    const url = document.getElementById('videoUrl')?.value;
    const platform = document.getElementById('videoPlatform')?.value;
    if (url) {
      editor.insertVideo(url, platform);
      document.getElementById('insertModal').style.display = 'none';
    } else {
      alert('请输入视频URL');
    }
  });

  document.getElementById('insertFileBtn')?.addEventListener('click', function () {
    const url = document.getElementById('fileUrl')?.value;
    const text = document.getElementById('fileText')?.value || '下载文件';
    if (url) {
      editor.insertFileLink(text, url);
      document.getElementById('insertModal').style.display = 'none';
    } else {
      alert('请输入文件URL');
    }
  });

  document.getElementById('insertOtherBtn')?.addEventListener('click', function () {
    const type = document.getElementById('otherType')?.value;
    if (type) {
      editor.insertOtherContent(type);
      document.getElementById('insertModal').style.display = 'none';
    }
  });
}

// 绑定图片上传预览
export function bindImageUploadEvents() {
  document.getElementById('imageUpload')?.addEventListener('change', function (e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageTab = document.getElementById('imageTab');
    let previewContainer = document.getElementById('imagePreviewContainer');
    if (!previewContainer) {
      previewContainer = document.createElement('div');
      previewContainer.id = 'imagePreviewContainer';
      previewContainer.style.marginTop = '15px';
      imageTab.appendChild(previewContainer);
    } else {
      previewContainer.innerHTML = '';
    }

    for (const file of files) {
      if (!file.type.match('image.*')) continue;

      const reader = new FileReader();
      reader.onload = (function (f) {
        return function (e) {
          const preview = document.createElement('div');
          preview.className = 'image-preview-item';
          preview.innerHTML = `
            <img src="${e.target.result}" style="max-width:100%;max-height:200px;display:block;border-radius:4px;">
            <div>${f.name} (${fileOps.formatFileSize(f.size)})</div>
          `;
          previewContainer.appendChild(preview);
        };
      })(file);
      reader.readAsDataURL(file);
    }
  });
}
