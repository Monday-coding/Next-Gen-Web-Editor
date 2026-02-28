// 0. 導入 React
import React from 'react'
import { FixedSizeList as List, areEqual } from 'react-window'

// 1. 導入 TipTap 核心和擴展
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TableOfContentsIcon from '@mui/icons-material/TableChart'

// 2. 導入 MUI 組件
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// 3. 導入 MUI Icons
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import SaveIcon from '@mui/icons-material/Save'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeBlockIcon from '@mui/icons-material/Code'
import LinkIcon from '@mui/icons-material/Link'
import ImageIcon from '@mui/icons-material/Image'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import DownloadIcon from '@mui/icons-material/Download'

// 4. 導入 Zustand Store
import { useEditorStore } from '../store/useEditorStore'

// 5. 導入導出工具
import { htmlToMarkdown, downloadFile } from '../utils/export'

// 5. 定義 Editor Props
interface EditorProps {
  height?: string
}

// 6. 實現 Editor 組件
export default function Editor({ height = '500px' }: EditorProps) {
  const { currentDocument, hasUnsavedChanges } = useEditorStore()
  const { updateDocument, saveDocument, undo, redo } = useEditorStore()

  // 7. 標題菜單
  const [headingMenu, setHeadingMenu] = React.useState<null | HTMLElement>(null)

  // 8. 初始化 TipTap 編輯器
  const lowlight = createLowlight(common)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        inlineFull: false, // 允許大圖片不上傳為 base64
      }),
      Placeholder.configure({
        placeholder: '開始輸入...',
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: currentDocument?.content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      updateDocument(html)
    },
    editorProps: {
      attributes: {
        class: 'prosemirror focused',
        style: `height: ${height}; outline: none;`,
      },
    },
  })

  // 9. 工具欄按鈕組件
  const ToolbarButton = ({ onClick, active, icon, title }: any) => (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        color={active ? 'primary' : 'default'}
        sx={{
          color: active ? '#00BCD4' : '#E0E0E0',
          '&:hover': {
            backgroundColor: '#2C2C2C',
          },
        }}
        size="small"
      >
        {icon}
      </IconButton>
    </Tooltip>
  )

  if (!editor) {
    return <div>載入編輯器...</div>
  }

  // 10. 處理文件拖放上傳
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* 工具欄 */}
      <Toolbar
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          padding: 1,
          borderBottom: '1px solid #333',
          backgroundColor: '#121212',
        }}
        variant="dense"
      >
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<UndoIcon />}
          title="撤銷 (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<RedoIcon />}
          title="重做 (Ctrl+Y)"
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 文本格式 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={<FormatBoldIcon />}
          title="粗體 (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={<FormatItalicIcon />}
          title="斜體 (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon={<FormatUnderlinedIcon />}
          title="下劃線 (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={<FormatStrikethroughIcon />}
          title="刪除線"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          icon={<FormatCodeIcon />}
          title="代碼 (Ctrl+E)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={<CodeBlockIcon />}
          title="代碼塊"
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 表格 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          icon={<TableOfContentsIcon />}
          title="插入表格"
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 標題 */}
        <ToolbarButton
          onClick={(e) => setHeadingMenu(e.currentTarget as HTMLElement)}
          icon={<FormatAlignLeftIcon />}
          title="標題"
        />
        <Menu
          anchorEl={headingMenu}
          open={Boolean(headingMenu)}
          onClose={() => setHeadingMenu(null)}
        >
          <MenuItem onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setHeadingMenu(null); }}>
            標題 1
          </MenuItem>
          <MenuItem onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setHeadingMenu(null); }}>
            標題 2
          </MenuItem>
          <MenuItem onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); setHeadingMenu(null); }}>
            標題 3
          </MenuItem>
          <MenuItem onClick={() => { editor.chain().focus().setParagraph().run(); setHeadingMenu(null); }}>
            正文
          </MenuItem>
        </Menu>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 列表 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={<FormatListBulletedIcon />}
          title="無序列表"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={<FormatListNumberedIcon />}
          title="有序列表"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={<FormatQuoteIcon />}
          title="引用"
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 對齊 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          icon={<FormatAlignLeftIcon />}
          title="左對齊"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          icon={<FormatAlignCenterIcon />}
          title="居中"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          icon={<FormatAlignRightIcon />}
          title="右對齊"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          icon={<FormatAlignJustifyIcon />}
          title="兩端對齊"
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 插入 */}
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('請輸入鏈接地址：')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          active={editor.isActive('link')}
          icon={<LinkIcon />}
          title="插入鏈接"
        />
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('請輸入圖片地址：')
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
          icon={<ImageIcon />}
          title="插入圖片"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<HorizontalRuleIcon />}
          title="分割線"
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* 操作 */}
        <Button
          onClick={() => saveDocument()}
          startIcon={<SaveIcon />}
          variant="text"
          sx={{
            color: hasUnsavedChanges ? '#4CAF50' : '#E0E0E0',
            '&:hover': {
              backgroundColor: '#2C2C2C',
            },
          }}
          size="small"
        >
          {hasUnsavedChanges ? '未保存' : '已保存'}
        </Button>
        <Button
          onClick={() => {
            const markdown = htmlToMarkdown(editor.getHTML())
            const filename = (currentDocument?.title || 'document') + '.md'
            downloadFile(markdown, filename, 'text/markdown')
          }}
          startIcon={<DownloadIcon />}
          variant="text"
          sx={{
            color: '#E0E0E0',
            '&:hover': {
              backgroundColor: '#2C2C2C',
            },
          }}
          size="small"
        >
          Markdown
        </Button>
        <Button
          onClick={async () => {
            try {
              const pdfBuffer = await htmlToPdf(editor.getHTML())
              const filename = (currentDocument?.title || 'document') + '.pdf'
              downloadFile(pdfBuffer, filename, 'application/pdf')
            } catch (error) {
              console.error('PDF 導出失敗:', error)
              alert('PDF 導出失敗，請查看控制台')
            }
          }}
          startIcon={<DownloadIcon />}
          variant="text"
          sx={{
            color: '#E0E0E0',
            '&:hover': {
              backgroundColor: '#2C2C2C',
            },
          }}
          size="small"
        >
          PDF
        </Button>
      </Toolbar>

      {/* 編輯器區域 - 使用虛擬滾動優化長文檔 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#1E1E1E',
          padding: 2,
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}
