<template>
  <div class="page-container">
    <!-- 大盘指标 -->
    <el-row :gutter="16">
      <el-col :span="8" v-for="m in metrics" :key="m.label">
        <div class="gov-card gov-card--hover monitor-card" @click="$router.push(m.path)">
          <div class="monitor-icon" :style="{ background: m.bg, color: m.color }">
            <el-icon :size="24"><component :is="m.icon" /></el-icon>
          </div>
          <div>
            <p class="monitor-value" :style="{ color: m.color }"><CountUp :value="m.value" /> <span class="monitor-unit">个</span></p>
            <p class="monitor-label">{{ m.label }}</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 部门异常分布 -->
    <div class="gov-card chart-card" style="margin-top: 16px">
      <div class="toolbar-row">
        <span class="section-title">异常分布（按部门统计）</span>
        <div class="spacer"></div>
        <el-tag effect="plain" type="info">数据截至 2026-07-27</el-tag>
      </div>
      <VChart :option="distOption" height="360px" />
    </div>
  </div>
</template>

<script setup>
import CountUp from '@/components/CountUp.vue'
import VChart from '@/components/VChart.vue'
import { dataMonitor } from '@/mock'

const metrics = [
  { label: '正常目录数', value: dataMonitor.normal, icon: 'CircleCheck', bg: '#f0f9eb', color: '#3f7d2c', path: '/zone/data-resource' },
  { label: '挂载异常数', value: dataMonitor.mountError, icon: 'Warning', bg: '#fdf6ec', color: '#e6a23c', path: '/manage/data/mount-check' },
  { label: '停更数据数', value: dataMonitor.stopped, icon: 'CircleClose', bg: '#fef0f0', color: '#f56c6c', path: '/manage/data/update-check' }
]

const distOption = {
  color: ['#e6a23c', '#f56c6c'],
  tooltip: { trigger: 'axis' },
  legend: { data: ['挂载异常', '停更数据'], top: 0 },
  grid: { left: 60, right: 30, top: 40, bottom: 40 },
  xAxis: { type: 'category', data: dataMonitor.deptDist.map((d) => d.dept), axisLabel: { interval: 0 } },
  yAxis: { type: 'value', name: '目录数' },
  series: [
    { name: '挂载异常', type: 'bar', barWidth: 16, data: dataMonitor.deptDist.map((d) => d.mountError), itemStyle: { borderRadius: [4, 4, 0, 0] } },
    { name: '停更数据', type: 'bar', barWidth: 16, data: dataMonitor.deptDist.map((d) => d.stopped), itemStyle: { borderRadius: [4, 4, 0, 0] } }
  ]
}
</script>

<style scoped>
.monitor-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 22px;
  cursor: pointer;
}
.monitor-icon {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.monitor-value { font-size: 28px; font-weight: 700; font-family: 'DIN Alternate', sans-serif; }
.monitor-unit { font-size: 13px; font-weight: 400; color: var(--text-secondary); }
.monitor-label { font-size: 13.5px; color: var(--text-secondary); margin-top: 2px; }
.chart-card { padding: 18px 24px; }
</style>
