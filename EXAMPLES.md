# Next-Gen Web Editor Examples

本目錄提供了各種使用 Web Editor 的示例。

## 📁 示例列表

### 1. 獨立應用 (Standalone App)
完整的富文本編輯器應用，包含所有功能。

```bash
cd examples/standalone-app
npm install
npm run dev
```

**功能**：
- 完整工具欄
- 文檔管理
- Markdown/PDF 導出
- 主題切換
- 語法高亮

### 2. React 組件集成 (React Component Integration)
展示如何將 Web Editor 作為組件集成到其他 React 應用。

```bash
cd examples/react-integration
npm install
npm run dev
```

**示例**：
- 基礎集成
- 受控組件
- 自定義工具欄
- 數據綁定

### 3. Headless 組件 (Headless Component)
只使用核心編輯器邏輯，完全自定義 UI。

```bash
cd examples/headless
npm install
npm run dev
```

**示例**：
- 自定義工具欄
- 自定義菜單
- 自定義狀態欄
- 完全控制樣式

### 4. API 使用 (API Usage)
展示如何通過 API 使用編輯器功能。

```bash
cd examples/api-usage
npm install
npm run dev
```

**示例**：
- Markdown 轉換
- PDF 導出
- 內容操作
- 設置管理

---

## 🎯 快速開始

### 作為組件使用

```typescript
import React from 'react'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function MyComponent() {
  return (
    <Editor
      extensions={[StarterKit]}
      content="<p>Hello, World!</p>"
      onUpdate={({ editor }) => {
        console.log(editor.getHTML())
      }}
    />
  )
}
```

### Headless 集成

```typescript
import { useEditor, EditorContent } from '@tiptap/react'

export default function CustomEditor() {
  const editor = useEditor({
    extensions: [/* 你的擴展 */],
    content: '<p>開始輸入...</p>'
  })

  if (!editor) {
    return null
  }

  return (
    <div>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <EditorContent editor={editor} />
    </div>
  )
}
```

---

## 📚 詳細文檔

- [完整 API 文檔](./docs/API.md)
- [組件 API](./docs/Components.md)
- [自定義擴展](./docs/Extensions.md)
- [配置選項](./docs/Configuration.md)

---

## 🤝 貢獻

歡迎提交 Pull Request 添加更多示例！

## 📄 License

MIT
