// 1. 導入 TipTap 核心和擴展
import {
  useEditor,
  EditorContent,
  useCurrentBlockId,
  useCurrentBlock,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit-react'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import ImageResize from '@tiptap/extension-image-resize'

// 2. 導入 MUI 組件
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import SaveIcon from '@mui/icons-material/Save'
import DownloadIcon from '@mui/icons-material/Download'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CodeIcon from '@mui/icons-material/Code'

// 3. 導入 Zustand Store
import { useEditorStore } from '../store/useEditorStore'

// 4. 定義 Editor Props
interface EditorProps {
  // 編輯器的高度
  height?: string
}

// 5. 實現 Editor 組件
export default function Editor({ height = '500px' }: EditorProps) {
  const { currentDocument, hasUnsavedChanges } = useEditorStore()
  const { updateDocument, saveDocument, undo, redo } = useEditorStore()

  // 6. 初始化 TipTap 編輯器
  // StarterKit 包含了：Paragraph, Text, Bold, Italic, Underline, Link, Image, Placeholder
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
      }),
      Link,
      Image.configure({
        inline: true,
        allowBase64: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
      }),
      Placeholder,
      ImageResize,
    ],
    content: currentDocument?.content || '<p></p>',
    onUpdate: ({ editor }) => {
      // 7. 當編輯器內容改變時，更新 Zustand Store
      const html = editor.getHTML()
      updateDocument(html)
    },
    editorProps: {
      attributes: {
        class: 'prosemirror focused', // 添加 CSS 類，用於樣式自定義
        style: `height: ${height}; outline: none;`, // 設置高度，移除輪廓
      },
    },
  })

  // 8. 渲染編輯器
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* 工具欄：Undo, Redo, Save, Download */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 1,
          borderBottom: '1px solid #333',
          backgroundColor: '#121212',
        }}
      >
        <IconButton onClick={() => undo()} disabled={false} color="#E0E0E0">
          <UndoIcon />
        </IconButton>
        <IconButton onClick={() => redo()} disabled={false} color="#E0E0E0">
          <RedoIcon />
        </IconButton>
        <Button
          onClick={() => saveDocument()}
          startIcon={<SaveIcon />}
          variant="text"
          color={hasUnsavedChanges ? '#4CAF50' : '#E0E0E0'}
        >
          {hasUnsavedChanges ? '未保存' : '已保存'}
        </Button>
        <Button onClick={() => alert('功能開發中...')} startIcon={<DownloadIcon />} variant="text" color="#E0E0E0">
          導出
        </Button>
        <Button onClick={() => alert('功能開發中...')} startIcon={<CloudUploadIcon />} variant="text" color="#E0E0E0">
          雲端
        </Button>
        <Button onClick={() => alert('功能開發中...')} startIcon={<CodeIcon />} variant="text" color="#E0E0E0">
          HTML/Markdown
        </Button>
      </Box>

      {/* 編輯器區域 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#1E1E1E1',
          border: '1px solid #333',
          borderRadius: 1,
          padding: 1,
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}
