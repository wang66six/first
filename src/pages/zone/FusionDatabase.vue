<template>
  <div class="page-container zone-page">
    <!-- 顶部总览指标 -->
    <div class="overview-row">
      <div class="gov-card ov-card">
        <p class="ov-value"><CountUp :value="fusionMetrics.total" /><span class="unit">个</span></p>
        <p class="ov-label">融合库总量</p>
      </div>
      <div class="gov-card ov-card">
        <p class="ov-value"><CountUp :value="fusionMetrics.opened" /><span class="unit">个</span></p>
        <p class="ov-label">已开放融合主题</p>
      </div>
      <div class="gov-card ov-card">
        <p class="ov-value"><CountUp :value="fusionMetrics.calls" /><span class="unit">次</span></p>
        <p class="ov-label">累计调用次数</p>
      </div>
    </div>

    <!-- 融合主题目录列表 -->
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <el-select v-model="filterDomain" placeholder="所属领域" clearable style="width: 160px">
          <el-option v-for="d in domains" :key="d" :label="d" :value="d" />
        </el-select>
        <el-select v-model="filterDept" placeholder="提供部门" clearable style="width: 220px">
          <el-option v-for="d in depts" :key="d" :label="d" :value="d" />
        </el-select>
      </div>
      <el-table :data="filtered" stripe>
        <el-table-column label="融合主题名称" min-width="200">
          <template #default="{ row }">
            <a class="theme-link" @click="$router.push(`/zone/fusion-database/${row.id}`)">{{ row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="domain" label="所属领域" width="120" />
        <el-table-column prop="dept" label="提供部门" min-width="180" show-overflow-tooltip />
        <el-table-column prop="fields" label="融合字段数" width="110" />
        <el-table-column label="累计调用" width="140">
          <template #default="{ row }">{{ row.calls.toLocaleString() }} 次</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已开放' ? 'success' : 'warning'" effect="plain">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="$router.push(`/zone/fusion-database/${row.id}`)">查看主题</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CountUp from '@/components/CountUp.vue'
import { fusionMetrics, fusionThemes } from '@/mock'

const filterDomain = ref('')
const filterDept = ref('')

const domains = [...new Set(fusionThemes.map((t) => t.domain))]
const depts = [...new Set(fusionThemes.map((t) => t.dept))]

const filtered = computed(() =>
  fusionThemes.filter((t) =>
    (!filterDomain.value || t.domain === filterDomain.value) &&
    (!filterDept.value || t.dept === filterDept.value)
  )
)
</script>

<style scoped>
.zone-page { width: 1280px; margin: 0 auto; }
.overview-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
.ov-card { padding: 24px 28px; text-align: center; }
.ov-value { font-size: 30px; }
.ov-value .unit { font-size: 13px; color: var(--text-secondary); margin-left: 4px; font-weight: 400; }
.ov-label { font-size: 14px; color: var(--text-regular); margin-top: 4px; }
.table-card { padding: 16px 20px 20px; }
.theme-link { color: var(--gov-blue); font-weight: 600; cursor: pointer; }
.theme-link:hover { text-decoration: underline; }
@media (max-width: 1440px) { .zone-page { width: 1200px; } }
</style>
