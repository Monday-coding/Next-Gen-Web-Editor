/**
 * 實時協作模塊 - Yjs 集成
 */

import * as Y from 'yjs'
import { WebsocketProvider as WebSocketProvider } from 'y-websocket'

// 文檔類型
export type CollaborationDoc = Y.XmlText

/**
 * 創建協作文檔
 */
export function createCollaborationDoc(): CollaborationDoc {
  const doc = new Y.Doc()
  const text = doc.getText('content')
  return text as CollaborationDoc
}

/**
 * 創建 WebSocket 提供者
 */
export function createWebSocketProvider(
  doc: Y.Doc,
  roomName: string,
  websocketUrl: string = 'wss://demos.yjs.dev'
): WebSocketProvider {
  return new WebSocketProvider(
    websocketUrl,
    roomName,
    doc
  )
}

/**
 * 訂閱文檔變更
 */
export function subscribeToChanges(
  doc: Y.Doc,
  callback: () => void
): () => void {
  const unobserve = doc.on('update', callback)
  return () => unobserve()
}

/**
 * 訂閱其他用戶狀態
 */
export function subscribeToAwareness(
  provider: WebSocketProvider,
  callback: (states: Map<number, { color: string; name: string }>) => void
): () => void {
  const unobserve = provider.awareness.on('change', callback)
  return () => unobserve()
}

/**
 * 獲取當前用戶光標位置
 */
export function updateCursorPosition(
  provider: WebSocketProvider,
  position: { from: number; to: number }
): void {
  provider.awareness.setLocalStateField('cursor', position)
}

/**
 * 獲取其他用戶的光標位置
 */
export function getOtherUserCursors(
  provider: WebSocketProvider
): Map<number, { from: number; to: number; color: string; name: string }> {
  const cursors = new Map()

  provider.awareness.getStates().forEach((state, clientID) => {
    if (state.cursor) {
      cursors.set(clientID, {
        ...state.cursor,
        color: state.color || '#00BCD4',
        name: state.name || 'Anonymous',
      })
    }
  })

  return cursors
}
