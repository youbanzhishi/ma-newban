/**
 * 事件绑定模块 - 聚合所有事件绑定
 */

import { 
  bindEditorEvents, bindSidebarEvents, bindKeyboardEvents, 
  bindModalEvents, bindLoginEvents 
} from './events-core.js';
import { bindUIEventHandlers } from './events-ui.js';

// 主绑定函数
export function bindEvents(appConfig) {
  // 核心事件
  bindEditorEvents();
  bindSidebarEvents();
  bindKeyboardEvents();
  bindModalEvents();
  bindLoginEvents();
  
  // UI业务事件
  bindUIEventHandlers(appConfig);
}
