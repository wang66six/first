import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom'],
          // 路由
          'router': ['react-router-dom'],
          // Redux 状态管理
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          // 图表库（较大，单独分离）
          'recharts': ['recharts'],
          // 工具库
          'utils': ['axios', 'dayjs', 'ahooks'],
        },
      },
    },
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 天天基金 API 代理
      '/api/fundgz': {
        target: 'http://fundgz.1234567.com.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fundgz/, ''),
      },
      // 天天基金持仓数据 API
      '/api/fundf10': {
        target: 'http://fundf10.eastmoney.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fundf10/, ''),
      },
      // 腾讯股票行情 API
      '/api/tencent': {
        target: 'http://qt.gtimg.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tencent/, ''),
      },
    },
  },
})
