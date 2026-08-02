<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">我的收藏夹（{{ user.cart.length }}）</span>
        <div class="spacer"></div>
        <el-button :disabled="!selected.length" @click="removeSelected">批量移除</el-button>
        <el-button type="primary" :disabled="!selected.length" :loading="submitting" @click="submitApply">
          统一提交用数申请（{{ selected.length }}）
        </el-button>
      </div>
      <el-table :data="user.cart" stripe @selection-change="(rows) => (selected = rows)">
        <el-table-column type="selection" width="46" />
        <el-table-column prop="id" label="目录编号" width="140" />
        <el-table-column label="目录名称" min-width="220">
          <template #default="{ row }">
            <a class="link" @click="$router.push(`/zone/data-resource/${row.id}`)">{{ row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="所属部门" min-width="180" show-overflow-tooltip />
        <el-table-column prop="frequency" label="更新频率" width="110" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click="removeOne(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!user.cart.length" description="收藏夹为空，去数据资源专区挑选目录吧">
        <el-button type="primary" @click="$router.push('/zone/data-resource')">前往数据资源专区</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'

const router = useRouter()
const user = useUserStore()
const selected = ref([])
const submitting = ref(false)

function removeOne(row) {
  user.removeFromCart([row.id])
  ElMessage.success('已移除')
}

function removeSelected() {
  ElMessageBox.confirm(`确定移除选中的 ${selected.value.length} 个目录吗？`, '批量移除', { type: 'warning' })
    .then(() => {
      user.removeFromCart(selected.value.map((r) => r.id))
      ElMessage.success('已批量移除')
    })
    .catch(() => {})
}

function submitApply() {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    const names = selected.value.map((r) => r.name)
    user.removeFromCart(selected.value.map((r) => r.id))
    ElMessage.success(`已统一提交 ${names.length} 项用数申请，可在「统一待办」查看进度`)
    router.push(`/workbench/${user.roles[0] || 'governance'}/todo`)
  }, 800)
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.link { color: var(--gov-blue); font-weight: 600; cursor: pointer; }
.link:hover { text-decoration: underline; }
</style>
