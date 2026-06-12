/**
 * 事件绑定UI模块 - 管理业务UI事件绑定
 */

import { bindNewFileEvents, bindSettingsEvents, bindStorageEvents, bindRepoAndHostEvents } from './events-settings.js';
import { bindInsertEvents, bindImageUploadEvents } from './events-insert.js';
import { bindMenuEvents, bindSyncEvents, bindImportExportEvents, bindEditFileEvents } from './events-menu.js';

// 导出UI事件绑定函数
export function bindUIEventHandlers(appConfig) {
  bindNewFileEvents();
  bindSettingsEvents(appConfig);
  bindStorageEvents(appConfig);
  bindRepoAndHostEvents();
  bindInsertEvents();
  bindImageUploadEvents();
  bindMenuEvents(appConfig);
  bindSyncEvents();
  bindImportExportEvents();
  bindEditFileEvents();
}
