<template>
  <div class="page-container">
    <el-row :gutter="16">
      <!-- 角色列表 -->
      <el-col :span="8">
        <div class="gov-card perm-card">
          <h3 class="section-title">角色列表</h3>
          <div
            v-for="r in roles"
            :key="r.key"
            class="role-item"
            :class="{ 'role-item--active': activeRole === r.key }"
            @click="selectRole(r.key)"
          >
            <div>
              <p class="role-name">{{ r.name }}</p>
              <p class="role-desc">{{ r.desc }}</p>
            </div>
            <el-tag size="small" effect="plain">{{ r.count }} 个账号</el-tag>
          </div>
        </div>
      </el-col>

      <!-- 权限配置树 -->
      <el-col :span="16">
        <div class="gov-card perm-card">
          <div class="toolbar-row">
            <h3 class="section-title">权限配置 - {{ currentRole.name }}</h3>
            <div class="spacer"></div>
            <el-button type="primary" :loading="saving" @click="save">保存配置</el-button>
          </div>
          <el-tree
            ref="treeRef"
            :data="permissionTree"
            show-checkbox
            node-key="label"
            default-expand-all
            :default-checked-keys="checkedKeys"
            style="margin-top: 12px"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { permissionTree, accounts } from '@/mock'

const roles = [
  { key: 'user', name: '普通用户', desc: '门户浏览、用数申请', count: accounts.filter((a) => a.role === '普通用户').length, perms: ['数据目录检索', '用数申请', '产品申请', '收藏夹'] },
  { key: 'commission', name: '委办用户', desc: '供数管理、接口运维', count: accounts.filter((a) => a.role === '委办用户').length, perms: ['数据目录检索', '用数申请', '产品申请', '收藏夹', '工单管理', '需求提交', '供需统计', '白名单管理', '接口管理', '变更申请'] },
  { key: 'admin', name: '治理部管理员', desc: '平台治理与运维', count: accounts.filter((a) => a.role === '治理部管理员').length, perms: ['数据目录检索', '用数申请', '产品申请', '收藏夹', '工单管理', '需求提交', '供需统计', '白名单管理', '接口管理', '变更申请', '管账号', '管资源', '管数据', '管运维'] }
]

const activeRole = ref('user')
const treeRef = ref(null)
const saving = ref(false)

const currentRole = computed(() => roles.find((r) => r.key === activeRole.value))
const checkedKeys = computed(() => currentRole.value.perms)

function selectRole(key) {
  activeRole.value = key
  nextTick(() => {
    treeRef.value?.setCheckedKeys(currentRole.value.perms)
  })
}

function save() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    const count = treeRef.value.getCheckedKeys(true).length
    ElMessage.success(`「${currentRole.value.name}」权限配置已保存（共 ${count} 项功能权限）`)
  }, 700)
}
</script>

<style scoped>
.perm-card { padding: 20px 24px; min-height: 520px; }
.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.role-item:hover { border-color: var(--gov-blue); }
.role-item--active { border-color: var(--gov-blue); background: var(--gov-blue-bg); }
.role-name { font-weight: 600; }
.role-desc { font-size: 12.5px; color: var(--text-secondary); margin-top: 4px; }
</style>
