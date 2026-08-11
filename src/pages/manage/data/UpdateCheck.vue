<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">数据更新检测</span>
        <el-tag type="danger" effect="light" style="margin-left: 12px">停更目录 {{ list.length }} 个</el-tag>
        <div class="spacer"></div>
        <el-select v-model="filterStatus" placeholder="通知状态" clearable style="width: 130px">
          <el-option v-for="s in ['待通知', '已通知', '整改中']" :key="s" :label="s" :value="s" />
        </el-select>
        <el-button type="primary" :disabled="!selected.length" :loading="batchNotifying" @click="batchNotify">
          批量通知责任部门（{{ selected.length }}）
        </el-button>
      </div>
      <el-table :data="filtered" stripe @selection-change="(v) => (selected = v)">
        <el-table-column type="selection" width="48" />
        <el-table-column prop="catalog" label="目录名称" min-width="170" />
        <el-table-column prop="dept" label="责任部门" min-width="170" />
        <el-table-column prop="frequency" label="约定频率" width="100" />
        <el-table-column prop="lastUpdate" label="上次更新时间" width="130" />
        <el-table-column label="停更时长" width="150" sortable :sort-method="(a, b) => a.stopDays - b.stopDays">
          <template #default="{ row }">
            <el-tag :type="row.stopDays > 60 ? 'danger' : 'warning'" size="small">已停更 {{ row.stopDays }} 天</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="{ 待通知: 'danger', 已通知: 'warning', 整改中: 'primary' }[row.status]" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待通知'" link type="primary" :loading="opId === row.id" @click="notify(row)">一键通知</el-button>
            <span v-else class="done-text">{{ row.status === '已通知' ? '已通知责任部门' : '部门整改中' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { updateIssues } from '@/mock'

const list = ref(updateIssues.map((u) => ({ ...u })))
const filterStatus = ref('')
const selected = ref([])
const opId = ref('')
const batchNotifying = ref(false)

const filtered = computed(() => list.value.filter((u) => !filterStatus.value || u.status === filterStatus.value))

function notify(row) {
  opId.value = row.id
  setTimeout(() => {
    opId.value = ''
    row.status = '已通知'
    ElMessage.success(`已通知「${row.dept}」尽快恢复「${row.catalog}」数据更新`)
  }, 700)
}

function batchNotify() {
  batchNotifying.value = true
  setTimeout(() => {
    batchNotifying.value = false
    selected.value.forEach((s) => {
      if (s.status === '待通知') s.status = '已通知'
    })
    ElMessage.success(`已批量通知 ${selected.value.length} 个目录的责任部门`)
  }, 900)
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.done-text { font-size: 13px; color: var(--text-secondary); }
</style>
