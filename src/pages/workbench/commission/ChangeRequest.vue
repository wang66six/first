<template>
  <div class="page-container">
    <!-- 三类申请入口 -->
    <el-row :gutter="16">
      <el-col :span="8" v-for="e in entries" :key="e.type">
        <div class="gov-card gov-card--hover entry-card" @click="openApply(e.type)">
          <div class="entry-icon" :style="{ background: e.bg, color: e.color }">
            <el-icon :size="26"><component :is="e.icon" /></el-icon>
          </div>
          <div>
            <p class="entry-name">{{ e.type }}申请</p>
            <p class="entry-desc">{{ e.desc }}</p>
          </div>
          <el-icon class="entry-arrow"><ArrowRight /></el-icon>
        </div>
      </el-col>
    </el-row>

    <!-- 历史申请 -->
    <div class="gov-card table-card" style="margin-top: 16px">
      <div class="toolbar-row">
        <span class="section-title">历史申请记录</span>
        <div class="spacer"></div>
        <el-select v-model="filterType" placeholder="申请类型" clearable style="width: 130px">
          <el-option v-for="t in ['变更', '延期', '调容量']" :key="t" :label="t" :value="t" />
        </el-select>
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="申请编号" width="170" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }"><el-tag effect="plain" size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="target" label="申请对象" min-width="200" />
        <el-table-column prop="desc" label="申请内容" min-width="240" />
        <el-table-column prop="submitTime" label="提交时间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="{ 审批中: 'warning', 已通过: 'success', 已驳回: 'danger' }[row.status]" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 申请表单弹窗 -->
    <el-dialog v-model="dialog" :title="`${applyType}申请`" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="申请对象" prop="target">
          <el-input v-model="form.target" placeholder="请输入接口/授权/目录名称" />
        </el-form-item>
        <el-form-item v-if="applyType === '延期'" label="延长期限" prop="extend">
          <el-select v-model="form.extend" placeholder="请选择延长期限" style="width: 100%">
            <el-option v-for="m in ['3个月', '6个月', '12个月']" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="applyType === '调容量'" label="容量调整" prop="capacity">
          <el-input v-model="form.capacity" placeholder="如 QPS 200 → 500" />
        </el-form-item>
        <el-form-item label="申请理由" prop="reason">
          <el-input v-model="form.reason" type="textarea" :rows="4" placeholder="请说明申请理由与业务背景" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { changeRequests } from '@/mock'

const entries = [
  { type: '变更', desc: '数据目录、接口共享范围内容变更', icon: 'EditPen', bg: '#eef4fc', color: '#1a4f9c' },
  { type: '延期', desc: '授权有效期、共享协议到期延展', icon: 'Clock', bg: '#fdf6ec', color: '#b7791f' },
  { type: '调容量', desc: '接口QPS、存储配额容量调整', icon: 'Odometer', bg: '#f0f9eb', color: '#3f7d2c' }
]

const records = ref(changeRequests.map((c) => ({ ...c })))
const filterType = ref('')
const filtered = computed(() => records.value.filter((r) => !filterType.value || r.type === filterType.value))

const dialog = ref(false)
const applyType = ref('变更')
const submitting = ref(false)
const formRef = ref(null)
const form = ref({ target: '', extend: '', capacity: '', reason: '' })

const rules = {
  target: [{ required: true, message: '请输入申请对象', trigger: 'blur' }],
  extend: [{ required: true, message: '请选择延长期限', trigger: 'change' }],
  capacity: [{ required: true, message: '请输入容量调整内容', trigger: 'blur' }],
  reason: [{ required: true, message: '请填写申请理由', trigger: 'blur' }]
}

function openApply(type) {
  applyType.value = type
  form.value = { target: '', extend: '', capacity: '', reason: '' }
  dialog.value = true
}

function submit() {
  formRef.value.validate((valid) => {
    if (!valid) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      const detail = applyType.value === '延期' ? `授权有效期延长${form.value.extend}` : applyType.value === '调容量' ? form.value.capacity : form.value.reason.slice(0, 30)
      records.value.unshift({
        id: `CR20260727${String(records.value.length + 1).padStart(3, '0')}`,
        type: applyType.value,
        target: form.value.target,
        desc: detail,
        submitTime: '2026-07-27',
        status: '审批中'
      })
      dialog.value = false
      ElMessage.success(`${applyType.value}申请提交成功，请等待治理部审批`)
    }, 800)
  })
}
</script>

<style scoped>
.entry-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px;
  cursor: pointer;
}
.entry-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.entry-name { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.entry-desc { font-size: 12.5px; color: var(--text-secondary); margin-top: 4px; }
.entry-arrow { margin-left: auto; color: var(--text-secondary); }
.table-card { padding: 16px 20px 20px; }
</style>
