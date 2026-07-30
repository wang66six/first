<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">工单管理</span>
        <div class="spacer"></div>
        <el-select v-model="filterType" placeholder="工单类型" clearable style="width: 140px">
          <el-option v-for="t in types" :key="t" :label="t" :value="t" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="工单状态" clearable style="width: 140px">
          <el-option v-for="s in ['待处理', '处理中', '已完成']" :key="s" :label="s" :value="s" />
        </el-select>
        <el-input v-model="keyword" placeholder="搜索工单标题/编号" clearable style="width: 220px" :prefix-icon="'Search'" />
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="工单编号" width="160" />
        <el-table-column prop="title" label="工单标题" min-width="240" />
        <el-table-column prop="type" label="类型" width="110">
          <template #default="{ row }"><el-tag effect="plain" size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="90">
          <template #default="{ row }">
            <el-tag :type="{ 紧急: 'danger', 重要: 'warning', 一般: 'info' }[row.priority]" size="small">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column prop="deadline" label="处理时限" width="110" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status !== '已完成'" link type="primary" @click="handle(row)">处理工单</el-button>
            <el-button v-else link type="info" @click="handle(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 工单处理抽屉 -->
    <el-drawer v-model="drawer" :title="`工单处理 - ${current?.id || ''}`" size="520px">
      <template v-if="current">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="工单标题">{{ current.title }}</el-descriptions-item>
          <el-descriptions-item label="工单类型">{{ current.type }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ current.priority }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ current.createTime }}</el-descriptions-item>
          <el-descriptions-item label="处理时限">{{ current.deadline }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">{{ current.status }}</el-descriptions-item>
        </el-descriptions>
        <template v-if="current.status !== '已完成'">
          <p class="drawer-label">处理说明</p>
          <el-input v-model="handleNote" type="textarea" :rows="4" placeholder="请填写处理过程与结果说明" />
          <div class="drawer-actions">
            <el-button type="primary" :loading="submitting" @click="submitHandle('完成处理')">完成处理</el-button>
            <el-button :loading="submitting" @click="submitHandle('转派处理')">转派工单</el-button>
          </div>
        </template>
        <template v-else>
          <p class="drawer-label">闭环记录</p>
          <el-alert type="success" :closable="false" title="工单已按期完成处理，结果已同步治理部备案" />
        </template>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { commissionTickets } from '@/mock'

const tickets = ref(commissionTickets.map((t) => ({ ...t })))
const types = [...new Set(commissionTickets.map((t) => t.type))]
const filterType = ref('')
const filterStatus = ref('')
const keyword = ref('')

const filtered = computed(() =>
  tickets.value.filter(
    (t) =>
      (!filterType.value || t.type === filterType.value) &&
      (!filterStatus.value || t.status === filterStatus.value) &&
      (!keyword.value || t.title.includes(keyword.value) || t.id.includes(keyword.value))
  )
)

const drawer = ref(false)
const current = ref(null)
const handleNote = ref('')
const submitting = ref(false)

function statusType(s) {
  return { 待处理: 'danger', 处理中: 'warning', 已完成: 'success' }[s]
}

function handle(row) {
  current.value = row
  handleNote.value = ''
  drawer.value = true
}

function submitHandle(action) {
  if (!handleNote.value.trim()) {
    ElMessage.warning('请先填写处理说明')
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    if (action === '完成处理') current.value.status = '已完成'
    else current.value.status = '处理中'
    drawer.value = false
    ElMessage.success(`工单「${current.value.id}」${action}成功`)
  }, 800)
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.drawer-label { font-weight: 600; margin: 18px 0 10px; }
.drawer-actions { margin-top: 20px; display: flex; gap: 10px; }
</style>
