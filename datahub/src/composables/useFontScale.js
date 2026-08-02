import { ref } from 'vue'

/**
 * 全局字号调节（可访问性增强）
 * - 四档可选：小 / 标准 / 大 / 特大
 * - 通过根元素 zoom 整体缩放（页面以 px 布局为主，zoom 可无损缩放全部元素）
 * - 选择持久化至 localStorage，刷新/重登后自动恢复
 */
export const FONT_SCALES = [
  { key: 'small', label: '小', value: 0.875 },
  { key: 'standard', label: '标准', value: 1 },
  { key: 'large', label: '大', value: 1.125 },
  { key: 'extraLarge', label: '特大', value: 1.25 }
]

const STORAGE_KEY = 'dh_font_scale'

function readStoredScale() {
  const v = parseFloat(localStorage.getItem(STORAGE_KEY))
  return FONT_SCALES.some((s) => s.value === v) ? v : 1
}

// 模块级单例：登录页固定 1，其他页用存储值
const isLoginPage = typeof location !== 'undefined' && (location.pathname === '/login' || location.pathname === '/login/')
const scale = ref(isLoginPage ? 1 : readStoredScale())

function applyScale(v) {
  document.documentElement.style.setProperty('--app-font-scale', String(v))
}
export { applyScale }

/** 应用启动时调用一次，把持久化的字号写回根元素（登录页跳过，由 index.html 内联脚本已处理） */
export function initFontScale() {
  if (!isLoginPage) applyScale(scale.value)
}

export function useFontScale() {
  function setScale(v) {
    scale.value = v
    localStorage.setItem(STORAGE_KEY, String(v))
    applyScale(v)
  }
  return { scale, scales: FONT_SCALES, setScale }
}
