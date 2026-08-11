<template>
  <div class="page-container" v-if="machine">
    <!-- 节点信息 -->
    <div class="gov-card info-card">
      <div class="toolbar-row">
        <span class="section-title">{{ machine.name }}</span>
        <el-tag :type="machine.status === '运行中' ? 'success' : 'danger'" effect="light" style="margin-left: 12px">{{ machine.status }}</el-tag>
        <div class="spacer"></div>
        <el-button plain @click="$router.back()">返回列表</el-button>
      </div>
      <el-descriptions :column="4" border style="margin-top: 12px">
        <el-descriptions-item label="节点ID">{{ machine.id }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ machine.dept }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ machine.ip }}</el-descriptions-item>
        <el-descriptions-item label="持续运行">{{ machine.uptime }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 资源占用仪表盘 -->
    <div class="gov-card info-card" style="margin-top: 16px">
      <h3 class="section-title">资源占用实时监控</h3>
      <el-row :gutter="16">
        <el-col :span="8" v-for="g in gauges" :key="g.name">
          <VChart :option="gaugeOption(g)" height="220px" />
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="16" style="margin-top: 16px">
      <!-- 任务列表 -->
      <el-col :span="14">
        <div class="gov-card info-card">
          <h3 class="section-title">任务列表（{{ machine.tasks }} 项运行中）</h3>
          <el-table :data="fmTasks" stripe style="margin-top: 12px">
            <el-table-column prop="name" label="任务名称" min-width="150" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="schedule" label="调度周期" width="120" />
            <el-table-column prop="lastRun" label="最近执行" width="150" />
            <el-table-column prop="status" label="结果" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === '成功' ? 'success' : 'danger'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <!-- 异常告警 -->
      <el-col :span="10">
        <div class="gov-card info-card">
          <h3 class="section-title">异常告警</h3>
          <div v-for="a in fmAlerts" :key="a.id" class="alert-item">
            <el-tag :type="a.level === '重要' ? 'warning' : 'info'" size="small" style="flex-shrink: 0">{{ a.level }}</el-tag>
            <div style="flex: 1">
              <p class="alert-content">{{ a.content }}</p>
              <p class="alert-time">{{ a.time }}</p>
            </div>
            <el-tag :type="a.status === '未处理' ? 'danger' : 'success'" effect="plain" size="small">{{ a.status }}</el-tag>
          </div>
          <el-empty v-if="!fmAlerts.length" description="暂无告警" :image-size="80" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import VChart from '@/components/VChart.vue'
import { frontMachines, fmTasks, fmAlerts } from '@/mock'

const route = useRoute()
const machine = computed(() => frontMachines.find((m) => m.id === route.params.id) || frontMachines[0])

const gauges = computed(() => [
  { name: 'CPU使用率', value: machine.value.cpu },
  { name: '内存使用率', value: machine.value.memory },
  { name: '磁盘使用率', value: machine.value.disk }
])

function gaugeOption(g) {
  return {
    series: [
      {
        type: 'gauge',
        radius: '95%',
        progress: { show: true, width: 12 },
        axisLine: { lineStyle: { width: 12 } },
        axisTick: { show: false },
        splitLine: { length: 8 },
        axisLabel: { distance: 18, fontSize: 10 },
        pointer: { width: 4 },
        itemStyle: { color: g.value >= 85 ? '#f56c6c' : g.value >= 70 ? '#e6a23c' : '#1a4f9c' },
        detail: { valueAnimation: true, formatter: '{value}%', fontSize: 20, offsetCenter: [0, '70%'] },
        title: { offsetCenter: [0, '95%'], fontSize: 13 },
        data: [{ value: g.value, name: g.name }]
      }
    ]
  }
}
</script>

<style scoped>
.info-card { padding: 18px 24px; }
.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 0;
  border-bottom: 1px dashed var(--border-color);
}
.alert-content { font-size: 13.5px; color: var(--text-regular); }
.alert-time { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
</style>
