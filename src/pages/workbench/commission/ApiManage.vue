<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">接口管理</span>
        <div class="spacer"></div>
        <el-select v-model="filterStatus" placeholder="接口状态" clearable style="width: 130px">
          <el-option label="在线" value="在线" />
          <el-option label="维护中" value="维护中" />
        </el-select>
        <el-input v-model="keyword" placeholder="搜索接口名称" clearable style="width: 220px" :prefix-icon="'Search'" />
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column prop="id" label="接口编号" width="100" />
        <el-table-column prop="name" label="接口名称" min-width="200" />
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="protocol" label="协议" width="120" />
        <el-table-column prop="qps" label="QPS配额" width="100" align="right" />
        <el-table-column label="今日调用量" width="120" align="right">
          <template #default="{ row }">{{ row.todayCalls.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="成功率" width="120">
          <template #default="{ row }">
            <span :class="row.successRate >= 99.9 ? 'rate-ok' : 'rate-warn'">{{ row.successRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '在线' ? 'success' : 'warning'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDoc(row)">接口文档</el-button>
            <el-button v-if="row.status === '在线'" link type="warning" @click="toggle(row, '下线维护')">下线维护</el-button>
            <el-button v-else link type="success" @click="toggle(row, '恢复上线')">恢复上线</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiList } from '@/mock'

const list = ref(apiList.map((a) => ({ ...a })))
const filterStatus = ref('')
const keyword = ref('')

const filtered = computed(() =>
  list.value.filter(
    (a) => (!filterStatus.value || a.status === filterStatus.value) && (!keyword.value || a.name.includes(keyword.value))
  )
)

function viewDoc(row) {
  ElMessageBox.alert(
    `接口地址：https://gw.bigdata.sh.gov.cn/api/${row.id.toLowerCase()}\n请求协议：${row.protocol}\n当前版本：${row.version}\nQPS配额：${row.qps}\n认证方式：AppKey + AppSecret 签名`,
    `接口文档 - ${row.name}`,
    { confirmButtonText: '知道了' }
  ).catch(() => {})
}

function toggle(row, action) {
  ElMessageBox.confirm(`确认对「${row.name}」执行${action}操作？`, action, { type: 'warning' })
    .then(() => {
      row.status = action === '下线维护' ? '维护中' : '在线'
      ElMessage.success(`「${row.name}」${action}成功`)
    })
    .catch(() => {})
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.rate-ok { color: var(--gov-green, #3f7d2c); font-weight: 600; }
.rate-warn { color: #e6a23c; font-weight: 600; }
</style>
