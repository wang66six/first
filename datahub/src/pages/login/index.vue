<template>
  <div class="login-page">
    <!-- 中间主视觉区 -->
    <main class="login-main">
      <!-- 左侧：平台名称 + 标语 + 能力卡片 -->
      <div class="intro-panel">
        <div class="brand-row">
          <img :src="logoImg" alt="logo" class="brand-logo" />
          <h1 class="brand-title">上海市大数据资源平台</h1>
        </div>
        <p class="slogan-sub">数据驱动决策 · 智慧赋能治理</p>

        <div class="ability-grid">
          <div class="ability-card ability-card--primary">
            <h3>统一底座</h3>
            <p>实现跨平台、多底座的统一数据管理和服务，提供统一管理的多样化数据工具</p>
          </div>
          <div class="ability-card">
            <h3>统一工具</h3>
            <p>提供更贴近用户的跨平台数据支撑，有效支撑“湖+池”两级数据治理架构，赋能数据归集、数据治理、数据共享、数据应用</p>
          </div>
          <div class="ability-card">
            <h3>统一运营</h3>
            <p>持续推进运营管理的精细化和智能化，实现数据归集、治理、服务、应用的全过程追溯和运维监控，强化数据安全风险管控能力</p>
          </div>
          <div class="ability-card">
            <h3>创新应用</h3>
            <p>拓展人工智能、区块链、隐私计算等新型技术的应用，不断丰富创新应用场景，强化数据流通安全，提升数据应用效率</p>
          </div>
        </div>
      </div>

      <!-- 右侧：统一身份认证登录卡片 -->
      <div class="auth-card">
        <div class="auth-head">
          <img :src="logoImg" alt="logo" class="auth-logo" />
          <span class="auth-org">上海市大数据中心</span>
        </div>
        <h2 class="auth-title">统一身份认证登录</h2>

        <!-- 登录方式切换 -->
        <div class="auth-tabs">
          <span class="auth-tab" :class="{ active: loginMode === 'pwd' }" @click="loginMode = 'pwd'">账号密码登录</span>
          <span class="tab-divider"></span>
          <span class="auth-tab" :class="{ active: loginMode === 'qr' }" @click="loginMode = 'qr'">二维码登录</span>
        </div>

        <!-- 二维码登录 -->
        <div v-if="loginMode === 'qr'" class="qr-panel">
          <div class="qr-wrap" :class="{ 'qr-expired': qrStatus === 'expired' }">
            <!-- 动态二维码（SVG 模拟） -->
            <svg class="qr-svg" viewBox="0 0 210 210" aria-label="登录二维码">
              <rect width="210" height="210" fill="#fff" />
              <g fill="#123a75">
                <rect v-for="(c, i) in qrCells" :key="`${qrSeed}-${i}`" :x="c.x" :y="c.y" width="9" height="9" />
                <!-- 三个定位角 -->
                <g v-for="p in [[8, 8], [152, 8], [8, 152]]" :key="p.join()">
                  <rect :x="p[0]" :y="p[1]" width="50" height="50" fill="none" stroke="#123a75" stroke-width="9" />
                  <rect :x="p[0] + 16" :y="p[1] + 16" width="18" height="18" />
                </g>
              </g>
            </svg>
            <!-- 失效/扫码成功 遮罩 -->
            <div v-if="qrStatus === 'expired'" class="qr-mask">
              <p>二维码已失效</p>
              <el-button type="primary" size="small" @click="refreshQr">
                <el-icon style="margin-right: 4px"><Refresh /></el-icon>刷新二维码
              </el-button>
            </div>
            <div v-else-if="qrStatus === 'scanned'" class="qr-mask qr-mask--ok">
              <el-icon class="ok-icon"><CircleCheckFilled /></el-icon>
              <p>扫码成功，正在登录…</p>
            </div>
          </div>
          <p class="qr-tip">
            <el-icon class="scan-icon"><FullScreen /></el-icon>
            请使用随申办政务云扫码登录
          </p>
          <p class="qr-status">
            <template v-if="qrStatus === 'waiting'">
              二维码 <b>{{ countdown }}s</b> 后自动刷新　
              <el-button link type="primary" size="small" @click="simulateScan">模拟扫码</el-button>
            </template>
            <template v-else-if="qrStatus === 'expired'">扫码超时，请刷新后重试</template>
          </p>
        </div>

        <!-- 账号密码登录 -->
        <div v-else class="pwd-panel">
          <el-form :model="form" label-width="0" @submit.prevent>
            <el-form-item>
              <el-input v-model="form.account" placeholder="请输入账号" size="large">
                <template #prefix><el-icon><User /></el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" show-password>
                <template #prefix><el-icon><Lock /></el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <!-- 四类角色可多选，多角色用户工作台入口为下拉选择 -->
              <el-checkbox-group v-model="form.roles">
                <el-checkbox value="commission">市委办单位</el-checkbox>
                <el-checkbox value="governance">数据治理部</el-checkbox>
                <el-checkbox value="district">区大数据中心</el-checkbox>
                <el-checkbox value="provider">第三方服务单位</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-button type="primary" size="large" style="width: 100%" :loading="logging" @click="pwdLogin">
              登 录
            </el-button>
            <p class="demo-tip">演示环境：任意账号密码即可登录，请选择角色体验对应权限视图</p>
          </el-form>
        </div>

        <!-- 卡片底部热线 -->
        <div class="auth-foot">
          <span>热线电话：96999666</span>
          <span>值班电话：021-23170299</span>
        </div>
      </div>
    </main>

    <!-- 底部备案区 -->
    <footer class="login-footer">
      主办单位：上海市数据局　承办单位：上海市大数据中心　沪ICP备2026001234号-1　沪公网安备 31010102006688号　Copyright © 2026 上海市大数据资源平台 版权所有
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useFontScale, applyScale } from '@/composables/useFontScale'
import logoImg from '@/assets/logo.png'

const router = useRouter()
const route = useRoute()
const user = useUserStore()

/* ---------- 登录方式 ---------- */
const loginMode = ref('qr') // qr | pwd

/* ---------- 动态二维码 ---------- */
const qrSeed = ref(Date.now())
const qrStatus = ref('waiting') // waiting | expired | scanned
const countdown = ref(60)
let timer = null

// 基于种子伪随机生成二维码点阵
const qrCells = computed(() => {
  const cells = []
  let seed = qrSeed.value % 2147483647
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      // 跳过三个定位角区域
      const inCorner = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)
      if (!inCorner && rand() > 0.52) cells.push({ x: 8 + c * 9.2, y: 8 + r * 9.2 })
    }
  }
  return cells
})

function startCountdown() {
  clearInterval(timer)
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      // 定时自动刷新；连续两轮未扫码则判定超时失效
      if (qrSeed.value % 2 === 0) {
        refreshQr(true)
      } else {
        qrStatus.value = 'expired'
        clearInterval(timer)
        ElMessage.warning('二维码已超时失效，请刷新后重新扫码')
      }
    }
  }, 1000)
}

function refreshQr(silent) {
  qrSeed.value = Date.now()
  qrStatus.value = 'waiting'
  startCountdown()
  if (silent !== true) ElMessage.success('二维码已刷新')
}

// 模拟扫码成功 → 自动跳转门户首页
function simulateScan() {
  qrStatus.value = 'scanned'
  clearInterval(timer)
  setTimeout(() => {
    user.login(['commission'])
    ElMessage.success('登录成功，欢迎访问上海市大数据资源平台')
    router.push(route.query.redirect || '/home')
  }, 900)
}

/* ---------- 账号密码登录 ---------- */
const logging = ref(false)
const form = ref({ account: '', password: '', roles: ['commission'] })

function pwdLogin() {
  if (!form.value.account || !form.value.password) {
    ElMessage.warning('请输入账号与密码')
    return
  }
  if (!form.value.roles.length) {
    ElMessage.warning('请至少选择一个角色')
    return
  }
  logging.value = true
  setTimeout(() => {
    logging.value = false
    user.login(form.value.roles)
    ElMessage.success('登录成功')
    router.push(route.query.redirect || '/home')
  }, 700)
}

// 登录页固定原始大小：挂载前将全局缩放临时归 1（首帧即生效，无闪烁），卸载后恢复用户设置
const { scale: fontScaleRef } = useFontScale()
onBeforeMount(() => applyScale(1))
onMounted(startCountdown)
onBeforeUnmount(() => {
  clearInterval(timer)
  // 从 localStorage 读取真实用户偏好（模块初始化时 ref 可能因 isLoginPage 被置为 1）
  const stored = parseFloat(localStorage.getItem('dh_font_scale')) || 1
  fontScaleRef.value = stored
  applyScale(stored)
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #4a70ac url('@/assets/login-bg.png') center / cover no-repeat;
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  width: min(1440px, 92%);
  margin: 0 auto;
  padding: 60px 0 40px;
}

/* ---------- 左侧品牌与能力区 ---------- */
.intro-panel { color: #fff; max-width: 700px; }
.brand-row { display: flex; align-items: center; gap: 20px; }
.brand-logo { width: 56px; height: auto; flex-shrink: 0; filter: drop-shadow(0 2px 6px rgba(10, 35, 80, 0.35)); }
.brand-title {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: 12px;
  text-shadow: 0 2px 10px rgba(10, 35, 80, 0.35);
  white-space: nowrap;
}
.slogan-sub {
  margin: 26px 0 56px;
  font-size: 18px;
  letter-spacing: 8px;
  text-align: center;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 6px rgba(10, 35, 80, 0.3);
}

.ability-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}
.ability-card {
  padding: 20px 22px;
  border-radius: 10px;
  background: rgba(90, 122, 170, 0.38);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  transition: transform 0.25s, box-shadow 0.25s;
}
.ability-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(10, 35, 80, 0.25); }
.ability-card--primary {
  background: linear-gradient(120deg, rgba(64, 128, 235, 0.92), rgba(96, 110, 225, 0.78));
}
.ability-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 10px; letter-spacing: 1px; }
.ability-card p { font-size: 13px; line-height: 1.8; color: rgba(255, 255, 255, 0.88); }

/* ---------- 右侧登录卡片 ---------- */
.auth-card {
  width: 420px;
  flex-shrink: 0;
  padding: 30px 36px 22px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 16px 48px rgba(13, 42, 90, 0.22);
}
.auth-head { display: flex; align-items: center; justify-content: center; gap: 10px; }
.auth-logo { width: 30px; height: auto; }
.auth-org { font-size: 18px; font-weight: 700; color: #2563c9; letter-spacing: 2px; }
.auth-title {
  margin: 22px 0 20px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #1f2d3d;
}

.auth-tabs { display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 22px; }
.auth-tab {
  font-size: 15px;
  color: #5f6f85;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: color 0.2s;
}
.auth-tab:hover { color: var(--gov-blue); }
.auth-tab.active { color: #2563c9; font-weight: 600; border-bottom-color: #2563c9; }
.tab-divider { width: 1px; height: 16px; background: #b8c6da; }

/* 二维码面板 */
.qr-panel { text-align: center; }
.qr-wrap {
  position: relative;
  width: 210px;
  height: 210px;
  margin: 0 auto;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(13, 42, 90, 0.1);
}
.qr-svg { width: 100%; height: 100%; }
.qr-expired .qr-svg { filter: blur(3px); opacity: 0.4; }
.qr-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  color: var(--text-regular);
}
.qr-mask--ok { background: rgba(255, 255, 255, 0.92); color: var(--gov-green); }
.ok-icon { font-size: 42px; color: var(--gov-green); }
.qr-tip {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2d3d;
}
.scan-icon { color: #2563c9; font-size: 18px; }
.qr-status { margin-top: 10px; font-size: 13px; color: #5f6f85; }
.qr-status b { color: var(--gov-blue); }

/* 账号密码面板 */
.pwd-panel { padding: 2px 0 4px; }
.demo-tip { margin-top: 12px; font-size: 12px; color: #7a8aa0; text-align: center; }

/* 卡片底部热线 */
.auth-foot {
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid rgba(31, 76, 145, 0.14);
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #5a7bb0;
}

/* ---------- 底部备案区 ---------- */
.login-footer {
  text-align: center;
  padding: 14px 0 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

/* 1366×768 适配 */
@media (max-width: 1500px) {
  .brand-title { font-size: 36px; letter-spacing: 9px; }
  .brand-logo { width: 46px; }
  .slogan-sub { margin: 20px 0 36px; }
  .intro-panel { max-width: 600px; }
  .auth-card { width: 392px; padding: 26px 30px 20px; }
}
</style>
