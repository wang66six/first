<template>
  <div class="page-container">
    <!-- 待办指标卡 -->
    <el-row :gutter="16">
      <el-col :span="6" v-for="m in metrics" :key="m.label">
        <div class="gov-card gov-card--hover metric-card" @click="$router.push(m.path)">
          <div class="metric-icon" :style="{ background: m.bg, color: m.color }">
            <el-icon :size="22"><component :is="m.icon" /></el-icon>
          </div>
          <div>
            <p class="metric-value"><CountUp :value="m.value" />{{ m.unit }}</p>
            <p class="metric-label">{{ m.label }}</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 待办事项列表 -->
    <div class="gov-card table-card" style="margin-top: 16px">
      <div class="toolbar-row">
        <span class="section-title">待办事项</span>
        <div class="spacer"></div>
        <el-button link type="primary" @click="$router.push('/workbench/commission/tickets')">
          查看全部工单 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-table :data="todoList" stripe @row-click="goTicket" style="cursor: pointer">
        <el-table-column prop="id" label="工单编号" width="160" />
        <el-table-column prop="title" label="事项标题" min-width="260" />
        <el-table-column prop="type" label="类型" width="110">
          <template #default="{ row }"><el-tag effect="plain" size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="priorityType(row.priority)" size="small">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="处理时限" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '待处理' ? 'danger' : 'warning'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CountUp from '@/components/CountUp.vue'
import { commissionTickets, supplyDemandData } from '@/mock'

const router = useRouter()

const pendingTickets = commissionTickets.filter((t) => t.status !== '已完成')
const todoList = pendingTickets

const metrics = [
  { label: '待处理工单', value: pendingTickets.length, unit: ' 项', icon: 'Tickets', bg: '#fef0f0', color: '#c0392b', path: '/workbench/commission/tickets' },
  { label: '待审批需求', value: 3, unit: ' 项', icon: 'DocumentChecked', bg: '#fdf6ec', color: '#b7791f', path: '/workbench/commission/demand' },
  { label: '本月供数目录', value: supplyDemandData.share.summary[0].value, unit: ' 个', icon: 'Upload', bg: '#eef4fc', color: '#1a4f9c', path: '/workbench/commission/supply-demand' },
  { label: '本月用数调用（万次）', value: Math.round(supplyDemandData.share.summary[1].value / 10000), unit: '', icon: 'Download', bg: '#f0f9eb', color: '#3f7d2c', path: '/workbench/commission/supply-demand' }
]

function priorityType(p) {
  return { 紧急: 'danger', 重要: 'warning', 一般: 'info' }[p]
}

function goTicket() {
  router.push('/workbench/commission/tickets')
}
</script>

<style scoped>
.metric-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  cursor: pointer;
}
.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.metric-value { font-size: 24px; font-weight: 700; color: var(--text-primary); font-family: 'DIN Alternate', sans-serif; }
.metric-label { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.table-card { padding: 16px 20px 20px; }
</style>
