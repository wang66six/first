<template>
  <div class="mg-layout">
    <TopNavbar />
    <div class="mg-body">
      <!-- 左侧固定主菜单：管账号 / 管资源 / 管数据 / 管运维 -->
      <aside class="mg-aside">
        <div class="mg-aside-title">
          <el-icon><Setting /></el-icon>
          <span>治理部管理后台</span>
        </div>
        <el-menu :default-active="$route.path" router class="mg-menu" :default-openeds="openeds">
          <el-sub-menu v-for="g in menuGroups" :key="g.key" :index="g.key">
            <template #title>
              <el-icon><component :is="g.icon" /></el-icon>
              <span>{{ g.label }}</span>
            </template>
            <el-menu-item v-for="m in g.children" :key="m.path" :index="m.path">
              {{ m.label }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </aside>
      <section class="mg-content">
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

const menuGroups = [
  {
    key: 'account', label: '管账号', icon: 'User',
    children: [
      { path: '/manage/account/list', label: '账号列表' },
      { path: '/manage/account/dormant', label: '休眠账号检测' },
      { path: '/manage/account/approval', label: '账号审批' },
      { path: '/manage/account/permission', label: '权限管理' }
    ]
  },
  {
    key: 'resource', label: '管资源', icon: 'Cpu',
    children: [
      { path: '/manage/resource/overview', label: '资源池总览' },
      { path: '/manage/resource/front-machine', label: '前置机管理' },
      { path: '/manage/resource/approval', label: '资源申请审批' }
    ]
  },
  {
    key: 'data', label: '管数据', icon: 'Coin',
    children: [
      { path: '/manage/data/monitor', label: '数据监测总览' },
      { path: '/manage/data/mount-check', label: '目录挂载检测' },
      { path: '/manage/data/update-check', label: '数据更新检测' }
    ]
  },
  {
    key: 'ops', label: '管运维', icon: 'Odometer',
    children: [
      { path: '/manage/ops/overview', label: '运行总览' },
      { path: '/manage/ops/alerts', label: '智能运维告警' },
      { path: '/manage/ops/tickets', label: '运维工单' }
    ]
  }
]

const openeds = ['account', 'resource', 'data', 'ops']
</script>

<style scoped>
.mg-layout { min-height: 100%; display: flex; flex-direction: column; }
.mg-body { flex: 1; display: flex; min-height: calc(100vh - 64px); }
.mg-aside {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid var(--border-color);
}
.mg-aside-title {
  height: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  font-weight: 700;
  color: var(--gov-blue);
  border-bottom: 1px solid var(--border-color);
}
.mg-menu { border-right: none; }
.mg-menu .el-menu-item.is-active {
  background: var(--gov-blue-lighter);
  border-right: 3px solid var(--gov-blue);
  font-weight: 600;
}
.mg-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
</style>
