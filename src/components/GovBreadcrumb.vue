<template>
  <el-breadcrumb separator="/" class="gov-breadcrumb">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in trail" :key="item.title" :to="item.path ? { path: item.path } : undefined">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 由路由 meta 自动生成面包屑：支持 parent 上级声明与 group 分组
const trail = computed(() => {
  const items = []
  const meta = route.meta || {}
  if (route.path.startsWith('/manage')) items.push({ title: '治理部管理后台', path: '/manage' })
  // 四类角色工作台（委办 / 治理部 / 区 / 服务商）：按 meta 生成工作台层级
  if (meta.workbench && meta.wbName) {
    items.push({ title: meta.wbName, path: `/workbench/${meta.workbench}` })
  }
  if (meta.group) items.push({ title: meta.group })
  if (meta.parent) items.push({ title: meta.parent.title, path: meta.parent.path })
  if (meta.title && items[items.length - 1]?.title !== meta.title) items.push({ title: meta.title })
  return items
})
</script>

<style scoped>
.gov-breadcrumb { padding: 14px 20px 0; }
</style>
