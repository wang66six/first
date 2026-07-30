<template>
  <div class="page-container">
    <div class="gov-card stats-card">
      <div class="toolbar-row">
        <span class="section-title">供需统计</span>
        <div class="spacer"></div>
        <el-tag effect="plain" type="info">统计周期：2026年2月 - 2026年7月</el-tag>
      </div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="共享侧" name="share" />
        <el-tab-pane label="开放侧" name="open" />
        <el-tab-pane label="授权运营侧" name="operate" />
      </el-tabs>

      <!-- 汇总指标 -->
      <el-row :gutter="16" style="margin-bottom: 8px">
        <el-col :span="8" v-for="s in currentData.summary" :key="s.label">
          <div class="sd-summary">
            <p class="sd-summary-value"><CountUp :value="s.value" /> <span class="sd-summary-unit">{{ s.unit }}</span></p>
            <p class="sd-summary-label">{{ s.label }}</p>
          </div>
        </el-col>
      </el-row>

      <!-- 图表 -->
      <el-row :gutter="16">
        <el-col :span="14">
          <p class="chart-title">供数 / 用数趋势（折线）</p>
          <VChart :option="lineOption" height="340px" />
        </el-col>
        <el-col :span="10">
          <p class="chart-title">月度供需对比（柱状）</p>
          <VChart :option="barOption" height="340px" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CountUp from '@/components/CountUp.vue'
import VChart from '@/components/VChart.vue'
import { supplyDemandData } from '@/mock'

const activeTab = ref('share')
const currentData = computed(() => supplyDemandData[activeTab.value])

const unitLabel = computed(() => ({ share: '目录数', open: '数据集数', operate: '产品数' }[activeTab.value]))

const lineOption = computed(() => ({
  color: ['#1a4f9c', '#e6a23c'],
  tooltip: { trigger: 'axis' },
  legend: { data: ['供数', '用数'], top: 0 },
  grid: { left: 50, right: 20, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: currentData.value.months, boundaryGap: false },
  yAxis: { type: 'value', name: unitLabel.value },
  series: [
    { name: '供数', type: 'line', smooth: true, data: currentData.value.supply, areaStyle: { opacity: 0.12 } },
    { name: '用数', type: 'line', smooth: true, data: currentData.value.demand, areaStyle: { opacity: 0.12 } }
  ]
}))

const barOption = computed(() => ({
  color: ['#1a4f9c', '#e6a23c'],
  tooltip: { trigger: 'axis' },
  legend: { data: ['供数', '用数'], top: 0 },
  grid: { left: 50, right: 20, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: currentData.value.months },
  yAxis: { type: 'value', name: unitLabel.value },
  series: [
    { name: '供数', type: 'bar', barWidth: 14, data: currentData.value.supply, itemStyle: { borderRadius: [4, 4, 0, 0] } },
    { name: '用数', type: 'bar', barWidth: 14, data: currentData.value.demand, itemStyle: { borderRadius: [4, 4, 0, 0] } }
  ]
}))
</script>

<style scoped>
.stats-card { padding: 16px 20px 24px; }
.sd-summary {
  background: var(--gov-blue-bg);
  border-radius: 8px;
  padding: 18px 20px;
  text-align: center;
}
.sd-summary-value { font-size: 26px; font-weight: 700; color: var(--gov-blue); font-family: 'DIN Alternate', sans-serif; }
.sd-summary-unit { font-size: 13px; font-weight: 400; color: var(--text-secondary); }
.sd-summary-label { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
.chart-title { font-size: 14px; font-weight: 600; margin: 14px 0 6px; color: var(--text-primary); }
</style>
