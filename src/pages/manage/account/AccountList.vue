<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">账号列表</span>
        <div class="spacer"></div>
        <el-select v-model="filterDept" placeholder="所属部门" clearable filterable style="width: 200px">
          <el-option v-for="d in DEPTS" :key="d" :label="d" :value="d" />
        </el-select>
        <el-select v-model="filterRole" placeholder="角色" clearable style="width: 140px">
          <el-option v-for="r in ['普通用户', '委办用户', '治理部管理员']" :key="r" :label="r" :value="r" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px">
          <el-option v-for="s in ['正常', '休眠', '禁用']" :key="s" :label="s" :value="s" />
        </el-select>
        <el-input v-model="keyword" placeholder="搜索账号名" clearable style="width: 180px" :prefix-icon="'Search'" />
      </div>
      <el-table :data="paged" stripe @selection-change="(v) => (selected = v)">
        <el-table-column type="selection" width="48" />
        <el-table-column prop="id" label="账号ID" width="100" />
        <el-table-column prop="name" label="账号名" width="120" />
        <el-table-column prop="dept" label="所属部门" min-width="200" />
        <el-table-column prop="role" label="角色" width="130">
          <template #default="{ row }"><el-tag effect="plain" size="small">{{ row.role }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="上次登录" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="{ 正常: 'success', 休眠: 'warning', 禁用: 'danger' }[row.status]" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="toolbar-row" style="margin-top: 14px">
        <el-button plain :disabled="!selected.length" @click="batchOp('发送提醒')">批量提醒（{{ selected.length }}）</el-button>
        <el-button type="danger" plain :disabled="!selected.length" @click="batchOp('禁用')">批量禁用（{{ selected.length }}）</el-button>
        <div class="spacer"></div>
        <el-pagination background layout="total, prev, pager, next" :total="filtered.length" :page-size="pageSize" v-model:current-page="page" />
      </div>
    </div>

    <!-- 账号详情与权限修改 -->
    <el-drawer v-model="drawer" :title="`账号详情 - ${current?.name || ''}`" size="480px">
      <template v-if="current">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="账号ID">{{ current.id }}</el-descriptions-item>
          <el-descriptions-item label="账号名">{{ current.name }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ current.dept }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ current.role }}</el-descriptions-item>
          <el-descriptions-item label="上次登录">{{ current.lastLogin }}</el-descriptions-item>
          <el-descriptions-item label="账号状态">{{ current.status }}</el-descriptions-item>
        </el-descriptions>
        <p class="drawer-label">功能权限</p>
        <el-checkbox-group v-model="editPerms">
          <el-checkbox v-for="p in allPerms" :key="p" :value="p">{{ p }}</el-checkbox>
        </el-checkbox-group>
        <div class="drawer-actions">
          <el-button type="primary" :loading="saving" @click="savePerms">保存权限</el-button>
          <el-button v-if="current.status !== '禁用'" type="danger" plain @click="disableOne">禁用账号</el-button>
          <el-button v-else type="success" plain @click="enableOne">启用账号</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { accounts, DEPTS } from '@/mock'

const list = ref(accounts.map((a) => ({ ...a })))
const filterDept = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const keyword = ref('')
const selected = ref([])
const page = ref(1)
const pageSize = 10

const filtered = computed(() =>
  list.value.filter(
    (a) =>
      (!filterDept.value || a.dept === filterDept.value) &&
      (!filterRole.value || a.role === filterRole.value) &&
      (!filterStatus.value || a.status === filterStatus.value) &&
      (!keyword.value || a.name.includes(keyword.value) || a.id.includes(keyword.value))
  )
)
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

const drawer = ref(false)
const current = ref(null)
const editPerms = ref([])
const saving = ref(false)
const allPerms = ['目录查询', '用数申请', '产品申请', '数据下载', '接口管理', '白名单管理']

function viewDetail(row) {
  current.value = row
  editPerms.value = [...row.permissions]
  drawer.value = true
}

function savePerms() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    current.value.permissions = [...editPerms.value]
    ElMessage.success(`账号「${current.value.name}」权限已更新`)
  }, 600)
}

function disableOne() {
  ElMessageBox.confirm(`确认禁用账号「${current.value.name}」？禁用后该账号将无法登录平台。`, '禁用确认', { type: 'warning' })
    .then(() => {
      current.value.status = '禁用'
      ElMessage.success('账号已禁用')
    })
    .catch(() => {})
}

function enableOne() {
  current.value.status = '正常'
  ElMessage.success('账号已启用')
}

function batchOp(action) {
  ElMessageBox.confirm(`确认对选中的 ${selected.value.length} 个账号执行「${action}」操作？`, `批量${action}`, { type: 'warning' })
    .then(() => {
      if (action === '禁用') selected.value.forEach((s) => (s.status = '禁用'))
      ElMessage.success(`已对 ${selected.value.length} 个账号${action === '禁用' ? '执行禁用' : '发送提醒'}`)
    })
    .catch(() => {})
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.drawer-label { font-weight: 600; margin: 18px 0 10px; }
.drawer-actions { margin-top: 24px; display: flex; gap: 10px; }
</style>
