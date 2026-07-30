<template>
  <div class="page-container zone-page" v-if="theme">
    <div class="gov-card head-card">
      <div>
        <h1>{{ theme.name }}</h1>
        <div class="head-tags">
          <el-tag effect="plain">{{ theme.domain }}</el-tag>
          <el-tag :type="theme.status === '已开放' ? 'success' : 'warning'" effect="plain">{{ theme.status }}</el-tag>
        </div>
        <el-descriptions :column="3" style="margin-top: 16px">
          <el-descriptions-item label="主题编号">{{ theme.id }}</el-descriptions-item>
          <el-descriptions-item label="提供部门">{{ theme.dept }}</el-descriptions-item>
          <el-descriptions-item label="累计调用">{{ theme.calls.toLocaleString() }} 次</el-descriptions-item>
        </el-descriptions>
      </div>
      <el-button type="primary" size="large" :loading="applying" @click="apply">申请使用</el-button>
    </div>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="14">
        <div class="gov-card body-card">
          <h3 class="section-title">融合数据字段（共 {{ theme.fields }} 个，展示部分）</h3>
          <el-table :data="fusionFields" stripe style="margin-top: 12px">
            <el-table-column prop="name" label="字段名称" width="180" />
            <el-table-column prop="source" label="来源部门" min-width="160" />
            <el-table-column prop="desc" label="字段说明" min-width="200" />
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="gov-card body-card">
          <h3 class="section-title">应用场景</h3>
          <div class="scene-list">
            <div v-for="s in theme.scenes" :key="s" class="scene-item">
              <el-icon class="scene-icon"><Aim /></el-icon>
              <div>
                <p class="scene-name">{{ s }}</p>
                <p class="scene-desc">依托本主题库多源融合数据，支撑业务闭环。</p>
              </div>
            </div>
          </div>
          <el-alert type="info" :closable="false" show-icon style="margin-top: 12px">
            融合库数据仅面向授权场景开放，申请时需明确使用范围并签署数据安全承诺。
          </el-alert>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-empty v-else description="融合主题不存在" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fusionThemes } from '@/mock'

const route = useRoute()
const router = useRouter()
const theme = computed(() => fusionThemes.find((t) => t.id === route.params.id))
const applying = ref(false)

const fusionFields = [
  { name: '主体统一标识', source: '市大数据中心', desc: '跨部门主体归一标识' },
  { name: '基础属性集', source: '市公安局 / 市场监管局', desc: '主体基础登记属性' },
  { name: '行为特征集', source: '多部门融合', desc: '业务办理、调用行为特征' },
  { name: '信用评价集', source: '市发展和改革委员会', desc: '公共信用综合评价' },
  { name: '空间位置集', source: '市规划和自然资源局', desc: '空间地理关联信息' },
  { name: '统计指标集', source: '市统计局', desc: '按区域/行业汇聚统计指标' }
]

function apply() {
  applying.value = true
  setTimeout(() => {
    applying.value = false
    ElMessage.success('融合主题使用申请已提交，可在个人工作台查看进度')
    router.push('/workbench/personal/applications')
  }, 700)
}
</script>

<style scoped>
.zone-page { width: 1280px; margin: 0 auto; }
.head-card { padding: 24px 28px; display: flex; justify-content: space-between; align-items: flex-start; }
.head-card h1 { font-size: 22px; margin-bottom: 12px; }
.head-tags { display: flex; gap: 8px; }
.body-card { padding: 20px 24px; }
.scene-list { display: flex; flex-direction: column; gap: 14px; margin-top: 14px; }
.scene-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: var(--gov-blue-bg);
  border-radius: 6px;
}
.scene-icon { color: var(--gov-blue); font-size: 22px; margin-top: 2px; }
.scene-name { font-weight: 600; }
.scene-desc { font-size: 12.5px; color: var(--text-secondary); margin-top: 2px; }
@media (max-width: 1440px) { .zone-page { width: 1200px; } }
</style>
