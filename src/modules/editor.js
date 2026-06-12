/**
 * Editor Module - Markdown编辑器模块
 */

// 更新字数统计
export function updateWordCount() {
  const editor = document.getElementById('editor');
  const wordCountEl = document.getElementById('wordCount');
  
  if (editor && wordCountEl) {
    const text = editor.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    wordCountEl.textContent = words;
  }
}

// 在光标位置插入内容
export function insertAtCursor(text) {
  const editor = document.getElementById('editor');
  if (!editor) return;
  
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const before = editor.value.substring(0, start);
  const after = editor.value.substring(end);

  editor.value = before + text + after;
  editor.selectionStart = start + text.length;
  editor.selectionEnd = start + text.length;
  editor.focus();

  // 触发输入事件以更新预览
  const event = new Event('input', { bubbles: true });
  editor.dispatchEvent(event);
}

// 插入图片
export function insertImage(alt, url) {
  const markdown = `![${alt}](${url})`;
  insertAtCursor(markdown);
}

// 插入视频
export function insertVideo(url, platform) {
  let markdown = '';
  if (platform === 'youtube') {
    const videoId = url.match(/[?&]v=([^&]+)/)?.[1] || url.split('/').pop();
    markdown = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  } else if (platform === 'vimeo') {
    const videoId = url.split('/').pop();
    markdown = `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
  } else {
    markdown = `<video src="${url}" controls></video>`;
  }
  insertAtCursor(markdown);
}

// 插入文件链接
export function insertFileLink(text, url) {
  const markdown = `[${text}](${url})`;
  insertAtCursor(markdown);
}

// 插入其他内容
export function insertOtherContent(type) {
  let content = '';
  switch (type) {
    case 'table':
      content = `| 标题1 | 标题2 | 标题3 |
|------|------|------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |`;
      break;
    case 'code':
      content = "```语言\n// 在这里输入代码\n```";
      break;
    case 'quote':
      content = "> 引用内容";
      break;
    case 'divider':
      content = "---";
      break;
  }
  insertAtCursor(content);
}

// 替换图片URL
export function replaceImageUrl(oldUrl, newUrl) {
  const editor = document.getElementById('editor');
  if (!editor) return;
  
  const content = editor.value;
  const newContent = content.replace(
    new RegExp(escapeRegExp(oldUrl), 'g'),
    newUrl
  );
  editor.value = newContent;
}

// 转义正则特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 获取编辑器内容
export function getEditorContent() {
  const editor = document.getElementById('editor');
  return editor ? editor.value : '';
}

// 设置编辑器内容
export function setEditorContent(content) {
  const editor = document.getElementById('editor');
  if (editor) {
    editor.value = content;
  }
}
