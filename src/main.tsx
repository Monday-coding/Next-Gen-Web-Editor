import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Editor from './components/Editor'

// 1. 定義 MUI 主題（暗色模式）
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00BCD4', // 藍色
      light: '#4FD3E8',
      dark: '#009688',
    },
    secondary: {
      main: '#4CAF50', // 綠色
      light: '#80E27E',
      dark: '#2E7D32',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// 2. 主應用組件
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Editor />
    </ThemeProvider>
  );
}

// 3. 渲染應用
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
