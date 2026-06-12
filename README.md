# MA Markdown 加密编辑器

现代化重构的 Markdown 编辑器，支持密码保护、文件管理、Git 同步和图床上传。

## 功能特性

- **Markdown 编辑**：实时预览，支持语法高亮
- **密码保护**：登录验证保护文档安全
- **文件管理**：支持文件夹组织、文件搜索
- **主题切换**：亮色/暗色主题
- **Git 同步**：支持 GitHub、Gitee、GitLab 等多平台同步
- **图床上传**：支持 GitHub、Gitee 图床及自定义图床
- **导入导出**：支持 Markdown、HTML、PDF 等格式导出

## 技术栈

- **构建工具**：Vite
- **模块化**：ES Modules
- **样式**：原生 CSS（组件化拆分）
- **依赖库**：
  - crypto-js（加密）
  - marked（Markdown 渲染）
  - highlight.js（代码高亮）

## 项目结构

```
ma-refactored/
├── index.html              # 主页面
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
├── README.md               # 项目说明
├── src/
│   ├── main.js             # 入口文件
│   ├── modules/            # 功能模块
│   │   ├── sidebar.js       # 侧边栏文件管理
│   │   ├── editor.js       # Markdown编辑器
│   │   ├── preview.js      # 预览渲染
│   │   ├── crypto.js       # 加密/解密
│   │   ├── file-ops.js     # 文件导入导出
│   │   ├── theme.js        # 主题切换
│   │   └── settings.js     # 设置管理
│   ├── utils/              # 工具函数
│   │   └── storage.js      # localStorage封装
│   └── styles/              # 样式文件
│       ├── main.css        # 主样式入口
│       ├── variables.css   # CSS变量
│       ├── base.css        # 基础重置
│       ├── layout.css      # 整体布局
│       ├── sidebar.css      # 侧边栏
│       ├── editor.css      # 编辑器
│       ├── preview.css     # 预览区
│       ├── modals.css      # 模态框
│       ├── themes.css      # 主题变量
│       └── responsive.css  # 响应式
└── public/                  # 静态资源
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 重构说明

本项目是将原始单文件 HTML 应用重构为模块化 Vite 项目：

1. **CSS 组件化**：从 1240 行内联 CSS 拆分为 9 个独立文件
2. **JS 模块化**：从 4000 行内联 JS 拆分为 8 个功能模块
3. **ES Modules**：使用 ES 模块化规范组织代码
4. **CDN 保留**：第三方库保持 CDN 引用，减小打包体积

## 原始源码

原始单文件源码位于：`../ma.newban.cn/index_raw.html`

## 许可证

MIT License
