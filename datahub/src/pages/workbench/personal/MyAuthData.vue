<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">我的授权数据</span>
      </div>
      <el-table :data="myAuthData" stripe>
        <el-table-column prop="name" label="数据/产品名称" min-width="180" />
        <el-table-column prop="source" label="提供部门" min-width="180" />
        <el-table-column prop="authTime" label="授权时间" width="120" />
        <el-table-column prop="expire" label="有效期至" width="120" />
        <el-table-column label="调用情况" min-width="220">
          <template #default="{ row }">
            <div class="quota-cell">
              <el-progress :percentage="Math.round((row.calls / row.quota) * 100)" :stroke-width="10" style="flex: 1" />
              <span class="quota-text">{{ row.calls.toLocaleString() }} / {{ row.quota.toLocaleString() }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewKey(row)">查看凭证</el-button>
            <el-button link type="warning" @click="renew(row)">申请续期</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { myAuthData } from '@/mock'

function viewKey(row) {
  ElMessageBox.alert(
    `AppKey：dh_${row.id.toLowerCase()}_2026\nAppSecret：********（点击复制后可见）\n调用网关：https://gw.bigdata.sh.gov.cn/api`,
    `调用凭证 - ${row.name}`,
    { confirmButtonText: '复制凭证' }
  ).then(() => ElMessage.success('凭证已复制到剪贴板')).catch(() => {})
}

function renew(row) {
  ElMessage.success(`「${row.name}」续期申请已提交，请等待提供部门审批`)
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.quota-cell { display: flex; align-items: center; gap: 10px; }
.quota-text { font-size: 12.5px; color: var(--text-secondary); white-space: nowrap; }
</style>
