/**
 * React Component Integration Example
 * 展示如何將 Web Editor 作為組件集成到其他 React 應用中
 */

import React, { useState } from 'react'
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import '@/components/Toolbar' // 假設有自定義工具欄

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
  toolbar?: boolean
}

export default function ReactEditor({
  content,
  onChange,
  placeholder = '開始輸入...',
  editable = true,
  toolbar = true,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (editor) {
        onChange(editor.getHTML())
      }
    },
  })

  if (!editor) {
    return null
  }

  // 處放上傳圖片
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (editor && result) {
        editor.commands.insertContent({
          type: 'image',
          attrs: {
            src: result,
            alt: file.name,
          },
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // 鍵盤快捷鍵處理
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Ctrl/Cmd + S 保存
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault()
      console.log('保存內容:', editor.getHTML())
      // 觸發保存回調
    }

    // Ctrl/Cmd + B 粗體
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault()
      editor.chain().focus().toggleBold().run()
    }

    // Ctrl/Cmd + I 斜體
    if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault()
      editor.chain().focus().toggleItalic().run()
    }

    // Ctrl/Cmd + U 下劃線
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
      event.preventDefault()
      editor.chain().focus().toggleUnderline().run()
    }
  }

  return (
    <div className="react-editor-wrapper" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {/* 自定義工具欄 */}
      {toolbar && <Toolbar editor={editor} />}

      {/* 編輯器區域 */}
      <div
        className="proseMirror-wrapper"
        onKeyDown={handleKeyDown}
        style={{
          minHeight: '400px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ===== 使用示例 =====

/**
 * 示例 1: 基礎博客編輯器
 */
function BlogEditor() {
  const [postContent, setPostContent] = useState('<h1>新文章標題</h1><p>開始寫作...</p>')

  return (
    <div className="blog-editor">
      <h2>編輯文章</h2>
      <ReactEditor
        content={postContent}
        onChange={setPostContent}
        placeholder="輸入文章內容..."
      />
      <button onClick={() => console.log('保存:', postContent)}>
        發布文章
      </button>
    </div>
  )
}

/**
 * 示例 2: 評論板回覆編輯器
 */
function ReplyEditor({ replyTo, onSubmit }: { replyTo: string; onSubmit: (content: string) => void }) {
  const [reply, setReply] = useState(`<p>回覆: ${replyTo}</p>`)

  return (
    <div className="reply-editor">
      <ReactEditor
        content={reply}
        onChange={setReply}
        placeholder="輸入回覆內容..."
        toolbar={false} // 隱藏工具欄
        editable={true}
      />
      <button onClick={() => onSubmit(reply)}>
        提交回覆
      </button>
    </div>
  )
}

/**
 * 示例 3: 表單字段中的描述編輯器
 */
function DescriptionEditor({ initialContent, onSave }: { initialContent: string; onSave: (content: string) => void }) {
  const [description, setDescription] = useState(initialContent)

  return (
    <div className="description-editor">
      <label>產品描述</label>
      <ReactEditor
        content={description}
        onChange={setDescription}
        placeholder="輸入產品描述..."
        editable={true}
      />
      <button onClick={() => onSave(description)}>
        保存描述
      </button>
    </div>
  )
}

/**
 * 示例 4: 多語言內容編輯器
 */
function MultiLanguageEditor() {
  const [currentLang, setCurrentLang] = useState('zh')
  const [contents, setContents] = useState({
    zh: '<h1>中文內容</h1>',
    en: '<h1>English Content</h1>',
    ja: '<h1>日本語の内容</h1>',
  })

  const handleChange = (content: string) => {
    setContents(prev => ({ ...prev, [currentLang]: content }))
  }

  return (
    <div className="multi-lang-editor">
      <div className="lang-switcher">
        <button onClick={() => setCurrentLang('zh')} className={currentLang === 'zh' ? 'active' : ''}>
          中文
        </button>
        <button onClick={() => setCurrentLang('en')} className={currentLang === 'en' ? 'active' : ''}>
          English
        </button>
        <button onClick={() => setCurrentLang('ja')} className={currentLang === 'ja' ? 'active' : ''}>
          日本語
        </button>
      </div>
      <ReactEditor
        content={contents[currentLang]}
        onChange={handleChange}
        placeholder={`輸入${currentLang === 'zh' ? '中文' : currentLang === 'en' ? 'English' : '日本語'}內容...`}
      />
    </div>
  )
}

// 導出所有示例
export {
  ReactEditor as default,
  BlogEditor,
  ReplyEditor,
  DescriptionEditor,
  MultiLanguageEditor,
}
