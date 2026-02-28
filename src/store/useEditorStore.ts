// 1. 創建 Zustand Store
import { create } from 'zustand'

// 定義 Document 接口
export interface Document {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// 定義 Editor State 接口
interface EditorState {
  // 1. 當前文檔
  currentDocument: Document | null
  
  // 2. 是否有未保存更改
  hasUnsavedChanges: boolean
  
  // 3. 編輯器歷史（用於 Undo/Redo）
  history: string[]
  currentIndex: number

  // 4. Actions
  createDocument: () => void
  updateDocument: (content: string) => void
  saveDocument: () => void
  undo: () => void
  redo: () => void
}

// 創建 Store
export const useEditorStore = create<EditorState>((set, get) => ({
  // 1. 初始狀態
  currentDocument: null,
  hasUnsavedChanges: false,
  history: [],
  currentIndex: -1,

  // 2. 創建新文檔
  createDocument: () => {
    const newDocument: Document = {
      id: crypto.randomUUID(),
      title: '未命名文檔',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set({
      currentDocument: newDocument,
      hasUnsavedChanges: false,
      history: [''],
      currentIndex: 0,
    })
  },

  // 3. 更新文檔內容
  updateDocument: (content: string) => {
    if (!get().currentDocument) return

    // 1. 更新當前文檔內容
    const updatedDocument = {
      ...get().currentDocument,
      content,
      updatedAt: new Date(),
    }

    // 2. 記錄歷史（用於 Undo）
    const history = get().history.slice(0, get().currentIndex + 1)
    history.push(content)

    // 3. 更新狀態
    set({
      currentDocument: updatedDocument,
      history,
      currentIndex: history.length - 1,
      hasUnsavedChanges: true,
    })
  },

  // 4. 保存文檔
  saveDocument: () => {
    if (!get().currentDocument) return

    // 1. 保存文檔到本地存儲（模擬，實際應使用 IndexedDB 或 LocalStorage）
    const savedDocument = { ...get().currentDocument }
    console.log('文檔已保存：', savedDocument)

    // 2. 更新狀態（無未保存更改）
    set({
      currentDocument: savedDocument,
      hasUnsavedChanges: false,
    })
  },

  // 5. Undo
  undo: () => {
    if (!get().currentDocument) return
    const { currentIndex, history } = get()

    // 1. 檢查是否可以 Undo
    if (currentIndex > 0) {
      // 2. 恢復到上一個狀態
      const newContent = history[currentIndex - 1]
      const newDocument = {
        ...get().currentDocument,
        content: newContent,
        updatedAt: new Date(),
      }

      // 3. 更新狀態
      set({
        currentDocument: newDocument,
        currentIndex: currentIndex - 1,
        hasUnsavedChanges: true,
      })
    }
  },

  // 6. Redo
  redo: () => {
    if (!get().currentDocument) return
    const { currentIndex, history } = get()

    // 1. 檢查是否可以 Redo
    if (currentIndex < history.length - 1) {
      // 2. 恢復到下一個狀態
      const newContent = history[currentIndex + 1]
      const newDocument = {
        ...get().currentDocument,
        content: newContent,
        updatedAt: new Date(),
      }

      // 3. 更新狀態
      set({
        currentDocument: newDocument,
        currentIndex: currentIndex + 1,
        hasUnsavedChanges: true,
      })
    }
  },
}))
