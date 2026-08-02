<template>
  <div class="home-page">
    <!-- 首屏横幅：主视觉 + AI 搜索 + 核心指标带 -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">上海市大数据资源平台</h1>

        <!-- 创意字体标语 -->
        <p class="ai-slogan">
          <el-icon class="ai-slogan-icon"><MagicStick /></el-icon>
          <span class="ai-slogan-text">AI 找数新体验～</span>
          <span class="ai-slogan-spark" aria-hidden="true">✦</span>
        </p>

        <!-- AI 智能搜索 -->
        <div class="search-wrap">
          <div class="hero-search">
            <el-icon class="search-prefix"><Search /></el-icon>
            <input
              v-model="keyword"
              class="search-input"
              :placeholder="`搜索 “${searchHints[hintIndex]}”`"
              @focus="openPanel"
              @keyup.enter="doSearch()"
            />
            <button class="search-btn" @click="doSearch()">搜索</button>
            <div class="ai-btn" title="AI 智能找数" @click="doSearch(true)">
              <el-icon><MagicStick /></el-icon>
            </div>
          </div>

          <!-- 搜索历史 + 猜你感兴趣 弹层 -->
          <transition name="el-zoom-in-top">
            <div v-show="panelVisible" class="search-panel">
              <div class="panel-sec">
                <div class="panel-sec-head">
                  <h4>搜索历史</h4>
                  <el-icon v-if="searchHistory.length" class="panel-action" title="清空搜索历史" @click="clearHistory"><Delete /></el-icon>
                </div>
                <div v-if="searchHistory.length" class="history-tags">
                  <span v-for="h in searchHistory" :key="h" class="history-tag" @click="doSearch(false, h)">{{ h }}</span>
                </div>
                <p v-else class="panel-empty">暂无搜索历史</p>
              </div>
              <div class="panel-sec">
                <div class="panel-sec-head">
                  <h4>您可能感兴趣的是</h4>
                  <el-icon class="panel-action" title="换一批" @click="shuffleRecommends"><Refresh /></el-icon>
                </div>
                <div class="recommend-list" :key="recommendBatch">
                  <span v-for="r in recommends" :key="r" class="recommend-item" @click="doSearch(false, r)">{{ r }}</span>
                </div>
              </div>
              <div class="panel-foot">
                <span>您是否满意本次推荐结果？</span>
                <span class="rate-btn" title="满意" @click="rateRecommend(true)">👍</span>
                <span class="rate-btn" title="不满意" @click="rateRecommend(false)">👎</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- 热门目录 TOP3（一行）+ 最新目录 3 条 -->
        <div class="hot-tags">
          <div class="hot-row">
            <span class="hot-label">热门目录</span>
            <span v-for="t in hotTop3" :key="t.name" class="hot-tag" @click="doSearch(false, t.name)">
              {{ t.name }}<em class="hot-clicks" :key="t.clicks">{{ t.clicks }}</em>
            </span>
          </div>
          <div class="hot-row">
            <span class="hot-label hot-label--new">最新目录</span>
            <span v-for="c in latestCatalogs" :key="c.id" class="hot-tag" @click="doSearch(false, c.name)">
              {{ c.name }}<em class="new-badge">NEW</em>
            </span>
          </div>
        </div>
      </div>

      <!-- 指标带 -->
      <div class="hero-stats">
        <div class="stats-inner">
          <div v-for="s in liveStats" :key="s.label" class="stat-item" @click="$router.push('/stats')">
            <p class="stat-value">
              <CountUp :value="s.value" :decimals="s.decimals || 0" /><span class="stat-unit">{{ s.unit }}</span>
            </p>
            <p class="stat-label">{{ s.label }}</p>
          </div>
          <el-button type="primary" round class="demand-btn" @click="goDemand">
            <el-icon style="margin-right: 4px"><Plus /></el-icon>需求对接
          </el-button>
        </div>
      </div>
    </section>

    <!-- 01 数据资源专区 -->
    <section class="block">
      <div class="block-inner">
        <!-- 通知公告播报条 -->
        <div class="notice-strip gov-card">
          <span class="notice-strip-label">
            <i class="notice-strip-icon"><el-icon><BellFilled /></el-icon></i>
            通知<em>公告</em>
          </span>
          <el-carousel height="26px" direction="vertical" :interval="4000" indicator-position="none" class="notice-carousel">
            <el-carousel-item v-for="n in notices" :key="n.id">
              <p class="notice-line" @click="$router.push(`/notice/${n.id}`)">
                <el-tag size="small" :type="n.type === '政策公告' ? 'warning' : 'primary'" effect="plain">{{ n.type }}</el-tag>
                <span class="notice-line-title">{{ n.title }}</span>
                <span class="notice-line-date">{{ n.date }}</span>
              </p>
            </el-carousel-item>
          </el-carousel>
          <span class="block-more" @click="scrollToNotices">更多 →</span>
        </div>

        <div class="block-head">
          <div class="block-title-wrap">
            <h2 class="block-title">数据资源专区</h2>
            <p class="block-sub"><i class="block-no">01</i>法人、自然人基础库数据成果及重点应用场景</p>
          </div>
          <span class="block-more" @click="$router.push('/zone/data-resource')">进入资源中心 →</span>
        </div>

        <div class="lib-grid">
          <!-- 法人基础库 -->
          <div class="lib-card gov-card">
            <div class="lib-head">
              <div class="lib-icon" style="background: #e8f0fc; color: #2563c9"><el-icon><OfficeBuilding /></el-icon></div>
              <div class="lib-name">
                <h3>{{ legalLib.name }}</h3>
                <p>{{ legalLib.en }}</p>
              </div>
              <p class="lib-total">
                <CountUp :value="legalLib.total" :decimals="2" /><span class="lib-unit">{{ legalLib.unit }}</span>
              </p>
            </div>
            <div class="theme-row">
              <div
                v-for="t in legalLib.themes"
                :key="t.name"
                class="theme-cell"
                :class="{ 'theme-cell--active': t.name === activeLegalTheme }"
                @click="activeLegalTheme = t.name"
              >
                <h4>{{ t.name }}</h4>
                <p v-for="l in t.lines" :key="l">{{ l }}</p>
              </div>
            </div>
            <div class="scene-block">
              <p class="scene-title">重点应用场景 · {{ activeLegalTheme }}</p>
              <div class="scene-grid" :key="activeLegalTheme">
                <div v-for="s in legalScenes" :key="s.name" class="scene-cell">
                  <span class="scene-name">• {{ s.name }}</span>
                  <span class="scene-value" :key="s.value">{{ s.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 自然人基础库 -->
          <div class="lib-card gov-card">
            <div class="lib-head">
              <div class="lib-icon" style="background: #e6f7f2; color: #0f9d76"><el-icon><UserFilled /></el-icon></div>
              <div class="lib-name">
                <h3>{{ naturalLib.name }}</h3>
                <p>{{ naturalLib.en }}</p>
              </div>
              <div class="lib-total-wrap">
                <p class="lib-total lib-total--green">
                  <CountUp :value="naturalLib.total" :decimals="2" /><span class="lib-unit">{{ naturalLib.unit }}</span>
                </p>
                <p class="lib-total-sub">{{ naturalLib.sub }}</p>
              </div>
            </div>
            <div class="theme-row">
              <div
                v-for="t in naturalLib.themes"
                :key="t.name"
                class="theme-cell"
                :class="{ 'theme-cell--active': t.name === activeNatTheme }"
                @click="activeNatTheme = t.name"
              >
                <h4>{{ t.name }}</h4>
                <p v-for="l in t.lines" :key="l">{{ l }}</p>
              </div>
            </div>
            <div class="scene-block">
              <p class="scene-title">应用场景调用 TOP 6 · {{ activeNatTheme }}</p>
              <div class="top-grid" :key="activeNatTheme">
                <div v-for="(s, i) in natTopScenes" :key="s.name" class="top-cell">
                  <span class="top-name">{{ i + 1 }}. {{ s.name }}</span>
                  <span class="scene-value" :key="s.value">{{ s.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 02 数据产品专区 -->
    <section class="block block--gray">
      <div class="block-inner">
        <div class="block-head">
          <div class="block-title-wrap">
            <h2 class="block-title">数据产品专区</h2>
            <p class="block-sub"><i class="block-no">02</i>覆盖各单位、各行业的高频数据产品服务，支持按需申请使用</p>
          </div>
          <span class="block-more" @click="$router.push('/zone/data-product')">产品服务市场 →</span>
        </div>

        <div class="industry-grid">
          <div
            v-for="ind in industries"
            :key="ind.key"
            class="industry-card gov-card gov-card--hover"
            :style="{ '--ind-color': ind.color }"
          >
            <div class="industry-head">
              <div class="lib-icon" :style="{ background: ind.color + '1a', color: ind.color }">
                <el-icon><component :is="ind.icon" /></el-icon>
              </div>
              <div class="lib-name">
                <h3>{{ ind.name }}</h3>
                <p>{{ ind.en }}</p>
              </div>
              <el-tag size="small" effect="plain" type="primary">TOP 5 调用</el-tag>
            </div>
            <div class="product-list">
              <div v-for="(p, i) in ind.top5" :key="p.name" class="product-row">
                <span class="product-no" :class="{ 'product-no--hot': i < 3 }">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="product-info">
                  <p class="product-name product-name--link" @click="goProduct(p)">{{ p.name }}</p>
                  <p class="product-calls" :key="p.calls">累计调用 {{ p.calls }}</p>
                </div>
                <el-button size="small" plain type="primary" @click="applyProduct(p)">申请使用</el-button>
              </div>
            </div>
            <div class="industry-foot">
              <span class="industry-dept">提供单位：{{ ind.dept }}</span>
              <span class="block-more" @click="$router.push('/zone/data-product')">查看全部产品 →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 03 智能合约专区 -->
    <section class="block">
      <div class="block-inner">
        <div class="block-head">
          <div class="block-title-wrap">
            <h2 class="block-title">智能合约专区</h2>
            <p class="block-sub"><i class="block-no">03</i>以规则驱动数据可信流通，让每一次授权与交易全程可追溯</p>
          </div>
          <span class="block-more" @click="$router.push('/zone/smart-contract')">进入合约中心 →</span>
        </div>

        <div class="contract-grid">
          <!-- 运行态势 -->
          <div class="contract-panel" @click="$router.push('/zone/smart-contract')">
            <p class="panel-en">SMART CONTRACT</p>
            <h3 class="panel-title">智能合约运行态势</h3>
            <div class="panel-metrics">
              <div class="panel-metric">
                <p class="metric-num"><CountUp :value="running.rules" /></p>
                <p class="metric-label">已发布合约规则</p>
                <p class="metric-trend">{{ running.rulesTrend }}</p>
              </div>
              <div class="panel-metric">
                <p class="metric-num"><CountUp :value="running.deals" /></p>
                <p class="metric-label">当日成交合约</p>
                <p class="metric-trend">{{ running.dealsTrend }}</p>
              </div>
            </div>
            <div class="panel-rate">
              <el-progress :percentage="running.rate" :stroke-width="8" color="#4ade80" :show-text="false" />
              <p class="rate-label">合约自动履约率 {{ running.rate }}%</p>
            </div>
          </div>

          <!-- 最新合约成交 -->
          <div class="deal-panel gov-card">
            <div class="deal-head">
              <div>
                <h3 class="deal-title">最新合约成交</h3>
                <p class="deal-sub">今日已完成数据授权交易记录</p>
              </div>
              <span class="block-more" @click="$router.push('/zone/smart-contract')">查看全部 →</span>
            </div>
            <div class="deal-list">
              <div v-for="d in deals" :key="d.name" class="deal-row" @click="$router.push('/zone/smart-contract')">
                <div class="deal-icon"><el-icon><DocumentChecked /></el-icon></div>
                <div class="deal-info">
                  <p class="deal-name">{{ d.name }}</p>
                  <p class="deal-dept">授权单位：{{ d.dept }}</p>
                </div>
                <span class="deal-count" :key="d.count">{{ d.count }} <em>次</em></span>
                <el-tag :type="d.status === '执行中' ? 'success' : 'warning'" size="small">{{ d.status }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 04 通知公告 -->
    <section ref="noticeBlockRef" class="block block--gray">
      <div class="block-inner">
        <div class="block-head">
          <div class="block-title-wrap">
            <h2 class="block-title">通知公告</h2>
            <p class="block-sub"><i class="block-no">04</i>平台动态与政策文件发布，掌握数据要素流通最新进展</p>
          </div>
        </div>

        <div class="notice-grid">
          <div v-for="g in noticeGroups" :key="g.type" class="notice-card gov-card">
            <div class="notice-card-head">
              <div class="lib-icon" :style="{ background: g.color + '1a', color: g.color }">
                <el-icon><component :is="g.icon" /></el-icon>
              </div>
              <h3>{{ g.type }}</h3>
              <el-tag size="small" effect="plain" :type="g.tagType">{{ g.items.length }} 条</el-tag>
            </div>
            <div class="notice-list">
              <div v-for="n in g.items" :key="n.id" class="notice-row" @click="$router.push(`/notice/${n.id}`)">
                <span class="notice-dot"></span>
                <p class="notice-row-title">{{ n.title }}</p>
                <span class="notice-row-date">{{ n.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 右侧快捷边栏：智慧问答 + 消息/待办/客服/文档（支持拖动） -->
    <aside
      class="side-bar"
      :class="{ dragging: sideDragging }"
      :style="sideBarStyle"
    >
      <div class="side-drag-handle" title="按住拖动">
        <span class="drag-dots"></span>
      </div>
      <div class="side-ai" @click="onSideItem('AI 数博士')">
        <div class="side-ai-avatar"><el-icon><ChatDotRound /></el-icon></div>
        <span class="side-ai-label">AI 数博士</span>
      </div>
      <div class="side-card">
        <div class="side-item" @click="onSideItem('消息')">
          <div class="side-icon-wrap">
            <el-icon class="side-icon"><Bell /></el-icon>
            <span v-if="msgCount" class="side-badge">{{ msgCount }}</span>
          </div>
          <span class="side-text">消息</span>
        </div>
        <div class="side-item" @click="onSideItem('待办')">
          <div class="side-icon-wrap">
            <el-icon class="side-icon"><Tickets /></el-icon>
            <span v-if="todoCount" class="side-badge">{{ todoCount }}</span>
          </div>
          <span class="side-text">待办</span>
        </div>
        <div class="side-item" @click="onSideItem('客服')">
          <div class="side-icon-wrap"><el-icon class="side-icon"><Service /></el-icon></div>
          <span class="side-text">客服</span>
        </div>
        <div class="side-item" @click="onSideItem('文档')">
          <div class="side-icon-wrap"><el-icon class="side-icon"><Document /></el-icon></div>
          <span class="side-text">文档</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import CountUp from '@/components/CountUp.vue'
import {
  searchHints, heroStats, hotCatalogTags,
  legalLibrary, naturalLibrary, industryProducts,
  contractRunning, latestDeals, notices, catalogs
} from '@/mock'

const router = useRouter()
const user = useUserStore()
const keyword = ref('')
const hintIndex = ref(0)
let timer = null
let refreshTimer = null

/* ---------- 动态数据：mock 深拷贝为响应式副本，定时小幅增量刷新 ---------- */
const liveStats = reactive(heroStats.map((s) => ({ ...s })))
const legalLib = reactive(JSON.parse(JSON.stringify(legalLibrary)))
const naturalLib = reactive(JSON.parse(JSON.stringify(naturalLibrary)))
const industries = reactive(JSON.parse(JSON.stringify(industryProducts)))
const running = reactive({ ...contractRunning })
const deals = reactive(latestDeals.map((d) => ({ ...d })))
const hotTags = reactive(hotCatalogTags.map((t) => ({ ...t })))

// 热门目录仅取点击量 TOP3，一行展示
const hotTop3 = computed(() => hotTags.slice(0, 3))
// 最新目录：按更新时间降序取 3 条
const latestCatalogs = [...catalogs].sort((a, b) => b.updateTime.localeCompare(a.updateTime)).slice(0, 3)

// 右侧快捷边栏：消息 / 待办数字角标
const msgCount = ref(5)
const todoCount = ref(3)

/* ---------- 右侧边栏拖动 ---------- */
const SIDEBAR_KEY = 'dh_sidebar_pos'
const sideDragging = ref(false)
const sidePos = reactive({ top: null, left: null }) // null 表示使用默认位置
let _dragStart = null

const sideBarStyle = computed(() => {
  if (sidePos.top == null) return {} // 默认位置由 CSS 控制
  return { top: sidePos.top + 'px', left: sidePos.left + 'px', right: 'auto', transform: 'none' }
})

function readSidebarPos() {
  try {
    const raw = localStorage.getItem(SIDEBAR_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (typeof p.top === 'number' && typeof p.left === 'number') {
        sidePos.top = p.top
        sidePos.left = p.left
      }
    }
  } catch (e) { /* ignore */ }
}

function onSidebarMousedown(e) {
  // 仅左键触发；排除按钮/链接上的点击
  if (e.button !== 0) return
  _dragStart = { x: e.clientX, y: e.clientY, moved: false }
  document.addEventListener('mousemove', onSidebarMousemove)
  document.addEventListener('mouseup', onSidebarMouseup)
}

function onSidebarMousemove(e) {
  if (!_dragStart) return
  const dx = e.clientX - _dragStart.x
  const dy = e.clientY - _dragStart.y
  // 超过 4px 阈值才进入拖拽模式，避免误触
  if (!_dragStart.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return
  if (!_dragStart.moved) {
    _dragStart.moved = true
    sideDragging.value = true
    // 首次拖动时，如果还是默认位置，先计算当前实际坐标
    if (sidePos.top == null) {
      const el = document.querySelector('.side-bar')
      const rect = el.getBoundingClientRect()
      sidePos.top = rect.top
      sidePos.left = rect.left
      _dragStart.x = e.clientX
      _dragStart.y = e.clientY
      return
    }
  }
  const newTop = Math.max(0, Math.min(window.innerHeight - 60, sidePos.top + dy))
  const newLeft = Math.max(0, Math.min(window.innerWidth - 76, sidePos.left + dx))
  sidePos.top = newTop
  sidePos.left = newLeft
  _dragStart.x = e.clientX
  _dragStart.y = e.clientY
}

function onSidebarMouseup() {
  document.removeEventListener('mousemove', onSidebarMousemove)
  document.removeEventListener('mouseup', onSidebarMouseup)
  if (_dragStart && _dragStart.moved) {
    sideDragging.value = false
    // 持久化位置
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify({ top: sidePos.top, left: sidePos.left }))
  }
  _dragStart = null
}
function onSideItem(name) {
  if (name === '消息') {
    msgCount.value = 0
    ElMessage.success('已查看全部消息')
  } else if (name === '待办') {
    todoCount.value = 0
    ElMessage.success('已查看全部待办事项')
  } else if (name === 'AI 数博士') {
    ElMessage.success('AI 数博士已就位，请在搜索框描述您的找数需求')
  } else {
    ElMessage.info(`「${name}」功能即将上线，敬请期待`)
  }
}

// 基础库专题选中：点击专题格切换下方应用场景数据
const activeLegalTheme = ref('产业园区专题库')
const legalScenes = computed(() => legalLib.themes.find((t) => t.name === activeLegalTheme.value).scenes)
const activeNatTheme = ref('身故库')
const natTopScenes = computed(() => naturalLib.themes.find((t) => t.name === activeNatTheme.value).topScenes)

const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

// 对「1,286.45 万次」「12.8万」等带格式文本中的首个数字做增量，保留原有千分位与小数位
function bumpText(str, delta) {
  return str.replace(/[\d,]+(\.\d+)?/, (m, dec) => {
    const num = parseFloat(m.replace(/,/g, '')) + delta
    const decimals = dec ? dec.length - 1 : 0
    const formatted = num.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    return m.includes(',') || num < 10000 ? formatted : formatted.replace(/,/g, '')
  })
}

// 周期性刷新首页各板块数据，体现平台实时活力
function refreshData() {
  // 指标带：大数快增、小数慢增
  liveStats.forEach((s) => {
    if (s.decimals) s.value = +(s.value + Math.random() * 0.4 + 0.05).toFixed(2)
    else if (s.value < 1000) s.value += Math.random() < 0.35 ? 1 : 0
    else s.value += randInt(2, 18)
  })
  // 基础库总量与应用场景调用量
  legalLib.total = +(legalLib.total + Math.random() * 0.05).toFixed(2)
  naturalLib.total = +(naturalLib.total + Math.random() * 0.08).toFixed(2)
  legalLib.themes.forEach((t) => t.scenes.forEach((s) => { s.value = bumpText(s.value, +(Math.random() * 0.6).toFixed(2)) }))
  naturalLib.themes.forEach((t) => t.topScenes.forEach((s) => { s.value = bumpText(s.value, +(Math.random() * 0.4).toFixed(2)) }))
  // 行业产品调用量
  industries.forEach((ind) => {
    ind.top5.forEach((p) => { p.calls = bumpText(p.calls, +(Math.random() * 0.9 + 0.1).toFixed(2)) })
  })
  // 合约运行态势
  if (Math.random() < 0.3) running.rules += 1
  running.deals += randInt(3, 15)
  running.rate = +Math.min(99.2, Math.max(98.2, running.rate + (Math.random() - 0.5) * 0.2)).toFixed(1)
  // 最新成交笔数
  deals.forEach((d) => { d.count = bumpText(d.count, randInt(1, 6)) })
  // 热门目录点击量
  hotTags.forEach((t) => { t.clicks = bumpText(t.clicks, +(Math.random() * 0.2).toFixed(1)) })
}

/* ---------- 通知公告 ---------- */
const noticeBlockRef = ref()

// 公告按类型分组：平台通知 / 政策公告 双卡片展示
const noticeGroups = [
  { type: '平台通知', icon: 'Bell', color: '#2563c9', tagType: 'primary', items: notices.filter((n) => n.type === '平台通知') },
  { type: '政策公告', icon: 'Document', color: '#b8860b', tagType: 'warning', items: notices.filter((n) => n.type === '政策公告') }
]

// 播报条「更多」滚动定位到通知公告板块
function scrollToNotices() {
  noticeBlockRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ---------- 搜索面板：搜索历史 + 猜你感兴趣 ---------- */
const HISTORY_KEY = 'datahub_search_history'
const panelVisible = ref(false)
const searchHistory = ref(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'))
const recommendBatch = ref(0)
const recommends = ref([])

// 从全量目录中随机抽取 6 条作为推荐
function shuffleRecommends() {
  recommends.value = [...catalogs].sort(() => Math.random() - 0.5).slice(0, 6).map((c) => c.name)
  recommendBatch.value += 1
}
shuffleRecommends()

function openPanel() {
  panelVisible.value = true
}

// 点击搜索区域以外时收起面板
function onDocClick(e) {
  if (!e.target.closest('.search-wrap')) panelVisible.value = false
}

function pushHistory(kw) {
  const list = searchHistory.value.filter((h) => h !== kw)
  list.unshift(kw)
  searchHistory.value = list.slice(0, 10)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory.value))
}

function clearHistory() {
  searchHistory.value = []
  localStorage.removeItem(HISTORY_KEY)
  ElMessage.success('搜索历史已清空')
}

function rateRecommend(good) {
  panelVisible.value = false
  ElMessage.success(good ? '感谢您的认可，我们会继续优化推荐' : '已收到反馈，将为您调整推荐策略')
}

onMounted(() => {
  // 搜索提示词轮播滚动
  timer = setInterval(() => {
    hintIndex.value = (hintIndex.value + 1) % searchHints.length
  }, 3000)
  // 数据动态刷新
  refreshTimer = setInterval(refreshData, 5000)
  document.addEventListener('click', onDocClick)
  // 恢复边栏拖拽位置
  readSidebarPos()
  const bar = document.querySelector('.side-bar')
  if (bar) bar.addEventListener('mousedown', onSidebarMousedown)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  clearInterval(refreshTimer)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('mousemove', onSidebarMousemove)
  document.removeEventListener('mouseup', onSidebarMouseup)
})

function doSearch(ai = false, tag) {
  const kw = tag || keyword.value.trim() || searchHints[hintIndex.value]
  pushHistory(kw)
  panelVisible.value = false
  if (ai) ElMessage.success(`AI 已理解您的需求：「${kw}」，正在为您匹配数据目录`)
  router.push({ path: '/zone/data-resource', query: { kw } })
}

// 点击产品名进入产品详情页
function goProduct(p) {
  router.push(`/zone/data-product/${p.id}`)
}

function applyProduct(p) {
  ElMessage.success(`「${p.name}」申请已发起，请在详情页完善申请信息`)
  router.push(`/zone/data-product/${p.id}`)
}

function goDemand() {
  // 进入当前用户主工作台的需求提交页；无工作台角色则回个人工作台
  const wb = user.workbenches[0]
  if (wb) {
    router.push(`${wb.path}/demand`)
  } else {
    router.push('/workbench/personal/applications')
  }
}
</script>

<style scoped>
.home-page { background: #f6f8fb; }

/* ---------- 首屏横幅 ---------- */
.hero {
  position: relative;
  background: var(--gov-blue-dark) url('@/assets/login-bg.png') center 30% / cover no-repeat;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(16, 45, 94, 0.55), rgba(16, 45, 94, 0.35));
}
/* 底部白色渐隐，柔化横幅与浅色内容区的分界 */
.hero::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 130px;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(246, 248, 251, 0) 0%, rgba(246, 248, 251, 0.45) 65%, rgba(246, 248, 251, 0.85) 100%);
}
.hero-inner {
  position: relative;
  /* 高于 .hero-stats(z-index:5) 与后续内容区，保证搜索弹层浮在顶层不被遮挡 */
  z-index: 10;
  width: 720px;
  margin: 0 auto;
  padding: 58px 0 42px;
  text-align: center;
  color: #fff;
}
.hero-title { font-size: 34px; font-weight: 700; letter-spacing: 4px; text-shadow: 0 2px 10px rgba(10, 35, 80, 0.4); }

/* 创意字体标语：渐变流光文字 + 魔法棒微动效，置于搜索框左上方 */
.ai-slogan {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  margin: 26px 0 12px 6px;
  text-align: left;
}
.ai-slogan-text {
  font-family: 'FZXiaoBiaoSong-B05S', 'STZhongsong', 'Songti SC', 'SimSun', serif;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 3px;
  background: linear-gradient(100deg, #ffd77a 10%, #fff7e0 35%, #8fd0ff 60%, #ffd77a 90%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: slogan-flow 5s linear infinite;
}
.ai-slogan-icon {
  font-size: 25px;
  color: #ffd77a;
  animation: slogan-swing 2.6s ease-in-out infinite;
  transform-origin: bottom center;
}
.ai-slogan-spark {
  font-size: 14px;
  color: #8fd0ff;
  animation: slogan-twinkle 1.8s ease-in-out infinite;
}
@keyframes slogan-flow {
  0% { background-position: 0% 0; }
  100% { background-position: 220% 0; }
}
@keyframes slogan-swing {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(12deg); }
}
@keyframes slogan-twinkle {
  0%, 100% { opacity: 0.35; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.15); }
}

.search-wrap { position: relative; }

.hero-search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 6px 0 16px;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 23px;
  box-shadow: 0 8px 24px rgba(10, 35, 80, 0.25);
  transition: border-color 0.25s, box-shadow 0.25s;
}
/* 聚焦 / 悬停时金色描边光晕，突出 AI 搜索入口 */
.hero-search:hover,
.hero-search:focus-within {
  border-color: rgba(255, 215, 122, 0.75);
  box-shadow: 0 8px 28px rgba(10, 35, 80, 0.3), 0 0 0 4px rgba(255, 215, 122, 0.18);
}
.search-prefix { color: #9aa8bd; font-size: 17px; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-primary);
  background: transparent;
}
.search-input::placeholder { color: #9aa8bd; }
.search-btn {
  height: 36px;
  padding: 0 26px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(90deg, #2563c9, #3b82f6);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.search-btn:hover { opacity: 0.9; }
.ai-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7c5cd9, #2563c9);
  color: #fff;
  font-size: 17px;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.ai-btn:hover { transform: scale(1.08); }

/* ---------- 搜索历史 + 猜你感兴趣 弹层 ---------- */
.search-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  z-index: 30;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(10, 35, 80, 0.28);
  padding: 18px 20px 12px;
  text-align: left;
}
/* 面板顶部小箭头指向搜索框 */
.search-panel::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  width: 12px;
  height: 12px;
  background: #fff;
  transform: translateX(-50%) rotate(45deg);
  border-radius: 2px;
}
.panel-sec + .panel-sec { margin-top: 16px; }
.panel-sec-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.panel-sec-head h4 { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.panel-action { color: #9aa8bd; font-size: 15px; cursor: pointer; transition: color 0.2s, transform 0.3s; }
.panel-action:hover { color: #2563c9; transform: rotate(-15deg); }
.panel-empty { font-size: 12.5px; color: var(--text-secondary); }
.history-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.history-tag {
  font-size: 13px;
  color: var(--text-primary);
  padding: 5px 14px;
  border: 1px solid var(--border-color);
  border-radius: 15px;
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.history-tag:hover { border-color: #2563c9; color: #2563c9; background: #f4f8fe; }
.recommend-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 16px; animation: num-flash 0.4s ease; }
.recommend-item {
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}
.recommend-item:hover { color: #2563c9; text-decoration: underline; text-underline-offset: 3px; }
.panel-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
  font-size: 12.5px;
  color: var(--text-secondary);
}
.rate-btn { cursor: pointer; font-size: 15px; transition: transform 0.2s; }
.rate-btn:hover { transform: scale(1.25); }

.hot-tags {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.hot-row { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.hot-label {
  font-size: 12.5px;
  padding: 3px 10px;
  border-radius: 3px;
  background: var(--gov-gold);
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}
/* 最新目录标签：蓝色系与金色热门标签区分 */
.hot-label--new { background: #3b82e0; }
.new-badge {
  font-style: normal;
  font-size: 10px;
  margin-left: 5px;
  padding: 0 4px;
  border-radius: 3px;
  background: #ff7043;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.hot-tag {
  font-size: 12px;
  padding: 3px 9px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, border-color 0.2s;
}
.hot-tag:hover { background: rgba(255, 255, 255, 0.3); transform: translateY(-2px); border-color: rgba(255, 215, 122, 0.7); }
.hot-clicks {
  font-style: normal;
  font-size: 11px;
  margin-left: 4px;
  padding-left: 4px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffd77a;
  font-weight: 600;
}

/* 指标带：白色悬浮卡片，下沿压出横幅 */
.hero-stats {
  position: relative;
  z-index: 5;
  width: min(1280px, 94%);
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(13, 42, 90, 0.16);
  overflow: hidden;
  /* 下移半个卡片高度，悬浮压在横幅下沿 */
  transform: translateY(50%);
}
/* 顶部多彩渐变饰条，呼应各板块主题色 */
.hero-stats::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2563c9 0%, #7c5cd9 30%, #0f9d76 60%, var(--gov-gold) 100%);
}
.stats-inner {
  padding: 20px 32px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.stat-item { text-align: center; cursor: pointer; padding: 4px 18px; border-radius: 8px; transition: background 0.2s, transform 0.2s; }
.stat-item + .stat-item { border-left: 1px solid #eef1f6; border-radius: 0 8px 8px 0; }
.stat-item:hover { background: rgba(37, 99, 201, 0.06); transform: translateY(-2px); }
.stat-value { color: var(--gov-blue); font-size: 24px; font-weight: 700; font-family: 'DIN Alternate', 'Helvetica Neue', sans-serif; }
.stat-unit { font-size: 12px; font-weight: 400; color: var(--text-secondary); margin-left: 3px; }
.stat-label { font-size: 12.5px; color: var(--text-secondary); margin-top: 3px; }
.demand-btn { border-radius: 18px; font-weight: 600; }

/* ---------- 通用板块 ---------- */
.block { padding: 44px 0 40px; }
.block--gray { background: #eef2f8; }
/* 为悬浮指标卡片让出重叠空间，并延续蓝白渐变过渡 */
.hero + .block {
  padding-top: 94px;
  background: linear-gradient(180deg, #e6edf8 0%, #eff3fa 120px, #f6f8fb 240px);
}

/* ---------- 通知公告播报条 ---------- */
.notice-strip {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 11px 20px;
  margin-bottom: 34px;
  /* 参考稿暖橙渐变播报条，弱化卡片白底 */
  background: linear-gradient(90deg, #fff3e5 0%, #fffaf3 45%, #fffdfa 100%);
  border: none;
  border-radius: 12px;
}
.notice-strip-label {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 15px;
  font-weight: 700;
  color: #2b3a55;
  flex-shrink: 0;
}
.notice-strip-label em { font-style: normal; color: #f2711c; }
/* 橙色渐变圆形喇叭徽章 */
.notice-strip-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9a3d, #f2711c);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  box-shadow: 0 3px 8px rgba(242, 113, 28, 0.35);
}
/* 铃铛周期摇摆，提示公告更新 */
.notice-strip-icon .el-icon {
  animation: bell-ring 3s ease-in-out infinite;
  transform-origin: top center;
}
@keyframes bell-ring {
  0%, 20%, 100% { transform: rotate(0); }
  4% { transform: rotate(14deg); }
  8% { transform: rotate(-12deg); }
  12% { transform: rotate(8deg); }
  16% { transform: rotate(-6deg); }
}
.notice-carousel { flex: 1; min-width: 0; }
.notice-line {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 26px;
  cursor: pointer;
}
.notice-line-title {
  font-size: 13.5px;
  color: var(--text-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notice-line:hover .notice-line-title { color: var(--gov-blue); }
.notice-line-date { font-size: 12.5px; color: var(--text-secondary); flex-shrink: 0; }

.block-inner { width: min(1280px, 94%); margin: 0 auto; }
.block-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; }
.block-title { font-size: 24px; color: var(--text-primary); letter-spacing: 1px; }
/* 标题下方蓝金渐变饰条 */
.block-title::after {
  content: '';
  display: block;
  width: 46px;
  height: 4px;
  margin-top: 8px;
  border-radius: 2px;
  background: linear-gradient(90deg, #2563c9, var(--gov-gold));
}
.block-sub { margin-top: 8px; font-size: 13.5px; color: var(--text-secondary); display: flex; align-items: center; }
.block-no {
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  margin-right: 10px;
  background: linear-gradient(135deg, #2563c9, #7c5cd9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.block-more { font-size: 13.5px; color: #2563c9; cursor: pointer; font-weight: 600; white-space: nowrap; display: inline-block; transition: transform 0.2s, color 0.2s; }
.block-more:hover { text-decoration: underline; transform: translateX(3px); color: #1a4f9c; }

/* ---------- 数据刷新动效：key 变化重挂载触发淡入上浮 ---------- */
.scene-value, .deal-count, .hot-clicks { display: inline-block; }
.scene-value, .product-calls, .deal-count, .hot-clicks {
  animation: num-flash 0.8s ease;
}
@keyframes num-flash {
  0% { opacity: 0.2; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* ---------- 01 数据资源专区 ---------- */
.lib-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.lib-card { padding: 24px 26px; border-top: 3px solid transparent; display: flex; flex-direction: column; }
/* 法人库蓝 / 自然人库绿主题色饰条，hover 时描边同色呼应 */
.lib-grid .lib-card:first-child { border-top-color: #2563c9; background: linear-gradient(165deg, #e8f1fd 0%, #fff 32%); }
.lib-grid .lib-card:last-child { border-top-color: #0f9d76; background: linear-gradient(165deg, #e3f6ef 0%, #fff 32%); }
.lib-grid .lib-card:first-child:hover { box-shadow: 0 12px 32px rgba(37, 99, 201, 0.18); }
.lib-grid .lib-card:last-child:hover { box-shadow: 0 12px 32px rgba(15, 157, 118, 0.18); }
/* min-height 拉平两卡片头部（自然人库多一行副标题），保证下方专题格与场景区水平对齐 */
.lib-head { display: flex; align-items: center; gap: 14px; min-height: 80px; padding-bottom: 18px; border-bottom: 1px solid var(--border-color); }
.lib-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  transition: transform 0.3s;
}
/* 卡片悬停时图标轻微放大旋转，增强互动感 */
.lib-card:hover .lib-icon,
.industry-card:hover .lib-icon,
.notice-card:hover .lib-icon { transform: scale(1.12) rotate(-6deg); }
.lib-name { flex: 1; }
.lib-name h3 { font-size: 18px; color: var(--text-primary); }
.lib-name p { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.5px; margin-top: 3px; }
.lib-total { font-size: 30px; font-weight: 700; color: #2563c9; white-space: nowrap; }
.lib-total--green { color: #0f9d76; }
.lib-unit { font-size: 14px; font-weight: 600; margin-left: 3px; }
.lib-total-wrap { text-align: right; }
.lib-total-sub { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.theme-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0; }
.theme-cell {
  padding: 14px 14px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.theme-cell:hover { border-color: #2563c9; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(37, 99, 201, 0.1); }
/* 选中态按图块位置着色：浅蓝 / 浅红 / 浅黄，背景加深便于识别 */
.theme-cell:nth-child(1).theme-cell--active { background: #d6e6fa; border-color: #7fabe3; }
.theme-cell:nth-child(1).theme-cell--active h4 { color: #1a4f9c; }
.theme-cell:nth-child(2).theme-cell--active { background: #fbdfda; border-color: #eba9a1; }
.theme-cell:nth-child(2).theme-cell--active h4 { color: #c0392b; }
.theme-cell:nth-child(3).theme-cell--active { background: #fcf0cd; border-color: #e3c26a; }
.theme-cell:nth-child(3).theme-cell--active h4 { color: #a8720a; }
.theme-cell h4 { font-size: 14px; color: var(--text-primary); margin-bottom: 8px; }
.theme-cell p { font-size: 12px; color: var(--text-secondary); line-height: 1.8; }

.scene-block { border-top: 1px dashed var(--border-color); padding-top: 14px; flex: 1; }
.scene-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  padding-left: 8px;
  border-left: 3px solid transparent;
  border-image: linear-gradient(180deg, #2563c9, var(--gov-gold)) 1;
  margin-bottom: 12px;
}
.scene-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; animation: num-flash 0.5s ease; }
.scene-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(90deg, #f2f6fc, #f6f8fb);
  border-left: 2px solid #c9d9f0;
  border-radius: 6px;
  font-size: 13px;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.scene-cell:hover { background: #e8f0fc; border-left-color: #2563c9; transform: translateX(3px); }
.scene-name { color: var(--text-regular); }
.scene-value { color: #2563c9; font-weight: 700; white-space: nowrap; }

.top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; animation: num-flash 0.5s ease; }
.top-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 5px 6px;
  border-radius: 4px;
  transition: background 0.2s;
}
.top-cell:hover { background: #f0faf7; }
.top-cell:hover .top-name { color: #0f9d76; }
.top-name { color: var(--text-regular); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 10px; }

/* ---------- 02 数据产品专区 ---------- */
.industry-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
/* 顶部行业主题色饰条，区分三大行业卡片 */
.industry-card {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  border-top: 3px solid var(--ind-color, #2563c9);
  /* 行业主题色浅渐变染底，呼应参考稿多彩专区卡 */
  background: linear-gradient(165deg, color-mix(in srgb, var(--ind-color, #2563c9) 9%, #fff) 0%, #fff 32%);
}
/* hover 时投影随行业主题色染色 */
.industry-card:hover { box-shadow: 0 12px 32px color-mix(in srgb, var(--ind-color, #2563c9) 20%, transparent); }
.industry-head { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
.product-list { flex: 1; padding: 6px 0; }
.product-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 8px;
  margin: 0 -8px;
  border-bottom: 1px dashed var(--border-color);
  border-radius: 6px;
  transition: background 0.2s;
}
.product-row:hover { background: color-mix(in srgb, var(--ind-color, #2563c9) 6%, #fff); }
.product-row:hover .product-name { color: var(--ind-color, #2563c9); }
.product-row:last-child { border-bottom: none; }
.product-no { font-size: 15px; font-weight: 700; color: #b7c3d4; font-family: 'DIN Alternate', sans-serif; }
/* TOP3 序号金银铜配色 */
.product-row:nth-child(1) .product-no--hot { color: #d4a017; }
.product-row:nth-child(2) .product-no--hot { color: #8c9bb5; }
.product-row:nth-child(3) .product-no--hot { color: #c07a50; }
.product-info { flex: 1; min-width: 0; }
.product-name { font-size: 13.5px; color: var(--text-primary); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* 产品名可点击进入详情页 */
.product-name--link { cursor: pointer; transition: color 0.2s; }
.product-name--link:hover { color: var(--ind-color, #2563c9); text-decoration: underline; text-underline-offset: 3px; }
.product-calls { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.industry-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
}
.industry-dept { font-size: 12.5px; color: var(--text-secondary); }

/* ---------- 03 智能合约专区 ---------- */
.contract-grid { display: grid; grid-template-columns: 380px 1fr; gap: 24px; }
.contract-panel {
  position: relative;
  overflow: hidden;
  padding: 28px 30px;
  border-radius: 8px;
  /* 深蓝过渡蓝紫渐变，呼应参考稿专区卡配色 */
  background: linear-gradient(150deg, #13376e 0%, #1a4f9c 55%, #45368f 100%);
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s, box-shadow 0.25s;
}
/* 右上角金色光斑 + 左下角青色光斑，增添面板层次 */
.contract-panel::before {
  content: '';
  position: absolute;
  top: -70px;
  right: -70px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 122, 0.22), transparent 65%);
  pointer-events: none;
}
.contract-panel::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.14), transparent 65%);
  pointer-events: none;
}
.contract-panel:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(13, 42, 90, 0.35); }
.panel-en { font-size: 11px; letter-spacing: 2px; color: rgba(255, 255, 255, 0.55); }
.panel-title { font-size: 20px; margin-top: 8px; letter-spacing: 1px; }
.panel-metrics { flex: 1; display: flex; gap: 40px; margin-top: 30px; }
/* 深色面板上覆盖全局深蓝数字色，改用白色保证对比度 */
.panel-metric .metric-num { font-size: 40px; font-weight: 700; font-family: 'DIN Alternate', sans-serif; color: #fff; }
.panel-metric .metric-label { font-size: 13px; color: rgba(255, 255, 255, 0.75); margin-top: 6px; }
.panel-metric .metric-trend { font-size: 12px; color: #4ade80; margin-top: 6px; }
.panel-rate { margin-top: 26px; }
.panel-rate :deep(.el-progress-bar__outer) { background: rgba(255, 255, 255, 0.18); }
.rate-label { font-size: 12.5px; color: rgba(255, 255, 255, 0.75); margin-top: 8px; }

.deal-panel { padding: 24px 28px; }
.deal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.deal-title { font-size: 18px; color: var(--text-primary); }
.deal-sub { font-size: 12.5px; color: var(--text-secondary); margin-top: 4px; }
.deal-list { display: flex; flex-direction: column; }
.deal-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 6px;
  border-bottom: 1px dashed var(--border-color);
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}
.deal-row:last-child { border-bottom: none; }
.deal-row:hover { background: #f6f8fb; }
.deal-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #eee9fb;
  color: #7c5cd9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  flex-shrink: 0;
  transition: transform 0.3s;
}
/* 成交记录图标按行轮换主题色，丰富列表色彩层次 */
.deal-row:nth-child(3n + 2) .deal-icon { background: #e8f0fc; color: #2563c9; }
.deal-row:nth-child(3n) .deal-icon { background: #e6f7f2; color: #0f9d76; }
.deal-row:hover .deal-icon { transform: scale(1.1) rotate(6deg); }
.deal-info { flex: 1; }
.deal-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.deal-dept { font-size: 12.5px; color: var(--text-secondary); margin-top: 3px; }
.deal-count { font-size: 17px; font-weight: 700; color: #2563c9; margin-right: 8px; white-space: nowrap; }
.deal-count em { font-style: normal; font-size: 12px; font-weight: 400; color: var(--text-secondary); }

/* ---------- 04 通知公告 ---------- */
.notice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
/* 双卡片按类型着色：平台通知蓝 / 政策公告金 */
.notice-card { padding: 22px 24px; border-top: 3px solid #2563c9; transition: box-shadow 0.25s, transform 0.25s; }
/* 参考稿粉彩底色卡：平台通知浅蓝 / 政策公告浅米黄 */
.notice-grid .notice-card:first-child { background: linear-gradient(165deg, #e8f2fd 0%, #fdfeff 60%); }
.notice-grid .notice-card:last-child { border-top-color: var(--gov-gold); background: linear-gradient(165deg, #fdf3dc 0%, #fffdf8 60%); }
.notice-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(37, 99, 201, 0.16); }
.notice-grid .notice-card:last-child:hover { box-shadow: 0 12px 32px rgba(184, 134, 11, 0.18); }
.notice-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}
.notice-card-head h3 { flex: 1; font-size: 17px; color: var(--text-primary); }
.notice-list { padding-top: 6px; }
.notice-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 8px;
  border-bottom: 1px dashed var(--border-color);
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s, transform 0.2s;
}
.notice-row:last-child { border-bottom: none; }
.notice-row:hover { background: #f6f8fb; transform: translateX(3px); }
.notice-row:hover .notice-row-title { color: var(--gov-blue); }
.notice-dot { width: 5px; height: 5px; border-radius: 50%; background: #2563c9; flex-shrink: 0; transition: transform 0.2s; }
/* 政策公告卡片内公告点用金色区分 */
.notice-grid .notice-card:last-child .notice-dot { background: var(--gov-gold); }
.notice-row:hover .notice-dot { transform: scale(1.6); }
.notice-row-title {
  flex: 1;
  font-size: 13.5px;
  color: var(--text-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notice-row-date { font-size: 12.5px; color: var(--text-secondary); flex-shrink: 0; }


/* ---------- 右侧快捷边栏（可拖动） ---------- */
.side-bar {
  position: fixed;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 120;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 76px;
  user-select: none;
}
.side-bar.dragging {
  cursor: grabbing;
  opacity: 0.92;
  transition: none;
}
.side-bar.dragging * { pointer-events: none; }
/* 拖拽手柄 */
.side-drag-handle {
  width: 36px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 4px rgba(16, 42, 84, 0.12);
  transition: background 0.2s;
}
.side-drag-handle:hover { background: #e8f0fb; }
.drag-dots {
  width: 16px;
  height: 4px;
  border-radius: 2px;
  background: repeating-linear-gradient(90deg, #a0b4cc 0 3px, transparent 3px 5.5px);
}
.side-ai {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.side-ai-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563c9, #123a75);
  border: 2px solid #fff;
  color: #ffd77a;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(18, 58, 117, 0.35);
  transition: transform 0.2s;
}
.side-ai:hover .side-ai-avatar { transform: scale(1.08); }
.side-ai-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #1a4f9c;
  background: #fff;
  padding: 4px 12px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(16, 42, 84, 0.15);
  white-space: nowrap;
}
.side-card {
  width: 100%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(16, 42, 84, 0.14);
  padding: 4px 0;
}
.side-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 14px 0 12px;
  cursor: pointer;
  transition: background 0.2s;
}
/* 项间分隔线 */
.side-item + .side-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15px;
  right: 15px;
  height: 1px;
  background: #e8edf5;
}
.side-item:hover { background: #f2f6fc; }
.side-item:first-child { border-radius: 12px 12px 0 0; }
.side-item:last-child { border-radius: 0 0 12px 12px; }
.side-icon-wrap { position: relative; }
.side-icon {
  font-size: 24px;
  color: #2563c9;
  transition: transform 0.2s;
}
.side-item:hover .side-icon { transform: scale(1.15); }
.side-text { font-size: 12.5px; color: #37465f; font-weight: 500; }
/* 数字角标 */
.side-badge {
  position: absolute;
  top: -7px;
  right: -11px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #e64545;
  color: #fff;
  font-size: 10.5px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 0 0 2px #fff;
  box-sizing: content-box;
}


/* ---------- 适配 ---------- */
@media (max-width: 1440px) {
  .hero-inner { width: 640px; }
  .stat-value { font-size: 19px; }
  .contract-grid { grid-template-columns: 340px 1fr; }
}
</style>
