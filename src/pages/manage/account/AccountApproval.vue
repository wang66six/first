<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">账号 / 权限审批</span>
        <div class="spacer"></div>
        <el-select v-model="filterStatus" placeholder="审批状态" clearable style="width: 130px">
          <el-option v-for="s in ['待审批', '已通过', '已驳回']" :key="s" :label="s" :value="s" />
        </el-select>
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="申请编号" width="160" />
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="dept" label="所属单位" min-width="180" />
        <el-table-column prop="type" label="申请类型" width="110">
          <template #default="{ row }"><el-tag effect="plain" size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="role" label="申请角色" width="110" />
        <el-table-column prop="submitTime" label="提交时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="{ 待审批: 'warning', 已通过: 'success', 已驳回: 'danger' }[row.status]" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewMaterial(row)">查看材料</el-button>
            <template v-if="row.status === '待审批'">
              <el-button link type="success" :loading="opId === row.id" @click="approve(row, true)">通过</el-button>
              <el-button link type="danger" @click="approve(row, false)">驳回</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { accountApprovals } from '@/mock'

const list = ref(accountApprovals.map((a) => ({ ...a })))
const filterStatus = ref('')
const opId = ref('')

const filtered = computed(() => list.value.filter((a) => !filterStatus.value || a.status === filterStatus.value))

function viewMaterial(row) {
  ElMessageBox.alert(
    `申请理由：${row.reason}\n\n提交材料：${row.material}`,
    `申请材料 - ${row.applicant}（${row.dept}）`,
    { confirmButtonText: '关闭' }
  ).catch(() => {})
}

function approve(row, pass) {
  if (pass) {
    opId.value = row.id
    setTimeout(() => {
      opId.value = ''
      row.status = '已通过'
      ElMessage.success(`「${row.applicant}」的${row.type}申请已审批通过`)
    }, 800)
  } else {
    ElMessageBox.prompt('请填写驳回理由', '驳回申请', {
      confirmButtonText: '确认驳回',
      cancelButtonText: '取消',
      inputPlaceholder: '如：材料不齐、不符合开通条件'
    })
      .then(({ value }) => {
        row.status = '已驳回'
        ElMessage.success(`已驳回并通知申请人${value ? '：' + value : ''}`)
      })
      .catch(() => {})
  }
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
</style>
