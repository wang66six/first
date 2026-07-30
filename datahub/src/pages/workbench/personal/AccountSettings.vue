<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :span="14">
        <div class="gov-card form-card">
          <h3 class="section-title">基本信息</h3>
          <el-form :model="form" label-width="100px" style="margin-top: 20px; max-width: 480px">
            <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
            <el-form-item label="所属单位"><el-input v-model="form.dept" disabled /></el-form-item>
            <el-form-item label="账号角色"><el-input :model-value="user.roleLabel" disabled /></el-form-item>
            <el-form-item label="手机号码"><el-input v-model="form.phone" /></el-form-item>
            <el-form-item label="政务邮箱"><el-input v-model="form.email" /></el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="save">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="gov-card form-card">
          <h3 class="section-title">安全设置</h3>
          <div class="sec-item">
            <div>
              <p class="sec-name">登录密码</p>
              <p class="sec-desc">建议定期更换密码，保障账号安全</p>
            </div>
            <el-button link type="primary" @click="notice('修改密码')">修改</el-button>
          </div>
          <div class="sec-item">
            <div>
              <p class="sec-name">随申办绑定</p>
              <p class="sec-desc">已绑定，支持扫码快捷登录</p>
            </div>
            <el-tag type="success" effect="plain">已绑定</el-tag>
          </div>
          <div class="sec-item">
            <div>
              <p class="sec-name">消息提醒</p>
              <p class="sec-desc">审批结果、额度预警短信提醒</p>
            </div>
            <el-switch v-model="form.notify" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const user = useUserStore()
const saving = ref(false)
const form = ref({
  name: user.name,
  dept: user.dept,
  phone: '138****6688',
  email: 'user@bigdata.sh.gov.cn',
  notify: true
})

function save() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    ElMessage.success('账号信息已保存')
  }, 600)
}

function notice(action) {
  ElMessage.info(`${action}功能请通过单位管理员或统一身份认证平台办理`)
}
</script>

<style scoped>
.form-card { padding: 20px 24px; min-height: 420px; }
.sec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px dashed var(--border-color);
}
.sec-name { font-weight: 600; }
.sec-desc { font-size: 12.5px; color: var(--text-secondary); margin-top: 4px; }
</style>
