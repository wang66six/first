<template>
  <header class="top-navbar">
    <!-- 左侧 Logo -->
    <router-link to="/home" class="nav-logo">
      <img :src="logoImg" alt="logo" class="logo-img" />
      <span class="logo-name">上海市大数据资源平台</span>
    </router-link>

    <!-- 中间导航菜单 -->
    <nav class="nav-menu">
      <span
        v-for="m in menus"
        :key="m.label"
        class="nav-menu-item"
        :class="{ active: isActive(m) }"
        @click="onMenu(m)"
      >{{ m.label }}</span>
    </nav>

    <!-- 右侧功能区 -->
    <div class="nav-actions">
      <!-- 工作台入口：单角色直达，多角色下拉选择 -->
      <el-dropdown v-if="user.workbenches.length > 1" @command="goWorkbench">
        <span class="nav-drop">
          工作台<el-icon class="drop-arrow"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="w in user.workbenches" :key="w.role" :command="w.path">{{ w.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span v-else-if="user.workbenches.length === 1" class="nav-drop" @click="goWorkbench(user.workbenches[0].path)">工作台</span>

      <!-- 用户下拉：右对齐，避免高倍字号下右侧溢出 -->
      <el-dropdown placement="bottom-end" @command="onCommand">
        <div class="user-box">
          <el-avatar :size="30" class="user-avatar">{{ user.name.slice(0, 1) }}</el-avatar>
          <el-icon class="drop-arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>{{ user.roleLabel }}</el-dropdown-item>
            <!-- 字号调节：小/标准/大/特大四档，点击不关闭下拉 -->
            <li class="fs-row" @click.stop>
              <span class="fs-label">字号</span>
              <div class="fs-opts">
                <button
                  v-for="s in fontScales"
                  :key="s.key"
                  class="fs-btn"
                  :class="{ active: s.value === fontScale }"
                  :title="`全局字号：${s.label}`"
                  @click="setFontScale(s.value)"
                >{{ s.label }}</button>
              </div>
            </li>
            <!-- 主题切换：浅色/深色/高对比 -->
            <li class="fs-row" @click.stop>
              <span class="fs-label">主题</span>
              <div class="fs-opts">
                <button
                  v-for="t in themeList"
                  :key="t.key"
                  class="fs-btn"
                  :class="{ active: t.key === currentTheme }"
                  :title="`切换主题：${t.label}`"
                  @click="setTheme(t.key)"
                >{{ t.label }}</button>
              </div>
            </li>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useFontScale } from '@/composables/useFontScale'
import { useTheme } from '@/composables/useTheme'
import logoImg from '@/assets/logo.png'

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const { scale: fontScale, scales: fontScales, setScale: setFontScale } = useFontScale()
const { theme: currentTheme, themes: themeList, setTheme } = useTheme()

const menus = [
  { label: '首页', path: '/home' },
  { label: '数据资源', path: '/zone/data-resource' },
  { label: '数据产品', path: '/zone/data-product' },
  { label: '智能合约', path: '/zone/smart-contract' }
]

function isActive(m) {
  return m.path && (m.path === '/home' ? route.path === '/home' : route.path.startsWith(m.path))
}

function onMenu(m) {
  if (m.path) {
    router.push(m.path)
  } else {
    ElMessage.info(`「${m.label}」模块建设中，敬请期待`)
  }
}

function goWorkbench(path) {
  router.push(path)
}

function onCommand(cmd) {
  if (cmd === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' }).then(() => {
      user.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    }).catch(() => {})
  }
}
</script>

<style scoped>
.top-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 28px;
  background: linear-gradient(90deg, var(--gov-blue-darker) 0%, var(--gov-blue) 100%);
  box-shadow: 0 2px 12px rgba(12, 44, 92, 0.35);
}
.nav-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.logo-img { width: 30px; height: auto; }
.logo-name { color: #fff; font-size: 16px; font-weight: 700; letter-spacing: 1px; white-space: nowrap; }

.nav-menu { flex: 1; display: flex; align-items: center; gap: 8px; overflow: hidden; }
.nav-menu-item {
  position: relative;
  padding: 0 16px;
  height: 56px;
  line-height: 56px;
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s;
}
.nav-menu-item:hover { color: #fff; }
.nav-menu-item.active { color: #fff; font-weight: 600; }
.nav-menu-item.active::after {
  content: '';
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 8px;
  height: 3px;
  border-radius: 2px;
  background: var(--gov-gold);
}

.nav-actions { display: flex; align-items: center; gap: 22px; flex-shrink: 0; }
.nav-drop {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  cursor: pointer;
  outline: none;
}
.nav-drop:hover { color: #fff; }
.drop-arrow { font-size: 12px; }

.user-box { display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; outline: none; }
.user-avatar { background: var(--gov-gold); font-weight: 700; flex-shrink: 0; }

/* 字号调节行（用户下拉内） */
.fs-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px 8px;
  list-style: none;
}
.fs-label { font-size: 13px; color: var(--text-secondary); white-space: nowrap; }
.fs-opts { display: flex; gap: 6px; }
.fs-btn {
  min-width: 34px;
  padding: 3px 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--text-regular);
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.fs-btn:hover { color: var(--color-brand); border-color: var(--color-brand); }
.fs-btn.active {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: #fff;
  font-weight: 600;
}
</style>
