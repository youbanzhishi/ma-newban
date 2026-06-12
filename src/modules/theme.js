/**
 * Theme Module - 主题切换模块
 */

import { saveConfig, loadConfig } from '../utils/storage.js';

// 应用主题
export function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

// 切换主题
export function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  const newTheme = isDark ? 'dark' : 'light';
  
  // 保存配置
  const config = loadConfig() || {};
  config.theme = newTheme;
  saveConfig(config);
  
  return newTheme;
}

// 获取当前主题
export function getCurrentTheme() {
  return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
}

// 初始化主题
export function initTheme() {
  const config = loadConfig();
  if (config && config.theme) {
    applyTheme(config.theme);
  }
}
