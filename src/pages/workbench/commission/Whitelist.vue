<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">白名单管理</span>
        <div class="spacer"></div>
        <el-input v-model="keyword" placeholder="搜索系统名称/IP" clearable style="width: 220px" :prefix-icon="'Search'" />
        <el-button :icon="'Upload'" @click="batchImport">批量导入</el-button>
        <el-button type="primary" :icon="'Plus'" @click="openAdd">新增白名单</el-button>
      </div>
      <el-table :data="filtered" stripe @selection-change="(v) => (selected = v)">
        <el-table-column type="selection" width="48" />
        <el-table-column prop="id" label="编号" width="90" />
        <el-table-column prop="name" label="接入系统名称" min-width="200" />
        <el-table-column prop="ip" label="来源IP" width="140" />
        <el-table-column prop="api" label="授权接口" min-width="180" />
        <el-table-column prop="addTime" label="加入时间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '生效中' ? 'success' : 'warning'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click="remove(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="toolbar-row" style="margin-top: 14px">
        <el-button type="danger" plain :disabled="!selected.length" @click="batchRemove">批量移除（{{ selected.length }}）</el-button>
        <div class="spacer"></div>
      </div>
    </div>

    <!-- 新增白名单 -->
    <el-dialog v-model="addDialog" title="新增白名单" width="480px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="110px">
        <el-form-item label="接入系统名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入接入系统名称" />
        </el-form-item>
        <el-form-item label="来源IP" prop="ip">
          <el-input v-model="addForm.ip" placeholder="如 10.28.6.101" />
        </el-form-item>
        <el-form-item label="授权接口" prop="api">
          <el-select v-model="addForm.api" placeholder="请选择授权接口" style="width: 100%">
            <el-option v-for="a in apiList" :key="a.id" :label="a.name" :value="a.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" :loading="adding" @click="confirmAdd">确认新增</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { whitelist, apiList } from '@/mock'

const list = ref(whitelist.map((w) => ({ ...w })))
const keyword = ref('')
const selected = ref([])

const filtered = computed(() =>
  list.value.filter((w) => !keyword.value || w.name.includes(keyword.value) || w.ip.includes(keyword.value))
)

const addDialog = ref(false)
const adding = ref(false)
const addFormRef = ref(null)
const addForm = ref({ name: '', ip: '', api: '' })
const addRules = {
  name: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  ip: [
    { required: true, message: '请输入来源IP', trigger: 'blur' },
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP格式不正确', trigger: 'blur' }
  ],
  api: [{ required: true, message: '请选择授权接口', trigger: 'change' }]
}

function openAdd() {
  addForm.value = { name: '', ip: '', api: '' }
  addDialog.value = true
}

function confirmAdd() {
  addFormRef.value.validate((valid) => {
    if (!valid) return
    adding.value = true
    setTimeout(() => {
      adding.value = false
      list.value.unshift({
        id: `WL${String(list.value.length + 1).padStart(3, '0')}`,
        ...addForm.value,
        addTime: '2026-07-27',
        status: '待生效'
      })
      addDialog.value = false
      ElMessage.success('白名单新增成功，次日零点生效')
    }, 700)
  })
}

function remove(row) {
  ElMessageBox.confirm(`确认将「${row.name}」移出白名单？移除后该系统将无法调用授权接口。`, '移除确认', { type: 'warning' })
    .then(() => {
      list.value = list.value.filter((w) => w.id !== row.id)
      ElMessage.success('已移除')
    })
    .catch(() => {})
}

function batchRemove() {
  ElMessageBox.confirm(`确认批量移除选中的 ${selected.value.length} 条白名单？`, '批量移除', { type: 'warning' })
    .then(() => {
      const ids = selected.value.map((s) => s.id)
      list.value = list.value.filter((w) => !ids.includes(w.id))
      ElMessage.success(`已批量移除 ${ids.length} 条白名单`)
    })
    .catch(() => {})
}

function batchImport() {
  ElMessage.info('请下载导入模板填写后上传，模板已开始下载')
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
</style>
