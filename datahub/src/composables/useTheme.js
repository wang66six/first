import { ref } from 'vue'

/**
 * 全局主题切换（浅色 / 深色 / 高对比）
 * - 通过给 <html> 设置 data-theme 属性驱动 CSS 变量切换
 * - 选择持久化至 localStorage，刷新/重登后自动恢复
 */
export const THEMES = [
  { key: 'light', label: '浅色' },
  { key: 'dark', label: '深色' },
  { key: 'highContrast', label: '高对比' }
]

const STORAGE_KEY = 'dh_theme'

function readStoredTheme() {
  const v = localStorage.getItem(STORAGE_KEY)
  return THEMES.some((t) => t.key === v) ? v : 'light'
}

// 模块级单例
const theme = ref(readStoredTheme())

function applyTheme(key) {
  if (key === 'light') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', key)
  }
}

/** 应用启动时调用一次，把持久化的主题写回根元素 */
export function initTheme() {
  applyTheme(theme.value)
}

export function useTheme() {
  function setTheme(key) {
    theme.value = key
    localStorage.setItem(STORAGE_KEY, key)
    applyTheme(key)
  }
  return { theme, themes: THEMES, setTheme }
}
