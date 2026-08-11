<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">智能运维告警</span>
        <div class="spacer"></div>
        <el-radio-group v-model="filterLevel">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="紧急">紧急</el-radio-button>
          <el-radio-button value="重要">重要</el-radio-button>
          <el-radio-button value="一般">一般</el-radio-button>
        </el-radio-group>
        <el-select v-model="filterStatus" placeholder="处理状态" clearable style="width: 130px">
          <el-option v-for="s in ['未处理', '处理中', '已闭环']" :key="s" :label="s" :value="s" />
        </el-select>
      </div>
      <el-table :data="filtered" stripe :row-class-name="rowClass">
        <el-table-column prop="id" label="告警编号" width="160" />
        <el-table-column prop="level" label="级别" width="90">
          <template #default="{ row }">
            <el-tag :type="{ 紧急: 'danger', 重要: 'warning', 一般: 'info' }[row.level]" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="告警内容" min-width="280" />
        <el-table-column prop="source" label="告警来源" width="130" />
        <el-table-column prop="time" label="发生时间" width="150" />
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="{ 未处理: 'danger', 处理中: 'warning', 已闭环: 'success' }[row.status]" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '未处理'" link type="primary" :loading="opId === row.id" @click="dispatch(row)">一键派发工单</el-button>
            <el-button v-else link type="info" @click="$router.push('/manage/ops/tickets')">查看工单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'
import { opsAlerts } from '@/mock'

const list = ref(opsAlerts.map((a) => ({ ...a })))
const filterLevel = ref('')
const filterStatus = ref('')
const opId = ref('')

const filtered = computed(() =>
  list.value.filter(
    (a) => (!filterLevel.value || a.level === filterLevel.value) && (!filterStatus.value || a.status === filterStatus.value)
  )
)

function rowClass({ row }) {
  return row.level === '紧急' && row.status === '未处理' ? 'row-urgent' : ''
}

function dispatch(row) {
  opId.value = row.id
  setTimeout(() => {
    opId.value = ''
    row.status = '处理中'
    const ticketNo = `OT${Date.now().toString().slice(-11)}`
    ElNotification({
      title: '运维工单已派发',
      message: `告警「${row.id}」已生成运维工单（${ticketNo}），已自动指派至值班运维组`,
      type: 'success'
    })
  }, 800)
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
:deep(.row-urgent) { background: #fef6f6 !important; }
</style>
