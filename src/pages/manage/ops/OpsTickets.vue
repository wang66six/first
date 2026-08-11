<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">运维工单</span>
        <div class="spacer"></div>
        <el-select v-model="filterStatus" placeholder="工单状态" clearable style="width: 130px">
          <el-option label="处理中" value="处理中" />
          <el-option label="已闭环" value="已闭环" />
        </el-select>
        <el-input v-model="keyword" placeholder="搜索工单标题/编号" clearable style="width: 220px" :prefix-icon="'Search'" />
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="工单编号" width="160" />
        <el-table-column prop="title" label="工单标题" min-width="220" />
        <el-table-column prop="alertId" label="关联告警" width="160" />
        <el-table-column prop="assignee" label="处理小组" width="110" />
        <el-table-column prop="priority" label="优先级" width="90">
          <template #default="{ row }">
            <el-tag :type="{ 紧急: 'danger', 重要: 'warning', 一般: 'info' }[row.priority]" size="small">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理进度" width="180">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="10" :status="row.progress === 100 ? 'success' : undefined" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '已闭环' ? 'success' : 'warning'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewRecord(row)">跟踪记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 跟踪记录抽屉 -->
    <el-drawer v-model="drawer" :title="`工单跟踪 - ${current?.id || ''}`" size="480px">
      <template v-if="current">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="工单标题">{{ current.title }}</el-descriptions-item>
          <el-descriptions-item label="关联告警">{{ current.alertId }}</el-descriptions-item>
          <el-descriptions-item label="处理小组">{{ current.assignee }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">{{ current.status }}（{{ current.progress }}%）</el-descriptions-item>
        </el-descriptions>
        <p class="drawer-label">处理流程</p>
        <el-timeline style="padding-left: 4px">
          <el-timeline-item
            v-for="(step, i) in steps"
            :key="i"
            :type="step.done ? 'success' : 'info'"
            :hollow="!step.done"
          >
            <p class="step-name">{{ step.name }}</p>
            <p v-if="step.note" class="step-note">{{ step.note }}</p>
          </el-timeline-item>
        </el-timeline>
        <el-alert
          v-if="current.status === '已闭环'"
          type="success"
          :closable="false"
          title="工单已闭环"
          :description="current.closeNote"
          style="margin-top: 8px"
        />
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { opsTickets } from '@/mock'

const list = ref(opsTickets.map((t) => ({ ...t })))
const filterStatus = ref('')
const keyword = ref('')

const filtered = computed(() =>
  list.value.filter(
    (t) =>
      (!filterStatus.value || t.status === filterStatus.value) &&
      (!keyword.value || t.title.includes(keyword.value) || t.id.includes(keyword.value))
  )
)

const drawer = ref(false)
const current = ref(null)

const steps = computed(() => {
  if (!current.value) return []
  const p = current.value.progress
  return [
    { name: '告警触发，自动生成工单', note: current.value.createTime, done: true },
    { name: `指派至${current.value.assignee}`, note: '智能调度自动指派', done: p >= 20 },
    { name: '故障定位与处理', note: p >= 40 && p < 100 ? '处理中…' : '', done: p >= 60 },
    { name: '处理验证', note: '', done: p >= 80 },
    { name: '闭环归档', note: current.value.closeNote || '', done: p === 100 }
  ]
})

function viewRecord(row) {
  current.value = row
  drawer.value = true
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.drawer-label { font-weight: 600; margin: 18px 0 14px; }
.step-name { font-size: 13.5px; font-weight: 600; }
.step-note { font-size: 12.5px; color: var(--text-secondary); margin-top: 4px; }
</style>
