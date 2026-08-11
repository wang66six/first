<template>
  <div class="wbp-page">
    <div class="gov-card wbp-card">
      <div class="wbp-icon"><el-icon :size="40"><Compass /></el-icon></div>
      <h2 class="wbp-title">{{ $route.meta.wbName }}</h2>
      <p class="wbp-desc">该工作台正在设计建设中，敬请期待</p>
      <div class="wbp-actions">
        <el-button type="primary" plain @click="$router.push('/home')">返回门户首页</el-button>
        <el-button v-if="$route.meta.wbName === '治理部工作台'" type="primary" @click="$router.push('/manage')">进入管理后台</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wbp-page { min-height: calc(100vh - 200px); display: flex; align-items: center; justify-content: center; }
.wbp-card { text-align: center; padding: 60px 90px; }
.wbp-icon {
  width: 84px;
  height: 84px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: var(--gov-blue-lighter);
  color: var(--gov-blue);
  display: flex;
  align-items: center;
  justify-content: center;
}
.wbp-title { font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
.wbp-desc { font-size: 14px; color: var(--text-secondary); margin-bottom: 26px; }
.wbp-actions { display: flex; justify-content: center; gap: 12px; }
</style>
