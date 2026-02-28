/**
 * Import Example
 * 展示如何通過 API 導入各種格式的內容到 Web Editor
 */

import { useState } from 'react'

// 導入 API 工具（假設已實現）
import {
  importFromHTML,
  importFromMarkdown,
  importFromPlainText,
  importFromWord,
  importFromPDF,
} from '../utils/editor-api'

export default function ImportExample() {
  const [editorContent, setEditorContent] = useState('<p>當前內容...</p>')
  const [importSource, setImportSource] = useState('')
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(false)

  // 從 HTML 導入
  const handleImportHTML = async () => {
    setImporting(true)
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.html,.htm'

      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const text = await file.text()
        const html = await importFromHTML(text)

        setEditorContent(html)
        setImportSource(`HTML 文件: ${file.name}`)
        setImported(true)
        setImporting(false)
      }

      input.click()
    } catch (error) {
      console.error('HTML 導入失敗:', error)
      setImporting(false)
    }
  }

  // 從 Markdown 導入
  const handleImportMarkdown = async () => {
    setImporting(true)
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md,.markdown,.txt'

      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const text = await file.text()
        const html = await importFromMarkdown(text)

        setEditorContent(html)
        setImportSource(`Markdown 文件: ${file.name}`)
        setImported(true)
        setImporting(false)
      }

      input.click()
    } catch (error) {
      console.error('Markdown 導入失敗:', error)
      setImporting(false)
    }
  }

  // 從純文本導入
  const handleImportText = async () => {
    setImporting(true)
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.txt,.text'

      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const text = await file.text()
        const html = await importFromPlainText(text)

        setEditorContent(html)
        setImportSource(`文本文件: ${file.name}`)
        setImported(true)
        setImporting(false)
      }

      input.click()
    } catch (error) {
      console.error('文本導入失敗:', error)
      setImporting(false)
    }
  }

  // 從 Word 導入（需要 mammoth.js）
  const handleImportWord = async () => {
    setImporting(true)
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.docx'

      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const arrayBuffer = await file.arrayBuffer()
        const html = await importFromWord(arrayBuffer)

        setEditorContent(html)
        setImportSource(`Word 文件: ${file.name}`)
        setImported(true)
        setImporting(false)
      }

      input.click()
    } catch (error) {
      console.error('Word 導入失敗:', error)
      setImporting(false)
    }
  }

  // 從 PDF 導入（需要 pdf.js）
  const handleImportPDF = async () => {
    setImporting(true)
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.pdf'

      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const arrayBuffer = await file.arrayBuffer()
        const html = await importFromPDF(arrayBuffer)

        setEditorContent(html)
        setImportSource(`PDF 文件: ${file.name}`)
        setImported(true)
        setImporting(false)
      }

      input.click()
    } catch (error) {
      console.error('PDF 導入失敗:', error)
      setImporting(false)
    }
  }

  // 從 URL 導入
  const handleImportURL = async () => {
    const url = window.prompt('輸入要導入的 URL：')

    if (!url) return

    setImporting(true)
    try {
      const response = await fetch(url)
      const html = await response.text()

      // 檢查是否是 HTML
      if (response.headers.get('content-type')?.includes('html')) {
        setEditorContent(html)
        setImportSource(`URL: ${url}`)
        setImported(true)
      } else {
        // 嘗試作為純文本處理
        const textHtml = await importFromPlainText(html)
        setEditorContent(textHtml)
        setImportSource(`URL (文本): ${url}`)
        setImported(true)
      }
    } catch (error) {
      console.error('URL 導入失敗:', error)
      alert('導入失敗，請檢查 URL 是否正確')
    } finally {
      setImporting(false)
    }
  }

  // 從剪貼板導入
  const handleImportClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()

      // 嘗試自動檢測格式
      let html: string

      if (text.includes('<!DOCTYPE html') || text.includes('<html')) {
        // HTML 格式
        html = await importFromHTML(text)
      } else if (text.includes('#') || text.includes('**') || text.includes('```')) {
        // Markdown 格式
        html = await importFromMarkdown(text)
      } else {
        // 純文本
        html = await importFromPlainText(text)
      }

      setEditorContent(html)
      setImportSource('剪貼板')
      setImported(true)
    } catch (error) {
      console.error('剪貼板導入失敗:', error)
      alert('導入失敗，請確保允許剪貼板訪問')
    }
  }

  // 清除內容
  const handleClear = () => {
    if (window.confirm('確定要清除所有內容嗎？')) {
      setEditorContent('')
      setImportSource('')
      setImported(false)
    }
  }

  return (
    <div className="import-example">
      <h2>📥 內容導入示例</h2>

      {/* 導入選項 */}
      <div className="import-options">
        <h3>選擇導入來源</h3>

        <div className="import-grid">
          <button
            onClick={handleImportHTML}
            disabled={importing}
            className="import-button html"
          >
            <span className="icon">📄</span>
            <span className="label">HTML 文件</span>
          </button>

          <button
            onClick={handleImportMarkdown}
            disabled={importing}
            className="import-button markdown"
          >
            <span className="icon">📝</span>
            <span className="label">Markdown 文件</span>
          </button>

          <button
            onClick={handleImportText}
            disabled={importing}
            className="import-button text"
          >
            <span className="icon">📄</span>
            <span className="label">文本文件</span>
          </button>

          <button
            onClick={handleImportWord}
            disabled={importing}
            className="import-button word"
          >
            <span className="icon">📘</span>
            <span className="label">Word 文件</span>
          </button>

          <button
            onClick={handleImportPDF}
            disabled={importing}
            className="import-button pdf"
          >
            <span className="icon">📕</span>
            <span className="label">PDF 文件</span>
          </button>

          <button
            onClick={handleImportURL}
            disabled={importing}
            className="import-button url"
          >
            <span className="icon">🌐</span>
            <span className="label">URL 鏈接</span>
          </button>

          <button
            onClick={handleImportClipboard}
            disabled={importing}
            className="import-button clipboard"
          >
            <span className="icon">📋</span>
            <span className="label">剪貼板</span>
          </button>
        </div>

        {/* URL 輸入框 */}
        <div className="url-import">
          <input
            type="text"
            placeholder="輸入 URL 後按回車導入..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                handleImportURL()
                e.target.value = ''
              }
            }}
          />
          <button onClick={handleImportURL} disabled={importing}>
            導入
          </button>
        </div>
      </div>

      {/* 導入狀態 */}
      {importing && (
        <div className="importing-status">
          <div className="spinner"></div>
          <p>正在導入內容...</p>
        </div>
      )}

      {/* 導入來源信息 */}
      {imported && importSource && !importing && (
        <div className="import-success">
          <span className="icon">✅</span>
          <span>已從 {importSource} 導入</span>
        </div>
      )}

      {/* 預覽編輯器 */}
      <div className="editor-preview">
        <div className="preview-header">
          <h3>預覽</h3>
          <button
            onClick={handleClear}
            className="clear-button"
          >
            清除內容
          </button>
        </div>

        {/* 模擬編輯器（只讀） */}
        <div className="readonly-editor">
          <div dangerouslySetInnerHTML={{ __html: editorContent }} />
        </div>

        {/* 統計信息 */}
        <div className="import-stats">
          <div className="stat-item">
            <span className="label">字符數:</span>
            <span className="value">{editorContent.length}</span>
          </div>
          <div className="stat-item">
            <span className="label">段落:</span>
            <span className="value">
              {editorContent.split('</p>').filter(p => p.trim()).length}
            </span>
          </div>
        </div>
      </div>

      {/* 使用說明 */}
      <div className="import-docs">
        <h3>📖 使用說明</h3>

        <details>
          <summary>支持的導入格式</summary>
          <ul>
            <li><strong>HTML</strong> - .html, .htm 文件</li>
            <li><strong>Markdown</strong> - .md, .markdown, .txt 文件</li>
            <li><strong>純文本</strong> - .txt, .text 文件</li>
            <li><strong>Word</strong> - .docx 文件（需要 mammoth.js）</li>
            <li><strong>PDF</strong> - .pdf 文件（需要 pdf.js）</li>
            <li><strong>URL</strong> - 任何公開的 URL</li>
            <li><strong>剪貼板</strong> - 系統剪貼板內容</li>
          </ul>
        </details>

        <details>
          <summary>API 使用方法</summary>
          <pre className="code-block">
            {`import { importFromHTML, importFromMarkdown } from '@next-gen-web-editor/api'

// 從 HTML 導入
const html = await importFromHTML(htmlString)

// 從 Markdown 導入
const html = await importFromMarkdown(markdownString)

// 從純文本導入
const html = await importFromPlainText(textString)`}
          </pre>
        </details>

        <details>
          <summary>React 組件中使用</summary>
          <pre className="code-block">
            {`import ImportDialog from '@next-gen-web-editor/components/ImportDialog'

function MyEditor() {
  const [content, setContent] = useState('')

  return (
    <div>
      <ImportDialog
        onImport={(importedHTML) => {
          setContent(importedHTML)
        }}
      />
      <Editor content={content} onChange={setContent} />
    </div>
  )
}`}
          </pre>
        </details>
      </div>

      <style jsx>{`
        .import-example {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 12px;
        }

        .import-example h2 {
          margin-bottom: 30px;
          color: #333;
        }

        .import-options {
          background: white;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .import-options h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #555;
        }

        .import-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .import-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .import-button:hover:not(:disabled) {
          border-color: #007bff;
          background: #007bff;
          color: white;
        }

        .import-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .import-button .icon {
          font-size: 32px;
        }

        .import-button .label {
          font-weight: 500;
        }

        .import-button.html .icon { color: #e44d26; }
        .import-button.markdown .icon { color: #3498db; }
        .import-button.text .icon { color: #f39c12; }
        .import-button.word .icon { color: #2b5797; }
        .import-button.pdf .icon { color: #e74c3c; }
        .import-button.url .icon { color: #27ae60; }
        .import-button.clipboard .icon { color: #9b59b6; }

        .url-import {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .url-import input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .url-import button {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .importing-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          color: #666;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .import-success {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #d4edda;
          color: #155724;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .editor-preview {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .preview-header h3 {
          margin: 0;
          color: #555;
        }

        .clear-button {
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.2s;
        }

        .clear-button:hover {
          background: #c82333;
        }

        .readonly-editor {
          min-height: 400px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #fafafa;
          line-height: 1.6;
        }

        .readonly-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .readonly-editor p {
          margin: 1em 0;
        }

        .import-stats {
          display: flex;
          gap: 24px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 6px;
          margin-top: 16px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-item .label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }

        .stat-item .value {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .import-docs {
          background: white;
          padding: 24px;
          border-radius: 8px;
          margin-top: 24px;
        }

        .import-docs h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #555;
        }

        .import-docs details {
          margin-bottom: 16px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
        }

        .import-docs details[open] {
          margin-bottom: 16px;
        }

        .import-docs summary {
          padding: 12px 16px;
          cursor: pointer;
          font-weight: 500;
          color: #333;
        }

        .import-docs summary:hover {
          background: #f8f9fa;
        }

        .import-docs ul {
          margin: 12px 0 12px 24px;
          padding: 0;
        }

        .import-docs li {
          margin-bottom: 8px;
          color: #555;
        }

        .import-docs strong {
          color: #333;
        }

        .code-block {
          background: #282c34;
          color: #abb2bf;
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}

// ===== API 工具函數實現 =====

/**
 * 從 HTML 導入
 */
async function importFromHTML(html: string): Promise<string> {
  // 清理和驗證 HTML
  const div = document.createElement('div')
  div.innerHTML = html

  // 移除腳本
  const scripts = div.querySelectorAll('script')
  scripts.forEach(s => s.remove())

  return div.innerHTML
}

/**
 * 從 Markdown 導入
 */
async function importFromMarkdown(markdown: string): Promise<string> {
  // 簡單實現，實際可以使用 marked.js
  let html = markdown
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
  html = html.replace(/_(.*?)_/gim, '<u>$1</u>')
  html = html.replace(/\n\n/gim, '</p><p>')
  html = '<p>' + html + '</p>'

  return html
}

/**
 * 從純文本導入
 */
async function importFromPlainText(text: string): Promise<string> {
  // 將文本轉換為段落
  const paragraphs = text.split('\n\n').map(p => {
    if (p.trim()) {
      return `<p>${p.replace(/\n/g, '<br>')}</p>`
    }
    return '<p><br></p>'
  })

  return paragraphs.join('')
}

/**
 * 從 Word 導入（需要 mammoth.js）
 */
async function importFromWord(arrayBuffer: ArrayBuffer): Promise<string> {
  // 實際使用 mammoth.js
  // const { convertToHtml } = await import('mammoth')
  // const result = await convertToHtml({ arrayBuffer })
  // return result.value

  // 這裡返回示例 HTML
  return `<p>Word 文檔內容將在這裡轉換為 HTML</p>
    <p>需要安裝 mammoth.js 庫</p>`
}

/**
 * 從 PDF 導入（需要 pdf.js）
 */
async function importFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  // 實際使用 pdf.js
  // const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js')
  // const pdfjs = await pdfjsLib.getDocument(arrayBuffer)
  // ... 提取文本並轉換為 HTML

  // 這裡返回示例 HTML
  return `<p>PDF 文檔內容將在這裡提取並轉換為 HTML</p>
    <p>需要安裝 pdf.js 庫</p>`
}
