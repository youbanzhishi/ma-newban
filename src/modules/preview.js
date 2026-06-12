/**
 * Preview Module - 预览渲染模块
 */

// 配置marked渲染选项
export function initMarked() {
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      gfm: true,
      breaks: true,
      highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, code).value;
        }
        return hljs.highlightAuto(code).value;
      }
    });
  }
}

// 更新预览
export function updatePreview(content) {
  const preview = document.getElementById('preview');
  if (preview && typeof marked !== 'undefined') {
    preview.innerHTML = marked.parse(content);
  }
}

// 初始化图片右键菜单
export function initImageContextMenu() {
  const preview = document.getElementById('preview');
  if (!preview) return;

  // 创建自定义右键菜单
  const contextMenu = document.createElement('div');
  contextMenu.id = 'imageContextMenu';
  contextMenu.style.display = 'none';
  contextMenu.style.position = 'absolute';
  contextMenu.style.backgroundColor = 'white';
  contextMenu.style.border = '1px solid #ccc';
  contextMenu.style.borderRadius = '4px';
  contextMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  contextMenu.style.zIndex = '1000';

  const uploadOption = document.createElement('div');
  uploadOption.textContent = '上传到图床';
  uploadOption.style.padding = '8px 12px';
  uploadOption.style.cursor = 'pointer';
  uploadOption.addEventListener('click', handleImageUploadToHost);

  contextMenu.appendChild(uploadOption);
  document.body.appendChild(contextMenu);

  // 监听预览区域的右键点击事件
  preview.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();

      // 保存当前点击的图片
      window.currentContextImage = e.target;

      // 显示菜单
      contextMenu.style.display = 'block';
      contextMenu.style.left = `${e.pageX}px`;
      contextMenu.style.top = `${e.pageY}px`;
    }
  });

  // 点击其他地方隐藏菜单
  document.addEventListener('click', function () {
    contextMenu.style.display = 'none';
  });
}

// 处理图片上传到图床
async function handleImageUploadToHost() {
  const image = window.currentContextImage;
  if (!image) return;

  const status = document.createElement('div');
  status.textContent = '上传中...';
  status.style.position = 'fixed';
  status.style.top = '10px';
  status.style.right = '10px';
  status.style.padding = '8px 12px';
  status.style.backgroundColor = 'rgba(0,0,0,0.7)';
  status.style.color = 'white';
  status.style.borderRadius = '4px';
  status.style.zIndex = '1000';
  document.body.appendChild(status);

  const imageUrl = image.src;

  if (imageUrl.startsWith('data:')) {
    const blob = dataURLtoBlob(imageUrl);
    const file = new File([blob], 'uploaded_image.png', { type: 'image/png' });

    try {
      await window.uploadImageToImageHost(file, '上传的图片', imageUrl);
      status.textContent = '上传成功!';
      setTimeout(() => status.remove(), 2000);
    } catch (error) {
      status.textContent = `上传失败: ${error.message}`;
      status.style.backgroundColor = '#e74c3c';
      setTimeout(() => status.remove(), 3000);
    }
  } else {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'downloaded_image.png', { type: blob.type });
      
      await window.uploadImageToImageHost(file, '上传的图片', imageUrl);
      status.textContent = '上传成功!';
      setTimeout(() => status.remove(), 2000);
    } catch (error) {
      status.textContent = `上传失败: ${error.message}`;
      status.style.backgroundColor = '#e74c3c';
      setTimeout(() => status.remove(), 3000);
    }
  }
}

// 将base64转换为Blob
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
