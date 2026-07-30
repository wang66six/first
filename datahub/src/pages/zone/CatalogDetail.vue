<template>
  <div class="page-container zone-page" v-if="catalog">
    <!-- 目录概要 -->
    <div class="gov-card head-card">
      <div class="head-main">
        <h1>{{ catalog.name }}</h1>
        <div class="head-tags">
          <el-tag effect="plain">{{ catalog.topic }}</el-tag>
          <el-tag effect="plain" type="info">{{ catalog.dataType }}</el-tag>
          <el-tag effect="plain" type="success">{{ catalog.status }}</el-tag>
          <el-tag effect="plain" type="warning">{{ catalog.tag }}</el-tag>
        </div>
        <el-descriptions :column="4" style="margin-top: 16px">
          <el-descriptions-item label="目录编号">{{ catalog.id }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ catalog.dept }}</el-descriptions-item>
          <el-descriptions-item label="更新频率">{{ catalog.frequency }}</el-descriptions-item>
          <el-descriptions-item label="最近更新">{{ catalog.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="字段数量">{{ catalog.fields }} 个</el-descriptions-item>
          <el-descriptions-item label="累计调用">{{ catalog.callCount.toLocaleString() }} 次</el-descriptions-item>
          <el-descriptions-item label="目录评分">
            <el-rate :model-value="catalog.score" disabled size="small" allow-half />
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="head-actions">
        <el-button type="warning" plain @click="addCart">
          <el-icon style="margin-right: 4px"><Star /></el-icon>收藏
        </el-button>
        <el-button type="primary" :loading="applying" @click="apply">立即申请</el-button>
      </div>
    </div>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16">
        <!-- 字段说明 -->
        <div class="gov-card body-card">
          <h3 class="section-title">字段说明</h3>
          <el-table :data="catalogFields" stripe style="margin-top: 12px">
            <el-table-column prop="name" label="字段英文名" width="140" />
            <el-table-column prop="label" label="字段中文名" width="160" />
            <el-table-column prop="type" label="数据类型" width="140" />
            <el-table-column prop="required" label="必填" width="70" />
            <el-table-column prop="desc" label="说明" />
          </el-table>
        </div>
        <!-- 挂载资源 -->
        <div class="gov-card body-card" style="margin-top: 16px">
          <h3 class="section-title">挂载资源</h3>
          <el-table :data="mountedResources" stripe style="margin-top: 12px">
            <el-table-column prop="name" label="资源名称" min-width="200" />
            <el-table-column prop="type" label="资源类型" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag type="success" effect="plain">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updated" label="最近同步时间" width="170" />
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <!-- 申请流程 -->
        <div class="gov-card body-card">
          <h3 class="section-title">申请流程</h3>
          <el-steps direction="vertical" :active="0" style="margin-top: 16px; height: 320px">
            <el-step v-for="s in approvalNodes" :key="s" :title="s" />
          </el-steps>
          <el-alert type="info" :closable="false" show-icon>
            提交申请后，一般 3 个工作日内完成审批；涉及敏感数据将增加安全评估环节。
          </el-alert>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-empty v-else description="目录不存在" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { catalogs, catalogFields, approvalNodes } from '@/mock'

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const applying = ref(false)

const catalog = computed(() => catalogs.find((c) => c.id === route.params.id))

const mountedResources = [
  { name: '共享库表：ods_base_info', type: '库表', status: '已挂载', updated: '2026-07-27 02:00' },
  { name: '查询接口：/api/v2/query', type: 'API接口', status: '已挂载', updated: '2026-07-27 08:00' },
  { name: '批量文件：全量数据包（月度）', type: '数据文件', status: '已挂载', updated: '2026-07-01 06:00' }
]

function addCart() {
  const c = catalog.value
  const ok = user.addToCart({ id: c.id, name: c.name, dept: c.dept, frequency: c.frequency })
  ElMessage[ok ? 'success' : 'info'](ok ? `「${c.name}」已收藏` : '该目录已在收藏夹中')
}

function apply() {
  applying.value = true
  setTimeout(() => {
    applying.value = false
    ElMessage.success('用数申请已提交，可在个人工作台查看进度')
    router.push('/workbench/personal/applications')
  }, 600)
}
</script>

<style scoped>
.zone-page { width: 1280px; margin: 0 auto; }
.head-card { padding: 24px 28px; display: flex; justify-content: space-between; gap: 24px; }
.head-main h1 { font-size: 22px; margin-bottom: 12px; }
.head-tags { display: flex; gap: 8px; }
.head-actions { display: flex; align-items: flex-start; gap: 4px; flex-shrink: 0; }
.body-card { padding: 20px 24px; }
@media (max-width: 1440px) { .zone-page { width: 1200px; } }
</style>
