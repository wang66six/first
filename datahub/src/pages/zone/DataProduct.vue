<template>
  <div class="page-container zone-page">
    <div class="zone-layout">
      <!-- 左侧筛选栏：与数据资源专区一致的组织树 -->
      <aside class="side-panel">
        <!-- 部门搜索 -->
        <el-input v-model="deptKw" placeholder="请输入部门名称" clearable class="dept-search">
          <template #suffix><el-icon><Search /></el-icon></template>
        </el-input>

        <!-- 产品提供部门组织树 -->
        <div class="gov-card side-card">
          <div class="side-card-head">
            <el-icon><OfficeBuilding /></el-icon>
            <span>产品提供部门</span>
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

      <!-- 右侧产品区 -->
      <div class="main-panel">
        <!-- 产品名称搜索 -->
        <div class="gov-card filter-card">
          <div class="toolbar-row">
            <el-input v-model="kw" placeholder="输入产品名称搜索" clearable style="width: 280px">
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-button type="primary">查询</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </div>
        </div>

        <!-- 顶部分类标签栏 -->
        <div class="gov-card tab-card">
          <el-tabs v-model="activeCategory">
            <el-tab-pane v-for="c in ['全部', ...productCategories]" :key="c" :label="c" :name="c" />
          </el-tabs>
        </div>

        <!-- 产品卡片网格 -->
        <div class="product-grid">
          <div
            v-for="p in filtered"
            :key="p.id"
            class="product-card gov-card gov-card--hover"
            @click="$router.push(`/zone/data-product/${p.id}`)"
          >
            <div class="product-head">
              <h3>{{ p.name }}</h3>
              <el-tag size="small" :type="categoryTagType(p.category)" effect="plain">{{ p.category }}</el-tag>
            </div>
            <p class="product-dept"><el-icon><OfficeBuilding /></el-icon>{{ p.dept }}</p>
            <p class="product-desc">{{ p.desc }}</p>
            <div class="product-stats">
              <span><el-icon><DataLine /></el-icon>申请次数：<b>{{ p.applyCount }}</b></span>
              <span><el-icon><Clock /></el-icon>上架时间：<b>{{ p.listTime }}</b></span>
            </div>
            <div class="product-foot">
              <span class="product-delivery">交付方式：{{ p.delivery }}</span>
              <el-button type="primary" size="small" plain @click.stop="apply(p)">申请使用</el-button>
            </div>
          </div>
        </div>
        <el-empty v-if="!filtered.length" description="暂无符合条件的数据产品" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { products, productCategories, deptOrgTree } from '@/mock'

const router = useRouter()
const activeCategory = ref('全部')
const kw = ref('')

/* ---------- 产品提供部门组织树 ---------- */
const deptKw = ref('')
const deptTreeRef = ref()
const activeDept = ref('')

const deptCountMap = computed(() => {
  const map = {}
  products.forEach((p) => { map[p.dept] = (map[p.dept] || 0) + 1 })
  return map
})

// 递归构建组织树节点：叶子取产品数，分组节点向下汇总
function buildTreeNode(node) {
  if (!node.children) {
    return { id: node.label, label: node.label, isLeaf: true, count: deptCountMap.value[node.label] || 0 }
  }
  const children = node.children.map(buildTreeNode)
  return {
    id: `g-${node.label}`,
    label: node.label,
    isLeaf: false,
    count: children.reduce((sum, c) => sum + c.count, 0),
    children
  }
}

const deptTree = computed(() => deptOrgTree.map(buildTreeNode))
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
  activeDept.value = activeDept.value === data.label ? '' : data.label
}

/* ---------- 交付方式筛选 ---------- */
const DELIVERIES = ['API接口', '数据文件', '数据看板', '在线报告', '服务套件']
const activeDelivery = ref('')

function toggleDelivery(name) {
  activeDelivery.value = activeDelivery.value === name ? '' : name
}

/* ---------- 产品过滤 ---------- */
// excludeDelivery：统计交付方式计数时排除自身维度（分面统计）
function matchProduct(p, excludeDelivery) {
  if (kw.value && !p.name.includes(kw.value)) return false
  if (activeCategory.value !== '全部' && p.category !== activeCategory.value) return false
  if (activeDept.value && p.dept !== activeDept.value) return false
  if (!excludeDelivery && activeDelivery.value && p.delivery !== activeDelivery.value) return false
  return true
}

const filtered = computed(() => products.filter((p) => matchProduct(p)))

const deliveryBuckets = computed(() =>
  DELIVERIES.map((name) => ({
    name,
    count: products.filter((p) => matchProduct(p, true) && p.delivery === name).length
  }))
)

function resetFilters() {
  kw.value = ''
  activeCategory.value = '全部'
  activeDept.value = ''
  activeDelivery.value = ''
}

function categoryTagType(c) {
  return { '原始数据产品': 'primary', '数据融合产品': 'success', '开放技术数据产品': 'warning', '报告/共享能力产品': 'info' }[c]
}

function apply(p) {
  ElMessage.success(`「${p.name}」申请已发起，请在详情页完善申请信息`)
  router.push(`/zone/data-product/${p.id}`)
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
.dept-tree { max-height: 560px; overflow-y: auto; padding: 0 4px 4px; }
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

/* ---------- 右侧产品区 ---------- */
.main-panel { flex: 1; min-width: 0; }
.filter-card { padding: 16px 20px; margin-bottom: 16px; }
.toolbar-row { display: flex; align-items: center; gap: 12px; }
.tab-card { padding: 6px 20px 0; margin-bottom: 16px; }
.product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.product-card { padding: 22px 24px; display: flex; flex-direction: column; }
.product-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.product-head h3 { font-size: 16px; }
.product-dept {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  margin: 10px 0;
}
.product-desc { font-size: 13px; color: var(--text-regular); line-height: 1.7; flex: 1; min-height: 44px; }
.product-stats { display: flex; align-items: center; gap: 20px; margin-top: 10px; }
.product-stats span { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--text-secondary); }
.product-stats .el-icon { font-size: 14px; color: #8f9bb0; }
.product-stats b { font-weight: 500; color: var(--text-regular); }
.product-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}
.product-delivery { font-size: 12.5px; color: var(--text-secondary); }
</style>
