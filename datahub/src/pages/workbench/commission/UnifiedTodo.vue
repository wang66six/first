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

    <!-- 我的待办 -->
    <div class="gov-card ut-card">
      <div class="ut-head">
        <span class="section-title">我的待办</span>
      </div>
      <div class="ut-stats">
        <div class="ut-stat" style="--ut-color: #1a4f9c; --ut-bg: #eef4fc">
          <div class="ut-stat-icon"><el-icon :size="20"><Document /></el-icon></div>
          <div>
            <p class="ut-stat-value">{{ todos.length }}</p>
            <p class="ut-stat-label">事项总数</p>
          </div>
        </div>
        <div class="ut-stat" style="--ut-color: #f2711c; --ut-bg: #fff3e5">
          <div class="ut-stat-icon"><el-icon :size="20"><AlarmClock /></el-icon></div>
          <div>
            <p class="ut-stat-value">{{ todoPending }}</p>
            <p class="ut-stat-label">待办</p>
          </div>
        </div>
        <div class="ut-stat" style="--ut-color: #22a35c; --ut-bg: #e8f8ee">
          <div class="ut-stat-icon"><el-icon :size="20"><Finished /></el-icon></div>
          <div>
            <p class="ut-stat-value">{{ todos.length - todoPending }}</p>
            <p class="ut-stat-label">已办</p>
          </div>
        </div>
      </div>
      <!-- 待办筛选 -->
      <div class="ut-filters">
        <el-select v-model="todoFilter.type" placeholder="单据类型" clearable style="width: 140px">
          <el-option v-for="t in todoTypes" :key="t" :label="t" :value="t" />
        </el-select>
        <el-select v-model="todoFilter.status" placeholder="状态" clearable style="width: 120px">
          <el-option v-for="s in ['待处理', '处理中', '已完成']" :key="s" :label="s" :value="s" />
        </el-select>
        <el-input v-model="todoFilter.keyword" placeholder="搜索编号 / 标题" clearable style="width: 220px">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
      </div>
      <el-table :data="filteredTodos" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="id" label="编号" width="150" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="单据类型" width="110" align="center">
          <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="submitter" label="提交人" width="130" />
        <el-table-column prop="time" label="提交时间" width="170" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === '已完成' ? 'success' : row.status === '处理中' ? 'primary' : 'warning'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button v-if="row.status !== '已完成'" link type="primary" size="small" @click="handleTodo(row)">办理</el-button>
            <el-button v-else link size="small" @click="viewTodo(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { wbMessages, unifiedTodos } from '@/mock'

/* ---------- 我的消息 ---------- */
const messages = ref(wbMessages.map((m) => ({ ...m })))
const msgUnread = computed(() => messages.value.filter((m) => !m.read).length)

// 消息筛选：类型 / 阅读状态 / 关键字
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

/* ---------- 我的待办 ---------- */
const todos = ref(unifiedTodos.map((t) => ({ ...t })))
// 待办 = 待处理 + 处理中，已办 = 已完成
const todoPending = computed(() => todos.value.filter((t) => t.status !== '已完成').length)

// 待办筛选：类型 / 状态 / 编号或标题关键字
const todoTypes = computed(() => [...new Set(todos.value.map((t) => t.type))])
const todoFilter = reactive({ type: '', status: '', keyword: '' })
const filteredTodos = computed(() =>
  todos.value.filter(
    (t) =>
      (!todoFilter.type || t.type === todoFilter.type) &&
      (!todoFilter.status || t.status === todoFilter.status) &&
      (!todoFilter.keyword.trim() ||
        t.id.includes(todoFilter.keyword.trim()) ||
        t.title.includes(todoFilter.keyword.trim()))
  )
)

function handleTodo(row) {
  row.status = '已完成'
  ElMessage.success(`单据 ${row.id} 已办理完成`)
}

function viewTodo(row) {
  ElMessage.info(`单据 ${row.id} 已办结，详情功能接入中`)
}
</script>

<style scoped>
.ut-card { padding: 20px 24px; }
.ut-card + .ut-card { margin-top: 16px; }
.ut-head { display: flex; align-items: center; margin-bottom: 16px; }
.ut-head .spacer { flex: 1; }

/* 统计卡 */
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

/* 筛选区 */
.ut-filters { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }

/* 消息列表 */
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
