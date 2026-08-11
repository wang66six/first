<template>
  <div class="portal-layout">
    <TopNavbar />
    <GovBreadcrumb v-if="$route.path !== '/home'" />
    <main class="portal-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <GovFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import TopNavbar from '@/components/TopNavbar.vue'
import GovBreadcrumb from '@/components/GovBreadcrumb.vue'
import GovFooter from '@/components/GovFooter.vue'

// 门户类页面（首页 / 各专区 / 统计 / 公告）隐藏右侧 window 滚动条，保留滚动能力；离开后恢复
onMounted(() => document.documentElement.classList.add('no-scrollbar'))
onBeforeUnmount(() => document.documentElement.classList.remove('no-scrollbar'))
</script>

<style scoped>
.portal-layout { min-height: 100%; display: flex; flex-direction: column; }
.portal-main { flex: 1; }
</style>
