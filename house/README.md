# 基金查询与自选管理系统

一个轻量级的基金代码查询和自选管理工具网站。

## 🚀 核心功能

### ✅ 已实现功能
- ✅ **基金代码查询** - 输入 6 位代码查询实时估值和涨跌幅
- ✅ **自选基金管理** - 添加/删除关注的基金，查看自选列表
- ✅ **响应式 UI 界面** - 适配桌面端和移动端
- ✅ **Redux 状态管理** - 持久化存储自选基金
- ✅ **多 CORS 代理** - 稳定的 API 调用方案

## 📦 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Redux Toolkit
- **路由**: React Router DOM 6
- **HTTP 客户端**: Axios
- **日期处理**: Day.js
- **UI 框架**: Tailwind CSS 3
- **数据源**: 天天基金网、东方财富网

## 🛠️ 安装和运行

### 前置要求
- Node.js >= 18
- pnpm >= 8

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本
```bash
pnpm build
```

### 预览生产构建
```bash
pnpm preview
```

## 📁 项目结构

```
house/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── FundCard.tsx          # 基金卡片
│   │   │   ├── FundSearch.tsx        # 搜索框
│   │   │   └── SearchResult.tsx      # 结果展示
│   │   └── layout/
│   │       └── Layout.tsx            # 布局组件
│   ├── pages/
│   │   ├── Home/                     # 首页（查询功能）
│   │   └── Portfolio/                # 自选页面
│   ├── services/                     # API 服务
│   ├── store/                        # Redux 状态管理
│   ├── types/                        # TypeScript 类型
│   └── utils/                        # 工具函数
├── package.json
├── README.md                         # 本文件
└── README_SIMPLIFIED.md              # 详细文档
```

## 💡 快速使用

### 1. 基金查询
访问 http://localhost:3000，输入基金代码（如：`161725`）点击查询。

### 2. 添加到自选
在查询结果页面点击"+ 自选"按钮。

### 3. 查看自选
点击导航栏"我的自选"，管理已关注的基金。

---

## 📖 详细文档

请查看 [`README_SIMPLIFIED.md`](README_SIMPLIFIED.md) 获取完整的功能说明和使用指南。

## ⚠️ 免责声明

本估算数据基于基金定期报告披露的持仓计算，实际净值以基金公司公布为准。
估算数据仅供参考，不构成投资建议。

## 📝 开发计划

### Phase 1: MVP (已完成)
- [x] 项目初始化
- [x] 基础布局组件
- [x] 基金数据获取
- [x] 实时涨跌幅计算
- [x] 首页展示

### Phase 2: 功能完善 (进行中)
- [ ] 基金详情页
- [ ] 历史走势图表
- [ ] 持仓分析
- [ ] 排行榜功能

### Phase 3: 高级功能
- [ ] 套利机会分析
- [ ] 智能提醒功能
- [ ] 数据导出
- [ ] 移动端适配

## 🔗 数据源 API

- 天天基金网：http://fund.eastmoney.com/
- 东方财富网：http://api.m.fund.eastmoney.com/
- 新浪财经：http://hq.sinajs.cn/

## 📄 License

MIT
