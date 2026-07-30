<template>
  <div class="page-container zone-page" v-if="product">
    <div class="gov-card head-card">
      <div>
        <h1>{{ product.name }}</h1>
        <div class="head-tags">
          <el-tag effect="plain">{{ product.category }}</el-tag>
          <el-tag effect="plain" type="info">{{ product.delivery }}</el-tag>
        </div>
        <p class="head-desc">{{ product.desc }}</p>
      </div>
      <el-button type="primary" size="large" @click="dialogVisible = true">在线提交申请</el-button>
    </div>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16">
        <div class="gov-card body-card">
          <h3 class="section-title">产品信息</h3>
          <el-descriptions :column="2" border style="margin-top: 14px">
            <el-descriptions-item label="产品编号">{{ product.id }}</el-descriptions-item>
            <el-descriptions-item label="提供部门">{{ product.dept }}</el-descriptions-item>
            <el-descriptions-item label="交付方式">{{ product.delivery }}</el-descriptions-item>
            <el-descriptions-item label="使用范围">{{ product.scope }}</el-descriptions-item>
            <el-descriptions-item label="计费模式">政务共享免费 / 授权运营按约定</el-descriptions-item>
            <el-descriptions-item label="服务等级">7×24 小时，可用率 ≥ 99.9%</el-descriptions-item>
          </el-descriptions>
          <h3 class="section-title" style="margin-top: 24px">核心价值</h3>
          <p class="value-text">{{ product.desc }}产品数据来源权威、更新及时，已通过平台数据质量与安全合规双重认证，可直接用于业务系统集成。</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="gov-card body-card">
          <h3 class="section-title">审批流程</h3>
          <el-steps direction="vertical" :active="0" style="margin-top: 16px; height: 280px">
            <el-step title="提交申请" description="填写使用场景与期限" />
            <el-step title="提供部门审核" description="核对使用范围合规性" />
            <el-step title="安全评估" description="敏感数据附加评估" />
            <el-step title="开通交付" description="按交付方式开通服务" />
          </el-steps>
        </div>
      </el-col>
    </el-row>

    <!-- 在线申请弹窗 -->
    <el-dialog v-model="dialogVisible" title="产品使用申请" width="520px">
      <el-form :model="form" label-width="96px">
        <el-form-item label="申请产品"><el-input :model-value="product.name" disabled /></el-form-item>
        <el-form-item label="使用场景" required>
          <el-input v-model="form.scene" type="textarea" :rows="3" placeholder="请描述具体业务场景与用途" />
        </el-form-item>
        <el-form-item label="使用期限" required>
          <el-select v-model="form.period" style="width: 100%">
            <el-option label="6 个月" value="6m" />
            <el-option label="12 个月" value="12m" />
            <el-option label="长期（每年复核）" value="long" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" required>
          <el-input v-model="form.contact" placeholder="手机号或政务邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
  <el-empty v-else description="产品不存在" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { products } from '@/mock'

const route = useRoute()
const router = useRouter()
const product = computed(() => products.find((p) => p.id === route.params.id))

const dialogVisible = ref(false)
const submitting = ref(false)
const form = ref({ scene: '', period: '12m', contact: '' })

function submit() {
  if (!form.value.scene || !form.value.contact) {
    ElMessage.warning('请填写完整的申请信息')
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dialogVisible.value = false
    ElMessage.success('产品申请已提交，可在个人工作台查看审批进度')
    router.push('/workbench/personal/applications')
  }, 700)
}
</script>

<style scoped>
.zone-page { width: 1280px; margin: 0 auto; }
.head-card { padding: 24px 28px; display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
.head-card h1 { font-size: 22px; margin-bottom: 12px; }
.head-tags { display: flex; gap: 8px; margin-bottom: 12px; }
.head-desc { color: var(--text-regular); font-size: 14px; max-width: 760px; line-height: 1.8; }
.body-card { padding: 20px 24px; }
.value-text { margin-top: 12px; color: var(--text-regular); line-height: 1.9; font-size: 14px; }
@media (max-width: 1440px) { .zone-page { width: 1200px; } }
</style>
