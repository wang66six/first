<template>
  <div class="page-container zone-page">
    <div class="zone-layout">
      <!-- 左侧筛选栏 -->
      <aside class="side-panel">
        <!-- 部门搜索 -->
        <el-input v-model="deptKw" placeholder="请输入部门名称" clearable class="dept-search">
          <template #suffix><el-icon><Search /></el-icon></template>
        </el-input>

        <!-- 数据来源部门组织树 -->
        <div class="gov-card side-card">
          <div class="side-card-head">
            <el-icon><OfficeBuilding /></el-icon>
            <span>数据来源部门</span>
            <el-button v-if="filters.dept" link type="primary" size="small" class="side-clear" @click="filters.dept = ''">清除</el-button>
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
              <span class="tree-node" :class="{ 'is-group': !data.isLeaf, 'is-active': data.isLeaf && filters.dept === data.label }">
                <el-icon class="tree-folder"><Folder /></el-icon>
                <span class="tree-label">{{ data.label }}</span>
                <span class="tree-count">{{ data.count }}</span>
              </span>
            </template>
          </el-tree>
        </div>

        <!-- 综合得分筛选 -->
        <div class="gov-card side-card">
          <div class="side-card-head">
            <el-icon><Star /></el-icon>
            <span>综合得分</span>
            <el-button v-if="filters.stars !== null" link type="primary" size="small" class="side-clear" @click="filters.stars = null">清除</el-button>
          </div>
          <div
            v-for="b in scoreBuckets"
            :key="b.stars"
            class="score-row"
            :class="{ 'is-active': filters.stars === b.stars }"
            @click="toggleStars(b.stars)"
          >
            <el-rate :model-value="b.stars" disabled size="small" />
            <span class="score-count">{{ b.count }}</span>
          </div>
        </div>
      </aside>

      <!-- 右侧列表区 -->
      <div class="main-panel">
        <!-- 顶部筛选栏 -->
        <div class="gov-card filter-card">
          <div class="toolbar-row">
            <el-input
              v-model="filters.kw"
              placeholder="输入目录名称或目录编码搜索"
              clearable
              style="width: 280px"
              @keyup.enter="page = 1"
            >
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-button type="primary" @click="page = 1">查询</el-button>
            <el-button @click="resetFilters">重置</el-button>
            <!-- 首页下钻带入的专题过滤 -->
            <el-tag v-if="filters.topic" closable type="primary" @close="filters.topic = ''">专题：{{ filters.topic }}</el-tag>
            <div class="spacer"></div>
            <!-- 收藏夹入口 -->
            <el-badge :value="user.cartCount" :hidden="!user.cartCount">
              <el-button type="warning" plain @click="$router.push(`/workbench/${user.roles[0] || 'governance'}/favorites`)">
                <el-icon style="margin-right: 4px"><Star /></el-icon>收藏夹
              </el-button>
            </el-badge>
          </div>

          <!-- 高级筛选 -->
          <div class="adv-filter">
            <p class="adv-title">高级筛选</p>
            <div v-for="dim in advDims" :key="dim.key" class="adv-row">
              <span class="adv-label">{{ dim.label }}</span>
              <span
                class="adv-pill"
                :class="{ 'is-active': !filters[dim.key] }"
                @click="setDim(dim.key, '')"
              >全部 ({{ filtered.length }})</span>
              <span
                v-for="opt in dim.options"
                :key="opt"
                class="adv-pill"
                :class="{ 'is-active': filters[dim.key] === opt }"
                @click="setDim(dim.key, opt)"
              >{{ opt }} ({{ dimCount(dim.key, opt) }})</span>
            </div>

            <!-- 底部：属性勾选 + 排序 -->
            <div class="adv-bottom">
              <el-checkbox v-model="filters.authOp" @change="page = 1">是否授权运营目录</el-checkbox>
              <el-checkbox v-model="filters.hasSample" @change="page = 1">是否有样例数据</el-checkbox>
              <div class="spacer"></div>
              <span
                v-for="s in sortItems"
                :key="s.key"
                class="sort-item"
                :class="{ 'is-active': sortKey === s.key }"
                @click="setSort(s.key)"
              >
                {{ s.label }}
                <span class="sort-carets">
                  <el-icon :class="{ on: sortKey === s.key && sortOrder === 'asc' }"><CaretTop /></el-icon>
                  <el-icon :class="{ on: sortKey === s.key && sortOrder === 'desc' }"><CaretBottom /></el-icon>
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- 数据目录条目列表 -->
        <div class="gov-card table-card" v-loading="loading">
          <div v-if="pageData.length" class="catalog-list">
            <div v-for="row in pageData" :key="row.id" class="catalog-item">
              <!-- 标题行：名称 + 所属单位/系统 + 目录编码 -->
              <div class="item-head">
                <el-icon class="head-icon"><InfoFilled /></el-icon>
                <a class="catalog-link" @click="$router.push(`/zone/data-resource/${row.id}`)">{{ row.name }}</a>
                <span class="meta-cell head-meta"><el-icon><OfficeBuilding /></el-icon>所属单位：<b>{{ row.dept }}</b></span>
                <span class="meta-cell head-meta"><el-icon><Monitor /></el-icon>所属系统：<b>{{ sysOf(row) }}</b></span>
                <span class="res-code">目录编码：{{ row.code }}</span>
              </div>
              <!-- 属性行 -->
              <div class="item-meta">
                <span class="meta-cell"><el-icon><Calendar /></el-icon>更新频率：<b>{{ row.frequency }}</b></span>
                <span class="meta-cell"><el-icon><Connection /></el-icon>资源状态：<b>{{ row.mounted }}</b></span>
                <span class="meta-cell"><el-icon><Share /></el-icon>共享类型：<b>{{ row.shareType }}</b></span>
                <span class="meta-cell"><el-icon><Unlock /></el-icon>开放类型：<b>{{ row.openType }}</b></span>
                <span class="meta-cell"><el-icon><Clock /></el-icon>更新时间：<b>{{ row.updateTime }}</b></span>
              </div>
              <!-- 数据项行：单行显示，超出裁切，弹窗查看全部 -->
              <div class="item-fields">
                <span class="fields-label"><el-icon><Grid /></el-icon>数据项({{ row.fields }})：</span>
                <div class="fields-clip">
                  <span v-for="f in fieldTags(row)" :key="f" class="field-tag">{{ f }}</span>
                </div>
                <!-- 全部数据项气泡：显示在按钮上方 -->
                <el-popover placement="top-end" :width="640" trigger="click">
                  <template #reference>
                    <span class="fields-more">查看全部<el-icon><View /></el-icon></span>
                  </template>
                  <div class="field-pop">
                    <p class="field-pop-title">全部数据项</p>
                    <div class="field-dialog-tags">
                      <span v-for="f in fieldTags(row)" :key="f" class="field-tag field-tag--lg">{{ f }}</span>
                    </div>
                  </div>
                </el-popover>
              </div>
              <!-- 底部行：统计 + 操作 -->
              <div class="item-foot">
                <span class="meta-cell"><el-icon><Pointer /></el-icon>点击次数：{{ row.callCount.toLocaleString() }}</span>
                <span class="meta-cell"><el-icon><DataLine /></el-icon>申请次数：{{ row.applyCount }}</span>
                <span class="meta-cell score-cell">
                  <el-popover placement="top" width="280" trigger="hover">
                    <template #reference>
                      <span class="score-box">
                        综合得分：<el-rate :model-value="row.score" disabled size="small" allow-half />
                        <b>{{ row.score }}</b>
                      </span>
                    </template>
                    <div class="score-tip">
                      <p class="score-tip-title">评分维度说明</p>
                      <p>· 数据完整性（30%）：字段完整、无缺失记录</p>
                      <p>· 更新及时性（30%）：按承诺频率更新</p>
                      <p>· 使用满意度（25%）：用数部门评价反馈</p>
                      <p>· 挂载规范性（15%）：资源挂载符合平台规范</p>
                    </div>
                  </el-popover>
                </span>
                <div class="spacer"></div>
                <el-button class="apply-btn" type="primary" @click="applyNow(row)">申请</el-button>
                <el-button
                  class="fav-btn"
                  :type="isFav(row) ? 'info' : 'warning'"
                  plain
                  @click="toggleFav(row)"
                >{{ isFav(row) ? '已收藏' : '收藏' }}</el-button>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无符合条件的数据目录" />
          <el-pagination
            v-model:current-page="page"
            :page-size="pageSize"
            :total="filtered.length"
            layout="total, prev, pager, next, jumper"
            background
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { catalogs, deptOrgTree } from '@/mock'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

const loading = ref(false)
const page = ref(1)
const pageSize = 15

const filters = ref({
  dept: '',
  stars: null,
  topic: route.query.topic || '',
  kw: route.query.kw || '',
  share: '',
  open: '',
  mount: '',
  res: '',
  authOp: false,
  hasSample: false
})

// AI 搜索 / 首页下钻带入的查询参数
watch(() => route.query, (q) => {
  if (q.topic) filters.value.topic = q.topic
  if (q.kw) filters.value.kw = q.kw
})

/* ---------- 数据来源部门组织树 ---------- */
const deptKw = ref('')
const deptTreeRef = ref()

// 部门计数随当前筛选条件联动（排除部门自身维度，分面统计）
const deptCountMap = computed(() => {
  const map = {}
  catalogs.forEach((c) => {
    if (!matchFilters(c, 'dept')) return
    map[c.dept] = (map[c.dept] || 0) + 1
  })
  return map
})

// 递归构建组织树节点：叶子取目录数，分组节点向下汇总；
// 筛选时仅保留有结果（count > 0）的部门，已选中的部门始终保留便于取消
function buildTreeNode(node) {
  if (!node.children) {
    const count = deptCountMap.value[node.label] || 0
    if (count === 0 && filters.value.dept !== node.label) return null
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
  // 再次点击已选部门则取消筛选
  filters.value.dept = filters.value.dept === data.label ? '' : data.label
  page.value = 1
}

/* ---------- 综合得分筛选 ---------- */
// 星级分桶：n 星 = [n-0.5, n+0.5)，5 星含满分
const starRange = (n) => [n - 0.5, n === 5 ? 5.01 : n + 0.5]

const scoreBuckets = computed(() =>
  [5, 4, 3, 2, 1].map((stars) => {
    const [min, max] = starRange(stars)
    return { stars, count: catalogs.filter((c) => c.score >= min && c.score < max).length }
  })
)

function toggleStars(stars) {
  filters.value.stars = filters.value.stars === stars ? null : stars
  page.value = 1
}

/* ---------- 高级筛选与排序 ---------- */
const advDims = [
  { key: 'share', label: '共享类型', field: 'shareType', options: ['无条件共享', '有条件共享', '不共享'] },
  { key: 'open', label: '开放类型', field: 'openType', options: ['可对社会开放', '不可对社会开放', '部分对社会开放'] },
  { key: 'mount', label: '挂载情况', field: 'mounted', options: ['已挂载', '未挂载'] },
  { key: 'res', label: '资源类型', field: 'resType', options: ['文件', '库表', '接口', '消息队列'] }
]
const dimFieldMap = Object.fromEntries(advDims.map((d) => [d.key, d.field]))

function matchFilters(c, excludeKey) {
  const f = filters.value
  const range = f.stars !== null ? starRange(f.stars) : null
  if (excludeKey !== 'dept' && f.dept && c.dept !== f.dept) return false
  if (range && !(c.score >= range[0] && c.score < range[1])) return false
  if (f.topic && c.topic !== f.topic) return false
  if (f.kw && !c.name.includes(f.kw) && !c.code.includes(f.kw)) return false
  if (f.authOp && !c.authOp) return false
  if (f.hasSample && !c.hasSample) return false
  for (const d of advDims) {
    if (d.key === excludeKey) continue
    if (f[d.key] && c[d.field] !== f[d.key]) return false
  }
  return true
}

// 某维度选项计数：不含该维度自身的筛选（分面统计）
function dimCount(key, opt) {
  return catalogs.filter((c) => matchFilters(c, key) && c[dimFieldMap[key]] === opt).length
}

function setDim(key, val) {
  filters.value[key] = filters.value[key] === val ? '' : val
  page.value = 1
}

const sortItems = [
  { key: 'score', label: '综合排序' },
  { key: 'applyCount', label: '申请次数' },
  { key: 'fields', label: '数据项个数' },
  { key: 'callCount', label: '点击次数' },
  { key: 'updateTime', label: '更新时间' }
]
const sortKey = ref('score')
const sortOrder = ref('desc')

function setSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
  page.value = 1
}

/* ---------- 列表过滤 ---------- */
const filtered = computed(() => catalogs.filter((c) => matchFilters(c)))

const sorted = computed(() =>
  [...filtered.value].sort((a, b) => {
    const va = a[sortKey.value]
    const vb = b[sortKey.value]
    // 更新时间为日期字符串，其余为数值
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb
    return sortOrder.value === 'desc' ? -cmp : cmp
  })
)

const pageData = computed(() =>
  sorted.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

function resetFilters() {
  filters.value = { dept: '', stars: null, topic: '', kw: '', share: '', open: '', mount: '', res: '', authOp: false, hasSample: false }
  deptKw.value = ''
  sortKey.value = 'score'
  sortOrder.value = 'desc'
  page.value = 1
}

/* ---------- 条目展示辅助 ---------- */
// 数据项字段池（示例字段，按目录字段数截取）
const FIELD_POOL = ['姓名', '身份证号码', '性别', '出生日期', '民族', '联系电话', '户籍地址', '居住地址', '所属街道', '所属居委会', '人员类别', '证件类型', '证件号码', '婚姻状况', '文化程度', '政治面貌', '就业状态', '工作单位', '职业类别', '参保状态', '参保类型', '社会保障卡号', '健康档案编号', '紧急联系人', '紧急联系电话', '数据更新时间', '数据来源', '行政区划代码', '经度', '纬度']

const fieldTags = (row) => FIELD_POOL.slice(0, row.fields)

// 所属系统：区级部门归口区平台，其余归口市平台
const sysOf = (row) => (row.dept.endsWith('区') ? '区政务资源交换平台' : '市政务资源交换平台')

/* ---------- 收藏 ---------- */
const isFav = (row) => user.cart.some((c) => c.id === row.id)

function toggleFav(row) {
  if (isFav(row)) {
    user.removeFromCart([row.id])
    ElMessage.info(`已取消收藏「${row.name}」`)
  } else {
    user.addToCart({ id: row.id, name: row.name, dept: row.dept, frequency: row.frequency })
    ElMessage.success(`「${row.name}」已收藏`)
  }
}

function applyNow(row) {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success(`「${row.name}」用数申请已提交，可在工作台统一待办查看进度`)
    router.push(`/workbench/${user.roles[0] || 'governance'}/todo`)
  }, 600)
}
</script>

<style scoped>
.zone-page { width: min(1760px, 96%); margin: 0 auto; }
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
.dept-tree { max-height: 480px; overflow-y: auto; padding: 0 4px 4px; }
.tree-node { flex: 1; display: flex; align-items: center; gap: 6px; padding-right: 8px; min-width: 0; }
.tree-folder { color: #3b82f6; font-size: 15px; flex-shrink: 0; }
.tree-node.is-group .tree-label { font-weight: 700; color: var(--text-primary); }
.tree-label { font-size: 13px; color: var(--text-regular); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tree-count { font-size: 12px; color: var(--text-secondary); margin-left: auto; flex-shrink: 0; }
/* 选中部门：整行蓝底白字 */
:deep(.el-tree-node__content) { height: 32px; border-radius: 6px; }
:deep(.el-tree-node__content:has(.tree-node.is-active)) { background: #3b82f6; }
:deep(.el-tree-node__content:has(.tree-node.is-active)) .tree-label,
:deep(.el-tree-node__content:has(.tree-node.is-active)) .tree-count,
:deep(.el-tree-node__content:has(.tree-node.is-active)) .tree-folder,
:deep(.el-tree-node__content:has(.tree-node.is-active) .el-tree-node__expand-icon) { color: #fff; }

/* 综合得分行 */
.score-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}
.score-row:hover { background: rgba(26, 79, 156, 0.05); }
.score-row.is-active { background: rgba(26, 79, 156, 0.1); }
.score-count { font-size: 12.5px; color: var(--text-secondary); }
.score-row.is-active .score-count { color: var(--gov-blue); font-weight: 700; }

/* ---------- 右侧列表区 ---------- */
.main-panel { flex: 1; min-width: 0; }
.filter-card { padding: 16px 20px; margin-bottom: 16px; }

/* ---------- 高级筛选 ---------- */
.adv-filter { margin-top: 14px; border-top: 1px solid var(--border-color); padding-top: 12px; }
.adv-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0 0 12px; }
.adv-row { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.adv-label { width: 64px; flex-shrink: 0; font-size: 13.5px; color: var(--gov-blue); }
.adv-pill {
  padding: 5px 14px;
  border-radius: 6px;
  background: #f2f3f5;
  font-size: 13px;
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.adv-pill:hover { color: var(--gov-blue); }
.adv-pill.is-active { background: #e8f1fd; color: var(--gov-blue); font-weight: 600; }
.adv-bottom {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 4px;
  padding: 8px 14px;
  border-radius: 6px;
  background: #f5f8fd;
}
/* 排序条件靠右对齐 */
.adv-bottom .spacer { flex: 1; }
.sort-item {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 13px;
  color: var(--text-regular);
  cursor: pointer;
  user-select: none;
}
.sort-item:hover, .sort-item.is-active { color: var(--gov-blue); font-weight: 600; }
.sort-carets { display: inline-flex; flex-direction: column; line-height: 0; }
.sort-carets .el-icon { font-size: 11px; height: 7px; color: #c0c4cc; }
.sort-carets .el-icon.on { color: var(--gov-blue); }
.table-card { padding: 4px 20px 20px; }

/* ---------- 目录条目 ---------- */
.catalog-item { padding: 18px 4px 16px; border-bottom: 1px solid var(--border-color); }
.catalog-item:last-child { border-bottom: none; }
.item-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.head-icon { color: var(--gov-blue); font-size: 17px; }
.item-head .catalog-link { font-size: 16px; }
.res-code { margin-left: auto; font-size: 13px; color: var(--text-secondary); flex-shrink: 0; }
.head-meta { margin-left: 16px; }
.item-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 28px; margin-bottom: 12px; }
.meta-cell { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: var(--text-secondary); }
.meta-cell .el-icon { font-size: 14px; color: #8f9bb0; }
.meta-cell b { font-weight: 500; color: var(--text-regular); }
.item-fields { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.fields-label { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: var(--text-secondary); flex-shrink: 0; }
/* 单行裁切容器：超出部分不显示 */
.fields-clip { display: flex; gap: 8px; flex: 1; min-width: 0; overflow: hidden; }
.field-tag {
  padding: 3px 10px;
  border-radius: 4px;
  background: #eef4fd;
  font-size: 12.5px;
  color: var(--gov-blue);
  white-space: nowrap;
  flex-shrink: 0;
}
.field-tag--lg { padding: 6px 14px; font-size: 13.5px; border-radius: 6px; }
.field-pop-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 4px 0 12px; }
.field-dialog-tags { display: flex; flex-wrap: wrap; gap: 12px; padding: 4px 0 8px; }
.fields-more {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  color: var(--text-regular);
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}
.fields-more:hover { color: var(--gov-blue); }
.item-foot { display: flex; align-items: center; gap: 28px; }
.item-foot .spacer { flex: 1; }
.score-cell .score-box { cursor: pointer; }
.apply-btn { width: 88px; border-radius: 6px; }
.fav-btn { width: 88px; border-radius: 6px; margin-left: 12px; }
.catalog-link { color: var(--gov-blue); font-weight: 600; cursor: pointer; }
.catalog-link:hover { text-decoration: underline; }
.score-box { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.score-box b { color: var(--gov-gold); }
.score-tip { font-size: 13px; line-height: 1.9; color: var(--text-regular); }
.score-tip-title { font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
</style>
