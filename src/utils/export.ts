import TiptapMarkdown from 'tiptap-markdown'
import { htmlToPdfmake } from 'html-to-pdfmake'
import pdfMake from 'pdfmake/build/pdfmake'

// 配置 pdfMake 字體
pdfMake.vfs = {
  fonts: {
    Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
    },
  },
  defaultFont: 'Roboto',
}

// 轉換 HTML 到 Markdown
export function htmlToMarkdown(html: string): string {
  const markdownParser = TiptapMarkdown()
  return markdownParser.transform(html)
}

// 轉換 HTML 到 PDF
export async function htmlToPdf(html: string): Promise<Uint8Array> {
  const pdfDoc = htmlToPdfmake(html, {
    defaultStyles: {
      p: { margin: [0, 5, 0, 10] },
      h1: { fontSize: 22, bold: true, margin: [0, 10, 0, 20] },
      h2: { fontSize: 18, bold: true, margin: [0, 5, 0, 10] },
      h3: { fontSize: 14, bold: true, margin: [0, 5, 0, 10] },
    },
  })

  return pdfMake.createPdf(pdfDoc).getBuffer()
}

// 導出文件
export function downloadFile(content: string | Uint8Array, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
