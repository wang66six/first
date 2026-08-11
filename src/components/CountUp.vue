<template>
  <span class="metric-num">{{ display }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 1200 },
  decimals: { type: Number, default: 0 }
})

const display = ref('0')
// 记录上一次的目标值：数据刷新时从当前值平滑过渡，而非从 0 重滚
let lastValue = 0

function format(n) {
  return n.toLocaleString('zh-CN', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals
  })
}

function run() {
  const start = performance.now()
  const from = lastValue
  const to = props.value
  lastValue = to
  let done = false
  const step = (now) => {
    const p = Math.min((now - start) / props.duration, 1)
    // easeOutCubic 缓动
    const eased = 1 - Math.pow(1 - p, 3)
    display.value = format(from + (to - from) * eased)
    if (p < 1) requestAnimationFrame(step)
    else done = true
  }
  requestAnimationFrame(step)
  // rAF 被节流（后台标签页/省电模式）时兜底显示最终值
  setTimeout(() => {
    if (!done) display.value = format(to)
  }, props.duration + 100)
}

onMounted(run)
watch(() => props.value, run)
</script>
