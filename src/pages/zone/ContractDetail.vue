<template>
  <div class="page-container zone-page" v-if="contract">
    <div class="gov-card head-card">
      <div>
        <h1>{{ contract.name }}</h1>
        <div class="head-tags">
          <el-tag effect="plain">{{ contract.type }}</el-tag>
          <el-tag :type="contract.status === '执行中' ? 'success' : contract.status === '待审批' ? 'warning' : 'info'" effect="plain">
            {{ contract.status }}
          </el-tag>
          <el-tag type="success" effect="plain"><el-icon style="vertical-align: -2px"><Link /></el-icon> 区块链已存证</el-tag>
        </div>
      </div>
      <el-button
        v-if="canApprove && contract.status === '待审批'"
        type="primary"
        size="large"
        :loading="approving"
        @click="approve"
      >一键审批</el-button>
    </div>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="14">
        <!-- 合约规则 -->
        <div class="gov-card body-card">
          <h3 class="section-title">合约规则</h3>
          <el-descriptions :column="1" border style="margin-top: 14px">
            <el-descriptions-item label="合约编号">{{ contract.id }}</el-descriptions-item>
            <el-descriptions-item label="发起部门">{{ contract.dept }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ contract.createTime }}</el-descriptions-item>
            <el-descriptions-item label="触发条件">用数方发起调用请求且白名单校验通过</el-descriptions-item>
            <el-descriptions-item label="执行动作">自动核验授权范围 → 放行数据调用 → 记录调用凭证并上链</el-descriptions-item>
            <el-descriptions-item label="约束规则">单日调用上限 10 万次；超限自动熔断并通知双方</el-descriptions-item>
            <el-descriptions-item label="累计执行">{{ contract.deals.toLocaleString() }} 笔</el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- 执行记录 -->
        <div class="gov-card body-card" style="margin-top: 16px">
          <h3 class="section-title">执行记录</h3>
          <el-table :data="execRecords" stripe style="margin-top: 12px">
            <el-table-column prop="time" label="执行时间" width="170" />
            <el-table-column prop="action" label="执行动作" min-width="180" />
            <el-table-column prop="result" label="结果" width="100">
              <template #default="{ row }">
                <el-tag :type="row.result === '成功' ? 'success' : 'danger'" size="small" effect="plain">{{ row.result }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <!-- 区块链存证 -->
        <div class="gov-card body-card chain-card">
          <h3 class="section-title">区块链存证信息</h3>
          <div class="chain-item">
            <p class="chain-label">存证哈希</p>
            <p class="chain-hash">{{ contract.hash }}</p>
          </div>
          <div class="chain-item">
            <p class="chain-label">存证时间</p>
            <p>{{ contract.createTime }}</p>
          </div>
          <div class="chain-item">
            <p class="chain-label">所在区块高度</p>
            <p># {{ 8264500 + contract.deals }}</p>
          </div>
          <div class="chain-item">
            <p class="chain-label">共识节点</p>
            <p>市数据局节点、市大数据中心节点、发起部门节点（3/3 确认）</p>
          </div>
          <el-button plain style="width: 100%; margin-top: 8px" @click="verifyChain" :loading="verifying">
            <el-icon style="margin-right: 4px"><CircleCheck /></el-icon>链上核验
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-empty v-else description="合约不存在" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { useUserStore } from '@/store/user'
import { contracts } from '@/mock'

const route = useRoute()
const user = useUserStore()
const canApprove = computed(() => ['commission', 'governance'].some((r) => user.roles.includes(r)))
const contract = ref(contracts.find((c) => c.id === route.params.id))

const approving = ref(false)
const verifying = ref(false)

const execRecords = [
  { time: '2026-07-27 14:02:18', action: '白名单校验 + 数据调用放行', result: '成功' },
  { time: '2026-07-27 13:45:02', action: '白名单校验 + 数据调用放行', result: '成功' },
  { time: '2026-07-27 11:20:44', action: '调用凭证上链存证', result: '成功' },
  { time: '2026-07-26 18:32:10', action: '超限校验（当日 82,304 次）', result: '成功' },
  { time: '2026-07-26 09:15:33', action: '白名单校验（IP 不在名单）', result: '拦截' }
]

function approve() {
  approving.value = true
  setTimeout(() => {
    approving.value = false
    contract.value.status = '执行中'
    const evidenceNo = `BC-${Date.now().toString().slice(-10)}`
    ElNotification({
      title: '审批完成',
      message: `合约已通过审批并上链存证，存证编号：${evidenceNo}`,
      type: 'success'
    })
  }, 1200)
}

function verifyChain() {
  verifying.value = true
  setTimeout(() => {
    verifying.value = false
    ElMessage.success('链上核验通过：存证哈希与区块记录一致，数据未被篡改')
  }, 900)
}
</script>

<style scoped>
.zone-page { width: 1280px; margin: 0 auto; }
.head-card { padding: 24px 28px; display: flex; justify-content: space-between; align-items: flex-start; }
.head-card h1 { font-size: 22px; margin-bottom: 12px; }
.head-tags { display: flex; gap: 8px; }
.body-card { padding: 20px 24px; }
.chain-card { background: linear-gradient(180deg, #f0f6ff 0%, #fff 30%); }
.chain-item { padding: 12px 0; border-bottom: 1px dashed var(--border-color); font-size: 14px; }
.chain-label { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 4px; }
.chain-hash { word-break: break-all; font-family: monospace; color: var(--gov-blue); font-size: 13px; }
@media (max-width: 1440px) { .zone-page { width: 1200px; } }
</style>
