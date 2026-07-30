<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">我的申请</span>
        <div class="spacer"></div>
        <el-select v-model="filterStatus" placeholder="按状态筛选" clearable style="width: 150px">
          <el-option v-for="s in ['待审批', '审批中', '已通过', '已驳回']" :key="s" :label="s" :value="s" />
        </el-select>
        <el-input v-model="kw" placeholder="申请名称关键词" clearable style="width: 220px">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="申请编号" width="170" />
        <el-table-column prop="name" label="申请名称" min-width="230" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="submitTime" label="提交时间" width="160" />
        <el-table-column label="当前节点" min-width="140">
          <template #default="{ row }">{{ row.node }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" effect="plain">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewNodes(row)">审批节点</el-button>
            <el-button v-if="['待审批', '审批中'].includes(row.status)" link type="danger" @click="withdraw(row)">撤回申请</el-button>
            <el-button v-if="row.status === '已驳回'" link type="warning" @click="supplement(row)">补充材料</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 审批节点抽屉 -->
    <el-drawer v-model="drawerVisible" :title="`审批节点 - ${current?.name || ''}`" size="420px">
      <template v-if="current">
        <el-alert v-if="current.reason" type="error" :title="`驳回原因：${current.reason}`" :closable="false" show-icon style="margin-bottom: 20px" />
        <el-steps direction="vertical" :active="activeNode" finish-status="success" style="height: 360px">
          <el-step
            v-for="(n, i) in approvalNodes"
            :key="n"
            :title="n"
            :description="i < activeNode ? '已完成' : i === activeNode ? '进行中' : '待处理'"
          />
        </el-steps>
      </template>
    </el-drawer>

    <!-- 补充材料弹窗 -->
    <el-dialog v-model="suppVisible" title="补充申请材料" width="480px">
      <el-form label-width="90px">
        <el-form-item label="补充说明">
          <el-input v-model="suppText" type="textarea" :rows="3" placeholder="请说明补充内容" />
        </el-form-item>
        <el-form-item label="上传附件">
          <el-upload drag action="#" :auto-upload="false" style="width: 100%">
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">拖拽文件到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="suppVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitSupplement">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { myApplications, approvalNodes } from '@/mock'

const route = useRoute()
const applications = ref(myApplications.map((a) => ({ ...a })))
const filterStatus = ref(route.query.status || '')
const kw = ref('')

const drawerVisible = ref(false)
const suppVisible = ref(false)
const suppText = ref('')
const submitting = ref(false)
const current = ref(null)

const filtered = computed(() =>
  applications.value.filter((a) =>
    (!filterStatus.value || a.status === filterStatus.value) &&
    (!kw.value || a.name.includes(kw.value))
  )
)

const activeNode = computed(() => {
  if (!current.value) return 0
  return Math.round((current.value.progress / 100) * (approvalNodes.length - 1))
})

function statusType(s) {
  return { '待审批': 'warning', '审批中': 'primary', '已通过': 'success', '已驳回': 'danger' }[s]
}

function viewNodes(row) {
  current.value = row
  drawerVisible.value = true
}

function withdraw(row) {
  ElMessageBox.confirm(`确定撤回「${row.name}」吗？撤回后可重新提交。`, '撤回申请', { type: 'warning' })
    .then(() => {
      applications.value = applications.value.filter((a) => a.id !== row.id)
      ElMessage.success('申请已撤回')
    })
    .catch(() => {})
}

function supplement(row) {
  current.value = row
  suppText.value = ''
  suppVisible.value = true
}

function submitSupplement() {
  if (!suppText.value) {
    ElMessage.warning('请填写补充说明')
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    suppVisible.value = false
    current.value.status = '审批中'
    current.value.node = '治理部初审'
    ElMessage.success('材料已补充提交，申请重新进入审批流程')
  }, 700)
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
</style>
