import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'zustand', 'prosemirror-model', 'react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          editor: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-underline', '@tiptap/extension-text-align', '@tiptap/extension-link', '@tiptap/extension-image', '@tiptap/extension-placeholder', '@tiptap/pm'],
          utils: ['file-saver', 'html-to-pdfmake', 'react-toastify', 'uuid'],
        },
      },
    },
  },
})
