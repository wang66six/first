<template>
  <div class="page-container stats-page">
    <!-- 顶部汇总指标 -->
    <div class="stat-cards">
      <div v-for="s in summary" :key="s.label" class="gov-card stat-card">
        <p class="stat-value"><CountUp :value="s.value" /><span class="unit">{{ s.unit }}</span></p>
        <p class="stat-label">{{ s.label }}</p>
      </div>
    </div>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <div class="gov-card chart-card">
          <h3 class="section-title">接口调用量趋势（近6个月）</h3>
          <VChart :option="callTrendOption" height="300px" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="gov-card chart-card">
          <h3 class="section-title">各委办活跃目录分布 TOP8</h3>
          <VChart :option="deptBarOption" height="300px" />
        </div>
      </el-col>
    </el-row>

    <div class="gov-card chart-card" style="margin-top: 16px">
      <h3 class="section-title">智能合约成交统计</h3>
      <VChart :option="contractOption" height="300px" />
    </div>
  </div>
</template>

<script setup>
import CountUp from '@/components/CountUp.vue'
import VChart from '@/components/VChart.vue'
import { homeMetrics } from '@/mock'

const summary = [
  ...homeMetrics.indicators.map((i) => ({ label: i.label, value: i.value, unit: i.unit })),
  { label: '接入委办单位', value: 63, unit: '家' },
  { label: '开放数据集', value: 5820, unit: '个' }
]

const months = ['2月', '3月', '4月', '5月', '6月', '7月']

const callTrendOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 60, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: months },
  yAxis: { type: 'value', name: '万次' },
  series: [{
    name: '接口调用量', type: 'line', smooth: true,
    data: [5620, 6180, 6850, 7320, 7960, 8542],
    areaStyle: { opacity: 0.15 },
    itemStyle: { color: '#1a4f9c' }
  }]
}

const deptBarOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 100, right: 30, top: 20, bottom: 30 },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: ['市场监管局', '公安局', '人社局', '规资局', '卫健委', '交通委', '住建委', '教委'].reverse() },
  series: [{
    type: 'bar', barWidth: 14,
    data: [1286, 1150, 1042, 986, 875, 820, 764, 690].reverse(),
    itemStyle: { color: '#2d6bc4', borderRadius: [0, 7, 7, 0] }
  }]
}

const contractOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['共享合约新增', '成交合约笔数'] },
  grid: { left: 60, right: 20, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: months },
  yAxis: { type: 'value' },
  series: [
    { name: '共享合约新增', type: 'bar', barWidth: 18, data: [285, 320, 356, 402, 438, 486], itemStyle: { color: '#1a4f9c', borderRadius: [4, 4, 0, 0] } },
    { name: '成交合约笔数', type: 'line', smooth: true, data: [8620, 9840, 11250, 12480, 13860, 15320], itemStyle: { color: '#d4a017' } }
  ]
}
</script>

<style scoped>
.stats-page { width: 1280px; margin: 0 auto; }
.stat-cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.stat-card { padding: 20px 24px; }
.stat-value { font-size: 26px; }
.stat-value .unit { font-size: 13px; color: var(--text-secondary); margin-left: 4px; font-weight: 400; }
.stat-label { font-size: 13px; color: var(--text-regular); margin-top: 4px; }
.chart-card { padding: 20px 24px; }
.chart-card .section-title { margin-bottom: 10px; font-size: 16px; }
@media (max-width: 1440px) { .stats-page { width: 1200px; } }
</style>
