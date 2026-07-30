<template>
  <div class="cwb-layout">
    <!-- 顶部导航栏（与门户一致） -->
    <TopNavbar />

    <div class="cwb-body">
    <!-- 左侧栏：头像 + 分组菜单 -->
    <aside class="cwb-aside">
      <div class="cwb-user">
        <div class="cwb-avatar">
          <el-icon :size="26"><UserFilled /></el-icon>
          <span class="cwb-online-dot"></span>
        </div>
        <p class="cwb-user-name">{{ user.name }}</p>
        <p class="cwb-user-dept">{{ user.dept }}</p>
      </div>

      <nav class="cwb-menu">
        <template v-for="g in menuGroups" :key="g.title || 'main'">
          <p
            v-if="g.title"
            class="cwb-group-title"
            :class="{ collapsible: g.collapsible }"
            @click="g.collapsible && toggleGroup(g.title)"
          >
            {{ g.title }}
            <el-icon v-if="g.collapsible" class="cwb-group-arrow" :class="{ folded: collapsed[g.title] }"><ArrowDown /></el-icon>
          </p>
          <el-collapse-transition>
            <div v-show="!g.collapsible || !collapsed[g.title]">
              <div
                v-for="m in g.items"
                :key="m.label"
                class="cwb-menu-item"
                :class="{ active: isActive(m), danger: m.danger }"
                @click="onMenu(m)"
              >
                <el-icon><component :is="m.icon" /></el-icon>
                <span>{{ m.label }}</span>
                <em v-if="m.label === '首页' && pendingCount" class="cwb-badge">{{ pendingCount }}</em>
              </div>
            </div>
          </el-collapse-transition>
        </template>
      </nav>

      <div class="cwb-back" @click="router.push('/home')">
        <el-icon><Back /></el-icon>返回门户首页
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <section class="cwb-content">
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
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import { unifiedTodos } from '@/mock'
import TopNavbar from '@/components/TopNavbar.vue'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

// 首页角标：统一待办中待处理的单据数
const pendingCount = unifiedTodos.filter((t) => t.status === '待处理').length

// 当前工作台标识（commission / governance / district / provider），从匹配路由 meta 派生
const workbench = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i--) {
    if (route.matched[i].meta?.workbench) return route.matched[i].meta.workbench
  }
  return 'commission'
})
const base = computed(() => `/workbench/${workbench.value}`)

// 分组菜单：路径以当前工作台 base 为前缀，四类工作台结构完全一致
const menuGroups = computed(() => {
  const b = base.value
  return [
    {
      items: [
        { label: '首页', icon: 'HomeFilled', path: b },
        { label: '统一待办', icon: 'Document', path: `${b}/todo` },
        { label: '我的收藏', icon: 'Star', path: `${b}/favorites` }
      ]
    },
    {
      title: '运营中心',
      collapsible: true,
      items: [
        { label: '运营过程管理', icon: 'SetUp', path: `${b}/operation` },
        { label: '智能运维', icon: 'Tools', path: `${b}/ops` },
        { label: '统一元数据管理', icon: 'Collection', path: `${b}/metadata` },
        { label: '数据编制', icon: 'EditPen', path: `${b}/data-compile` },
        { label: '统一资源管理', icon: 'Coin', path: `${b}/resource` },
        { label: '前置机管理', icon: 'Monitor', path: `${b}/front-machine` }
      ]
    },
    {
      title: '开发中心',
      collapsible: true,
      items: [
        { label: '统一工具', icon: 'Box', path: `${b}/dev-tools` },
        { label: '三合一治理', icon: 'Operation', path: `${b}/tri-governance` },
        { label: '统一服务总线', icon: 'Connection', path: `${b}/service-bus` }
      ]
    },
    {
      title: '安全中心',
      collapsible: true,
      items: [
        { label: '安全控制中心', icon: 'Lock', path: `${b}/security-control` }
      ]
    },
    {
      title: '其他',
      collapsible: true,
      items: [
        { label: '数据共享', icon: 'Share', path: `${b}/data-share` },
        { label: '数据开放', icon: 'FolderOpened', path: `${b}/data-open` },
        { label: '授权运营', icon: 'Stamp', path: `${b}/authorized-operation` }
      ]
    },
    {
      title: '系统设置',
      items: [
        { label: '个人资料', icon: 'User', path: `${b}/profile` },
        { label: '退出登录', icon: 'SwitchButton', danger: true }
      ]
    }
  ]
})

function isActive(m) {
  if (!m.path) return false
  return m.path === base.value ? route.path === m.path : route.path.startsWith(m.path)
}

// 分组折叠状态（默认展开）
const collapsed = reactive({})
function toggleGroup(title) {
  collapsed[title] = !collapsed[title]
}

function onMenu(m) {
  if (m.danger) {
    ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' }).then(() => {
      user.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    }).catch(() => {})
    return
  }
  router.push(m.path)
}
</script>

<style scoped>
.cwb-layout { min-height: 100vh; background: #f4f6fa; }
.cwb-body { display: flex; min-height: calc(100vh - 56px); }

/* ---------- 左侧栏 ---------- */
.cwb-aside {
  width: 232px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 56px;
  height: calc(100vh - 56px);
  overflow-y: auto;
}
.cwb-user { text-align: center; padding: 30px 16px 22px; }
.cwb-avatar {
  position: relative;
  width: 58px;
  height: 58px;
  margin: 0 auto 10px;
  border-radius: 50%;
  background: var(--gov-blue-lighter);
  color: var(--gov-blue);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cwb-online-dot {
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #fff;
}
.cwb-user-name { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.cwb-user-dept { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

.cwb-menu { flex: 1; padding: 4px 12px 12px; }
.cwb-group-title { font-size: 12px; color: var(--text-secondary); padding: 16px 10px 8px; }
.cwb-group-title.collapsible {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 可折叠分组标题：比下级菜单项（14px）稍大 */
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}
.cwb-group-title.collapsible:hover { color: var(--gov-blue); }
.cwb-group-arrow { font-size: 12px; transition: transform 0.25s; }
.cwb-group-arrow.folded { transform: rotate(-90deg); }
.cwb-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  margin-bottom: 2px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-regular);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 0.2s, color 0.2s, transform 0.2s, padding-left 0.2s;
}
/* 左侧高亮指示条 */
.cwb-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  border-radius: 0 3px 3px 0;
  background: var(--gov-blue);
  transition: height 0.22s ease;
}
.cwb-menu-item:hover { background: #f4f7fc; color: var(--gov-blue); padding-left: 16px; }
.cwb-menu-item:hover::before { height: 16px; }
.cwb-menu-item:active { transform: scale(0.98); }
.cwb-menu-item.active { background: var(--gov-blue-lighter); color: var(--gov-blue); font-weight: 600; }
.cwb-menu-item.active::before { height: 20px; }
.cwb-menu-item.danger { color: #e04a4a; }
.cwb-menu-item.danger::before { background: #e04a4a; }
.cwb-menu-item.danger:hover { background: #fdf0f0; color: #d03030; }
.cwb-badge {
  margin-left: auto;
  font-style: normal;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--gov-blue);
  color: #fff;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cwb-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  font-size: 13px;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
  cursor: pointer;
}
.cwb-back:hover { color: var(--gov-blue); }

/* ---------- 内容区 ---------- */
.cwb-content { flex: 1; min-width: 0; padding: 18px 20px; }
</style>
