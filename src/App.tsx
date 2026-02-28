import React, { useState, useEffect, createContext, useContext } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import IconButton from '@mui/material/IconButton'
import Editor from './components/Editor'
import Sidebar from './components/Sidebar'
import { useEditorStore } from './store/useEditorStore'

// 定義主題
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00BCD4',
      light: '#4FD3E8',
      dark: '#009688',
    },
    secondary: {
      main: '#4CAF50',
      light: '#80E27E',
      dark: '#2E7D32',
    },
  },
})

// 主題上下文
const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({
  theme: 'dark',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

// 主應用組件
function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const { createDocument } = useEditorStore()
  const { documents, currentDocument, deleteDocument, renameDocument, selectDocument } = useEditorStore()

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // 初始化時創建新文檔
  useEffect(() => {
    if (documents.length === 0) {
      createDocument()
    }
  }, [documents.length, createDocument])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
          {/* 側邊欄 */}
          <Sidebar
            documents={documents}
            currentDocument={currentDocument}
            onCreateDocument={createDocument}
            onSelectDocument={selectDocument}
            onDeleteDocument={deleteDocument}
            onRenameDocument={renameDocument}
          />

          {/* 主內容區 */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* 主題切換按鈕 */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 1000,
              }}
            >
              <IconButton
                onClick={toggleTheme}
                sx={{
                  backgroundColor: theme === 'dark' ? '#2C2C2C' : '#f5f5f5',
                  color: theme === 'dark' ? '#E0E0E0' : '#212121',
                }}
              >
                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>

            {/* 編輯器區域 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {currentDocument ? (
                <Editor />
              ) : (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="text-gray-400 text-xl">請選擇或創建文檔</div>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default App
