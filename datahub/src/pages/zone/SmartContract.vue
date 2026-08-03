<template>
  <div class="page-container zone-page">
    <!-- 顶部核心指标卡 -->
    <div class="metric-row">
      <div class="gov-card metric-card">
        <div class="metric-icon"><el-icon><Share /></el-icon></div>
        <div>
          <p class="metric-label">共享智能合约</p>
          <p class="metric-main"><CountUp :value="contractMetrics.shared.total" /><span class="unit">条规则</span></p>
          <p class="metric-sub">当日新增 <b>+{{ contractMetrics.shared.todayNew }}</b></p>
        </div>
      </div>
      <div class="gov-card metric-card">
        <div class="metric-icon metric-icon--gold"><el-icon><SuccessFilled /></el-icon></div>
        <div>
          <p class="metric-label">成交合约</p>
          <p class="metric-main"><CountUp :value="contractMetrics.dealt.total" /><span class="unit">笔</span></p>
          <p class="metric-sub">当日成交 <b>+{{ contractMetrics.dealt.todayNew }}</b></p>
        </div>
      </div>
    </div>

    <div class="zone-layout">
      <!-- 左侧筛选栏：与数据资源专区一致的组织树 -->
      <aside class="side-panel">
        <!-- 部门搜索 -->
        <el-input v-model="deptKw" placeholder="请输入部门名称" clearable class="dept-search">
          <template #suffix><el-icon><Search /></el-icon></template>
        </el-input>

        <!-- 合约发起部门组织树 -->
        <div class="gov-card side-card">
          <div class="side-card-head">
            <el-icon><OfficeBuilding /></el-icon>
            <span>合约发起部门</span>
            <el-button v-if="activeDept" link type="primary" size="small" class="side-clear" @click="activeDept = ''">清除</el-button>
          </div>
          <el-tree
            ref="deptTreeRef"
            :data="deptTree"
            node-key="id"
            :default-expanded-keys="expandedKeys"
            :expand-on-click-node="false"
            :filter-node-method="filterDeptNode"
            class="dept-tree"
            @node-click="onDeptClick"
          >
            <template #default="{ data }">
              <span class="tree-node" :class="{ 'is-group': !data.isLeaf, 'is-active': data.isLeaf && activeDept === data.label }">
                <el-icon class="tree-folder"><Folder /></el-icon>
                <span class="tree-label">{{ data.label }}</span>
                <span class="tree-count">{{ data.count }}</span>
              </span>
            </template>
          </el-tree>
        </div>

        <!-- 交付方式筛选 -->
        <div class="gov-card side-card">
          <div class="side-card-head">
            <el-icon><Box /></el-icon>
            <span>交付方式</span>
            <el-button v-if="activeDelivery" link type="primary" size="small" class="side-clear" @click="activeDelivery = ''">清除</el-button>
          </div>
          <div
            v-for="d in deliveryBuckets"
            :key="d.name"
            class="delivery-row"
            :class="{ 'is-active': activeDelivery === d.name }"
            @click="toggleDelivery(d.name)"
          >
            <span>{{ d.name }}</span>
            <span class="delivery-count">{{ d.count }}</span>
          </div>
        </div>
      </aside>

      <!-- 右侧合约区 -->
      <div class="main-panel">
        <!-- 合约名称搜索 + 类型/状态筛选 -->
        <div class="gov-card filter-card">
          <div class="toolbar-row">
            <el-input v-model="kw" placeholder="输入合约名称搜索" clearable style="width: 260px">
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-select v-model="filterType" placeholder="合约类型" clearable style="width: 140px">
              <el-option label="共享合约" value="共享合约" />
              <el-option label="成交合约" value="成交合约" />
            </el-select>
            <el-select v-model="filterStatus" placeholder="合约状态" clearable style="width: 140px">
              <el-option v-for="s in ['执行中', '待审批', '已终止']" :key="s" :label="s" :value="s" />
            </el-select>
            <el-button type="primary">查询</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </div>
        </div>

        <!-- 合约卡片网格 -->
        <div class="contract-grid">
          <div
            v-for="c in filtered"
            :key="c.id"
            class="contract-card gov-card gov-card--hover"
            @click="$router.push(`/zone/smart-contract/${c.id}`)"
          >
            <div class="contract-head">
              <h3>{{ c.name }}</h3>
              <el-tag size="small" :type="c.type === '共享合约' ? 'primary' : 'success'" effect="plain">{{ c.type }}</el-tag>
            </div>
            <p class="contract-dept"><el-icon><OfficeBuilding /></el-icon>{{ c.dept }}</p>
            <div class="contract-stats">
              <span><el-icon><Box /></el-icon>交付方式：<b>{{ c.delivery }}</b></span>
              <span><el-icon><Money /></el-icon>成交笔数：<b>{{ c.deals.toLocaleString() }}</b></span>
              <span><el-icon><Clock /></el-icon>创建时间：<b>{{ c.createTime }}</b></span>
            </div>
            <div class="contract-foot">
              <div class="contract-tags">
                <el-tag :type="statusType(c.status)" effect="plain" size="small">{{ c.status }}</el-tag>
                <el-tag type="success" effect="plain" size="small">
                  <el-icon style="vertical-align: -2px"><Link /></el-icon> 已存证
                </el-tag>
              </div>
              <el-button
                v-if="canApprove && c.status === '待审批'"
                type="primary"
                size="small"
                :loading="approvingId === c.id"
                @click.stop="approve(c)"
              >一键审批</el-button>
              <el-button v-else type="primary" size="small" plain @click.stop="$router.push(`/zone/smart-contract/${c.id}`)">查看详情</el-button>
            </div>
          </div>
        </div>
        <el-empty v-if="!filtered.length" description="暂无符合条件的智能合约" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElNotification } from 'element-plus'
import CountUp from '@/components/CountUp.vue'
import { useUserStore } from '@/store/user'
import { contractMetrics, contracts as rawContracts, deptOrgTree } from '@/mock'

const user = useUserStore()
const canApprove = computed(() => ['commission', 'governance'].some((r) => user.roles.includes(r)))

const contracts = ref(rawContracts.map((c) => ({ ...c })))
const filterType = ref('')
const filterStatus = ref('')
const kw = ref('')
const approvingId = ref('')

/* ---------- 合约发起部门组织树 ---------- */
const deptKw = ref('')
const deptTreeRef = ref()
const activeDept = ref('')

// 部门计数随当前筛选条件联动（排除部门自身维度，分面统计）
const deptCountMap = computed(() => {
  const map = {}
  contracts.value.forEach((c) => {
    if (!matchContract(c, 'dept')) return
    map[c.dept] = (map[c.dept] || 0) + 1
  })
  return map
})

// 递归构建组织树节点：叶子取合约数，分组节点向下汇总；
// 筛选时仅保留有结果（count > 0）的部门，已选中的部门始终保留便于取消
function buildTreeNode(node) {
  if (!node.children) {
    const count = deptCountMap.value[node.label] || 0
    if (count === 0 && activeDept.value !== node.label) return null
    return { id: node.label, label: node.label, isLeaf: true, count }
  }
  const children = node.children.map(buildTreeNode).filter(Boolean)
  if (!children.length) return null
  return {
    id: `g-${node.label}`,
    label: node.label,
    isLeaf: false,
    count: children.reduce((sum, c) => sum + c.count, 0),
    children
  }
}

const deptTree = computed(() => deptOrgTree.map(buildTreeNode).filter(Boolean))
// 默认展开市政府、各区两个并列分组
const expandedKeys = ['g-市政府', 'g-各区']

watch(deptKw, (val) => deptTreeRef.value?.filter(val))

function filterDeptNode(value, data) {
  if (!value) return true
  return data.label.includes(value)
}

function onDeptClick(data) {
  if (!data.isLeaf) return
  activeDept.value = activeDept.value === data.label ? '' : data.label
}

/* ---------- 交付方式筛选 ---------- */
const DELIVERIES = ['API接口', '库表交换', '数据文件', '消息队列']
const activeDelivery = ref('')

function toggleDelivery(name) {
  activeDelivery.value = activeDelivery.value === name ? '' : name
}

/* ---------- 合约过滤 ---------- */
// excludeKey：统计某维度计数时排除该维度自身筛选（分面统计），'dept' / 'delivery'
function matchContract(c, excludeKey) {
  if (kw.value && !c.name.includes(kw.value)) return false
  if (filterType.value && c.type !== filterType.value) return false
  if (filterStatus.value && c.status !== filterStatus.value) return false
  if (excludeKey !== 'dept' && activeDept.value && c.dept !== activeDept.value) return false
  if (excludeKey !== 'delivery' && activeDelivery.value && c.delivery !== activeDelivery.value) return false
  return true
}

const filtered = computed(() => contracts.value.filter((c) => matchContract(c)))

const deliveryBuckets = computed(() =>
  DELIVERIES.map((name) => ({
    name,
    count: contracts.value.filter((c) => matchContract(c, 'delivery') && c.delivery === name).length
  }))
)

function resetFilters() {
  kw.value = ''
  filterType.value = ''
  filterStatus.value = ''
  activeDept.value = ''
  activeDelivery.value = ''
}

function statusType(s) {
  return { '执行中': 'success', '待审批': 'warning', '已终止': 'info' }[s]
}

// 一键审批：加载 → 实时更新状态 → 展示链上存证编号
function approve(row) {
  approvingId.value = row.id
  setTimeout(() => {
    approvingId.value = ''
    row.status = '执行中'
    const evidenceNo = `BC-${Date.now().toString().slice(-10)}`
    ElNotification({
      title: '审批完成',
      message: `「${row.name}」已通过审批并上链存证，存证编号：${evidenceNo}`,
      type: 'success',
      duration: 5000
    })
  }, 1200)
}
</script>

<style scoped>
.zone-page { width: min(1760px, 96%); margin: 0 auto; }
.metric-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.metric-card { padding: 24px 28px; display: flex; align-items: center; gap: 20px; }
.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a4f9c, #2d6bc4);
  color: #fff;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.metric-icon--gold { background: linear-gradient(135deg, #b8860b, #d4a017); }
.metric-label { font-size: 14px; color: var(--text-regular); }
.metric-main { font-size: 30px; margin: 4px 0; }
.metric-main .unit { font-size: 13px; color: var(--text-secondary); margin-left: 6px; font-weight: 400; }
.metric-sub { font-size: 13px; color: var(--text-secondary); }
.metric-sub b { color: var(--gov-red); }

.zone-layout { display: flex; align-items: flex-start; gap: 16px; }

/* ---------- 左侧筛选栏 ---------- */
.side-panel { width: 280px; flex-shrink: 0; }
.dept-search { margin-bottom: 12px; }
.side-card { padding: 0 0 8px; margin-bottom: 16px; overflow: hidden; }
.side-card-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--gov-blue);
  background: linear-gradient(90deg, rgba(26, 79, 156, 0.08), rgba(26, 79, 156, 0.02));
  border-bottom: 1px solid var(--border-color);
}
.side-clear { margin-left: auto; }

/* 组织树节点 */
.dept-tree { max-height: 520px; overflow-y: auto; padding: 0 4px 4px; }
.tree-node { flex: 1; display: flex; align-items: center; gap: 6px; padding-right: 8px; min-width: 0; }
.tree-folder { color: #3b82f6; font-size: 15px; flex-shrink: 0; }
.tree-node.is-group .tree-label { font-weight: 700; color: var(--text-primary); }
.tree-label { font-size: 13px; color: var(--text-regular); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tree-count { font-size: 12px; color: var(--text-secondary); margin-left: auto; flex-shrink: 0; }
:deep(.el-tree-node__content) { height: 32px; border-radius: 6px; }
:deep(.el-tree-node__content:has(.tree-node.is-active)) { background: #3b82f6; }
:deep(.el-tree-node__content:has(.tree-node.is-active)) .tree-label,
:deep(.el-tree-node__content:has(.tree-node.is-active)) .tree-count,
:deep(.el-tree-node__content:has(.tree-node.is-active)) .tree-folder,
:deep(.el-tree-node__content:has(.tree-node.is-active) .el-tree-node__expand-icon) { color: #fff; }

/* 交付方式行 */
.delivery-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 14px;
  margin: 0 4px;
  font-size: 13px;
  color: var(--text-regular);
  border-radius: 6px;
  cursor: pointer;
}
.delivery-row:hover { background: #f2f6fd; }
.delivery-row.is-active { background: #3b82f6; color: #fff; }
.delivery-row.is-active .delivery-count { color: #fff; }
.delivery-count { font-size: 12px; color: var(--text-secondary); }

/* ---------- 右侧合约区 ---------- */
.main-panel { flex: 1; min-width: 0; }
.filter-card { padding: 16px 20px; margin-bottom: 16px; }
.toolbar-row { display: flex; align-items: center; gap: 12px; }
.contract-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.contract-card { padding: 22px 24px; display: flex; flex-direction: column; }
.contract-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.contract-head h3 { font-size: 16px; color: var(--gov-blue); }
.contract-dept {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  margin: 10px 0;
}
.contract-stats { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 20px; margin-bottom: 4px; }
.contract-stats span { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--text-secondary); }
.contract-stats .el-icon { font-size: 14px; color: #8f9bb0; }
.contract-stats b { font-weight: 500; color: var(--text-regular); }
.contract-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}
.contract-tags { display: flex; align-items: center; gap: 8px; }
</style>
