<template>
  <div class="page-container">
    <el-row :gutter="16">
      <!-- 环形图 -->
      <el-col :span="10">
        <div class="gov-card chart-card">
          <h3 class="section-title">资源池分布（单位：核）</h3>
          <VChart :option="ringOption" height="300px" />
        </div>
      </el-col>
      <!-- 数字指标 -->
      <el-col :span="14">
        <div class="gov-card chart-card">
          <h3 class="section-title">资源池核心指标</h3>
          <el-row :gutter="16" style="margin-top: 24px">
            <el-col :span="12" v-for="m in metrics" :key="m.label">
              <div class="res-metric" :style="{ borderColor: m.color }">
                <p class="res-metric-value" :style="{ color: m.color }"><CountUp :value="m.value" /> <span class="res-metric-unit">核</span></p>
                <p class="res-metric-label">{{ m.label }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 使用趋势 -->
    <div class="gov-card chart-card" style="margin-top: 16px">
      <h3 class="section-title">资源使用趋势</h3>
      <VChart :option="trendOption" height="320px" />
    </div>
  </div>
</template>

<script setup>
import CountUp from '@/components/CountUp.vue'
import VChart from '@/components/VChart.vue'
import { resourcePool } from '@/mock'

const metrics = [
  { label: '总资源量', value: resourcePool.total, color: '#1a4f9c' },
  { label: '已申请量', value: resourcePool.applied, color: '#e6a23c' },
  { label: '已放出量', value: resourcePool.released, color: '#3f7d2c' },
  { label: '剩余可用量', value: resourcePool.remain, color: '#909399' }
]

const ringOption = {
  color: ['#e6a23c', '#3f7d2c', '#c6d4ea'],
  tooltip: { trigger: 'item', formatter: '{b}：{c} 核（{d}%）' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['52%', '74%'],
      center: ['50%', '45%'],
      label: { show: true, formatter: '{b}\n{c} 核' },
      data: [
        { name: '已申请', value: resourcePool.applied },
        { name: '已放出', value: resourcePool.released - resourcePool.applied > 0 ? resourcePool.released - resourcePool.applied : resourcePool.total - resourcePool.applied - resourcePool.remain },
        { name: '剩余可用', value: resourcePool.remain }
      ]
    }
  ]
}

const trendOption = {
  color: ['#e6a23c', '#3f7d2c'],
  tooltip: { trigger: 'axis' },
  legend: { data: ['已申请量', '已放出量'], top: 0 },
  grid: { left: 60, right: 30, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: resourcePool.trend.months, boundaryGap: false },
  yAxis: { type: 'value', name: '核' },
  series: [
    { name: '已申请量', type: 'line', smooth: true, data: resourcePool.trend.applied, areaStyle: { opacity: 0.15 } },
    { name: '已放出量', type: 'line', smooth: true, data: resourcePool.trend.released, areaStyle: { opacity: 0.15 } }
  ]
}
</script>

<style scoped>
.chart-card { padding: 20px 24px; }
.res-metric {
  border-left: 4px solid;
  background: var(--bg-page, #f5f7fa);
  border-radius: 6px;
  padding: 20px 22px;
  margin-bottom: 16px;
}
.res-metric-value { font-size: 30px; font-weight: 700; font-family: 'DIN Alternate', sans-serif; }
.res-metric-unit { font-size: 14px; font-weight: 400; }
.res-metric-label { font-size: 13.5px; color: var(--text-secondary); margin-top: 4px; }
</style>
