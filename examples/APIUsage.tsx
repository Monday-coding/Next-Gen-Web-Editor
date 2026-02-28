/**
 * API Usage Example
 * 展示如何通過 API 使用 Web Editor 的功能
 */

import { useState } from 'react'

// 導入 API 工具（假設已實現）
import {
  convertToMarkdown,
  convertFromMarkdown,
  exportToPDF,
  exportToHTML,
  getWordCount,
  getCharacterCount,
  sanitizeHTML,
} from '../utils/editor-api'

export default function APIUsageExample() {
  const [htmlContent, setHtmlContent] = useState('<p>Hello, <strong>World!</strong></p>')
  const [markdown, setMarkdown] = useState('')
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    paragraphs: 0,
  })

  // HTML 轉 Markdown
  const handleConvertToMarkdown = () => {
    const md = convertToMarkdown(htmlContent)
    setMarkdown(md)
    console.log('Markdown:', md)
  }

  // Markdown 轉 HTML
  const handleConvertFromMarkdown = () => {
    const html = convertFromMarkdown(markdown)
    setHtmlContent(html)
    console.log('HTML:', html)
  }

  // 導出 PDF
  const handleExportPDF = async () => {
    try {
      const pdfBlob = await exportToPDF(htmlContent)
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'document.pdf'
      link.click()
      URL.revokeObjectURL(url)
      console.log('PDF 導出成功')
    } catch (error) {
      console.error('PDF 導出失敗:', error)
    }
  }

  // 導出 HTML
  const handleExportHTML = () => {
    const htmlBlob = exportToHTML(htmlContent)
    const url = URL.createObjectURL(htmlBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'document.html'
    link.click()
    URL.revokeObjectURL(url)
    console.log('HTML 導出成功')
  }

  // 計算統計
  const handleCalculateStats = () => {
    const stats = {
      words: getWordCount(htmlContent),
      characters: getCharacterCount(htmlContent),
      paragraphs: htmlContent.split('</p>').filter(p => p.trim()).length,
    }
    setStats(stats)
    console.log('統計:', stats)
  }

  // 淨理 HTML（移除不安全標籤）
  const handleSanitize = () => {
    const cleanHTML = sanitizeHTML(htmlContent)
    setHtmlContent(cleanHTML)
    console.log('淨理後的 HTML:', cleanHTML)
  }

  // 提取純文本
  const handleExtractText = () => {
    const text = extractTextFromHTML(htmlContent)
    console.log('純文本:', text)
    alert('純文本: ' + text)
  }

  return (
    <div className="api-usage-example">
      <h2>API 使用示例</h2>

      <div className="api-section">
        <h3>格式轉換</h3>
        <div className="button-group">
          <button onClick={handleConvertToMarkdown}>HTML → Markdown</button>
          <button onClick={handleConvertFromMarkdown}>Markdown → HTML</button>
        </div>

        {markdown && (
          <div className="result-box">
            <h4>Markdown 輸出:</h4>
            <pre>{markdown}</pre>
          </div>
        )}
      </div>

      <div className="api-section">
        <h3>導出功能</h3>
        <div className="button-group">
          <button onClick={handleExportPDF}>導出 PDF</button>
          <button onClick={handleExportHTML}>導出 HTML</button>
        </div>
      </div>

      <div className="api-section">
        <h3>內容統計</h3>
        <button onClick={handleCalculateStats}>計算統計</button>
        {stats.words > 0 && (
          <div className="stats-box">
            <div>字數: {stats.words}</div>
            <div>字符數: {stats.characters}</div>
            <div>段落數: {stats.paragraphs}</div>
          </div>
        )}
      </div>

      <div className="api-section">
        <h3>內容操作</h3>
        <div className="button-group">
          <button onClick={handleSanitize}>清理 HTML</button>
          <button onClick={handleExtractText}>提取純文本</button>
        </div>
      </div>

      <div className="api-section">
        <h3>HTML 預覽</h3>
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="輸入 HTML..."
          rows={10}
        />
      </div>

      <div className="api-section">
        <h3>Markdown 輸入</h3>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="輸入 Markdown..."
          rows={10}
        />
      </div>
    </div>
  )
}

// ===== API 工具函數實現 =====

/**
 * HTML 轉 Markdown
 */
function convertToMarkdown(html: string): string {
  // 簡化版實現，實際項目可以使用 marked 等庫
  let md = html
    // 移除 HTML 標籤，轉換為 Markdown
  md = md.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
  md = md.replace(/<b>(.*?)<\/b>/g, '**$1**')
  md = md.replace(/<em>(.*?)<\/em>/g, '*$1*')
  md = md.replace(/<i>(.*?)<\/i>/g, '*$1*')
  md = md.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
  md = md.replace(/<h1>(.*?)<\/h1>/g, '# $1')
  md = md.replace(/<h2>(.*?)<\/h2>/g, '## $1')
  md = md.replace(/<h3>(.*?)<\/h3>/g, '### $1')
  md = md.replace(/<p>(.*?)<\/p>/g, '\n$1\n')
  md = md.replace(/<br\s*\/?>/gi, '\n')
  // 移除其他標籤
  md = md.replace(/<[^>]*>/g, '')
  return md.trim()
}

/**
 * Markdown 轉 HTML
 */
function convertFromMarkdown(markdown: string): string {
  let html = markdown
  // 轉換 Markdown 為 HTML
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.*?)_/g, '<u>$1</u>')
  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  return html
}

/**
 * 導出 PDF
 */
async function exportToPDF(html: string): Promise<Blob> {
  // 簡化版實現，實際項目使用 jsPDF 或 html2pdf.js
  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Document</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2, h3 { color: #333; }
        p { line-height: 1.6; }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `
  return new Blob([pdfContent], { type: 'application/pdf' })
}

/**
 * 導出 HTML
 */
function exportToHTML(html: string): Blob {
  const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Document</title>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `
  return new Blob([fullHTML], { type: 'text/html' })
}

/**
 * 計算字數
 */
function getWordCount(html: string): number {
  const text = extractTextFromHTML(html)
  return text.split(/\s+/).filter(word => word.length > 0).length
}

/**
 * 計算字符數
 */
function getCharacterCount(html: string): number {
  const text = extractTextFromHTML(html)
  return text.length
}

/**
 * 清理 HTML（移除不安全標籤）
 */
function sanitizeHTML(html: string): string {
  // 簡化版，實際項目使用 DOMPurify
  const div = document.createElement('div')
  div.innerHTML = html
  // 移除 script 和 style 標籤
  const scripts = div.querySelectorAll('script, style')
  scripts.forEach(el => el.remove())
  return div.innerHTML
}

/**
 * 提取純文本
 */
function extractTextFromHTML(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// 樣式
const apiStyles = `
.api-usage-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.api-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.api-section h3 {
  margin-top: 0;
  color: #333;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.button-group button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.button-group button:hover {
  background: #0056b3;
}

.result-box, .stats-box {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-top: 10px;
}

.result-box pre, .stats-box div {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.api-section textarea {
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
}

.api-section textarea:focus {
  outline: none;
  border-color: #007bff;
}
`

// 將樣式注入到 head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = apiStyles
  document.head.appendChild(styleElement)
}
