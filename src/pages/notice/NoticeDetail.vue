<template>
  <div class="page-container notice-detail">
    <div class="gov-card notice-card" v-if="notice">
      <div class="notice-head">
        <el-tag :type="notice.type === '政策公告' ? 'warning' : 'primary'" effect="plain">{{ notice.type }}</el-tag>
        <h1>{{ notice.title }}</h1>
        <p class="notice-meta">发布时间：{{ notice.date }}　来源：上海市大数据资源平台</p>
      </div>
      <el-divider />
      <div class="notice-body">
        <p>{{ notice.content }}</p>
        <p class="notice-sign">上海市数据局<br />{{ notice.date }}</p>
      </div>
      <el-divider />
      <el-button @click="$router.back()">
        <el-icon style="margin-right: 4px"><Back /></el-icon>返回上级
      </el-button>
    </div>
    <el-empty v-else description="公告不存在" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { notices } from '@/mock'

const route = useRoute()
const notice = computed(() => notices.find((n) => n.id === Number(route.params.id)))
</script>

<style scoped>
.notice-detail { width: 1000px; margin: 0 auto; }
.notice-card { padding: 36px 48px; }
.notice-head h1 { font-size: 24px; margin: 14px 0 10px; line-height: 1.5; }
.notice-meta { font-size: 13px; color: var(--text-secondary); }
.notice-body { font-size: 15px; line-height: 2.2; color: var(--text-regular); text-indent: 2em; }
.notice-sign { text-align: right; text-indent: 0; margin-top: 32px; }
</style>
