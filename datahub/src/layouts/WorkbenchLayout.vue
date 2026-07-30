<template>
  <div class="wb-layout">
    <TopNavbar />
    <div class="wb-body">
      <!-- 左侧菜单栏 -->
      <aside class="wb-aside">
        <div class="wb-aside-title">
          <el-icon><Monitor /></el-icon>
          <span>个人工作台</span>
        </div>
        <el-menu :default-active="$route.path" router class="wb-menu">
          <el-menu-item v-for="m in menus" :key="m.path" :index="m.path">
            <el-icon><component :is="m.icon" /></el-icon>
            <span>{{ m.label }}</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <!-- 主内容区 -->
      <section class="wb-content">
        <GovBreadcrumb />
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </section>
    </div>
  </div>
</template>

<script setup>
import TopNavbar from '@/components/TopNavbar.vue'
import GovBreadcrumb from '@/components/GovBreadcrumb.vue'

const menus = [
  { path: '/workbench/personal', label: '工作台概览', icon: 'HomeFilled' },
  { path: '/workbench/personal/applications', label: '我的申请', icon: 'Document' },
  { path: '/workbench/personal/cart', label: '我的收藏夹', icon: 'Star' },
  { path: '/workbench/personal/auth-data', label: '我的授权数据', icon: 'Key' },
  { path: '/workbench/personal/messages', label: '消息通知', icon: 'Bell' },
  { path: '/workbench/personal/settings', label: '账号设置', icon: 'Setting' }
]
</script>

<style scoped>
.wb-layout { min-height: 100%; display: flex; flex-direction: column; }
.wb-body { flex: 1; display: flex; min-height: calc(100vh - 64px); }
.wb-aside {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}
.wb-aside-title {
  height: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  font-weight: 700;
  color: var(--gov-blue);
  border-bottom: 1px solid var(--border-color);
}
.wb-menu { border-right: none; flex: 1; }
.wb-menu .el-menu-item.is-active {
  background: var(--gov-blue-lighter);
  border-right: 3px solid var(--gov-blue);
  font-weight: 600;
}
.wb-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
</style>
