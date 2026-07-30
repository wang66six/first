<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :span="18">
        <!-- 申请进度卡片 -->
        <div class="status-cards">
          <div
            v-for="s in statusCards"
            :key="s.label"
            class="gov-card status-card gov-card--hover"
            @click="goApplications(s.label)"
          >
            <div class="status-icon" :style="{ background: s.color }"><el-icon><component :is="s.icon" /></el-icon></div>
            <div>
              <p class="status-num"><CountUp :value="s.count" /></p>
              <p class="status-label">{{ s.label }}</p>
            </div>
          </div>
        </div>

        <!-- 申请记录列表 -->
        <div class="gov-card table-card" style="margin-top: 16px">
          <div class="toolbar-row">
            <span class="section-title">申请记录</span>
            <div class="spacer"></div>
            <el-select v-model="filterStatus" placeholder="按状态筛选" clearable style="width: 150px">
              <el-option v-for="s in ['待审批', '审批中', '已通过', '已驳回']" :key="s" :label="s" :value="s" />
            </el-select>
            <el-date-picker v-model="filterDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 260px" />
          </div>
          <el-table :data="filtered" stripe>
            <el-table-column prop="id" label="申请编号" width="160" />
            <el-table-column prop="name" label="申请名称" min-width="220" show-overflow-tooltip />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="submitTime" label="提交时间" width="160" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="statusType(row.status)" effect="plain">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button link type="primary" @click="$router.push('/workbench/personal/applications')">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <!-- 右侧快捷入口 -->
      <el-col :span="6">
        <div class="gov-card quick-card">
          <h3 class="section-title">快捷入口</h3>
          <el-button type="primary" style="width: 100%; margin-top: 16px" @click="$router.push('/zone/data-resource')">
            <el-icon style="margin-right: 6px"><Plus /></el-icon>新建用数申请
          </el-button>
          <el-button type="warning" plain style="width: 100%; margin: 12px 0 0" @click="$router.push('/workbench/personal/cart')">
            <el-icon style="margin-right: 6px"><Star /></el-icon>查看收藏夹（{{ user.cartCount }}）
          </el-button>
        </div>
        <div class="gov-card quick-card" style="margin-top: 16px">
          <h3 class="section-title">最新消息</h3>
          <div v-for="m in myMessages.slice(0, 3)" :key="m.id" class="msg-item" @click="$router.push('/workbench/personal/messages')">
            <el-badge :is-dot="!m.read" style="width: 100%">
              <p class="msg-title">{{ m.title }}</p>
            </el-badge>
            <p class="msg-time">{{ m.time }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CountUp from '@/components/CountUp.vue'
import { useUserStore } from '@/store/user'
import { myApplications, myMessages } from '@/mock'

const router = useRouter()
const user = useUserStore()
const filterStatus = ref('')
const filterDate = ref('')

const statusCards = computed(() => {
  const count = (s) => myApplications.filter((a) => a.status === s).length
  return [
    { label: '待审批', count: count('待审批'), icon: 'Clock', color: 'linear-gradient(135deg,#e67e22,#f39c12)' },
    { label: '审批中', count: count('审批中'), icon: 'Loading', color: 'linear-gradient(135deg,#1a4f9c,#2d6bc4)' },
    { label: '已通过', count: count('已通过'), icon: 'CircleCheck', color: 'linear-gradient(135deg,#1e8e4e,#35b06a)' },
    { label: '已驳回', count: count('已驳回'), icon: 'CircleClose', color: 'linear-gradient(135deg,#c0392b,#e74c3c)' }
  ]
})

const filtered = computed(() =>
  myApplications.filter((a) => !filterStatus.value || a.status === filterStatus.value)
)

function statusType(s) {
  return { '待审批': 'warning', '审批中': 'primary', '已通过': 'success', '已驳回': 'danger' }[s]
}

function goApplications(status) {
  router.push({ path: '/workbench/personal/applications', query: { status } })
}
</script>

<style scoped>
.status-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.status-card { padding: 20px 22px; display: flex; align-items: center; gap: 14px; }
.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-num { font-size: 26px; }
.status-label { font-size: 13px; color: var(--text-regular); }
.table-card { padding: 16px 20px 20px; }
.quick-card { padding: 20px; }
.msg-item { padding: 12px 0; border-bottom: 1px dashed var(--border-color); cursor: pointer; }
.msg-item:last-child { border-bottom: none; }
.msg-title { font-size: 13px; line-height: 1.6; color: var(--text-regular); }
.msg-item:hover .msg-title { color: var(--gov-blue); }
.msg-time { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
</style>
