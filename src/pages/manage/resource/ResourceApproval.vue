<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">资源申请审批</span>
        <div class="spacer"></div>
        <el-select v-model="filterType" placeholder="申请类型" clearable style="width: 140px">
          <el-option label="前置机申请" value="前置机申请" />
          <el-option label="扩容申请" value="扩容申请" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="审批状态" clearable style="width: 130px">
          <el-option v-for="s in ['待审批', '已通过', '已驳回']" :key="s" :label="s" :value="s" />
        </el-select>
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="申请编号" width="160" />
        <el-table-column prop="dept" label="申请部门" min-width="180" />
        <el-table-column prop="type" label="申请类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === '前置机申请' ? 'primary' : 'warning'" effect="plain" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="申请规格" min-width="160" />
        <el-table-column prop="reason" label="申请理由" min-width="200" show-overflow-tooltip />
        <el-table-column prop="submitTime" label="提交时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="{ 待审批: 'warning', 已通过: 'success', 已驳回: 'danger' }[row.status]" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === '待审批'">
              <el-button link type="success" :loading="opId === row.id" @click="approve(row, true)">通过</el-button>
              <el-button link type="danger" @click="approve(row, false)">驳回</el-button>
            </template>
            <span v-else class="done-text">已办结</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { resourceApprovals } from '@/mock'

const list = ref(resourceApprovals.map((r) => ({ ...r })))
const filterType = ref('')
const filterStatus = ref('')
const opId = ref('')

const filtered = computed(() =>
  list.value.filter(
    (r) => (!filterType.value || r.type === filterType.value) && (!filterStatus.value || r.status === filterStatus.value)
  )
)

function approve(row, pass) {
  if (pass) {
    opId.value = row.id
    setTimeout(() => {
      opId.value = ''
      row.status = '已通过'
      ElMessage.success(`「${row.dept}」的${row.type}已审批通过，资源将于24小时内交付`)
    }, 800)
  } else {
    ElMessageBox.prompt('请填写驳回理由', '驳回申请', {
      confirmButtonText: '确认驳回',
      cancelButtonText: '取消',
      inputPlaceholder: '如：资源池余量不足，请调整申请规格'
    })
      .then(() => {
        row.status = '已驳回'
        ElMessage.success('已驳回并通知申请部门')
      })
      .catch(() => {})
  }
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.done-text { font-size: 13px; color: var(--text-secondary); }
</style>
