/* 全局模拟数据源 */

const DEPTS = ['市政府办公厅', '市公安局', '市发展改革委', '市商务委', '市教卫工作党委、市教委', '市民族宗教局', '市民政局', '市司法局', '市人社局', '市规划资源局', '市生态环境局', '市交通委', '市文化旅游局', '市卫生健康委', '市医疗保障局', '市退役军人局', '市审计局', '市市场监管局', '市数据局', '市地方金融监管局', '市国资委', '市体育局', '市统计局', '市公积金管理中心']
const TOPICS = ['法人专题', '自然人专题', '空间地理专题', '电子证照专题', '信用信息专题', '经济运行专题']
const TAGS = ['高频调用', '实时更新', '权威库', '基础数据', '主题数据', '开放数据']

/* 数据来源部门组织树：市政府 / 各区 两个并列分组 */
const DISTRICT_DEPTS = ['浦东新区', '黄浦区', '静安区', '徐汇区', '长宁区', '普陀区', '虹口区', '杨浦区', '宝山区', '闵行区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
export const deptOrgTree = [
  { label: '市政府', children: DEPTS.map((d) => ({ label: d })) },
  { label: '各区', children: DISTRICT_DEPTS.map((d) => ({ label: d })) }
]

export const notices = [
  { id: 1, type: '平台通知', title: '关于开展2026年度数据目录质量专项治理工作的通知', date: '2026-07-20', content: '为进一步提升全市数据目录质量，市数据局决定于2026年8月至10月开展数据目录质量专项治理工作。各委办局需在8月15日前完成本部门目录自查，重点核查目录挂载完整性、数据更新及时性与字段描述规范性。治理期间平台将每周发布质量通报，请各单位高度重视。' },
  { id: 2, type: '政策公告', title: '《上海市公共数据共享实施办法（修订版）》正式发布', date: '2026-07-15', content: '经市政府常务会议审议通过，《上海市公共数据共享实施办法（修订版）》自2026年8月1日起施行。修订版进一步明确了公共数据共享责任清单、扩大无条件共享范围，并新增智能合约自动化审批条款，为数据要素流通提供制度保障。' },
  { id: 3, type: '平台通知', title: '智能合约专区三期功能上线公告', date: '2026-07-10', content: '智能合约专区三期功能已于7月10日正式上线，新增合约一键审批、链上存证核验、成交合约实时统计等能力。欢迎各委办用户体验使用，如有问题请通过运维工单反馈。' },
  { id: 4, type: '平台通知', title: '平台例行维护通知（7月28日 00:00-04:00）', date: '2026-07-08', content: '平台将于2026年7月28日00:00至04:00进行例行维护，期间接口调用服务可能出现短暂中断，请各接入单位提前做好业务安排。' },
  { id: 5, type: '政策公告', title: '关于推进公共数据授权运营试点扩面的实施意见', date: '2026-07-01', content: '为深化数据要素市场化配置改革，现就推进公共数据授权运营试点扩面工作提出实施意见：扩大授权运营领域至交通、医疗、文旅三大场景，建立授权运营收益分配机制，强化全流程安全监管。' }
]

export const homeMetrics = {
  legal: { total: 3286500, coverage: '覆盖全市 328.6 万法人主体', items: ['统一社会信用代码', '登记注册信息', '经营异常名录', '行政许可与处罚'] },
  natural: { total: 24875000, coverage: '覆盖全市 2487.5 万常住人口', items: ['户籍与居住信息', '社保参保信息', '学历学籍信息', '婚姻登记信息'] },
  indicators: [
    { key: 'catalogs', label: '活跃数据目录数', value: 12863, unit: '个' },
    { key: 'apiCalls', label: '接口累计调用量', value: 458216903, unit: '次' },
    { key: 'contractDeals', label: '智能合约成交总量', value: 86452, unit: '笔' }
  ]
}

export const searchHints = ['查找法人基础数据', '查询接口调用量', '申请自然人数据', '查看智能合约成交情况', '检索空间地理信息目录', '查询电子证照共享清单']

export const zones = [
  { key: 'data-resource', path: '/zone/data-resource', icon: 'Coin', name: '数据资源专区', desc: '全市数据目录统一检索与用数申请', tags: ['12863个目录', '10大委办'] },
  { key: 'data-product', path: '/zone/data-product', icon: 'Box', name: '数据产品专区', desc: '原始、融合、开放技术等多形态数据产品', tags: ['4大品类', '326个产品'] },
  { key: 'smart-contract', path: '/zone/smart-contract', icon: 'DocumentChecked', name: '智能合约专区', desc: '区块链智能合约规则共享与自动化审批', tags: ['链上存证', '一键审批'] },
  { key: 'fusion-database', path: '/zone/fusion-database', icon: 'DataAnalysis', name: '融合库专区', desc: '跨部门融合主题库开放与调用服务', tags: ['58个主题', '亿级调用'] }
]

/* ---------- 门户首页（3.0 改版） ---------- */
export const heroStats = [
  { label: '上链单位', value: 98, unit: '家' },
  { label: '职责目录数', value: 203363, unit: '个' },
  { label: '系统目录数', value: 3422, unit: '个' },
  { label: '数据目录数', value: 33452, unit: '个' },
  { label: '当日共享调用数', value: 1286435, unit: '次' },
  { label: '当日开放调用数', value: 386210, unit: '次' },
  { label: '当日授权运营调用数', value: 52847, unit: '次' }
]

// 热门目录按点击量降序推荐
export const hotCatalogTags = [
  { name: '合作交流网站发文信息', clicks: '12.8万' },
  { name: '投资促进环境要素资源(区)', clicks: '11.3万' },
  { name: '劳模管理信息', clicks: '9.6万' },
  { name: '投资促进环境要素资源(园区)', clicks: '8.2万' },
  { name: '劳动管理信息', clicks: '7.5万' },
  { name: '困难职工日常收入开支数据', clicks: '6.1万' }
]

export const legalLibrary = {
  name: '法人基础库',
  en: 'CORPORATE BASIC DATABASE',
  total: 354.7,
  unit: '万家',
  themes: [
    {
      name: '产业园区专题库',
      lines: ['覆盖企业数量 114.62 万家', '覆盖园区数量 204 个'],
      scenes: [
        { name: '一企一档', value: '450 万次' },
        { name: '企业变更一件事', value: '201.12 万次' },
        { name: '免审即享', value: '32700 万次' },
        { name: '综合监管', value: '1111 万次' }
      ]
    },
    {
      name: '专利专题库',
      lines: ['企业创新能力', '专利信息关联'],
      scenes: [
        { name: '企业创新画像', value: '1,265 万次' },
        { name: '高新技术企业认定', value: '386 万次' },
        { name: '知识产权质押融资', value: '152.4 万次' },
        { name: '专利侵权线索核查', value: '89 万次' }
      ]
    },
    {
      name: '商标专题库',
      lines: ['市场主体品牌', '商标信息关联'],
      scenes: [
        { name: '商标注册状态核验', value: '976.5 万次' },
        { name: '品牌保护监测', value: '268 万次' },
        { name: '侵权假冒线索比对', value: '132 万次' },
        { name: '驰名商标认定支撑', value: '45 万次' }
      ]
    }
  ]
}

export const naturalLibrary = {
  name: '自然人基础库',
  en: 'NATURAL PERSON BASIC DATABASE',
  total: 2595.87,
  unit: '万人',
  sub: '覆盖人数 · 标签数 259 个',
  themes: [
    {
      name: '婚姻库',
      lines: ['婚姻登记信息', '跨部门核验'],
      topScenes: [
        { name: '结婚登记跨省通办核验', value: '3,286 万次' },
        { name: '购房资格审核', value: '1,542 万次' },
        { name: '公积金贷款婚姻核验', value: '876 万次' },
        { name: '出生一件事', value: '512 万次' },
        { name: '涉外婚姻公证', value: '86 万次' },
        { name: '遗产继承婚姻关系核验', value: '38 万次' }
      ]
    },
    {
      name: '身故库',
      lines: ['目录数 11 个', '覆盖 79.02 万人'],
      topScenes: [
        { name: '虚假就医', value: '100 万次' },
        { name: '申康死亡核验', value: '100 万次' },
        { name: '民政养老、救助等补贴发放', value: '100 万次' },
        { name: '工会会员专享困难职工帮扶', value: '100 万次' },
        { name: '退休职工互助保障参保', value: '100 万次' },
        { name: '计划生育服务管理', value: '100 万次' }
      ]
    },
    {
      name: '亲属关系库',
      lines: ['亲属关系信息', '服务事项支撑'],
      topScenes: [
        { name: '少儿住院互助基金', value: '22,397 万次' },
        { name: '疫苗接种证申领', value: '10,069 万次' },
        { name: '个人身后一件事', value: '460 万次' },
        { name: '法定继承人亲属关系校验', value: '369 万次' },
        { name: '家庭医生签约', value: '67 万次' },
        { name: '学分银行', value: '25 万次' }
      ]
    }
  ]
}

export const industryProducts = [
  {
    key: 'hr', name: '人社行业', en: 'HUMAN RESOURCES', icon: 'User', color: '#2563c9',
    dept: '人社数据主管部门',
    top5: [
      { id: 'P016', name: '参保信息核验服务', calls: '1,286.45 万次' },
      { id: 'P017', name: '缴费核验服务', calls: '986.72 万次' },
      { id: 'P018', name: '社保待遇领取资格核验', calls: '652.18 万次' },
      { id: 'P019', name: '就业失业登记信息核验', calls: '421.64 万次' },
      { id: 'P020', name: '职业资格证书核验服务', calls: '287.90 万次' }
    ]
  },
  {
    key: 'civil', name: '民政行业', en: 'CIVIL AFFAIRS', icon: 'Postcard', color: '#0ea5a3',
    dept: '民政数据主管部门',
    top5: [
      { id: 'P021', name: '婚姻状况核验服务', calls: '842.36 万次' },
      { id: 'P022', name: '低保对象资格核验服务', calls: '326.89 万次' },
      { id: 'P023', name: '养老服务补贴核验服务', calls: '278.45 万次' },
      { id: 'P024', name: '社会组织登记信息查询', calls: '165.20 万次' },
      { id: 'P025', name: '殡葬信息协同核验服务', calls: '112.68 万次' }
    ]
  },
  {
    key: 'health', name: '医疗行业', en: 'HEALTHCARE', icon: 'FirstAidKit', color: '#7c5cd9',
    dept: '医疗数据主管部门',
    top5: [
      { id: 'P026', name: '医保参保状态核验服务', calls: '1,108.62 万次' },
      { id: 'P027', name: '电子健康档案授权查询', calls: '756.04 万次' },
      { id: 'P028', name: '医疗机构执业信息核验', calls: '538.76 万次' },
      { id: 'P029', name: '基本医疗保险待遇核验', calls: '416.25 万次' },
      { id: 'P030', name: '药品追溯信息查询服务', calls: '201.17 万次' }
    ]
  }
]

export const contractRunning = {
  rules: 286, rulesTrend: '↑ 12 本月新增',
  deals: 1248, dealsTrend: '↑ 18.6% 较昨日',
  rate: 98.6
}

export const latestDeals = [
  { name: '法人基础信息授权共享', dept: '市市场监督管理局', count: '1,286', status: '执行中' },
  { name: '自然人身份核验服务', dept: '市公安局', count: '964', status: '执行中' },
  { name: '不动产登记信息核验', dept: '市规划和自然资源局', count: '728', status: '待确认' }
]

/* ---------- 数据资源目录 ---------- */
const catalogNames = ['法人基础信息目录', '企业登记注册信息', '自然人户籍基础信息', '社保参保缴费记录', '不动产登记信息', '机动车登记信息', '道路运输许可信息', '医疗机构执业许可', '学籍注册基础信息', '婚姻登记信息目录', '低保救助对象信息', '企业信用评价信息', '行政处罚决定信息', '建筑工程施工许可', '排污许可证信息', '食品经营许可信息', '药品经营许可信息', '出租车运营信息', '公积金缴存信息', '残疾人证基础信息']

const cityCatalogs = catalogNames.map((name, i) => ({
  id: `CAT${String(2026001 + i)}`,
  code: `002438161/${String(486 + i).padStart(6, '0')}`,
  name,
  dept: DEPTS[i % DEPTS.length],
  topic: TOPICS[i % TOPICS.length],
  dataType: ['结构化', '结构化', '半结构化', '非结构化'][i % 4],
  frequency: ['实时', '每日', '每周', '每月'][i % 4],
  score: +(3.6 + (i % 15) / 10).toFixed(1),
  status: ['正常', '正常', '正常', '更新中', '正常'][i % 5],
  tag: TAGS[i % TAGS.length],
  fields: 8 + (i % 12),
  callCount: 12000 + i * 3517,
  updateTime: `2026-07-${String(1 + (i % 26)).padStart(2, '0')}`,
  shareType: ['无条件共享', '无条件共享', '有条件共享', '有条件共享', '不共享'][i % 5],
  openType: ['可对社会开放', '不可对社会开放', '部分对社会开放'][i % 3],
  mounted: i % 5 < 3 ? '已挂载' : '未挂载',
  resType: ['库表', '库表', '库表', '接口'][i % 4],
  authOp: i % 3 === 0,
  hasSample: i % 2 === 0,
  applyCount: 60 + ((i * 37) % 400)
}))

/* 区级部门挂载目录 */
const extraCatalogSeeds = [
  { name: '静安区江宁路街道党群服务阵地信息数据', dept: '静安区' },
  { name: '静安区江宁路街道社区宝宝屋信息数据', dept: '静安区' },
  { name: '静安区江宁路街道为老服务机构信息数据', dept: '静安区' },
  { name: '静安区2025年进博会展商名单', dept: '静安区' },
  { name: '浦东新区政务服务办事网点信息', dept: '浦东新区' },
  { name: '浦东新区公共充电桩分布数据', dept: '浦东新区' },
  { name: '黄浦区历史保护建筑名录', dept: '黄浦区' },
  { name: '黄浦区商圈客流统计数据', dept: '黄浦区' },
  { name: '徐汇区养老机构床位信息', dept: '徐汇区' },
  { name: '徐汇区社区卫生服务中心信息', dept: '徐汇区' },
  { name: '长宁区数字化转型示范企业名单', dept: '长宁区' },
  { name: '长宁区公园绿地开放信息', dept: '长宁区' }
]
const extraScores = [4.8, 4.2, 3.4, 2.6, 4.6, 1.9, 3.8, 4.9, 2.2, 4.4, 3.2, 4.7]
const extraCatalogs = extraCatalogSeeds.map((s, i) => ({
  id: `CAT${String(2026001 + catalogNames.length + i)}`,
  code: `002438161/${String(486 + catalogNames.length + i).padStart(6, '0')}`,
  name: s.name,
  dept: s.dept,
  topic: TOPICS[i % TOPICS.length],
  dataType: ['结构化', '结构化', '半结构化', '非结构化'][i % 4],
  frequency: ['实时', '每日', '每周', '每月'][(i + 1) % 4],
  score: extraScores[i],
  status: ['正常', '正常', '更新中'][i % 3],
  tag: TAGS[i % TAGS.length],
  fields: 6 + (i % 10),
  callCount: 800 + i * 1211,
  updateTime: `2026-07-${String(2 + (i % 24)).padStart(2, '0')}`,
  shareType: ['无条件共享', '有条件共享', '无条件共享', '不共享', '有条件共享'][i % 5],
  openType: ['可对社会开放', '部分对社会开放', '不可对社会开放'][i % 3],
  mounted: i % 4 < 3 ? '已挂载' : '未挂载',
  resType: ['库表', '接口', '库表', '消息队列'][i % 4],
  authOp: i % 4 === 0,
  hasSample: i % 3 !== 0,
  applyCount: 20 + ((i * 53) % 260)
}))

export const catalogs = [...cityCatalogs, ...extraCatalogs]

export const catalogFields = [
  { name: 'tyshxydm', label: '统一社会信用代码', type: 'VARCHAR(18)', required: '是', desc: '法人主体唯一标识' },
  { name: 'qymc', label: '企业名称', type: 'VARCHAR(200)', required: '是', desc: '登记注册名称' },
  { name: 'fddbr', label: '法定代表人', type: 'VARCHAR(50)', required: '是', desc: '法定代表人姓名' },
  { name: 'zcdz', label: '注册地址', type: 'VARCHAR(500)', required: '否', desc: '登记注册地址' },
  { name: 'clrq', label: '成立日期', type: 'DATE', required: '是', desc: '主体成立日期' },
  { name: 'jyzt', label: '经营状态', type: 'VARCHAR(20)', required: '是', desc: '存续/注销/吊销等' },
  { name: 'zczb', label: '注册资本', type: 'DECIMAL(18,2)', required: '否', desc: '单位：万元' },
  { name: 'hylb', label: '行业类别', type: 'VARCHAR(100)', required: '否', desc: '国民经济行业分类' }
]

/* ---------- 数据产品 ---------- */
export const productCategories = ['原始数据产品', '数据融合产品', '开放技术数据产品', '报告/共享能力产品']

export const products = [
  { id: 'P001', name: '法人全景画像', category: '数据融合产品', dept: '市市场监管局', desc: '融合登记、信用、纳税、社保等12类数据，输出法人主体360°画像。', delivery: 'API接口', scope: '政务部门/授权运营机构' },
  { id: 'P002', name: '自然人基础信息核验', category: '原始数据产品', dept: '市公安局', desc: '提供姓名、身份证号一致性核验服务，毫秒级响应。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P003', name: '企业信用报告', category: '报告/共享能力产品', dept: '市发展改革委', desc: '一键生成企业公共信用报告，支持PDF下载与在线核验。', delivery: '在线报告', scope: '社会公众/政务部门' },
  { id: 'P004', name: '空间地理底图服务', category: '开放技术数据产品', dept: '市规划资源局', desc: '提供全市电子地图、遥感影像、三维模型等地理底图能力。', delivery: '服务套件', scope: '政务部门/企事业单位' },
  { id: 'P005', name: '社保参保状态查询', category: '原始数据产品', dept: '市人社局', desc: '实时查询参保状态、参保类型与缴费区间。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P006', name: '交通出行指数', category: '数据融合产品', dept: '市交通委', desc: '融合公交、地铁、道路卡口数据，输出区域出行热力指数。', delivery: '数据文件', scope: '政务部门/科研机构' },
  { id: 'P007', name: '医疗资源分布分析', category: '报告/共享能力产品', dept: '市卫生健康委', desc: '全市医疗机构、床位、医师资源分布统计分析报告。', delivery: '在线报告', scope: '政务部门' },
  { id: 'P008', name: '隐私计算联合建模', category: '开放技术数据产品', dept: '市数据局', desc: '基于多方安全计算，支持数据可用不可见的联合建模能力。', delivery: '服务套件', scope: '授权运营机构' },
  { id: 'P009', name: '电子证照核验服务', category: '原始数据产品', dept: '市政府办公厅', desc: '身份证、营业执照、驾驶证等58类电子证照真伪核验。', delivery: 'API接口', scope: '政务部门/公共服务机构' },
  { id: 'P010', name: '区域经济运行监测', category: '数据融合产品', dept: '市统计局', desc: '融合税务、用电、用工数据，按区按行业输出经济运行监测指标。', delivery: '数据看板', scope: '政务部门' },
  { id: 'P011', name: '普惠金融风控数据包', category: '数据融合产品', dept: '市地方金融监管局', desc: '面向银行机构的中小微企业信贷风控数据服务包。', delivery: 'API接口', scope: '授权运营机构' },
  { id: 'P012', name: '数据开放年度报告', category: '报告/共享能力产品', dept: '市数据局', desc: '全市公共数据开放利用情况年度分析报告。', delivery: '在线报告', scope: '社会公众' },
  { id: 'P013', name: '浦东城市运行体征指数', category: '数据融合产品', dept: '浦东新区', desc: '汇聚城运、交通、环境等区级数据，实时输出城市运行数字体征指数。', delivery: '数据看板', scope: '政务部门' },
  { id: 'P014', name: '静安商圈客流洞察', category: '报告/共享能力产品', dept: '静安区', desc: '基于脱敏客流与消费数据，输出重点商圈客流画像与趋势洞察报告。', delivery: '在线报告', scope: '政务部门/企事业单位' },
  { id: 'P015', name: '徐汇养老服务资源图谱', category: '开放技术数据产品', dept: '徐汇区', desc: '整合区域养老机构、床位、助餐点数据，提供可视化资源图谱服务。', delivery: '服务套件', scope: '政务部门/公共服务机构' },
  /* 首页行业 TOP5 产品（P016-P030），与 industryProducts.top5 通过 id 关联 */
  { id: 'P016', name: '参保信息核验服务', category: '原始数据产品', dept: '市人社局', desc: '实时核验城镇职工、城乡居民参保登记信息，支撑资格审核类业务场景。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P017', name: '缴费核验服务', category: '原始数据产品', dept: '市人社局', desc: '提供社保缴费记录与缴费状态核验，支持按月度、年度区间查询。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P018', name: '社保待遇领取资格核验', category: '原始数据产品', dept: '市人社局', desc: '核验养老、失业等社保待遇领取资格，防范重复领取与冒领风险。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P019', name: '就业失业登记信息核验', category: '原始数据产品', dept: '市人社局', desc: '提供就业登记、失业登记状态核验，支撑就业补贴精准发放。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P020', name: '职业资格证书核验服务', category: '原始数据产品', dept: '市人社局', desc: '核验国家职业资格证书、技能等级证书真伪与等级信息。', delivery: 'API接口', scope: '政务部门/公共服务机构' },
  { id: 'P021', name: '婚姻状况核验服务', category: '原始数据产品', dept: '市民政局', desc: '提供婚姻登记状态核验服务，支撑购房资格、公积金贷款等场景。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P022', name: '低保对象资格核验服务', category: '原始数据产品', dept: '市民政局', desc: '核验最低生活保障对象身份，支撑救助帮扶政策精准落地。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P023', name: '养老服务补贴核验服务', category: '原始数据产品', dept: '市民政局', desc: '核验老年人养老服务补贴领取资格与发放状态。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P024', name: '社会组织登记信息查询', category: '原始数据产品', dept: '市民政局', desc: '提供社会团体、基金会、民办非企业单位登记信息查询服务。', delivery: 'API接口', scope: '政务部门/社会公众' },
  { id: 'P025', name: '殡葬信息协同核验服务', category: '原始数据产品', dept: '市民政局', desc: '提供殡葬信息跨部门协同核验，支撑身后一件事联办场景。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P026', name: '医保参保状态核验服务', category: '原始数据产品', dept: '市医疗保障局', desc: '实时核验医保参保状态与参保类型，毫秒级响应。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P027', name: '电子健康档案授权查询', category: '数据融合产品', dept: '市卫生健康委', desc: '经个人授权后查询电子健康档案摘要信息，支撑连续诊疗服务。', delivery: 'API接口', scope: '政务部门/公共服务机构' },
  { id: 'P028', name: '医疗机构执业信息核验', category: '原始数据产品', dept: '市卫生健康委', desc: '核验医疗机构执业许可、诊疗科目与执业状态信息。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P029', name: '基本医疗保险待遇核验', category: '原始数据产品', dept: '市医疗保障局', desc: '核验基本医疗保险待遇享受资格与报销记录。', delivery: 'API接口', scope: '政务部门' },
  { id: 'P030', name: '药品追溯信息查询服务', category: '开放技术数据产品', dept: '市市场监管局', desc: '基于药品追溯码查询药品流通全链路信息，保障用药安全。', delivery: 'API接口', scope: '政务部门/社会公众' }
]

// 产品申请热度与上架时间（演示数据）
products.forEach((p, i) => {
  p.applyCount = 40 + ((i * 53) % 360)
  p.listTime = `2026-${String((i % 6) + 1).padStart(2, '0')}-${String(3 + ((i * 7) % 25)).padStart(2, '0')}`
})

/* ---------- 智能合约 ---------- */
export const contractMetrics = {
  shared: { total: 3286, todayNew: 12 },
  dealt: { total: 86452, todayNew: 341 }
}

export const contracts = [
  { id: 'SC20260701', name: '法人数据共享自动审批合约', type: '共享合约', dept: '市市场监管局', status: '执行中', createTime: '2026-07-01 09:30', delivery: 'API接口', hash: '0x7f9a3b1c8e2d4f6a0b5c9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a', deals: 1286 },
  { id: 'SC20260628', name: '自然人核验按次计费合约', type: '成交合约', dept: '市公安局', status: '执行中', createTime: '2026-06-28 14:20', delivery: 'API接口', hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a7f9a3b1c8e2d4f6a0b5c9d8e7f1a2b', deals: 8452 },
  { id: 'SC20260625', name: '信用数据授权运营分账合约', type: '成交合约', dept: '市发展改革委', status: '待审批', createTime: '2026-06-25 10:05', delivery: '库表交换', hash: '0x9c0d1e2f3a4b5c6d7e8f9a7f9a3b1c8e2d4f6a0b5c9d8e7f1a2b3c4d5e6f7a8b', deals: 0 },
  { id: 'SC20260620', name: '医保结算数据定向共享合约', type: '共享合约', dept: '市医疗保障局', status: '执行中', createTime: '2026-06-20 16:40', delivery: '库表交换', hash: '0x1e2f3a4b5c6d7e8f9a7f9a3b1c8e2d4f6a0b5c9d8e7f1a2b3c4d5e6f7a8b9c0d', deals: 3251 },
  { id: 'SC20260618', name: '交通卡口数据脱敏开放合约', type: '共享合约', dept: '市交通委', status: '待审批', createTime: '2026-06-18 11:15', delivery: '消息队列', hash: '0x5c6d7e8f9a7f9a3b1c8e2d4f6a0b5c9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b', deals: 0 },
  { id: 'SC20260615', name: '公积金数据金融机构调用合约', type: '成交合约', dept: '市公积金管理中心', status: '执行中', createTime: '2026-06-15 09:00', delivery: 'API接口', hash: '0x8f9a7f9a3b1c8e2d4f6a0b5c9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e', deals: 12403 },
  { id: 'SC20260610', name: '学籍数据升学核验合约', type: '共享合约', dept: '市教卫工作党委、市教委', status: '已终止', createTime: '2026-06-10 15:30', delivery: 'API接口', hash: '0x2d4f6a0b5c9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a7f9a3b1c8e', deals: 956 },
  { id: 'SC20260605', name: '排污监测数据实时共享合约', type: '共享合约', dept: '市生态环境局', status: '执行中', createTime: '2026-06-05 08:45', delivery: '消息队列', hash: '0x6a0b5c9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a7f9a3b1c8e2d4f', deals: 2107 },
  { id: 'SC20260602', name: '浦东城运体征数据共享合约', type: '共享合约', dept: '浦东新区', status: '执行中', createTime: '2026-06-02 10:20', delivery: '数据文件', hash: '0x4b5c6d7e8f9a7f9a3b1c8e2d4f6a0b5c9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a', deals: 1732 },
  { id: 'SC20260528', name: '静安商圈客流数据成交合约', type: '成交合约', dept: '静安区', status: '待审批', createTime: '2026-05-28 14:50', delivery: '数据文件', hash: '0x0d1e2f3a4b5c6d7e8f9a7f9a3b1c8e2d4f6a0b5c9d8e7f1a2b3c4d5e6f7a8b9c', deals: 0 }
]

/* ---------- 融合库 ---------- */
export const fusionMetrics = { total: 58, opened: 42, calls: 128645230 }

export const fusionThemes = [
  { id: 'F001', name: '营商环境主题库', domain: '经济治理', dept: '市发展和改革委员会', fields: 126, scenes: ['惠企政策精准推送', '企业开办一件事'], calls: 32651240, status: '已开放' },
  { id: 'F002', name: '城市运行体征库', domain: '城市治理', dept: '市城市运行管理中心', fields: 214, scenes: ['城市生命体征监测', '突发事件联动处置'], calls: 28437653, status: '已开放' },
  { id: 'F003', name: '民生保障主题库', domain: '公共服务', dept: '市民政局', fields: 98, scenes: ['社会救助精准识别', '养老服务资源匹配'], calls: 15230821, status: '已开放' },
  { id: 'F004', name: '医疗健康融合库', domain: '公共服务', dept: '市卫生健康委员会', fields: 156, scenes: ['电子病历共享调阅', '医保智能审核'], calls: 21873402, status: '已开放' },
  { id: 'F005', name: '交通出行融合库', domain: '城市治理', dept: '市交通委员会', fields: 143, scenes: ['拥堵治理分析', '公交线网优化'], calls: 18652107, status: '已开放' },
  { id: 'F006', name: '生态环境主题库', domain: '生态文明', dept: '市生态环境局', fields: 87, scenes: ['污染溯源分析', '碳排放核算'], calls: 6721530, status: '建设中' },
  { id: 'F007', name: '信用联合奖惩库', domain: '经济治理', dept: '市发展和改革委员会', fields: 76, scenes: ['失信联合惩戒', '守信激励白名单'], calls: 5078577, status: '已开放' }
]

/* ---------- 个人工作台 ---------- */
export const myApplications = [
  { id: 'APP20260721001', name: '法人基础信息目录用数申请', type: '用数申请', submitTime: '2026-07-21 10:32', status: '审批中', node: '数据提供部门审核', progress: 60 },
  { id: 'APP20260718003', name: '社保参保缴费记录用数申请', type: '用数申请', submitTime: '2026-07-18 15:04', status: '待审批', node: '治理部初审', progress: 20 },
  { id: 'APP20260715002', name: '企业信用报告产品申请', type: '产品申请', submitTime: '2026-07-15 09:18', status: '已通过', node: '已完成', progress: 100 },
  { id: 'APP20260710005', name: '不动产登记信息用数申请', type: '用数申请', submitTime: '2026-07-10 14:47', status: '已驳回', node: '材料不齐驳回', progress: 100, reason: '未提供数据使用场景说明及安全承诺书' },
  { id: 'APP20260706001', name: '交通出行指数产品申请', type: '产品申请', submitTime: '2026-07-06 11:22', status: '已通过', node: '已完成', progress: 100 },
  { id: 'APP20260701004', name: '电子证照核验服务申请', type: '产品申请', submitTime: '2026-07-01 16:35', status: '审批中', node: '安全评估', progress: 80 }
]

export const approvalNodes = ['提交申请', '治理部初审', '数据提供部门审核', '安全评估', '开通交付']

export const myAuthData = [
  { id: 'AUTH001', name: '企业信用报告', source: '市发展和改革委员会', authTime: '2026-07-16', expire: '2027-07-16', calls: 328, quota: 10000 },
  { id: 'AUTH002', name: '交通出行指数', source: '市交通委员会', authTime: '2026-07-07', expire: '2026-12-31', calls: 1240, quota: 50000 },
  { id: 'AUTH003', name: '空间地理底图服务', source: '市规划和自然资源局', authTime: '2026-05-20', expire: '2027-05-20', calls: 8635, quota: 100000 }
]

export const myMessages = [
  { id: 1, type: '审批通知', title: '您的「企业信用报告产品申请」已审批通过', time: '2026-07-16 14:20', read: false },
  { id: 2, type: '审批通知', title: '您的「不动产登记信息用数申请」被驳回，请补充材料', time: '2026-07-12 09:35', read: false },
  { id: 3, type: '系统通知', title: '平台将于7月28日凌晨进行例行维护', time: '2026-07-08 10:00', read: true },
  { id: 4, type: '额度提醒', title: '「交通出行指数」本月调用量已达配额80%', time: '2026-07-05 08:30', read: true }
]

/* ---------- 委办工作台 ---------- */
// 统一待办：服务单/需求单/工单/三清单 四类单据汇总
export const unifiedTodos = [
  { id: 'GD-20260727001', type: '服务单', submitter: '李想', time: '2026-07-27 09:15', status: '待处理' },
  { id: 'GD-20260726154', type: '需求单', submitter: '王维嘉', time: '2026-07-26 16:40', status: '处理中' },
  { id: 'GD-20260726082', type: '工单', submitter: '系统自动发起', time: '2026-07-26 08:00', status: '已完成' },
  { id: 'GD-20260725110', type: '三清单', submitter: '赵小敏', time: '2026-07-25 11:30', status: '待处理' },
  { id: 'GD-20260725067', type: '服务单', submitter: '陈嘉伟', time: '2026-07-25 09:45', status: '处理中' },
  { id: 'GD-20260724021', type: '需求单', submitter: '孙丽华', time: '2026-07-24 14:20', status: '待处理' },
  { id: 'GD-20260723093', type: '工单', submitter: '周建平', time: '2026-07-23 10:05', status: '已完成' },
  { id: 'GD-20260722045', type: '三清单', submitter: '吴雅婷', time: '2026-07-22 15:50', status: '处理中' },
  { id: 'GD-20260721078', type: '其他类型', submitter: '林志强', time: '2026-07-21 16:25', status: '处理中' },
  { id: 'GD-20260720036', type: '其他类型', submitter: '许文娟', time: '2026-07-20 09:40', status: '已完成' }
]

// 工作台首页数据看板：数据融合 / 用数情况 / 供数情况（按五级库分布）
export const wbBoard = {
  fusion: { label: '数据融合总量', total: 1256, unit: '项', growth: 12.5, categories: ['基础库', '主题库', '专题库', '部门库', '个人库'], values: [420, 312, 240, 180, 104] },
  usage: { label: '用数调用总量', total: 8642, unit: '万次', growth: 9.8, categories: ['基础库', '主题库', '专题库', '部门库', '个人库'], values: [3120, 2260, 1580, 1120, 562] },
  supply: { label: '供数目录总量', total: 3187, unit: '个', growth: 6.4, categories: ['基础库', '主题库', '专题库', '部门库', '个人库'], values: [1080, 820, 610, 452, 225] }
}

// 看板-本单位资源统计（用数/供数页签共用）
export const wbOrgStats = [
  { label: '职责目录数', value: 296, unit: '个' },
  { label: '系统目录数', value: 23, unit: '个' },
  { label: '数据目录数', value: 509, unit: '个' },
  { label: '累计归集量', value: 1234, unit: '万条' },
  { label: '当日归集量', value: 4321, unit: '条' }
]

// 看板-用数情况：统计 + TOP5 + 用数清单
export const wbUsageBoard = {
  stats: [
    { label: '申请总数', value: 26, unit: '个' },
    { label: '累计用数', value: 134, unit: '万条' },
    { label: '库表落地次数', value: 509, unit: '次' },
    { label: 'API调用次数', value: 350, unit: '次' },
    { label: '目数据融合次数', value: 60, unit: '次' },
    { label: '属地返还次数', value: 60, unit: '次' }
  ],
  top5: [
    { name: '养老人员情况表A', code: '002421001/000041', dept: '上海大数据中心', count: 10 },
    { name: '养老人员情况表B', code: '002421001/000041', dept: '上海大数据中心', count: 9 },
    { name: '养老人员情况表C', code: '002421001/000041', dept: '上海大数据中心', count: 8 },
    { name: '长三角一体化学生数据', code: '002421001/000041', dept: '上海大数据中心', count: 7 },
    { name: '工会会员信息表', code: '002421001/000041', dept: '上海市总工会', count: 6 }
  ],
  list: [
    { orderNo: '002421001/000041', demandDept: '数据治理部(数据运营部)', dutyDept: '上海市大数据中心', dutyType: '数据落地', catalog: '测试目录名称1', catalogType: '数据库', resource: '养老人员情况表A', status: '已挂接', expire: '2026年6月6日' },
    { orderNo: '002421001/000041', demandDept: '数据治理部(数据运营部)', dutyDept: '上海市大数据中心', dutyType: '数据落地', catalog: '测试目录名称2', catalogType: '数据库', resource: '养老人员情况表B', status: '已挂接', expire: '2026年6月6日' },
    { orderNo: '002421001/000041', demandDept: '数据治理部(数据运营部)', dutyDept: '上海市大数据中心', dutyType: 'api数据服务', catalog: '测试目录名称3', catalogType: '数据库', resource: '养老人员情况表C', status: '已挂接', expire: '2026年6月6日' },
    { orderNo: '002421001/000041', demandDept: '数据治理部(数据运营部)', dutyDept: '上海市大数据中心', dutyType: 'api数据服务', catalog: '测试目录名称4', catalogType: '服务目录', resource: '长三角一体化学生数据', status: '已挂接', expire: '2026年6月6日' },
    { orderNo: '002421001/000041', demandDept: '数据治理部(数据运营部)', dutyDept: '上海市大数据中心', dutyType: 'api数据服务', catalog: '测试目录名称5', catalogType: '服务目录', resource: '工会会员信息表', status: '已挂接', expire: '2026年6月6日' }
  ]
}

// 看板-供数情况：统计 + TOP5 + 供数清单
export const wbSupplyBoard = {
  stats: [
    { label: '需求总数', value: 96, unit: '个' },
    { label: '累计供数', value: 1234, unit: '万条' },
    { label: '库表落地次数', value: 509, unit: '次' },
    { label: 'API调用次数', value: 350, unit: '次' },
    { label: '目数据融合次数', value: 60, unit: '次' },
    { label: '属地返还次数', value: 60, unit: '次' }
  ],
  top5: [
    { name: '文旅局信用数据错误反馈', code: '002421001/000041', shareType: '无条件共享', count: 10 },
    { name: '文健委信用数据错误反馈', code: '002421001/000041', shareType: '无条件共享', count: 9 },
    { name: '人社局信用数据错误反馈', code: '002421001/000041', shareType: '无条件共享', count: 8 },
    { name: '市教务信用数据错误反馈', code: '002421001/000041', shareType: '无条件共享', count: 7 },
    { name: '绿化绿容局信用数据错误反馈', code: '002421001/000041', shareType: '无条件共享', count: 6 }
  ],
  list: [
    { code: '002421001/000041', name: '文旅局信用数据错误反馈', items: '备注,主键,错误信息描述,数据id,时间戳,反馈', shareType: '无条件共享', pubStatus: '已发布', linkStatus: '已挂接', count: 10 },
    { code: '002421001/000041', name: '文健委信用数据错误反馈', items: '备注,主键,错误信息描述,数据id,时间戳,反馈', shareType: '无条件共享', pubStatus: '已发布', linkStatus: '已挂接', count: 9 },
    { code: '002421001/000041', name: '人社局信用数据错误反馈', items: '备注,主键,错误信息描述,数据id,时间戳,反馈', shareType: '无条件共享', pubStatus: '已发布', linkStatus: '已挂接', count: 8 },
    { code: '002421001/000041', name: '市教务信用数据错误反馈', items: '备注,主键,错误信息描述,数据id,时间戳,反馈', shareType: '无条件共享', pubStatus: '已发布', linkStatus: '已挂接', count: 7 },
    { code: '002421001/000041', name: '绿化绿容局信用数据错误反馈', items: '备注,主键,错误信息描述,数据id,时间戳,反馈', shareType: '无条件共享', pubStatus: '已发布', linkStatus: '已挂接', count: 6 }
  ]
}

export const commissionTickets = [
  { id: 'WO20260722001', title: '法人库7月增量数据挂载异常整改', type: '数据整改', priority: '紧急', status: '待处理', createTime: '2026-07-22 09:10', deadline: '2026-07-25' },
  { id: 'WO20260720002', title: '企业登记信息接口响应超时优化', type: '接口运维', priority: '重要', status: '处理中', createTime: '2026-07-20 14:30', deadline: '2026-07-27' },
  { id: 'WO20260718001', title: '行政许可数据字段描述补全', type: '数据整改', priority: '一般', status: '处理中', createTime: '2026-07-18 10:15', deadline: '2026-07-30' },
  { id: 'WO20260715003', title: '新增测绘成果目录挂载申请协办', type: '目录管理', priority: '一般', status: '已完成', createTime: '2026-07-15 16:00', deadline: '2026-07-22' },
  { id: 'WO20260712002', title: '不动产数据月度质量核查', type: '质量核查', priority: '重要', status: '已完成', createTime: '2026-07-12 09:00', deadline: '2026-07-19' }
]

export const supplyDemandData = {
  share: {
    months: ['2月', '3月', '4月', '5月', '6月', '7月'],
    supply: [1250, 1380, 1420, 1560, 1690, 1820],
    demand: [980, 1100, 1240, 1350, 1480, 1602],
    summary: [
      { label: '本月供数目录', value: 186, unit: '个' },
      { label: '本月共享调用', value: 1820435, unit: '次' },
      { label: '服务部门数', value: 42, unit: '个' }
    ]
  },
  open: {
    months: ['2月', '3月', '4月', '5月', '6月', '7月'],
    supply: [420, 465, 510, 548, 590, 632],
    demand: [310, 356, 402, 445, 490, 528],
    summary: [
      { label: '开放数据集', value: 632, unit: '个' },
      { label: '本月下载量', value: 52843, unit: '次' },
      { label: '社会开发应用', value: 87, unit: '个' }
    ]
  },
  operate: {
    months: ['2月', '3月', '4月', '5月', '6月', '7月'],
    supply: [86, 95, 108, 120, 134, 152],
    demand: [64, 78, 88, 102, 115, 128],
    summary: [
      { label: '授权运营产品', value: 152, unit: '个' },
      { label: '本月成交额', value: 2864, unit: '万元' },
      { label: '合作运营机构', value: 12, unit: '家' }
    ]
  }
}

export const whitelist = [
  { id: 'WL001', name: '市公安局人口核验系统', ip: '10.28.6.101', api: '自然人基础信息核验', addTime: '2026-06-10', status: '生效中' },
  { id: 'WL002', name: '市税务局金三系统', ip: '10.32.1.55', api: '法人基础信息查询', addTime: '2026-06-15', status: '生效中' },
  { id: 'WL003', name: '浦东新区政务服务平台', ip: '10.45.8.20', api: '电子证照核验', addTime: '2026-06-28', status: '生效中' },
  { id: 'WL004', name: '市住建委审批系统', ip: '10.51.3.88', api: '不动产登记信息查询', addTime: '2026-07-05', status: '待生效' },
  { id: 'WL005', name: '市医保局结算平台', ip: '10.60.2.33', api: '参保状态查询', addTime: '2026-07-12', status: '生效中' }
]

export const apiList = [
  { id: 'API001', name: '法人基础信息查询', version: 'v2.3', protocol: 'HTTPS/JSON', qps: 200, todayCalls: 86452, successRate: 99.97, status: '在线' },
  { id: 'API002', name: '不动产登记信息查询', version: 'v1.8', protocol: 'HTTPS/JSON', qps: 100, todayCalls: 32107, successRate: 99.92, status: '在线' },
  { id: 'API003', name: '测绘成果目录检索', version: 'v1.2', protocol: 'HTTPS/JSON', qps: 50, todayCalls: 5230, successRate: 99.85, status: '在线' },
  { id: 'API004', name: '控规信息批量获取', version: 'v1.0', protocol: 'HTTPS/文件', qps: 20, todayCalls: 863, successRate: 98.60, status: '维护中' },
  { id: 'API005', name: '地名地址标准化匹配', version: 'v3.1', protocol: 'HTTPS/JSON', qps: 300, todayCalls: 120685, successRate: 99.99, status: '在线' }
]

export const changeRequests = [
  { id: 'CR20260718001', type: '调容量', target: '法人基础信息查询接口', desc: 'QPS从200提升至500，支撑年检高峰', submitTime: '2026-07-18', status: '审批中' },
  { id: 'CR20260630002', type: '延期', target: '测绘成果共享授权', desc: '授权有效期延长12个月', submitTime: '2026-06-30', status: '已通过' },
  { id: 'CR20260615001', type: '变更', target: '不动产登记信息目录', desc: '新增"抵押状态"字段共享范围', submitTime: '2026-06-15', status: '已通过' }
]

/* ---------- 治理部：管账号 ---------- */
export const accounts = Array.from({ length: 28 }, (_, i) => {
  const roles = ['普通用户', '委办用户', '委办用户', '治理部管理员']
  const status = ['正常', '正常', '正常', '正常', '休眠', '禁用']
  const days = [2, 5, 1, 12, 98, 156, 8, 0, 3, 210][i % 10]
  const d = new Date(2026, 6, 27 - days)
  return {
    id: `U${String(10001 + i)}`,
    name: ['陈志强', '刘敏', '赵国庆', '孙丽华', '周建军', '吴晓燕', '郑海涛', '王芳', '冯军', '褚红梅'][i % 10] + (i >= 10 ? String(Math.floor(i / 10)) : ''),
    dept: DEPTS[i % DEPTS.length],
    role: roles[i % roles.length],
    lastLogin: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    dormantDays: days,
    status: days > 90 ? '休眠' : status[i % status.length] === '休眠' ? '正常' : status[i % status.length],
    permissions: ['目录查询', '用数申请', i % 2 ? '接口管理' : '数据下载'].filter(Boolean)
  }
})

export const accountApprovals = [
  { id: 'AA20260722001', applicant: '钱学明', dept: '市水务局', type: '开通账号', role: '委办用户', reason: '负责本单位水务数据共享对接工作', material: '单位介绍信、身份证明、保密承诺书', submitTime: '2026-07-22 10:20', status: '待审批' },
  { id: 'AA20260721002', applicant: '孙丽华', dept: '市市场监督管理局', type: '权限升级', role: '委办用户', reason: '新增接口管理权限，负责法人库接口运维', material: '部门授权函', submitTime: '2026-07-21 15:40', status: '待审批' },
  { id: 'AA20260720001', applicant: '李文博', dept: '市体育局', type: '开通账号', role: '普通用户', reason: '查询体育场馆运营统计数据', material: '单位介绍信', submitTime: '2026-07-20 09:15', status: '待审批' },
  { id: 'AA20260718002', applicant: '张伟东', dept: '市文化和旅游局', type: '权限升级', role: '委办用户', reason: '申请文旅融合库数据下载权限', material: '部门授权函、安全评估表', submitTime: '2026-07-18 14:00', status: '已通过' },
  { id: 'AA20260715001', applicant: '王建国', dept: '某科技公司', type: '开通账号', role: '委办用户', reason: '数据授权运营合作', material: '营业执照', submitTime: '2026-07-15 11:30', status: '已驳回' }
]

export const permissionTree = [
  { label: '门户功能', children: [{ label: '数据目录检索' }, { label: '用数申请' }, { label: '产品申请' }, { label: '收藏夹' }] },
  { label: '委办功能', children: [{ label: '工单管理' }, { label: '需求提交' }, { label: '供需统计' }, { label: '白名单管理' }, { label: '接口管理' }, { label: '变更申请' }] },
  { label: '治理功能', children: [{ label: '管账号' }, { label: '管资源' }, { label: '管数据' }, { label: '管运维' }] }
]

/* ---------- 治理部：管资源 ---------- */
export const resourcePool = {
  total: 2048, applied: 1436, released: 1180, remain: 612,
  trend: {
    months: ['2月', '3月', '4月', '5月', '6月', '7月'],
    applied: [980, 1050, 1150, 1260, 1350, 1436],
    released: [820, 900, 960, 1040, 1120, 1180]
  }
}

export const frontMachines = Array.from({ length: 12 }, (_, i) => ({
  id: `FM${String(101 + i)}`,
  name: `前置机-${DEPTS[i % DEPTS.length].replace('市', '').slice(0, 4)}-${String(i + 1).padStart(2, '0')}`,
  dept: DEPTS[i % DEPTS.length],
  ip: `10.88.${i + 1}.${10 + i * 3}`,
  cpu: [35, 62, 78, 45, 91, 28, 55, 70, 40, 85, 33, 60][i],
  memory: [48, 70, 82, 52, 94, 36, 61, 75, 45, 88, 40, 66][i],
  disk: [30, 55, 68, 42, 80, 25, 50, 62, 38, 76, 28, 58][i],
  status: [91, 85].includes([35, 62, 78, 45, 91, 28, 55, 70, 40, 85, 33, 60][i]) ? '告警' : '运行中',
  tasks: 3 + (i % 6),
  uptime: `${120 + i * 15}天`
}))

export const fmTasks = [
  { id: 'T001', name: '法人库增量同步', type: '数据同步', schedule: '每日 02:00', lastRun: '2026-07-27 02:00', duration: '18分32秒', status: '成功' },
  { id: 'T002', name: '目录质量巡检', type: '质量检测', schedule: '每日 05:00', lastRun: '2026-07-27 05:00', duration: '42分10秒', status: '成功' },
  { id: 'T003', name: '接口日志归集', type: '日志归集', schedule: '每小时', lastRun: '2026-07-27 14:00', duration: '3分05秒', status: '成功' },
  { id: 'T004', name: '全量备份任务', type: '数据备份', schedule: '每周日 01:00', lastRun: '2026-07-26 01:00', duration: '2小时18分', status: '失败' }
]

export const fmAlerts = [
  { id: 'AL001', level: '重要', content: 'CPU使用率连续15分钟超过85%', time: '2026-07-27 13:42', status: '未处理' },
  { id: 'AL002', level: '一般', content: '磁盘使用率超过75%阈值', time: '2026-07-26 09:15', status: '已处理' }
]

export const resourceApprovals = [
  { id: 'RA20260723001', dept: '市水务局', type: '前置机申请', spec: '8C16G / 500GB SSD', reason: '新接入水务监测数据共享', submitTime: '2026-07-23 10:00', status: '待审批' },
  { id: 'RA20260721001', dept: '市卫生健康委员会', type: '扩容申请', spec: '内存 16G→32G', reason: '医疗数据同步任务内存不足', submitTime: '2026-07-21 14:30', status: '待审批' },
  { id: 'RA20260718001', dept: '市交通委员会', type: '扩容申请', spec: '磁盘 500GB→1TB', reason: '卡口数据量增长', submitTime: '2026-07-18 09:20', status: '已通过' },
  { id: 'RA20260715002', dept: '市教育委员会', type: '前置机申请', spec: '4C8G / 200GB SSD', reason: '学籍数据共享接入', submitTime: '2026-07-15 16:45', status: '已通过' }
]

/* ---------- 治理部：管数据 ---------- */
export const dataMonitor = {
  normal: 12275, mountError: 326, stopped: 262,
  deptDist: [
    { dept: '市场监管局', mountError: 68, stopped: 42 },
    { dept: '公安局', mountError: 22, stopped: 15 },
    { dept: '人社局', mountError: 45, stopped: 38 },
    { dept: '规资局', mountError: 31, stopped: 26 },
    { dept: '生态环境局', mountError: 52, stopped: 47 },
    { dept: '住建委', mountError: 38, stopped: 30 },
    { dept: '交通委', mountError: 28, stopped: 24 },
    { dept: '卫健委', mountError: 42, stopped: 40 }
  ]
}

export const mountIssues = [
  { id: 'MI001', catalog: '食品经营许可信息', dept: '市市场监督管理局', type: '未挂载资源', detail: '目录已发布42天，未挂载任何库表或接口资源', foundTime: '2026-07-25', status: '待整改' },
  { id: 'MI002', catalog: '排污许可证信息', dept: '市生态环境局', type: '挂载异常', detail: '挂载接口连续3日探活失败', foundTime: '2026-07-24', status: '待整改' },
  { id: 'MI003', catalog: '建筑工程施工许可', dept: '市住房和城乡建设管理委员会', type: '挂载异常', detail: '库表字段与目录描述不一致（缺失2个字段）', foundTime: '2026-07-22', status: '整改中' },
  { id: 'MI004', catalog: '出租车运营信息', dept: '市交通委员会', type: '未挂载资源', detail: '目录更新后原挂载资源已失效', foundTime: '2026-07-20', status: '整改中' },
  { id: 'MI005', catalog: '残疾人证基础信息', dept: '市残疾人联合会', type: '挂载异常', detail: '接口返回格式不符合平台规范', foundTime: '2026-07-18', status: '已整改' }
]

export const updateIssues = [
  { id: 'UI001', catalog: '婚姻登记信息目录', dept: '市民政局', frequency: '每日', lastUpdate: '2026-06-02', stopDays: 55, status: '待通知' },
  { id: 'UI002', catalog: '药品经营许可信息', dept: '市药品监督管理局', frequency: '每周', lastUpdate: '2026-06-15', stopDays: 42, status: '已通知' },
  { id: 'UI003', catalog: '低保救助对象信息', dept: '市民政局', frequency: '每月', lastUpdate: '2026-04-30', stopDays: 88, status: '已通知' },
  { id: 'UI004', catalog: '公积金缴存信息', dept: '市公积金管理中心', frequency: '每日', lastUpdate: '2026-07-10', stopDays: 17, status: '待通知' },
  { id: 'UI005', catalog: '机动车登记信息', dept: '市公安局', frequency: '每日', lastUpdate: '2026-07-05', stopDays: 22, status: '整改中' }
]

/* ---------- 治理部：管运维 ---------- */
export const opsOverview = {
  services: [
    { name: '数据共享交换服务', status: '正常', uptime: '99.99%' },
    { name: '统一身份认证服务', status: '正常', uptime: '99.98%' },
    { name: 'API网关服务', status: '正常', uptime: '99.97%' },
    { name: '区块链存证服务', status: '正常', uptime: '99.95%' },
    { name: 'AI智能搜索服务', status: '告警', uptime: '99.62%' },
    { name: '融合计算服务', status: '正常', uptime: '99.94%' }
  ],
  serverLoad: { cpu: 58, memory: 67, disk: 52, network: 43 },
  apiSuccess: {
    hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    rate: [99.95, 99.97, 99.92, 99.96, 99.98, 99.90, 99.94],
    rt: [86, 92, 110, 95, 78, 120, 98]
  }
}

export const opsAlerts = [
  { id: 'OA20260727001', level: '紧急', content: 'AI智能搜索服务节点2响应超时率达8%', source: 'AI搜索集群', time: '2026-07-27 13:20', status: '未处理' },
  { id: 'OA20260727002', level: '重要', content: 'API网关QPS达到峰值容量85%', source: 'API网关', time: '2026-07-27 11:45', status: '处理中' },
  { id: 'OA20260726003', level: '重要', content: '前置机FM105 CPU持续高负载', source: '前置机监控', time: '2026-07-26 16:30', status: '处理中' },
  { id: 'OA20260726001', level: '一般', content: '共享交换库慢查询数量环比上升30%', source: '数据库监控', time: '2026-07-26 10:15', status: '未处理' },
  { id: 'OA20260725002', level: '一般', content: '对象存储桶容量使用率达70%', source: '存储监控', time: '2026-07-25 09:00', status: '已闭环' },
  { id: 'OA20260724001', level: '紧急', content: '区块链存证节点同步延迟超过阈值', source: '区块链服务', time: '2026-07-24 22:10', status: '已闭环' }
]

export const opsTickets = [
  { id: 'OT20260727001', title: 'AI搜索服务节点扩容处理', alertId: 'OA20260727001', assignee: '运维一组', priority: '紧急', createTime: '2026-07-27 13:30', status: '处理中', progress: 40 },
  { id: 'OT20260726002', title: '前置机FM105负载优化', alertId: 'OA20260726003', assignee: '运维二组', priority: '重要', createTime: '2026-07-26 17:00', status: '处理中', progress: 65 },
  { id: 'OT20260725001', title: '对象存储扩容申请与实施', alertId: 'OA20260725002', assignee: '运维一组', priority: '一般', createTime: '2026-07-25 10:00', status: '已闭环', progress: 100, closeNote: '完成扩容500TB，使用率降至45%' },
  { id: 'OT20260724003', title: '区块链节点同步异常修复', alertId: 'OA20260724001', assignee: '运维三组', priority: '紧急', createTime: '2026-07-24 22:30', status: '已闭环', progress: 100, closeNote: '重启同步服务并优化网络链路，延迟恢复正常' }
]

export { DEPTS, TOPICS, TAGS }
