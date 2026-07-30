<template>
  <div class="cfp-page">
    <div class="gov-card cfp-card">
      <div class="cfp-icon"><el-icon :size="36"><Files /></el-icon></div>
      <h2 class="cfp-title">{{ $route.meta.title }}</h2>
      <p class="cfp-desc">该功能模块正在建设中，敬请期待</p>
      <el-button type="primary" plain @click="router.push(base)">返回工作台首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 返回当前工作台首页（从匹配路由 meta 派生 base，四类工作台共用本页）
const base = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i--) {
    if (route.matched[i].meta?.workbench) return `/workbench/${route.matched[i].meta.workbench}`
  }
  return '/workbench/commission'
})
</script>

<style scoped>
.cfp-page { min-height: calc(100vh - 160px); display: flex; align-items: center; justify-content: center; }
.cfp-card { text-align: center; padding: 56px 84px; }
.cfp-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: var(--gov-blue-lighter);
  color: var(--gov-blue);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cfp-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
.cfp-desc { font-size: 13.5px; color: var(--text-secondary); margin-bottom: 24px; }
</style>
