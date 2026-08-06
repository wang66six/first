<template>
  <div class="page-container">
    <!-- 我的消息 -->
    <div class="gov-card ut-card">
      <div class="ut-head">
        <span class="section-title">我的消息</span>
        <div class="spacer"></div>
        <el-button size="small" :disabled="!msgUnread" @click="readAll">全部标为已读</el-button>
      </div>
      <div class="ut-stats">
        <div class="ut-stat" style="--ut-color: #1a4f9c; --ut-bg: #eef4fc">
          <div class="ut-stat-icon"><el-icon :size="20"><Message /></el-icon></div>
          <div>
            <p class="ut-stat-value">{{ messages.length }}</p>
            <p class="ut-stat-label">消息总数</p>
          </div>
        </div>
        <div class="ut-stat" style="--ut-color: #f2711c; --ut-bg: #fff3e5">
          <div class="ut-stat-icon"><el-icon :size="20"><BellFilled /></el-icon></div>
          <div>
            <p class="ut-stat-value">{{ msgUnread }}</p>
            <p class="ut-stat-label">未读</p>
          </div>
        </div>
        <div class="ut-stat" style="--ut-color: #22a35c; --ut-bg: #e8f8ee">
          <div class="ut-stat-icon"><el-icon :size="20"><CircleCheck /></el-icon></div>
          <div>
            <p class="ut-stat-value">{{ messages.length - msgUnread }}</p>
            <p class="ut-stat-label">已读</p>
          </div>
        </div>
      </div>
      <!-- 消息筛选 -->
      <div class="ut-filters">
        <el-select v-model="msgFilter.type" placeholder="消息类型" clearable style="width: 140px">
          <el-option v-for="t in msgTypes" :key="t" :label="t" :value="t" />
        </el-select>
        <el-select v-model="msgFilter.read" placeholder="阅读状态" clearable style="width: 120px">
          <el-option label="未读" :value="false" />
          <el-option label="已读" :value="true" />
        </el-select>
        <el-input v-model="msgFilter.keyword" placeholder="搜索消息内容" clearable style="width: 220px">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
      </div>
      <div class="ut-msg-list">
        <div v-for="m in filteredMessages" :key="m.id" class="ut-msg" :class="{ unread: !m.read }" @click="markRead(m)">
          <span class="ut-msg-dot"></span>
          <el-tag size="small" :type="msgTagType(m.type)" effect="light">{{ m.type }}</el-tag>
          <span class="ut-msg-title">{{ m.title }}</span>
          <span class="ut-msg-time">{{ m.time }}</span>
        </div>
        <el-empty v-if="!filteredMessages.length" description="没有符合条件的消息" :image-size="70" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { wbMessages } from '@/mock'

const messages = ref(wbMessages.map((m) => ({ ...m })))
const msgUnread = computed(() => messages.value.filter((m) => !m.read).length)

const msgTypes = computed(() => [...new Set(messages.value.map((m) => m.type))])
const msgFilter = reactive({ type: '', read: '', keyword: '' })
const filteredMessages = computed(() =>
  messages.value.filter(
    (m) =>
      (msgFilter.type === '' || msgFilter.type === null || m.type === msgFilter.type) &&
      (msgFilter.read === '' || msgFilter.read === null || m.read === msgFilter.read) &&
      (!msgFilter.keyword.trim() || m.title.includes(msgFilter.keyword.trim()))
  )
)

const msgTagType = (t) =>
  ({ 审批通知: 'primary', 工单提醒: 'warning', 供需通知: 'success', 额度提醒: 'danger' }[t] || 'info')

function markRead(m) {
  if (m.read) return
  m.read = true
  ElMessage.success('已标为已读')
}

function readAll() {
  messages.value.forEach((m) => (m.read = true))
  ElMessage.success('全部消息已标为已读')
}
</script>

<style scoped>
.ut-card { padding: 20px 24px; }
.ut-head { display: flex; align-items: center; margin-bottom: 16px; }
.ut-head .spacer { flex: 1; }

.ut-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
.ut-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--border-light, #e6ebf2);
  border-left: 3px solid var(--ut-color);
  border-radius: 8px;
  background: #fff;
}
.ut-stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ut-bg);
  color: var(--ut-color);
}
.ut-stat-value { font-size: 24px; font-weight: 700; color: var(--text-primary); font-family: 'DIN Alternate', sans-serif; }
.ut-stat-label { font-size: 12.5px; color: var(--text-secondary); margin-top: 2px; }

.ut-filters { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }

.ut-msg-list { border: 1px solid var(--border-light, #e6ebf2); border-radius: 8px; overflow: hidden; }
.ut-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  border-bottom: 1px solid #f0f3f8;
  cursor: pointer;
  transition: background 0.2s;
}
.ut-msg:last-child { border-bottom: none; }
.ut-msg:hover { background: #f7fafd; }
.ut-msg-dot { width: 7px; height: 7px; border-radius: 50%; background: transparent; flex-shrink: 0; }
.ut-msg.unread .ut-msg-dot { background: #e04a4a; }
.ut-msg-title { font-size: 13.5px; color: var(--text-secondary); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ut-msg.unread .ut-msg-title { color: var(--text-primary); font-weight: 600; }
.ut-msg-time { font-size: 12px; color: var(--text-secondary); flex-shrink: 0; }
</style>