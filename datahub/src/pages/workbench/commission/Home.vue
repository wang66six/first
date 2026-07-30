<template>
  <div class="cwb-home">
    <!-- 第一行：欢迎卡 + 快捷操作 -->
    <div class="welcome-row">
      <div class="gov-card welcome-card">
        <div class="welcome-avatar"><el-icon :size="24"><Monitor /></el-icon></div>
        <div>
          <h2 class="welcome-title">{{ wbName }}</h2>
          <p class="welcome-meta"><el-icon><Clock /></el-icon>登录时间：{{ user.loginTime || nowText }}</p>
          <p class="welcome-meta"><el-icon><Position /></el-icon>登录 IP：{{ user.loginIp || '10.208.36.72' }}</p>
        </div>
      </div>
      <div class="gov-card quick-card">
        <p class="quick-card-title">快捷操作</p>
        <div class="quick-items">
          <div v-for="q in quickActions" :key="q.label" class="quick-item" @click="onQuick(q)">
            <span class="quick-icon" :style="{ background: q.bg, color: q.color }">
              <el-icon :size="18"><component :is="q.icon" /></el-icon>
            </span>
            <span class="quick-label">{{ q.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二行：AI 找数 -->
    <div class="gov-card ai-card">
      <div class="ai-head">
        <span class="ai-robot"><el-icon :size="18"><MagicStick /></el-icon></span>
        <span class="ai-title">AI 找数</span>
        <span class="ai-sub">通过自然语言语义识别，快速定位所需数据目录</span>
      </div>
      <div class="ai-search">
        <el-icon class="ai-search-icon"><Search /></el-icon>
        <input
          v-model="keyword"
          class="ai-input"
          placeholder="搜索数据目录、数据产品、应用场景或直接描述需求"
          @keyup.enter="doSearch()"
        />
        <button class="ai-btn" @click="doSearch()">搜索</button>
      </div>
      <div class="ai-hot">
        <span class="ai-hot-label">热门目录：</span>
        <span v-for="t in hotTags" :key="t.name" class="ai-hot-tag" @click="doSearch(t.name)">
          {{ t.name }}<em>{{ t.clicks }}</em>
        </span>
        <span class="ai-hot-more" @click="router.push('/zone/data-resource')">全部目录 &gt;</span>
      </div>
    </div>

    <!-- 第三行：通知公告 / 消息提醒 / 待办事项 -->
    <div class="gov-card tab-card">
      <div class="tab-head">
        <span
          v-for="t in ['通知公告', '消息提醒', '待办事项']"
          :key="t"
          class="tab-item"
          :class="{ active: activeTab === t }"
          @click="activeTab = t"
        >{{ t }}</span>
      </div>

      <!-- 待办事项：类型筛选 + 单据表格 -->
      <template v-if="activeTab === '待办事项'">
        <div class="todo-filters">
          <span
            v-for="f in ['全部', '服务单', '需求单', '工单', '三清单', '其他类型']"
            :key="f"
            class="todo-pill"
            :class="{ active: todoType === f }"
            @click="todoType = f"
          >{{ f }}</span>
        </div>
        <el-table :data="filteredTodos" :show-header="true">
          <el-table-column prop="id" label="工单编号" min-width="200" />
          <el-table-column prop="type" label="工单类型" min-width="140" />
          <el-table-column prop="submitter" label="提交人" min-width="140" />
          <el-table-column prop="time" label="提交时间" min-width="170" />
          <el-table-column label="状态" min-width="110">
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)" size="small" effect="light">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="viewTodo(row)">{{ row.status === '已完成' ? '查看日志' : '详情' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 通知公告 -->
      <div v-else-if="activeTab === '通知公告'" class="notice-list">
        <div v-for="n in notices" :key="n.id" class="notice-row" @click="router.push(`/notice/${n.id}`)">
          <el-tag size="small" :type="n.type === '政策公告' ? 'warning' : 'primary'" effect="plain">{{ n.type }}</el-tag>
          <span class="notice-title">{{ n.title }}</span>
          <span class="notice-date">{{ n.date }}</span>
        </div>
      </div>

      <!-- 消息提醒 -->
      <div v-else class="notice-list">
        <div v-for="m in myMessages" :key="m.id" class="notice-row" @click="ElMessage.info('消息详情建设中')">
          <el-badge :is-dot="!m.read"><el-tag size="small" effect="plain">{{ m.type }}</el-tag></el-badge>
          <span class="notice-title">{{ m.title }}</span>
          <span class="notice-date">{{ m.time }}</span>
        </div>
      </div>
    </div>

    <!-- 第四行：数据看板 -->
    <div class="gov-card board-card">
      <div class="tab-head">
        <span
          v-for="b in boardTabs"
          :key="b.key"
          class="tab-item"
          :class="{ active: activeBoard === b.key }"
          @click="activeBoard = b.key"
        >{{ b.label }}</span>
        <div class="spacer"></div>
        <el-select v-if="activeBoard === 'fusion'" v-model="boardRange" size="small" style="width: 116px">
          <el-option label="最近6个月" value="6m" />
          <el-option label="最近12个月" value="12m" />
          <el-option label="本年度" value="year" />
        </el-select>
        <!-- 用数/供数全局时间筛选 -->
        <div v-else class="ds-range">
          <span
            v-for="r in ['全部', '本年度', '当月']"
            :key="r"
            class="ds-range-item"
            :class="{ active: dsRange === r }"
            @click="dsRange = r"
          >{{ r }}</span>
        </div>
      </div>

      <!-- 数据融合：总量指标 + 五级库柱状图 -->
      <template v-if="activeBoard === 'fusion'">
        <div class="board-summary">
          <p class="board-summary-label">{{ board.label }}</p>
          <div class="board-summary-num">
            <span class="board-total"><CountUp :value="board.total" />{{ board.unit }}</span>
            <span class="board-growth"><el-icon><TopRight /></el-icon>{{ board.growth }}% 环比增长</span>
          </div>
        </div>
        <VChart :option="boardOption" height="330px" />
      </template>

      <!-- 用数情况 / 供数情况：统计 + TOP5 + 清单 -->
      <template v-else>
        <div class="ds-stats-row">
          <div class="ds-panel">
            <div class="ds-panel-head"><span class="ds-panel-title">本单位资源统计</span></div>
            <div class="ds-metrics">
              <div v-for="m in wbOrgStats" :key="m.label" class="ds-metric">
                <p class="ds-metric-label">{{ m.label }}</p>
                <p class="ds-metric-value">{{ m.value }}<em>{{ m.unit }}</em></p>
              </div>
            </div>
          </div>
          <div class="ds-panel">
            <div class="ds-panel-head">
              <span class="ds-panel-title">{{ isUsage ? '用数统计' : '供数统计' }}</span>
            </div>
            <div class="ds-metrics">
              <div v-for="m in dsBoard.stats" :key="m.label" class="ds-metric">
                <p class="ds-metric-label">{{ m.label }}</p>
                <p class="ds-metric-value">{{ m.value }}<em>{{ m.unit }}</em></p>
              </div>
            </div>
          </div>
        </div>

        <h3 class="ds-section-title">{{ isUsage ? '用数TOP5' : '供数TOP5' }}</h3>
        <el-table :data="dsBoard.top5">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="name" label="数据目录名称" min-width="220" />
          <el-table-column prop="code" label="数据目录代码" min-width="180" />
          <el-table-column v-if="isUsage" prop="dept" label="职责部门" min-width="170" />
          <el-table-column v-else prop="shareType" label="共享类型" min-width="170" />
          <el-table-column prop="count" :label="isUsage ? '用数次数' : '共享次数'" width="110" />
        </el-table>

        <h3 class="ds-section-title">{{ isUsage ? '用数清单' : '供数清单' }}</h3>
        <div class="ds-filters">
          <template v-if="isUsage">
            <span class="ds-filter-label">需求单号</span>
            <el-input v-model="dsFilter.kw1" placeholder="请输入" style="width: 130px" />
            <span class="ds-filter-label">需求部门</span>
            <el-input v-model="dsFilter.kw2" placeholder="请输入" style="width: 130px" />
            <span class="ds-filter-label">责任类型</span>
            <el-select v-model="dsFilter.type" style="width: 100px"><el-option label="全部" value="全部" /></el-select>
            <span class="ds-filter-label">状态</span>
            <el-select v-model="dsFilter.status" style="width: 100px"><el-option label="全部" value="全部" /></el-select>
          </template>
          <template v-else>
            <span class="ds-filter-label">数据目录代码</span>
            <el-input v-model="dsFilter.kw1" placeholder="请输入" style="width: 140px" />
            <span class="ds-filter-label">数据目录名称</span>
            <el-input v-model="dsFilter.kw2" placeholder="请输入" style="width: 140px" />
            <span class="ds-filter-label">共享类型</span>
            <el-select v-model="dsFilter.type" style="width: 110px"><el-option label="全部" value="全部" /></el-select>
          </template>
          <span class="ds-filter-label">选择月份区间</span>
          <el-select v-model="dsFilter.month" placeholder="请选择" clearable style="width: 120px">
            <el-option v-for="mo in ['2026-05', '2026-06', '2026-07']" :key="mo" :label="mo" :value="mo" />
          </el-select>
          <div class="spacer"></div>
          <el-button type="primary" @click="ElMessage.success('筛选内容已导出')">导出筛选内容</el-button>
          <el-button type="primary" @click="ElMessage.success('查询完成')"><el-icon style="margin-right: 4px"><Search /></el-icon>查询</el-button>
          <el-button @click="dsReset"><el-icon style="margin-right: 4px"><Refresh /></el-icon>重置</el-button>
        </div>

        <el-table v-if="isUsage" :data="dsBoard.list">
          <el-table-column type="index" label="序号" width="64" />
          <el-table-column prop="orderNo" label="需求单号" min-width="160" />
          <el-table-column prop="demandDept" label="需求部门" min-width="180" />
          <el-table-column prop="dutyDept" label="责任部门" min-width="150" />
          <el-table-column prop="dutyType" label="责任类型" min-width="120" />
          <el-table-column prop="catalog" label="数据目录名称" min-width="130" />
          <el-table-column prop="catalogType" label="目录类型" min-width="100" />
          <el-table-column prop="resource" label="资源名称" min-width="160" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }"><el-tag size="small" effect="light">{{ row.status }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="expire" label="到期时间" min-width="120" />
          <el-table-column label="操作" width="70" align="right">
            <template #default><el-button link type="primary" @click="ElMessage.info('详情页建设中')">详情</el-button></template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="dsBoard.list">
          <el-table-column type="index" label="序号" width="64" />
          <el-table-column prop="code" label="数据目录代码" min-width="160" />
          <el-table-column prop="name" label="数据目录名称" min-width="200" />
          <el-table-column prop="items" label="数据项" min-width="250" show-overflow-tooltip />
          <el-table-column prop="shareType" label="共享类型" min-width="110" />
          <el-table-column label="目录状态" width="100">
            <template #default="{ row }"><el-tag size="small" type="warning" effect="light">{{ row.pubStatus }}</el-tag></template>
          </el-table-column>
          <el-table-column label="目录状态" width="100">
            <template #default="{ row }"><el-tag size="small" effect="light">{{ row.linkStatus }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="count" label="共享次数" width="100" />
          <el-table-column label="操作" width="70" align="right">
            <template #default><el-button link type="primary" @click="ElMessage.info('详情页建设中')">详情</el-button></template>
          </el-table-column>
        </el-table>
        <div class="ds-pager">
          <el-pagination v-model:current-page="dsPage" background layout="prev, pager, next" :total="50" :page-size="10" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CountUp from '@/components/CountUp.vue'
import VChart from '@/components/VChart.vue'
import { useUserStore } from '@/store/user'
import { notices, myMessages, unifiedTodos, wbBoard, wbOrgStats, wbUsageBoard, wbSupplyBoard } from '@/mock'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

// 当前工作台标识与名称（从匹配路由 meta 派生，四类工作台共用本页）
const workbench = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i--) {
    if (route.matched[i].meta?.workbench) return route.matched[i].meta.workbench
  }
  return 'commission'
})
const base = computed(() => `/workbench/${workbench.value}`)
const wbName = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i--) {
    if (route.matched[i].meta?.wbName) return route.matched[i].meta.wbName
  }
  return '委办工作台'
})

const nowText = new Date().toLocaleString('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
}).replace(/\//g, '-')

/* ---------- 快捷操作 ---------- */
const quickActions = computed(() => [
  { label: '供需对接', icon: 'Switch', bg: '#fff3e5', color: '#f2711c', path: `${base.value}/operation` },
  { label: '账号申请', icon: 'UserFilled', bg: '#e8f8ee', color: '#22a35c', path: '' },
  { label: '接口上限调整', icon: 'TrendCharts', bg: '#e8f2fd', color: '#2563c9', path: `${base.value}/ops` },
  { label: '白名单管理', icon: 'CircleCheck', bg: '#f1edfc', color: '#7c5cd6', path: `${base.value}/resource` }
])
function onQuick(q) {
  if (q.path) router.push(q.path)
  else ElMessage.info(`「${q.label}」流程已发起，请在统一待办中跟踪进度`)
}

/* ---------- AI 找数 ---------- */
const keyword = ref('')
// 热门目录（与设计稿一致的短目录名 + 检索热度）
const hotTags = [
  { name: '人口基础信息', clicks: '2.3w次' },
  { name: '法人单位信息', clicks: '1.8w次' },
  { name: '自然资源信息', clicks: '1.5w次' },
  { name: '宏观经济数据', clicks: '1.2w次' },
  { name: '社会保障信息', clicks: '0.9w次' }
]
function doSearch(tag) {
  const kw = tag || keyword.value.trim()
  if (!kw) {
    ElMessage.warning('请输入检索关键词或需求描述')
    return
  }
  router.push({ path: '/zone/data-resource', query: { kw } })
}

/* ---------- 待办 / 公告 / 消息 页签 ---------- */
const activeTab = ref('待办事项')
const todoType = ref('全部')
const filteredTodos = computed(() =>
  todoType.value === '全部' ? unifiedTodos.slice(0, 4) : unifiedTodos.filter((t) => t.type === todoType.value)
)
function statusType(s) {
  return { 待处理: 'warning', 处理中: 'primary', 已完成: 'success' }[s]
}
function viewTodo(row) {
  if (row.status === '已完成') ElMessage.info(`「${row.id}」处理日志加载中`)
  else router.push(`${base.value}/todo`)
}

/* ---------- 数据看板 ---------- */
const boardTabs = [
  { key: 'usage', label: '用数情况' },
  { key: 'supply', label: '供数情况' },
  { key: 'fusion', label: '数据融合' }
]
const activeBoard = ref('usage')
const boardRange = ref('6m')
const board = computed(() => wbBoard[activeBoard.value])

/* 用数 / 供数页签：统计 + TOP5 + 清单 */
const isUsage = computed(() => activeBoard.value === 'usage')
const dsBoard = computed(() => (isUsage.value ? wbUsageBoard : wbSupplyBoard))
const dsRange = ref('当月')
const dsPage = ref(1)
const dsFilter = reactive({ kw1: '', kw2: '', type: '全部', status: '全部', month: '' })
function dsReset() {
  Object.assign(dsFilter, { kw1: '', kw2: '', type: '全部', status: '全部', month: '' })
  ElMessage.success('筛选条件已重置')
}

const boardOption = computed(() => ({
  grid: { left: 50, right: 24, top: 30, bottom: 40 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: {
    type: 'category',
    data: board.value.categories,
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#dce3ed' } },
    axisLabel: { color: '#8492a6' }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#eef1f6' } },
    axisLabel: { color: '#8492a6' }
  },
  series: [{
    type: 'bar',
    data: board.value.values,
    barWidth: 56,
    itemStyle: { color: '#6d7cf5', borderRadius: [3, 3, 0, 0] }
  }]
}))
</script>

<style scoped>
.cwb-home { display: flex; flex-direction: column; gap: 16px; }

/* ---------- 欢迎行 ---------- */
.welcome-row { display: grid; grid-template-columns: 380px 1fr; gap: 16px; }
.welcome-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(120deg, var(--gov-blue) 0%, var(--gov-blue-light) 55%, #3a7bd5 100%);
  border: none;
}
/* 装饰光晕 */
.welcome-card::before,
.welcome-card::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  pointer-events: none;
}
.welcome-card::before { width: 160px; height: 160px; right: -46px; top: -60px; }
.welcome-card::after { width: 90px; height: 90px; right: 70px; bottom: -46px; background: rgba(255, 255, 255, 0.08); }
.welcome-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  animation: cwbFloat 3.2s ease-in-out infinite;
}
@keyframes cwbFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.welcome-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 6px; position: relative; z-index: 1; }
.welcome-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.9;
  position: relative;
  z-index: 1;
}
.quick-card { display: flex; flex-direction: column; padding: 14px 16px 12px; }
.quick-card-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
.quick-items { flex: 1; display: flex; align-items: stretch; gap: 10px; }
.quick-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
}
/* 悬停时从底部漫入的浅色渐变 */
.quick-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(26, 79, 156, 0.06) 100%);
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}
.quick-item:hover { border-color: var(--gov-blue); box-shadow: 0 8px 20px rgba(26, 79, 156, 0.16); transform: translateY(-3px); }
.quick-item:hover::before { opacity: 1; }
.quick-item:hover .quick-icon { transform: scale(1.12) rotate(-4deg); }
.quick-item:active { transform: translateY(-1px) scale(0.98); }
.quick-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.quick-label { font-size: 14.5px; font-weight: 600; color: var(--text-primary); position: relative; z-index: 1; }

/* ---------- AI 找数 ---------- */
.ai-card { padding: 20px 26px 18px; }
.ai-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.ai-robot {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--gov-blue) 0%, #4b8ce0 100%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
/* 机器人脉冲光圈 */
.ai-robot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 2px solid var(--gov-blue);
  opacity: 0;
  animation: cwbPulse 2.4s ease-out infinite;
}
@keyframes cwbPulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
}
.ai-title { font-size: 17px; font-weight: 700; color: var(--text-primary); }
.ai-sub { font-size: 12.5px; color: var(--text-secondary); }
.ai-search {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding-left: 14px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ai-search:focus-within { border-color: var(--gov-blue); box-shadow: 0 0 0 3px rgba(26, 79, 156, 0.12); }
.ai-search-icon { color: var(--text-secondary); transition: color 0.2s; }
.ai-search:focus-within .ai-search-icon { color: var(--gov-blue); }
.ai-input { flex: 1; border: none; outline: none; height: 44px; padding: 0 12px; font-size: 14px; color: var(--text-primary); }
.ai-btn {
  height: 44px;
  padding: 0 30px;
  border: none;
  background: linear-gradient(135deg, var(--gov-blue) 0%, #4b8ce0 100%);
  color: #fff;
  font-size: 14.5px;
  cursor: pointer;
  transition: filter 0.2s, box-shadow 0.2s;
}
.ai-btn:hover { filter: brightness(1.08); box-shadow: 0 4px 14px rgba(26, 79, 156, 0.35); }
.ai-btn:active { filter: brightness(0.95); }
.ai-hot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 13px; }
.ai-hot-label { font-size: 13px; color: var(--text-secondary); }
.ai-hot-tag {
  font-size: 12.5px;
  color: var(--text-regular);
  background: #f4f6fa;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 4px 12px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.ai-hot-tag:hover {
  color: #fff;
  border-color: var(--gov-blue);
  background: var(--gov-blue);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 79, 156, 0.28);
}
.ai-hot-tag:hover em { color: rgba(255, 255, 255, 0.8); }
.ai-hot-tag:active { transform: translateY(0); }
.ai-hot-tag em { font-style: normal; color: var(--text-secondary); margin-left: 6px; font-size: 11.5px; transition: color 0.2s; }
.ai-hot-more { font-size: 12.5px; color: var(--gov-blue); cursor: pointer; transition: opacity 0.2s; }
.ai-hot-more:hover { opacity: 0.7; }

/* ---------- 页签卡 ---------- */
.tab-card { padding: 6px 26px 20px; }
.tab-head { display: flex; align-items: center; gap: 32px; border-bottom: 1px solid var(--border-color); }
.tab-item {
  position: relative;
  padding: 15px 2px;
  font-size: 15px;
  color: var(--text-regular);
  cursor: pointer;
}
.tab-item:hover { color: var(--gov-blue); }
.tab-item.active { color: var(--gov-blue); font-weight: 700; }
.tab-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  border-radius: 2px;
  background: var(--gov-blue);
}
.tab-head .spacer { flex: 1; }

.todo-filters { display: flex; gap: 10px; margin: 16px 0 6px; }
.todo-pill {
  font-size: 12.5px;
  padding: 5px 14px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s;
}
.todo-pill:hover { color: var(--gov-blue); border-color: var(--gov-blue); }
.todo-pill.active { background: var(--gov-blue); border-color: var(--gov-blue); color: #fff; }

.notice-list { padding-top: 10px; }
.notice-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 4px;
  border-bottom: 1px dashed var(--border-color);
  cursor: pointer;
}
.notice-row:last-child { border-bottom: none; }
.notice-row:hover .notice-title { color: var(--gov-blue); }
.notice-title {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}
.notice-date { font-size: 12.5px; color: var(--text-secondary); flex-shrink: 0; }

/* ---------- 数据看板 ---------- */
.board-card { padding: 6px 26px 16px; }
.board-summary {
  display: inline-block;
  margin: 18px 0 6px;
  padding: 14px 22px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #fafbfd;
}
.board-summary-label { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 6px; }
.board-summary-num { display: flex; align-items: center; gap: 12px; }
.board-total { font-size: 26px; font-weight: 700; color: var(--text-primary); }
.board-growth {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #16a34a;
  background: #e8f8ee;
  border-radius: 4px;
  padding: 3px 8px;
}

/* ---------- 用数 / 供数看板 ---------- */
.ds-stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0 4px; }
.ds-panel {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: linear-gradient(180deg, #fbfcfe 0%, #f5f8fc 100%);
  padding: 16px 18px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.ds-panel:hover { box-shadow: 0 6px 18px rgba(26, 79, 156, 0.1); transform: translateY(-2px); }
.ds-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.ds-panel-title { font-size: 15px; font-weight: 700; color: var(--text-primary); display: inline-flex; align-items: center; gap: 8px; }
.ds-panel-title::before { content: ''; width: 4px; height: 15px; border-radius: 2px; background: linear-gradient(180deg, var(--gov-blue), #4b8ce0); }
.ds-range { display: inline-flex; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; background: #fff; }
.ds-range-item {
  padding: 3px 12px;
  font-size: 12.5px;
  color: var(--text-regular);
  cursor: pointer;
  border-right: 1px solid var(--border-color);
  transition: background 0.2s, color 0.2s;
}
.ds-range-item:last-child { border-right: none; }
.ds-range-item:hover { color: var(--gov-blue); }
.ds-range-item.active { background: var(--gov-blue); color: #fff; }
.ds-range-item.active:hover { color: #fff; }
.ds-metrics { display: flex; flex-wrap: nowrap; gap: 10px; }
.ds-metric { flex: 1 1 0; min-width: 0; border-radius: 8px; padding: 6px 8px; transition: background 0.2s, transform 0.2s; }
.ds-metric:hover { background: rgba(26, 79, 156, 0.06); transform: translateY(-2px); }
.ds-metric-label { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ds-metric-value { font-size: 20px; font-weight: 700; color: var(--gov-blue); white-space: nowrap; }
.ds-metric-value em { font-style: normal; font-size: 12px; font-weight: 400; color: var(--text-secondary); margin-left: 3px; }

.ds-section-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 22px 0 12px; display: flex; align-items: center; gap: 9px; }
.ds-section-title::before { content: ''; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, var(--gov-blue), #4b8ce0); }
.ds-filters { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; margin-bottom: 14px; }
.ds-filters .spacer { flex: 1; }
.ds-filter-label { font-size: 13px; color: var(--text-regular); white-space: nowrap; }
.ds-pager { display: flex; justify-content: flex-end; margin-top: 16px; }

/* ---------- 卡片错落入场动效 ---------- */
@keyframes cwbFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.cwb-home > .welcome-row,
.cwb-home > .gov-card { animation: cwbFadeUp 0.5s ease both; }
.cwb-home > .welcome-row { animation-delay: 0.02s; }
.cwb-home > .ai-card { animation-delay: 0.1s; }
.cwb-home > .tab-card { animation-delay: 0.18s; }
.cwb-home > .board-card { animation-delay: 0.26s; }
</style>
