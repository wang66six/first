import { ref } from 'vue'

/**
 * 全局页面大小调节（可访问性增强）
 * - 三档可选：标准 / 大 / 特大
 * - 实现机制：#app zoom 整体缩放页面主体（字体/卡片/表格/图表），teleport 到 body 的 Element Plus 弹层
 *   在 1:1 坐标系中定位、由 global.css 中的 transform: scale 等比放大，两者共用 --app-font-scale 变量
 * - 选择持久化至 localStorage，刷新/重登后自动恢复（旧版「小」档 0.875 自动回落为标准）
 */
export const FONT_SCALES = [
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
    // zoom 不触发 window resize，主动派发事件让 ECharts 等监听窗口尺寸的组件感知变化重新渲染
    window.dispatchEvent(new Event('resize'))
  }
  return { scale, scales: FONT_SCALES, setScale }
}
