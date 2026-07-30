<template>
  <div class="page-container">
    <el-row :gutter="16">
      <!-- 需求表单 -->
      <el-col :span="14">
        <div class="gov-card form-card">
          <h3 class="section-title">需求提交</h3>
          <el-tabs v-model="demandType" style="margin-top: 10px">
            <el-tab-pane label="数据融合需求" name="fusion" />
            <el-tab-pane label="接口产品调整需求" name="api" />
          </el-tabs>
          <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width: 560px">
            <el-form-item label="需求名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入需求名称" />
            </el-form-item>
            <template v-if="demandType === 'fusion'">
              <el-form-item label="融合领域" prop="domain">
                <el-select v-model="form.domain" placeholder="请选择融合领域" style="width: 100%">
                  <el-option v-for="d in ['经济治理', '城市治理', '公共服务', '生态文明']" :key="d" :label="d" :value="d" />
                </el-select>
              </el-form-item>
              <el-form-item label="涉及数据源" prop="sources">
                <el-select v-model="form.sources" multiple placeholder="请选择涉及数据源（可多选）" style="width: 100%">
                  <el-option v-for="d in DEPTS" :key="d" :label="d" :value="d" />
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="目标接口" prop="api">
                <el-select v-model="form.api" placeholder="请选择需调整的接口" style="width: 100%">
                  <el-option v-for="a in apiList" :key="a.id" :label="`${a.name}（${a.version}）`" :value="a.name" />
                </el-select>
              </el-form-item>
              <el-form-item label="调整类型" prop="adjustType">
                <el-radio-group v-model="form.adjustType">
                  <el-radio value="字段调整">字段调整</el-radio>
                  <el-radio value="QPS调整">QPS调整</el-radio>
                  <el-radio value="协议升级">协议升级</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
            <el-form-item label="应用场景" prop="scene">
              <el-input v-model="form.scene" placeholder="请简述需求的业务应用场景" />
            </el-form-item>
            <el-form-item label="需求描述" prop="desc">
              <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请详细描述需求内容、期望交付时间等" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="submitting" @click="submit">提交需求</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>

      <!-- 需求进度 -->
      <el-col :span="10">
        <div class="gov-card form-card">
          <h3 class="section-title">我提交的需求</h3>
          <div v-for="d in submitted" :key="d.id" class="demand-item">
            <div class="demand-item-head">
              <el-tag size="small" effect="plain">{{ d.typeLabel }}</el-tag>
              <p class="demand-item-name">{{ d.name }}</p>
            </div>
            <div class="demand-item-progress">
              <el-progress :percentage="d.progress" :stroke-width="8" :status="d.progress === 100 ? 'success' : undefined" style="flex: 1" />
              <span class="demand-item-node">{{ d.node }}</span>
            </div>
            <p class="demand-item-time">提交时间：{{ d.time }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { apiList, DEPTS } from '@/mock'

const demandType = ref('fusion')
const formRef = ref(null)
const submitting = ref(false)

const form = ref({ name: '', domain: '', sources: [], api: '', adjustType: '字段调整', scene: '', desc: '' })

const rules = {
  name: [{ required: true, message: '请输入需求名称', trigger: 'blur' }],
  domain: [{ required: true, message: '请选择融合领域', trigger: 'change' }],
  sources: [{ required: true, message: '请选择涉及数据源', trigger: 'change' }],
  api: [{ required: true, message: '请选择目标接口', trigger: 'change' }],
  scene: [{ required: true, message: '请填写应用场景', trigger: 'blur' }],
  desc: [{ required: true, message: '请填写需求描述', trigger: 'blur' }]
}

const submitted = ref([
  { id: 'D001', typeLabel: '数据融合', name: '规划用地与不动产联动融合需求', progress: 60, node: '治理部方案评审', time: '2026-07-15 10:20' },
  { id: 'D002', typeLabel: '接口调整', name: '控规信息接口协议升级JSON', progress: 100, node: '已完成', time: '2026-06-28 14:35' },
  { id: 'D003', typeLabel: '数据融合', name: '测绘成果与市政管线融合分析', progress: 20, node: '需求受理', time: '2026-07-24 09:05' }
])

function submit() {
  formRef.value.validate((valid) => {
    if (!valid) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      submitted.value.unshift({
        id: `D${Date.now().toString().slice(-4)}`,
        typeLabel: demandType.value === 'fusion' ? '数据融合' : '接口调整',
        name: form.value.name,
        progress: 10,
        node: '已提交待受理',
        time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-')
      })
      resetForm()
      ElMessage.success('需求提交成功，可在右侧查看受理进度')
    }, 900)
  })
}

function resetForm() {
  formRef.value?.resetFields()
  form.value = { name: '', domain: '', sources: [], api: '', adjustType: '字段调整', scene: '', desc: '' }
}
</script>

<style scoped>
.form-card { padding: 20px 24px; min-height: 560px; }
.demand-item {
  padding: 14px 0;
  border-bottom: 1px dashed var(--border-color);
}
.demand-item-head { display: flex; align-items: center; gap: 8px; }
.demand-item-name { font-weight: 600; font-size: 14px; }
.demand-item-progress { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
.demand-item-node { font-size: 12.5px; color: var(--gov-blue); white-space: nowrap; }
.demand-item-time { font-size: 12.5px; color: var(--text-secondary); margin-top: 6px; }
</style>
