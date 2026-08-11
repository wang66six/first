<template>
  <div class="page-container">
    <!-- 需求数量统计 -->
    <div class="dc-stats">
      <div v-for="s in stats" :key="s.label" class="gov-card dc-stat" :style="{ '--dc-color': s.color }">
        <div class="dc-stat-icon" :style="{ background: s.bg, color: s.color }">
          <el-icon :size="22"><component :is="s.icon" /></el-icon>
        </div>
        <div>
          <p class="dc-stat-value">{{ s.value }}</p>
          <p class="dc-stat-label">{{ s.label }}</p>
        </div>
      </div>
    </div>

    <!-- 需求列表 -->
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">需求列表</span>
        <div class="spacer"></div>
        <el-button type="primary" :icon="'Plus'" @click="openAdd">新增需求</el-button>
      </div>

      <!-- 筛选区 -->
      <div class="dc-filters">
        <el-input v-model="filter.keyword" placeholder="搜索需求名称" clearable style="width: 220px" :prefix-icon="'Search'" />
        <el-select v-model="filter.type" placeholder="需求类型" clearable style="width: 160px">
          <el-option v-for="t in demandTypes" :key="t" :label="t" :value="t" />
        </el-select>
        <el-select v-model="filter.status" placeholder="状态" clearable style="width: 140px">
          <el-option v-for="s in ['已完成', '进行中', '驳回']" :key="s" :label="s" :value="s" />
        </el-select>
        <el-date-picker
          v-model="filter.range"
          type="daterange"
          range-separator="至"
          start-placeholder="提交开始日期"
          end-placeholder="提交结束日期"
          value-format="YYYY-MM-DD"
          style="width: 260px"
        />
        <el-button @click="resetFilter">重置</el-button>
      </div>

      <el-table :data="paged" stripe>
        <el-table-column type="index" label="序号" width="70" :index="(i) => (page - 1) * pageSize + i + 1" />
        <el-table-column prop="name" label="需求名称" min-width="240" show-overflow-tooltip />
        <el-table-column prop="type" label="需求类型" width="140">
          <template #default="{ row }">
            <el-tag effect="plain" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="170" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusTag[row.status]" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="dc-pager">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="filtered.length"
          layout="total, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <!-- 新增需求：选择需求类型 -->
    <el-dialog v-model="addDialog" title="新增需求" width="520px">
      <p class="dc-dialog-tip">请选择需求类型：</p>
      <div class="dc-type-grid">
        <div
          v-for="t in typeOptions"
          :key="t.label"
          class="dc-type-item"
          :class="{ selected: addForm.type === t.label }"
          @click="addForm.type = t.label"
        >
          <div class="dc-type-icon" :style="{ background: t.bg, color: t.color }">
            <el-icon :size="20"><component :is="t.icon" /></el-icon>
          </div>
          <p class="dc-type-name">{{ t.label }}</p>
          <p class="dc-type-desc">{{ t.desc }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" :disabled="!addForm.type" :loading="adding" @click="confirmAdd">开始创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const demandTypes = ['账号申请', '白名单管理', '接口上限调整', '网络策略', '其他']

// 需求类型选项（新增弹窗）
const typeOptions = [
  { label: '账号申请', desc: '平台账号开通与权限变更', icon: 'UserFilled', bg: '#e8f8ee', color: '#22a35c' },
  { label: '白名单管理', desc: '接入系统白名单增删调整', icon: 'CircleCheck', bg: '#f1edfc', color: '#7c5cd6' },
  { label: '接口上限调整', desc: 'API 调用配额上限变更', icon: 'TrendCharts', bg: '#e8f2fd', color: '#2563c9' },
  { label: '网络策略', desc: '网络访问策略开通与调整', icon: 'Connection', bg: '#fff3e5', color: '#f2711c' },
  { label: '其他', desc: '其他类型的数据服务需求', icon: 'MoreFilled', bg: '#eef1f6', color: '#5e6d85' }
]

// mock 需求数据
const seedNames = {
  账号申请: ['数据治理平台操作账号开通', '目录编制系统账号权限升级', '前置机运维账号申请', '数据质检系统子账号开通', '共享交换平台账号续期', '安全审计账号开通'],
  白名单管理: ['人口库调用系统白名单新增', '法人库接入IP白名单变更', '电子证照系统白名单续期', '信用信息平台白名单新增', '医保结算系统白名单调整'],
  接口上限调整: ['婚姻登记核验接口上限提升', '不动产登记查询接口扩容', '社保缴费记录接口上限调整', '企业登记信息接口日限提升', '公积金查询接口并发扩容', '户籍人口核验接口上限提升'],
  网络策略: ['政务外网访问策略开通', '前置机至资源池网络策略变更', '跨区数据传输专线策略申请', '灾备中心网络互通策略开通', '视频专网边界策略调整']
}
const statuses = ['已完成', '进行中', '驳回']
const rows = []
let seq = 0
Object.entries(seedNames).forEach(([type, names]) => {
  names.forEach((name, i) => {
    seq += 1
    const day = String(28 - ((seq * 3) % 26)).padStart(2, '0')
    const month = seq % 2 ? '07' : '06'
    rows.push({
      name,
      type,
      submitTime: `2026-${month}-${day} ${String(9 + (seq % 9)).padStart(2, '0')}:${String((seq * 17) % 60).padStart(2, '0')}`,
      // 已完成为主，穿插进行中与少量驳回
      status: seq % 5 === 0 ? '驳回' : seq % 3 === 0 ? '进行中' : '已完成'
    })
  })
})
rows.sort((a, b) => (a.submitTime < b.submitTime ? 1 : -1))
const list = ref(rows)

const statusTag = { 已完成: 'success', 进行中: 'primary', 驳回: 'danger' }

// 统计指标
const stats = computed(() => {
  const count = (s) => list.value.filter((d) => d.status === s).length
  return [
    { label: '需求总数', value: list.value.length, icon: 'DataLine', bg: '#e8f2fd', color: '#2563c9' },
    { label: '已完成需求数', value: count('已完成'), icon: 'CircleCheck', bg: '#e8f8ee', color: '#22a35c' },
    { label: '进行中需求数', value: count('进行中'), icon: 'Loading', bg: '#fff3e5', color: '#f2711c' },
    { label: '驳回需求数', value: count('驳回'), icon: 'CircleClose', bg: '#fdeeee', color: '#e04a4a' }
  ]
})

// 筛选
const filter = reactive({ keyword: '', type: '', status: '', range: null })
const filtered = computed(() =>
  list.value.filter((d) => {
    if (filter.keyword && !d.name.includes(filter.keyword)) return false
    if (filter.type && d.type !== filter.type) return false
    if (filter.status && d.status !== filter.status) return false
    if (filter.range?.length === 2) {
      const day = d.submitTime.slice(0, 10)
      if (day < filter.range[0] || day > filter.range[1]) return false
    }
    return true
  })
)
function resetFilter() {
  Object.assign(filter, { keyword: '', type: '', status: '', range: null })
}

// 分页：每页 10 条，筛选变化时回到第一页
const page = ref(1)
const pageSize = 10
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
watch(filtered, () => { page.value = 1 })

// 新增需求
const addDialog = ref(false)
const adding = ref(false)
const addForm = reactive({ type: '' })

function openAdd() {
  addForm.type = ''
  addDialog.value = true
}

function confirmAdd() {
  adding.value = true
  setTimeout(() => {
    adding.value = false
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    list.value.unshift({
      // 名称按类型自动生成，进入流程后可再完善
      name: `${addForm.type}需求-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`,
      type: addForm.type,
      submitTime: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      status: '进行中'
    })
    addDialog.value = false
    resetFilter()
    ElMessage.success(`「${addForm.type}」需求已创建，等待运营方受理`)
  }, 600)
}
</script>

<style scoped>
/* ---------- 统计卡 ---------- */
.dc-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 14px; }
.dc-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.dc-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26, 79, 156, 0.12); }
.dc-stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dc-stat-value { font-size: 24px; font-weight: 700; color: var(--text-primary); font-family: 'DIN Alternate', 'Helvetica Neue', sans-serif; }
.dc-stat-label { font-size: 12.5px; color: var(--text-secondary); margin-top: 2px; }

/* ---------- 列表卡 ---------- */
.table-card { padding: 16px 20px 20px; }
.dc-filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.dc-pager { display: flex; justify-content: flex-end; margin-top: 14px; }

/* ---------- 新增需求弹窗 ---------- */
.dc-dialog-tip { font-size: 13.5px; color: var(--text-secondary); margin-bottom: 12px; }
.dc-type-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.dc-type-item {
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.dc-type-item:hover { border-color: var(--gov-blue); transform: translateY(-2px); }
.dc-type-item.selected { border-color: var(--gov-blue); background: var(--gov-blue-lighter); }
.dc-type-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.dc-type-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.dc-type-desc { font-size: 12px; color: var(--text-secondary); margin-top: 3px; }
</style>
