// 四类工作台共用的左侧菜单结构（纯函数，b 为工作台基础路径）
// 供 RoleWorkbenchLayout 侧栏渲染与首页快捷操作自定义配置共用，保证选项与菜单始终一致
//
// 不同工作台按 wb 标识隐藏部分菜单（治理部为管理侧，展示全部）：
// - commission 委办 / district 区：隐藏运营管理、组织/权限管理、智能运维等治理侧能力
// - provider 服务商（开发工作台）：隐藏数据编目/共享/开放、供需对接、统一身份等消费侧能力
const HIDDEN_MENUS = {
  commission: ['运营管理', '组织管理', '权限管理', '智能运维', '统一元数据管理', '数据编织', '统一资源管理', '流程引擎', '创新应用', '数据直达', '统一服务总线', '安全控制中心'],
  district: ['运营管理', '组织管理', '权限管理', '智能运维', '统一元数据管理', '数据编织', '统一资源管理', '流程引擎', '创新应用', '数据直达', '统一服务总线', '安全控制中心'],
  provider: ['数据编目', '数据共享', '数据开放', '供需对接', '统一身份', '智能运维', '统一元数据管理', '数据编织', '统一资源管理', '流程引擎', '前置机管理', '安全控制中心']
}

// 按工作台过滤菜单：命中隐藏名单的顶层项/子项一并剔除，子项被清空的父项与被清空的分组同样移除
function filterMenuGroups(groups, wb) {
  const hidden = HIDDEN_MENUS[wb]
  if (!hidden || !hidden.length) return groups
  const hit = (label) => hidden.includes(label)
  return groups
    .map((g) => {
      const items = g.items
        .filter((m) => !hit(m.label))
        .map((m) => (m.children ? { ...m, children: m.children.filter((c) => !hit(c.label)) } : m))
        .filter((m) => !m.children || m.children.length > 0)
      return { ...g, items }
    })
    .filter((g) => g.items.length > 0)
}

export function getWorkbenchMenuGroups(b, wb) {
  const groups = [
    {
      items: [
        { label: '首页', icon: 'HomeFilled', path: b },
        { label: '统一待办', icon: 'Document', path: `${b}/todo` },
        { label: '我的收藏', icon: 'Star', path: `${b}/favorites` }
      ]
    },
    {
      title: '数据中心',
      collapsible: true,
      items: [
        { label: '目录链', icon: 'Link', path: `${b}/catalog-chain` },
        { label: '数据编目', icon: 'Notebook', path: `${b}/data-catalog` },
        { label: '数据共享', icon: 'Share', path: `${b}/data-share` },
        { label: '数据开放', icon: 'FolderOpened', path: `${b}/data-open` }
      ]
    },
    {
      title: '运营中心',
      collapsible: true,
      items: [
        { label: '供需对接', icon: 'Switch', path: `${b}/supply-demand` },
        { label: '运营管理', icon: 'SetUp', children: [
          { label: '服务目录管理', path: `${b}/operation/service-order` },
          { label: '三单管理', path: `${b}/operation/demand-order` },
          { label: '计量管理', path: `${b}/operation/work-order` },
          { label: '交付物管理', path: `${b}/operation/deliverable` }
        ] },
        { label: '统一身份', icon: 'Avatar', children: [
          { label: '组织管理', path: `${b}/identity/org` },
          { label: '账号管理', path: `${b}/identity/account` },
          { label: '权限管理', path: `${b}/identity/permission` }
        ] },
        { label: '智能运维', icon: 'Tools', path: `${b}/ops` },
        { label: '统一元数据管理', icon: 'Collection', path: `${b}/metadata` },
        { label: '数据编织', icon: 'EditPen', path: `${b}/data-compile` },
        { label: '统一资源管理', icon: 'Coin', path: `${b}/resource` },
        { label: '流程引擎', icon: 'Cpu', path: `${b}/process-engine` },
        { label: '前置机管理', icon: 'Monitor', path: `${b}/front-machine` }
      ]
    },
    {
      title: '开发中心',
      collapsible: true,
      items: [
        { label: '工作空间', icon: 'Grid', path: `${b}/workspace` },
        { label: '创新应用', icon: 'MagicStick', path: `${b}/innovation-app` },
        { label: '数据直达', icon: 'Position', path: `${b}/data-direct` },
        { label: '统一工具', icon: 'Box', path: `${b}/dev-tools` },
        { label: '三合一治理', icon: 'Operation', path: `${b}/tri-governance` },
        { label: '统一服务总线', icon: 'Connection', path: `${b}/service-bus` }
      ]
    },
    {
      title: '安全中心',
      collapsible: true,
      items: [
        { label: '安全控制中心', icon: 'Lock', path: `${b}/security-control` }
      ]
    },
    {
      title: '其他',
      collapsible: true,
      items: [
        { label: '授权运营', icon: 'Stamp', path: `${b}/authorized-operation` }
      ]
    },
    {
      title: '系统设置',
      items: [
        { label: '个人资料', icon: 'User', path: `${b}/profile` },
        { label: '退出登录', icon: 'SwitchButton', danger: true }
      ]
    }
  ]
  return filterMenuGroups(groups, wb)
}

// 摊平出可配置到快捷操作区的叶子菜单（含二级子菜单，子项沿用父项图标）
// 排除无跳转路径的项（退出登录）与首页本身
export function getWorkbenchMenuLeaves(b, wb) {
  const leaves = []
  getWorkbenchMenuGroups(b, wb).forEach((g) => {
    g.items.forEach((m) => {
      if (m.danger) return
      if (m.children) {
        m.children.forEach((c) => leaves.push({ label: c.label, icon: m.icon, path: c.path, group: g.title || '常用' }))
      } else if (m.path && m.path !== b) {
        leaves.push({ label: m.label, icon: m.icon, path: m.path, group: g.title || '常用' })
      }
    })
  })
  return leaves
}
