/**
 * 版本歷史和 Diff 模塊
 */

// 版本記錄類型
export interface DocumentVersion {
  id: string
  content: string
  timestamp: Date
  description: string
}

/**
 * 版本歷史管理器
 */
export class VersionHistory {
  private versions: DocumentVersion[] = []
  private maxVersions: number = 50

  /**
   * 添加新版本
   */
  addVersion(content: string, description: string = 'Auto-save'): void {
    const version: DocumentVersion = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      description,
    }

    this.versions.push(version)

    // 限制版本數量
    if (this.versions.length > this.maxVersions) {
      this.versions.shift()
    }
  }

  /**
   * 獲取所有版本
   */
  getVersions(): DocumentVersion[] {
    return [...this.versions].reverse()
  }

  /**
   * 獲取版本
   */
  getVersion(id: string): DocumentVersion | undefined {
    return this.versions.find(v => v.id === id)
  }

  /**
   * 恢復到版本
   */
  restoreVersion(id: string): string | undefined {
    const version = this.getVersion(id)
    if (version) {
      return version.content
    }
    return undefined
  }

  /**
   * 計算簡單的 Diff
   */
  compareVersions(oldContent: string, newContent: string): {
    added: string[]
    removed: string[]
  } {
    const oldLines = oldContent.split('\n')
    const newLines = newContent.split('\n')

    const removed: string[] = []
    const added: string[] = []

    // 簡單的行級 Diff
    oldLines.forEach(line => {
      if (!newLines.includes(line) && line.trim()) {
        removed.push(line)
      }
    })

    newLines.forEach(line => {
      if (!oldLines.includes(line) && line.trim()) {
        added.push(line)
      }
    })

    return { added, removed }
  }

  /**
   * 獲取 Diff HTML
   */
  getDiffHTML(oldContent: string, newContent: string): string {
    const { added, removed } = this.compareVersions(oldContent, newContent)

    let html = ''

    removed.forEach(line => {
      html += `<div style="background: #fee; padding: 2px 4px; margin: 2px 0;">- ${this.escapeHtml(line)}</div>`
    })

    added.forEach(line => {
      html += `<div style="background: #dfd; padding: 2px 4px; margin: 2px 0;">+ ${this.escapeHtml(line)}</div>`
    })

    return html
  }

  /**
   * HTML 轉義
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  /**
   * 清除所有版本
   */
  clear(): void {
    this.versions = []
  }
}
