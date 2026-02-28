# Next-Gen Web Editor

## 項目概覽

**名稱**：Next-Gen Web Editor
**描述**：A web-based rich text editor using React 18, TypeScript, Material UI v5, Zustand, and TipTap.

## 核心技術

- **框架**：React 18
- **語言**：TypeScript
- **構建工具**：Vite 5
- **UI 框架**：Material UI v5 (MUI)
- **狀態管理**：Zustand
- **編輯器核心**：TipTap (基於 ProseMirror)
- **構建**：Vite 5
- **運行**：`npm run dev` (3000 端口)
- **預覽**：`npm run preview`

## 功能

1.  **文字格式化**：粗體、斜體、下劃線、刪除線
2.  **字體控制**：字體類型、大小、顏色
3.  **排版**：標題層級 (H1-H6)、對齊方式、縮排
4.  **列表**：有序、無序
5.  **連結**：超鏈接、錨點
6.  **媒體**：圖片、視頻、文件（本地拖放）
7.  **表格**：插入、編輯表格
8.  **快捷鍵**：常見快捷鍵支持 (Ctrl/Cmd + B/I/U 等)
9.  **操作歷史**：Undo、Redo

## 文件結構

```text
next-gen-web-editor/
├── public/
├── src/
│   ├── main.tsx           # 應用入口
│   ├── App.tsx            # 根組件
│   ├── components/
│   │   └── Editor.tsx    # 編輯器組件
│   ├── store/
│   │   └── useEditorStore.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 快速開始

### 安裝依賴

```bash
npm install
```

### 運行開發服務器

```bash
npm run dev
```

### 構建生產版本

```bash
npm run build
```

### 代碼檢查

```bash
npm run lint
```

## 核心庫版本

- React: 18.2.0
- MUI: 5.15.10
- Zustand: 4.4.7
- TipTap: 2.1.13
- Vite: 5.2.0

---

**Next-Gen Web Editor** - 項目初始化完成。
