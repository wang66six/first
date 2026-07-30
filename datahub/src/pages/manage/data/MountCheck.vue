<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">目录挂载检测</span>
        <el-tag type="warning" effect="light" style="margin-left: 12px">检出异常目录 {{ list.length }} 个</el-tag>
        <div class="spacer"></div>
        <el-select v-model="filterType" placeholder="异常类型" clearable style="width: 140px">
          <el-option label="未挂载资源" value="未挂载资源" />
          <el-option label="挂载异常" value="挂载异常" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="整改状态" clearable style="width: 130px">
          <el-option v-for="s in ['待整改', '整改中', '已整改']" :key="s" :label="s" :value="s" />
        </el-select>
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column prop="catalog" label="目录名称" min-width="170" />
        <el-table-column prop="dept" label="责任部门" min-width="190" />
        <el-table-column prop="type" label="异常类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === '未挂载资源' ? 'danger' : 'warning'" effect="plain" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="detail" label="异常详情" min-width="240" show-overflow-tooltip />
        <el-table-column prop="foundTime" label="发现时间" width="110" />
        <el-table-column prop="status" label="整改状态" width="100">
          <template #default="{ row }">
            <el-tag :type="{ 待整改: 'danger', 整改中: 'warning', 已整改: 'success' }[row.status]" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待整改'" link type="primary" :loading="opId === row.id" @click="dispatch(row)">派发整改工单</el-button>
            <span v-else class="done-text">{{ row.status === '整改中' ? '工单已派发' : '已闭环' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'
import { mountIssues } from '@/mock'

const list = ref(mountIssues.map((m) => ({ ...m })))
const filterType = ref('')
const filterStatus = ref('')
const opId = ref('')

const filtered = computed(() =>
  list.value.filter(
    (m) => (!filterType.value || m.type === filterType.value) && (!filterStatus.value || m.status === filterStatus.value)
  )
)

function dispatch(row) {
  opId.value = row.id
  setTimeout(() => {
    opId.value = ''
    row.status = '整改中'
    ElNotification({
      title: '整改工单已派发',
      message: `已向「${row.dept}」派发目录「${row.catalog}」整改工单，要求 3 个工作日内完成整改`,
      type: 'success'
    })
  }, 800)
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.done-text { font-size: 13px; color: var(--text-secondary); }
</style>
