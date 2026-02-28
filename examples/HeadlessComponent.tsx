/**
 * Headless Component Example
 * 只使用核心編輯器邏輯，完全自定義 UI
 */

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

export default function HeadlessEditor() {
  const [content, setContent] = useState('<p>開始輸入...</p>')
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor?.getHTML() || ''
      setContent(html)
      updateActiveFormats(editor)
    },
    editorProps: {
      attributes: {
        class: 'prosemirror headless-editor',
      },
    },
  })

  const updateActiveFormats = (editor: any) => {
    const formats = new Set<string>()

    if (editor.isActive('bold')) formats.add('bold')
    if (editor.isActive('italic')) formats.add('italic')
    if (editor.isActive('underline')) formats.add('underline')
    if (editor.isActive('strike')) formats.add('strike')
    if (editor.isActive('link')) formats.add('link')
    if (editor.isActive({ textAlign: 'center' })) formats.add('center')
    if (editor.isActive({ textAlign: 'right' })) formats.add('right')

    const heading = editor.getAttributes('heading')?.level
    if (heading) formats.add(`h${heading}`)

    setActiveFormats(formats)
  }

  const toggleFormat = (format: string) => {
    if (!editor) return

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'underline':
        editor.chain().focus().toggleUnderline().run()
        break
      case 'strike':
        editor.chain().focus().toggleStrike().run()
        break
      case 'link':
        const url = window.prompt('輸入鏈接地址：')
        if (url) editor.chain().focus().setLink({ href: url }).run()
        break
      case 'center':
        editor.chain().focus().setTextAlign('center').run()
        break
      case 'right':
        editor.chain().focus().setTextAlign('right').run()
        break
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case 'ul':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'ol':
        editor.chain().focus().toggleOrderedList().run()
        break
    }
  }

  if (!editor) {
    return <div className="loading">載入編輯器...</div>
  }

  return (
    <div className="headless-editor-container">
      {/* 自定義工具欄 */}
      <div className="custom-toolbar">
        <div className="toolbar-group">
          <button
            className={activeFormats.has('bold') ? 'active' : ''}
            onClick={() => toggleFormat('bold')}
            title="粗體 (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            className={activeFormats.has('italic') ? 'active' : ''}
            onClick={() => toggleFormat('italic')}
            title="斜體 (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            className={activeFormats.has('underline') ? 'active' : ''}
            onClick={() => toggleFormat('underline')}
            title="下劃線 (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            className={activeFormats.has('strike') ? 'active' : ''}
            onClick={() => toggleFormat('strike')}
            title="刪除線"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            className={activeFormats.has('h1') ? 'active' : ''}
            onClick={() => toggleFormat('h1')}
            title="標題 1"
          >
            H1
          </button>
          <button
            className={activeFormats.has('h2') ? 'active' : ''}
            onClick={() => toggleFormat('h2')}
            title="標題 2"
          >
            H2
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            onClick={() => toggleFormat('ul')}
            title="無序列表"
          >
            • 列表
          </button>
          <button
            onClick={() => toggleFormat('ol')}
            title="有序列表"
          >
            1. 列表
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            className={activeFormats.has('left') ? 'active' : ''}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="左對齊"
          >
            ⬅
          </button>
          <button
            className={activeFormats.has('center') ? 'active' : ''}
            onClick={() => toggleFormat('center')}
            title="居中"
          >
            ↔
          </button>
          <button
            className={activeFormats.has('right') ? 'active' : ''}
            onClick={() => toggleFormat('right')}
            title="右對齊"
          >
            ➡
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            onClick={() => toggleFormat('link')}
            title="插入鏈接"
          >
            🔗 鏈接
          </button>
          <button
            onClick={() => {
              const url = window.prompt('輸入圖片地址：')
              if (url) editor.chain().focus().setImage({ src: url }).run()
            }}
            title="插入圖片"
          >
            🖼 圖片
          </button>
        </div>

        <div className="toolbar-actions">
          <button onClick={() => console.log('保存:', content)} className="save-button">
            保存
          </button>
          <button onClick={() => console.log('撤銷')} className="undo-button">
            撤銷
          </button>
          <button onClick={() => console.log('重做')} className="redo-button">
            重做
          </button>
        </div>
      </div>

      {/* 自定義編輯器區域 */}
      <div className="custom-editor">
        <EditorContent editor={editor} />
      </div>

      {/* 字數統計 */}
      <div className="stats">
        字數: {editor.storage.characterCount().length} |
        段落: {content.split('</p>').length - 1}
      </div>
    </div>
  )
}

// CSS 樣式（可以放在組件中或分離的 CSS 文件）
const styles = `
.headless-editor-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
  background: #f5f5f5;
  border-radius: 8px 8px 0 0;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-separator {
  width: 1px;
  height: 24px;
  background: #d0d0d0;
  margin: 0 4px;
}

.custom-toolbar button {
  padding: 6px 12px;
  border: 1px solid #d0d0d0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.custom-toolbar button:hover {
  background: #e0e0e0;
  border-color: #b0b0b0;
}

.custom-toolbar button.active {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.toolbar-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.save-button {
  background: #28a745 !important;
  color: white !important;
  border-color: #1e7e34 !important;
}

.undo-button, .redo-button {
  background: #6c757d !important;
  color: white !important;
  border-color: #545b62 !important;
}

.custom-editor {
  min-height: 400px;
  padding: 20px;
  background: white;
  border-radius: 0 0 8px 8px;
}

.prosemirror {
  outline: none;
}

.prosemirror p {
  margin: 1em 0;
  line-height: 1.6;
}

.prosemirror h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.5em 0;
}

.prosemirror h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5em 0;
}

.prosemirror img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em 0;
}

.stats {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 0 0 8px 8px;
  font-size: 14px;
  color: #666;
  text-align: right;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #999;
}
`

// 將樣式注入到 head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  document.head.appendChild(styleElement)
}
