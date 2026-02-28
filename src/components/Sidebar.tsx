import { useState, useEffect } from 'react'

// 定義 Document 接口
interface Document {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// 定義 Sidebar Props
interface SidebarProps {
  documents: Document[]
  currentDocument: Document | null
  onCreateDocument: () => void
  onSelectDocument: (doc: Document) => void
  onDeleteDocument: (id: string) => void
  onRenameDocument: (id: string, newTitle: string) => void
}

export default function Sidebar({
  documents,
  currentDocument,
  onCreateDocument,
  onSelectDocument,
  onDeleteDocument,
  onRenameDocument,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  // 處理重命名
  const handleStartRename = (doc: Document) => {
    setEditingId(doc.id)
    setEditTitle(doc.title)
  }

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameDocument(id, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditTitle('')
  }

  // 處理刪除
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('確定要刪除此文檔嗎？')) {
      onDeleteDocument(id)
    }
  }

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* 標題 */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">文檔</h2>
      </div>

      {/* 新建文檔按鈕 */}
      <div className="p-4">
        <button
          onClick={onCreateDocument}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + 新建文檔
        </button>
      </div>

      {/* 文檔列表 */}
      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <div className="text-2xl mb-2">📄</div>
            <p className="text-sm">暫無文檔</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className={`
                  flex items-center justify-between p-3 rounded cursor-pointer
                  ${currentDocument?.id === doc.id ? 'bg-blue-600' : 'hover:bg-gray-800'}
                  transition-colors
                `}
              >
                {/* 左側：標題或編輯框 */}
                <div className="flex-1 min-w-0">
                  {editingId === doc.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveRename(doc.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveRename(doc.id)
                        } else if (e.key === 'Escape') {
                          handleCancelRename()
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div className="truncate text-sm text-white">
                      {doc.title}
                    </div>
                  )}
                </div>

                {/* 右側：操作按鈕 */}
                <div className="flex gap-1 ml-2">
                  {/* 編輯按鈕 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartRename(doc)
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                    title="重命名"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  {/* 刪除按鈕 */}
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="p-1 hover:bg-gray-700 rounded"
                    title="刪除"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>共 {documents.length} 個文檔</span>
          <span>按 F2 重命名</span>
        </div>
      </div>
    </div>
  )
}
