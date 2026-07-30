<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">前置机管理</span>
        <el-tag effect="light" style="margin-left: 12px">共 {{ filtered.length }} 台</el-tag>
        <el-tag type="danger" effect="light" style="margin-left: 8px">告警 {{ alertCount }} 台</el-tag>
        <div class="spacer"></div>
        <el-select v-model="filterDept" placeholder="所属部门" clearable filterable style="width: 200px">
          <el-option v-for="d in DEPTS" :key="d" :label="d" :value="d" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="运行状态" clearable style="width: 130px">
          <el-option label="运行中" value="运行中" />
          <el-option label="告警" value="告警" />
        </el-select>
      </div>
      <el-table :data="filtered" stripe @row-click="goDetail" style="cursor: pointer">
        <el-table-column prop="id" label="节点ID" width="90" />
        <el-table-column prop="name" label="前置机名称" min-width="180" />
        <el-table-column prop="dept" label="所属部门" min-width="180" />
        <el-table-column prop="ip" label="IP地址" width="130" />
        <el-table-column label="CPU" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.cpu" :stroke-width="8" :color="loadColor(row.cpu)" />
          </template>
        </el-table-column>
        <el-table-column label="内存" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.memory" :stroke-width="8" :color="loadColor(row.memory)" />
          </template>
        </el-table-column>
        <el-table-column label="磁盘" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.disk" :stroke-width="8" :color="loadColor(row.disk)" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '运行中' ? 'success' : 'danger'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="goDetail(row)">运行详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { frontMachines, DEPTS } from '@/mock'

const router = useRouter()
const filterDept = ref('')
const filterStatus = ref('')

const filtered = computed(() =>
  frontMachines.filter(
    (m) => (!filterDept.value || m.dept === filterDept.value) && (!filterStatus.value || m.status === filterStatus.value)
  )
)
const alertCount = computed(() => frontMachines.filter((m) => m.status === '告警').length)

function loadColor(v) {
  if (v >= 85) return '#f56c6c'
  if (v >= 70) return '#e6a23c'
  return '#3f7d2c'
}

function goDetail(row) {
  router.push(`/manage/resource/front-machine/${row.id}`)
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
</style>
