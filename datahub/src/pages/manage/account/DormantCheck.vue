<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">休眠账号检测</span>
        <el-tag type="warning" effect="light" style="margin-left: 12px">自动筛选 3 个月未登录账号，共 {{ dormant.length }} 个</el-tag>
        <div class="spacer"></div>
        <el-button plain :disabled="!selected.length" @click="batchRemind">批量发送提醒（{{ selected.length }}）</el-button>
        <el-button type="danger" plain :disabled="!selected.length" @click="batchDisable">批量禁用（{{ selected.length }}）</el-button>
      </div>
      <el-table :data="dormant" stripe @selection-change="(v) => (selected = v)">
        <el-table-column type="selection" width="48" />
        <el-table-column prop="id" label="账号ID" width="100" />
        <el-table-column prop="name" label="账号名" width="120" />
        <el-table-column prop="dept" label="所属部门" min-width="200" />
        <el-table-column prop="role" label="角色" width="120" />
        <el-table-column prop="lastLogin" label="上次登录" width="120" />
        <el-table-column label="休眠时长" width="140" sortable :sort-method="(a, b) => a.dormantDays - b.dormantDays">
          <template #default="{ row }">
            <el-tag :type="row.dormantDays > 180 ? 'danger' : 'warning'" size="small">已休眠 {{ row.dormantDays }} 天</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '禁用' ? 'danger' : 'warning'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="remind(row)">发送提醒</el-button>
            <el-button v-if="row.status !== '禁用'" link type="danger" @click="disable(row)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { accounts } from '@/mock'

const list = ref(accounts.filter((a) => a.dormantDays > 90).map((a) => ({ ...a })))
const selected = ref([])
const dormant = computed(() => list.value)

function remind(row) {
  ElMessage.success(`已向「${row.name}」发送登录提醒短信`)
}

function disable(row) {
  ElMessageBox.confirm(`确认禁用休眠账号「${row.name}」？`, '禁用确认', { type: 'warning' })
    .then(() => {
      row.status = '禁用'
      ElMessage.success('账号已禁用')
    })
    .catch(() => {})
}

function batchRemind() {
  ElMessage.success(`已向 ${selected.value.length} 个休眠账号批量发送提醒`)
}

function batchDisable() {
  ElMessageBox.confirm(`确认批量禁用选中的 ${selected.value.length} 个休眠账号？`, '批量禁用', { type: 'warning' })
    .then(() => {
      selected.value.forEach((s) => (s.status = '禁用'))
      ElMessage.success(`已批量禁用 ${selected.value.length} 个账号`)
    })
    .catch(() => {})
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
</style>
