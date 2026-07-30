<template>
  <div class="page-container">
    <!-- 核心服务运行状态 -->
    <div class="gov-card ops-card">
      <div class="toolbar-row">
        <span class="section-title">核心服务运行状态</span>
        <div class="spacer"></div>
        <el-tag :type="abnormalCount ? 'warning' : 'success'" effect="light">
          {{ abnormalCount ? `${abnormalCount} 项服务告警` : '全部服务运行正常' }}
        </el-tag>
      </div>
      <el-row :gutter="14" style="margin-top: 8px">
        <el-col :span="4" v-for="s in opsOverview.services" :key="s.name">
          <div class="svc-item" :class="{ 'svc-item--warn': s.status !== '正常' }">
            <el-icon :size="20" :color="s.status === '正常' ? '#3f7d2c' : '#e6a23c'">
              <CircleCheck v-if="s.status === '正常'" />
              <Warning v-else />
            </el-icon>
            <p class="svc-name">{{ s.name }}</p>
            <p class="svc-uptime">可用率 {{ s.uptime }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="16" style="margin-top: 16px">
      <!-- 服务器负载 -->
      <el-col :span="10">
        <div class="gov-card ops-card">
          <h3 class="section-title">服务器集群负载</h3>
          <div v-for="l in loads" :key="l.name" class="load-row">
            <span class="load-name">{{ l.name }}</span>
            <el-progress :percentage="l.value" :stroke-width="12" :color="loadColor(l.value)" style="flex: 1" />
          </div>
        </div>
      </el-col>
      <!-- 接口调用成功率 / 响应时长 -->
      <el-col :span="14">
        <div class="gov-card ops-card">
          <h3 class="section-title">接口调用成功率与响应时长（今日）</h3>
          <VChart :option="apiOption" height="300px" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VChart from '@/components/VChart.vue'
import { opsOverview } from '@/mock'

const abnormalCount = computed(() => opsOverview.services.filter((s) => s.status !== '正常').length)

const loads = [
  { name: 'CPU', value: opsOverview.serverLoad.cpu },
  { name: '内存', value: opsOverview.serverLoad.memory },
  { name: '磁盘', value: opsOverview.serverLoad.disk },
  { name: '网络带宽', value: opsOverview.serverLoad.network }
]

function loadColor(v) {
  if (v >= 85) return '#f56c6c'
  if (v >= 70) return '#e6a23c'
  return '#1a4f9c'
}

const apiOption = {
  color: ['#1a4f9c', '#e6a23c'],
  tooltip: { trigger: 'axis' },
  legend: { data: ['调用成功率', '平均响应时长'], top: 0 },
  grid: { left: 60, right: 60, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: opsOverview.apiSuccess.hours },
  yAxis: [
    { type: 'value', name: '成功率(%)', min: 99.5, max: 100 },
    { type: 'value', name: '响应(ms)', min: 0 }
  ],
  series: [
    { name: '调用成功率', type: 'line', smooth: true, data: opsOverview.apiSuccess.rate, areaStyle: { opacity: 0.1 } },
    { name: '平均响应时长', type: 'bar', yAxisIndex: 1, barWidth: 16, data: opsOverview.apiSuccess.rt, itemStyle: { borderRadius: [4, 4, 0, 0], opacity: 0.85 } }
  ]
}
</script>

<style scoped>
.ops-card { padding: 18px 24px; }
.svc-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px 12px;
  text-align: center;
}
.svc-item--warn { border-color: #e6a23c; background: #fdf6ec; }
.svc-name { font-size: 13px; font-weight: 600; margin-top: 8px; }
.svc-uptime { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
.load-row { display: flex; align-items: center; gap: 14px; margin-top: 32px; }
.load-name { width: 64px; font-size: 13.5px; color: var(--text-regular); text-align: right; }
</style>
