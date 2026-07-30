import { defineStore } from 'pinia'

/**
 * 平台四类角色，一一对应四类工作台：
 * governance 数据治理部   → 治理部工作台
 * commission 市委办单位   → 委办工作台
 * district   区大数据中心 → 区工作台
 * provider   第三方服务单位 → 服务商工作台
 * 用户可同时拥有多个角色（roles 数组），visitor 表示未登录访客
 */
export const ROLE_LABELS = {
  governance: '数据治理部',
  commission: '市委办单位',
  district: '区大数据中心',
  provider: '第三方服务单位'
}

export const ROLE_WORKBENCHES = {
  governance: { label: '治理部工作台', path: '/workbench/governance' },
  commission: { label: '委办工作台', path: '/workbench/commission' },
  district: { label: '区工作台', path: '/workbench/district' },
  provider: { label: '服务商工作台', path: '/workbench/provider' }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: sessionStorage.getItem('dh_token') || '',
    roles: JSON.parse(sessionStorage.getItem('dh_roles') || '[]'),
    name: sessionStorage.getItem('dh_name') || '',
    dept: sessionStorage.getItem('dh_dept') || '',
    loginTime: sessionStorage.getItem('dh_login_time') || '',
    loginIp: sessionStorage.getItem('dh_login_ip') || '',
    cart: JSON.parse(sessionStorage.getItem('dh_cart') || '[]')
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    // 主角色：roles 首位，用于欢迎语/档案展示
    role: (s) => s.roles[0] || 'visitor',
    roleLabel: (s) => s.roles.map((r) => ROLE_LABELS[r]).filter(Boolean).join(' / ') || '访客',
    hasRole: (s) => (r) => s.roles.includes(r),
    // 当前用户可进入的工作台列表（按角色顺序）
    workbenches: (s) => s.roles.filter((r) => ROLE_WORKBENCHES[r]).map((r) => ({ role: r, ...ROLE_WORKBENCHES[r] })),
    cartCount: (s) => s.cart.length
  },
  actions: {
    // roles 为角色数组，档案按主角色（首位）取
    login(roles) {
      const list = Array.isArray(roles) ? roles : [roles]
      const profiles = {
        governance: { name: '王治理', dept: '市数据局治理部' },
        commission: { name: '李建华', dept: '市规划和自然资源局' },
        district: { name: '陈晓峰', dept: '浦东新区大数据中心' },
        provider: { name: '赵明轩', dept: '数慧科技服务有限公司' }
      }
      const p = profiles[list[0]] || profiles.commission
      this.token = `mock-token-${Date.now()}`
      this.roles = list
      this.name = p.name
      this.dept = p.dept
      // 记录本次登录时间与来源 IP（演示环境 IP 为模拟政务内网地址）
      this.loginTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
      }).replace(/\//g, '-')
      this.loginIp = `10.208.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 240) + 10}`
      sessionStorage.setItem('dh_token', this.token)
      sessionStorage.setItem('dh_roles', JSON.stringify(list))
      sessionStorage.setItem('dh_name', p.name)
      sessionStorage.setItem('dh_dept', p.dept)
      sessionStorage.setItem('dh_login_time', this.loginTime)
      sessionStorage.setItem('dh_login_ip', this.loginIp)
    },
    logout() {
      this.token = ''
      this.roles = []
      this.name = ''
      this.dept = ''
      this.loginTime = ''
      this.loginIp = ''
      sessionStorage.clear()
    },
    addToCart(item) {
      if (this.cart.find((c) => c.id === item.id)) return false
      this.cart.push(item)
      sessionStorage.setItem('dh_cart', JSON.stringify(this.cart))
      return true
    },
    removeFromCart(ids) {
      this.cart = this.cart.filter((c) => !ids.includes(c.id))
      sessionStorage.setItem('dh_cart', JSON.stringify(this.cart))
    },
    clearCart() {
      this.cart = []
      sessionStorage.setItem('dh_cart', '[]')
    }
  }
})
