<template>
  <div class="page-container">
    <div class="gov-card table-card">
      <div class="toolbar-row">
        <span class="section-title">消息通知</span>
        <div class="spacer"></div>
        <el-radio-group v-model="filterRead">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="unread">未读</el-radio-button>
          <el-radio-button value="read">已读</el-radio-button>
        </el-radio-group>
        <el-button @click="markAllRead">全部标为已读</el-button>
      </div>
      <div class="msg-list">
        <div v-for="m in filtered" :key="m.id" class="msg-row" :class="{ 'msg-row--unread': !m.read }" @click="readMsg(m)">
          <el-tag size="small" :type="tagType(m.type)" effect="plain" style="flex-shrink: 0">{{ m.type }}</el-tag>
          <p class="msg-row-title">{{ m.title }}</p>
          <span class="msg-row-time">{{ m.time }}</span>
        </div>
        <el-empty v-if="!filtered.length" description="暂无消息" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { myMessages } from '@/mock'

const messages = ref(myMessages.map((m) => ({ ...m })))
const filterRead = ref('')

const filtered = computed(() =>
  messages.value.filter((m) =>
    filterRead.value === '' ? true : filterRead.value === 'unread' ? !m.read : m.read
  )
)

function tagType(t) {
  return { '审批通知': 'primary', '系统通知': 'info', '额度提醒': 'warning' }[t]
}

function readMsg(m) {
  m.read = true
}

function markAllRead() {
  messages.value.forEach((m) => (m.read = true))
  ElMessage.success('已全部标为已读')
}
</script>

<style scoped>
.table-card { padding: 16px 20px 20px; }
.msg-list { display: flex; flex-direction: column; }
.msg-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 12px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}
.msg-row:hover { background: var(--gov-blue-bg); }
.msg-row-title { flex: 1; font-size: 14px; color: var(--text-regular); }
.msg-row--unread .msg-row-title { font-weight: 700; color: var(--text-primary); }
.msg-row--unread::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gov-red);
  flex-shrink: 0;
}
.msg-row-time { font-size: 12.5px; color: var(--text-secondary); }
</style>
