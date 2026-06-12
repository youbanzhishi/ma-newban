/**
 * File Operations Module - 文件导出操作模块
 */

// 格式化文件大小
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 实现saveAs函数
export function saveAs(blob, filename) {
  if (typeof navigator.msSaveBlob !== 'undefined') {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

// Markdown导出
export function exportToMarkdown(fileName, content) {
  const blob = new Blob([content], { type: 'text/markdown' });
  saveAs(blob, `${fileName}.md`);
}

// HTML导出
export function exportToHTML(fileName, content) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${fileName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        blockquote { border-left: 4px solid #ddd; padding-left: 15px; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
      </style>
    </head>
    <body>
      ${marked.parse(content)}
    </body>
    </html>
  `;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  saveAs(blob, `${fileName}.html`);
}

// PDF导出
export async function exportToPDF(fileName, content) {
  try {
    await loadHtml2Pdf();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          h1, h2, h3 { color: #333; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
          code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
          blockquote { border-left: 4px solid #ddd; padding-left: 15px; color: #666; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        ${marked.parse(content)}
      </body>
      </html>
    `;

    const element = document.createElement('div');
    element.innerHTML = htmlContent;

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '0';
    hiddenContainer.style.width = '1px';
    hiddenContainer.style.height = '1px';
    hiddenContainer.style.overflow = 'hidden';
    hiddenContainer.appendChild(element);

    document.body.appendChild(hiddenContainer);

    const opt = {
      margin: 10,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
    document.body.removeChild(hiddenContainer);
  } catch (error) {
    console.error('PDF导出失败:', error);
    throw error;
  }
}

// 加载html2pdf库
let html2pdfLoaded = false;
let html2pdfLoading = false;

export async function loadHtml2Pdf() {
  if (html2pdfLoaded) return true;
  if (html2pdfLoading) {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (html2pdfLoaded) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
    });
  }

  html2pdfLoading = true;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      html2pdfLoaded = true;
      html2pdfLoading = false;
      resolve(true);
    };
    script.onerror = () => {
      html2pdfLoading = false;
      reject(new Error('加载html2pdf库失败'));
    };
    document.head.appendChild(script);
  });
}

// 导入文件
export function importFile(file, createNewFileFn) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    const name = file.name.endsWith('.md') ? file.name : file.name + '.md';
    createNewFileFn(name, content);
  };
  reader.readAsText(file);
}

// 加载JSZip库
export async function loadJSZip() {
  if (typeof JSZip !== 'undefined') return true;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('加载JSZip失败'));
    document.head.appendChild(script);
  });
}

// 导出所有文件为ZIP
export async function exportAllFilesAsZip(files) {
  try {
    await loadJSZip();

    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "markdown_files.zip");
    return true;
  } catch (error) {
    console.error('ZIP导出失败:', error);
    throw error;
  }
}

// 导出所有文件为JSON
export function exportAllFilesAsJson(files) {
  const exportData = {
    exportedAt: new Date().toISOString(),
    files: files.map(file => ({
      id: file.id,
      name: file.name,
      content: file.content,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt
    }))
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  saveAs(blob, "markdown_files.json");
}

// 批量导入文件
export function importFilesFromFiles(files, createNewFileFn) {
  let importedCount = 0;
  const totalFiles = Array.from(files).filter(f => 
    f.name.endsWith('.md') || f.name.endsWith('.markdown')
  ).length;

  Array.from(files).forEach(file => {
    if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        createNewFileFn(file.name, e.target.result);
        importedCount++;
      };
      reader.readAsText(file);
    }
  });

  return totalFiles;
}

// ZIP导入
export async function importFilesFromZip(zipFile, createNewFileFn) {
  await loadJSZip();

  const zip = new JSZip();
  const content = await zip.loadAsync(zipFile);
  let importedCount = 0;

  for (const [relativePath, file] of Object.entries(content.files)) {
    if (!file.dir && (relativePath.endsWith('.md') || relativePath.endsWith('.markdown'))) {
      const fileContent = await file.async('string');
      const fileName = relativePath.split('/').pop();
      createNewFileFn(fileName, fileContent);
      importedCount++;
    }
  }

  return importedCount;
}

// JSON导入
export async function importFilesFromJson(jsonFile, createNewFileFn) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse(e.target.result);
        if (jsonData.files && Array.isArray(jsonData.files)) {
          jsonData.files.forEach(fileData => {
            createNewFileFn(fileData.name, fileData.content);
          });
          resolve(jsonData.files.length);
        } else {
          reject(new Error('无效的JSON格式'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(jsonFile);
  });
}
