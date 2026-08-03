import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

/**
 * 路由权限：meta.roles 声明可访问角色，未声明则登录即可访问
 * visitor 仅可访问 /login
 */

/**
 * 四类工作台（委办 / 治理部 / 区 / 服务商）共用同一套独立布局与页面，
 * 仅工作台名称不同。此处以工厂统一生成，保证结构完全一致。
 */
const WORKBENCH_DEFS = [
  { key: 'commission', name: '委办工作台', roles: ['commission', 'governance'] },
  { key: 'governance', name: '治理部工作台', roles: ['governance'] },
  { key: 'district', name: '区工作台', roles: ['district'] },
  { key: 'provider', name: '服务商工作台', roles: ['provider'] }
]

function makeWorkbenchRoute({ key, name, roles }) {
  return {
    path: `/workbench/${key}`,
    component: () => import('@/layouts/RoleWorkbenchLayout.vue'),
    meta: { roles, workbench: key, wbName: name },
    children: [
      { path: '', name: `${key}-home`, component: () => import('@/pages/workbench/commission/Home.vue'), meta: { title: name } },
      { path: 'todo', name: `${key}-todo`, component: () => import('@/pages/workbench/commission/UnifiedTodo.vue'), meta: { title: '统一待办' } },
      { path: 'favorites', name: `${key}-favorites`, component: () => import('@/pages/workbench/personal/MyCart.vue'), meta: { title: '我的收藏' } },
      { path: 'supply-demand', name: `${key}-supply-demand`, component: () => import('@/pages/workbench/commission/DemandConnect.vue'), meta: { title: '需求对接' } },
      // 运营管理子菜单
      { path: 'operation/service-order', name: `${key}-op-service-order`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '服务目录管理', pending: true } },
      { path: 'operation/demand-order', name: `${key}-op-demand-order`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '三单管理', pending: true } },
      { path: 'operation/work-order', name: `${key}-op-work-order`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '计量管理', pending: true } },
      { path: 'operation/deliverable', name: `${key}-op-deliverable`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '交付物管理', pending: true } },
      // 统一身份子菜单
      { path: 'identity/org', name: `${key}-identity-org`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '组织管理', pending: true } },
      { path: 'identity/account', name: `${key}-identity-account`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '账号管理', pending: true } },
      { path: 'identity/permission', name: `${key}-identity-permission`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '权限管理', pending: true } },
      { path: 'ops', name: `${key}-ops`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '智能运维', pending: true } },
      { path: 'metadata', name: `${key}-metadata`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '统一元数据管理' } },
      { path: 'data-compile', name: `${key}-data-compile`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '数据编织' } },
      { path: 'resource', name: `${key}-resource`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '统一资源管理', pending: true } },
      { path: 'process-engine', name: `${key}-process-engine`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '流程引擎', pending: true } },
      { path: 'front-machine', name: `${key}-front-machine`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '前置机管理', pending: true } },
      { path: 'workspace', name: `${key}-workspace`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '工作空间', pending: true } },
      { path: 'innovation-app', name: `${key}-innovation-app`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '创新应用', pending: true } },
      { path: 'data-direct', name: `${key}-data-direct`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '数据直达', pending: true } },
      { path: 'dev-tools', name: `${key}-dev-tools`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '统一工具' } },
      { path: 'tri-governance', name: `${key}-tri-governance`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '三合一治理' } },
      { path: 'service-bus', name: `${key}-service-bus`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '统一服务总线' } },
      { path: 'security-control', name: `${key}-security-control`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '安全控制中心' } },
      // 数据中心
      { path: 'catalog-chain', name: `${key}-catalog-chain`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '目录链', pending: true } },
      { path: 'data-catalog', name: `${key}-data-catalog`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '数据编目', pending: true } },
      { path: 'data-share', name: `${key}-data-share`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '数据共享', pending: true } },
      { path: 'data-open', name: `${key}-data-open`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '数据开放', pending: true } },
      { path: 'authorized-operation', name: `${key}-authorized-operation`, component: () => import('@/pages/workbench/commission/FeaturePlaceholder.vue'), meta: { title: '授权运营' } },
      // 兼容既有跳转链接的旧路径
      { path: 'tickets', name: `${key}-tickets`, component: () => import('@/pages/workbench/commission/Tickets.vue'), meta: { title: '工单管理' } },
      { path: 'supply-demand-stats', name: `${key}-supply-demand-stats`, component: () => import('@/pages/workbench/commission/SupplyDemandStats.vue'), meta: { title: '供需统计' } },
      { path: 'whitelist', name: `${key}-whitelist`, component: () => import('@/pages/workbench/commission/Whitelist.vue'), meta: { title: '白名单管理' } },
      { path: 'api-manage', name: `${key}-api-manage`, component: () => import('@/pages/workbench/commission/ApiManage.vue'), meta: { title: '接口管理' } },
      { path: 'change-request', name: `${key}-change-request`, component: () => import('@/pages/workbench/commission/ChangeRequest.vue'), meta: { title: '变更申请' } }
    ]
  }
}

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/home',
    component: () => import('@/layouts/PortalLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/home/index.vue'),
        meta: { title: '门户首页' }
      }
    ]
  },
  {
    path: '/zone',
    component: () => import('@/layouts/PortalLayout.vue'),
    children: [
      { path: 'data-resource', name: 'DataResource', component: () => import('@/pages/zone/DataResource.vue'), meta: { title: '数据资源专区' } },
      { path: 'data-resource/:id', name: 'CatalogDetail', component: () => import('@/pages/zone/CatalogDetail.vue'), meta: { title: '目录详情', parent: { title: '数据资源专区', path: '/zone/data-resource' } } },
      { path: 'data-product', name: 'DataProduct', component: () => import('@/pages/zone/DataProduct.vue'), meta: { title: '数据产品专区' } },
      { path: 'data-product/:id', name: 'ProductDetail', component: () => import('@/pages/zone/ProductDetail.vue'), meta: { title: '产品详情', parent: { title: '数据产品专区', path: '/zone/data-product' } } },
      { path: 'smart-contract', name: 'SmartContract', component: () => import('@/pages/zone/SmartContract.vue'), meta: { title: '智能合约专区' } },
      { path: 'smart-contract/:id', name: 'ContractDetail', component: () => import('@/pages/zone/ContractDetail.vue'), meta: { title: '合约详情', parent: { title: '智能合约专区', path: '/zone/smart-contract' } } },
      { path: 'fusion-database', name: 'FusionDatabase', component: () => import('@/pages/zone/FusionDatabase.vue'), meta: { title: '融合库专区' } },
      { path: 'fusion-database/:id', name: 'FusionDetail', component: () => import('@/pages/zone/FusionDetail.vue'), meta: { title: '融合主题详情', parent: { title: '融合库专区', path: '/zone/fusion-database' } } }
    ]
  },
  {
    path: '/stats',
    component: () => import('@/layouts/PortalLayout.vue'),
    children: [
      { path: '', name: 'FullStats', component: () => import('@/pages/stats/FullStats.vue'), meta: { title: '全量统计明细' } }
    ]
  },
  {
    path: '/notice/:id',
    component: () => import('@/layouts/PortalLayout.vue'),
    children: [
      { path: '', name: 'NoticeDetail', component: () => import('@/pages/notice/NoticeDetail.vue'), meta: { title: '公告详情' } }
    ]
  },
  // 四类工作台（委办 / 治理部 / 区 / 服务商）：独立侧边栏布局，结构一致仅名称不同
  ...WORKBENCH_DEFS.map(makeWorkbenchRoute),
  {
    path: '/manage',
    component: () => import('@/layouts/ManageLayout.vue'),
    meta: { roles: ['governance'] },
    redirect: '/manage/account/list',
    children: [
      { path: 'account/list', name: 'AccountList', component: () => import('@/pages/manage/account/AccountList.vue'), meta: { title: '账号列表', group: '管账号' } },
      { path: 'account/dormant', name: 'DormantCheck', component: () => import('@/pages/manage/account/DormantCheck.vue'), meta: { title: '休眠账号检测', group: '管账号' } },
      { path: 'account/approval', name: 'AccountApproval', component: () => import('@/pages/manage/account/AccountApproval.vue'), meta: { title: '账号审批', group: '管账号' } },
      { path: 'account/permission', name: 'PermissionManage', component: () => import('@/pages/manage/account/PermissionManage.vue'), meta: { title: '权限管理', group: '管账号' } },
      { path: 'resource/overview', name: 'ResourceOverview', component: () => import('@/pages/manage/resource/ResourceOverview.vue'), meta: { title: '资源池总览', group: '管资源' } },
      { path: 'resource/front-machine', name: 'FrontMachine', component: () => import('@/pages/manage/resource/FrontMachine.vue'), meta: { title: '前置机管理', group: '管资源' } },
      { path: 'resource/front-machine/:id', name: 'FrontMachineDetail', component: () => import('@/pages/manage/resource/FrontMachineDetail.vue'), meta: { title: '前置机详情', group: '管资源', parent: { title: '前置机管理', path: '/manage/resource/front-machine' } } },
      { path: 'resource/approval', name: 'ResourceApproval', component: () => import('@/pages/manage/resource/ResourceApproval.vue'), meta: { title: '资源申请审批', group: '管资源' } },
      { path: 'data/monitor', name: 'DataMonitor', component: () => import('@/pages/manage/data/DataMonitor.vue'), meta: { title: '数据监测总览', group: '管数据' } },
      { path: 'data/mount-check', name: 'MountCheck', component: () => import('@/pages/manage/data/MountCheck.vue'), meta: { title: '目录挂载检测', group: '管数据' } },
      { path: 'data/update-check', name: 'UpdateCheck', component: () => import('@/pages/manage/data/UpdateCheck.vue'), meta: { title: '数据更新检测', group: '管数据' } },
      { path: 'ops/overview', name: 'OpsOverview', component: () => import('@/pages/manage/ops/OpsOverview.vue'), meta: { title: '运行总览', group: '管运维' } },
      { path: 'ops/alerts', name: 'OpsAlerts', component: () => import('@/pages/manage/ops/OpsAlerts.vue'), meta: { title: '智能运维告警', group: '管运维' } },
      { path: 'ops/tickets', name: 'OpsTickets', component: () => import('@/pages/manage/ops/OpsTickets.vue'), meta: { title: '运维工单', group: '管运维' } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const user = useUserStore()
  document.title = to.meta.title ? `${to.meta.title} - 上海市大数据资源平台` : '上海市大数据资源平台'

  if (to.meta.public) {
    // 已登录访问登录页则直接进入首页
    if (user.isLoggedIn && to.path === '/login') return '/home'
    return true
  }
  if (!user.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  // 逐级向上收集角色限制，命中任一角色即放行
  const required = to.matched.reduce((acc, r) => r.meta?.roles || acc, null)
  if (required && !required.some((r) => user.roles.includes(r))) {
    return '/home'
  }
  return true
})

export default router
