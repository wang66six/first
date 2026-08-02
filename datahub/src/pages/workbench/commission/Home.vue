<template>
  <div class="cwb-home">
    <!-- 第一行：欢迎卡 + 快捷操作 -->
    <div class="welcome-row">
      <div class="gov-card welcome-card">
        <div class="welcome-avatar"><el-icon :size="24"><Monitor /></el-icon></div>
        <div>
          <h2 class="welcome-title title-font">{{ wbDept }}<span class="welcome-office">{{ wbOffice }}</span></h2>
          <p class="welcome-meta"><el-icon><Clock /></el-icon>登录时间：{{ user.loginTime || nowText }}</p>
          <p class="welcome-meta"><el-icon><Position /></el-icon>登录 IP：{{ user.loginIp || '10.208.36.72' }}</p>
        </div>
      </div>
      <div class="gov-card quick-card">
        <div class="quick-card-head">
          <p class="quick-card-title">快捷操作</p>
          <el-tooltip content="自定义快捷操作" placement="top">
            <span class="quick-config-btn" @click="openQuickConfig">
              <el-icon :size="15"><Setting /></el-icon>
            </span>
          </el-tooltip>
        </div>
        <div class="quick-items">
          <div
            v-for="q in quickActions"
            :key="q.label"
            class="quick-item stagger-item"
            role="button"
            tabindex="0"
            :title="q.label"
            :aria-label="`快捷操作：${q.label}`"
            @click="onQuick(q)"
            @keydown.enter="onQuick(q)"
          >
            <span class="quick-icon" :style="{ background: q.bg, color: q.color }">
              <el-icon :size="18"><component :is="q.icon" /></el-icon>
            </span>
            <span class="quick-label">{{ q.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作配置弹窗：从左侧菜单中选择 4 个 -->
    <el-dialog v-model="quickConfigDialog" title="自定义快捷操作" width="640px" align-center>
      <p class="qc-tip">从工作台左侧菜单中选择 <b>4</b> 个功能固定展示在快捷操作区（已选 {{ quickDraft.length }}/4）</p>
      <div v-for="g in quickOptionGroups" :key="g.group" class="qc-group">
        <p class="qc-group-title">{{ g.group }}</p>
        <div class="qc-options">
          <div
            v-for="opt in g.options"
            :key="opt.label"
            class="qc-option"
            :class="{ selected: quickDraft.includes(opt.label), disabled: !quickDraft.includes(opt.label) && quickDraft.length >= 4 }"
            @click="toggleQuick(opt)"
          >
            <el-icon :size="14"><component :is="opt.icon" /></el-icon>
            <span>{{ opt.label }}</span>
            <el-icon v-if="quickDraft.includes(opt.label)" class="qc-check" :size="13"><Check /></el-icon>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="quickConfigDialog = false">取消</el-button>
        <el-button @click="resetQuickDraft">恢复默认</el-button>
        <el-button type="primary" :disabled="quickDraft.length !== 4" @click="saveQuickConfig">保存</el-button>
      </template>
    </el-dialog>

    <!-- 第二行：AI 找数 -->
    <div class="gov-card ai-card">
      <div class="ai-head">
        <span class="ai-robot"><el-icon :size="18"><MagicStick /></el-icon></span>
        <span class="ai-title">AI 找数</span>
        <span class="ai-sub">通过自然语言语义识别，快速定位所需数据目录</span>
      </div>
      <div class="ai-search">
        <el-icon class="ai-search-icon"><Search /></el-icon>
        <input
          v-model="keyword"
          class="ai-input"
          placeholder="搜索数据目录、数据产品、应用场景或直接描述需求"
          @keyup.enter="doSearch()"
        />
        <button class="ai-btn" @click="doSearch()">搜索</button>
      </div>
      <div class="ai-hot">
        <span class="ai-hot-label">热门目录：</span>
        <span v-for="t in hotTags" :key="t.name" class="ai-hot-tag" @click="doSearch(t.name)">
          {{ t.name }}<em>{{ t.clicks }}</em>
        </span>
        <span class="ai-hot-more" @click="router.push('/zone/data-resource')">全部目录 &gt;</span>
      </div>
    </div>

    <!-- 第三行：通知公告 / 消息提醒 / 待办事项 -->
    <div class="gov-card tab-card">
      <div class="tab-head">
        <span
          v-for="t in ['通知公告', '消息提醒', '待办事项']"
          :key="t"
          class="tab-item"
          :class="{ active: activeTab === t }"
          @click="activeTab = t"
        >{{ t }}</span>
      </div>

      <!-- 待办事项：类型筛选 + 单据表格 -->
      <template v-if="activeTab === '待办事项'">
        <div class="todo-filters">
          <span
            v-for="f in ['全部', '服务单', '需求单', '工单', '三清单', '其他类型']"
            :key="f"
            class="todo-pill"
            :class="{ active: todoType === f }"
            @click="todoType = f"
          >{{ f }}</span>
        </div>
        <el-table :data="filteredTodos" :show-header="true">
          <el-table-column prop="id" label="工单编号" min-width="200" />
          <el-table-column prop="type" label="工单类型" min-width="140" />
          <el-table-column prop="submitter" label="提交人" min-width="140" />
          <el-table-column prop="time" label="提交时间" min-width="170" />
          <el-table-column label="状态" min-width="110">
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)" size="small" effect="light">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="viewTodo(row)">{{ row.status === '已完成' ? '查看日志' : '详情' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 通知公告 -->
      <div v-else-if="activeTab === '通知公告'" class="notice-list">
        <div v-for="n in notices" :key="n.id" class="notice-row" @click="router.push(`/notice/${n.id}`)">
          <el-tag size="small" :type="n.type === '政策公告' ? 'warning' : 'primary'" effect="plain">{{ n.type }}</el-tag>
          <span class="notice-title">{{ n.title }}</span>
          <span class="notice-date">{{ n.date }}</span>
        </div>
      </div>

      <!-- 消息提醒 -->
      <div v-else class="notice-list">
        <div v-for="m in myMessages" :key="m.id" class="notice-row" @click="ElMessage.info('消息详情建设中')">
          <el-badge :is-dot="!m.read"><el-tag size="small" effect="plain">{{ m.type }}</el-tag></el-badge>
          <span class="notice-title">{{ m.title }}</span>
          <span class="notice-date">{{ m.time }}</span>
        </div>
      </div>
    </div>

    <!-- 第四行：数据看板 -->
    <div class="gov-card board-card">
      <!-- 治理部工作台：账号统计 / 资源情况 / 数据目录 / 运维监控 -->
      <template v-if="isGov">
        <div class="tab-head">
          <span
            v-for="b in govBoardTabs"
            :key="b.key"
            class="tab-item"
            :class="{ active: govBoard === b.key }"
            @click="govBoard = b.key"
          >{{ b.label }}</span>
          <div class="spacer"></div>
        </div>

        <!-- 账号统计 -->
        <template v-if="govBoard === 'account'">
          <div class="ds-panel gov-acct-panel">
            <div class="ds-panel-head"><span class="ds-panel-title">账号数据统计</span></div>
            <div class="ds-metrics">
              <div v-for="m in govAccountStats" :key="m.label" class="ds-metric gov-acct-metric">
                <span class="gov-acct-icon" :style="{ background: m.bg, color: m.color }">
                  <el-icon :size="18"><component :is="m.icon" /></el-icon>
                </span>
                <div class="gov-acct-body">
                  <p class="ds-metric-label">{{ m.label }}</p>
                  <p class="ds-metric-value">{{ m.value }}<em>{{ m.unit }}</em></p>
                </div>
              </div>
            </div>
          </div>

          <!-- 登录情况统计 -->
          <div class="ds-panel gov-login-panel">
            <div class="ds-panel-head"><span class="ds-panel-title">登录情况统计</span></div>
            <div class="gov-login-charts">
              <div class="gov-login-chart">
                <p class="gov-chart-title">当日分时访问人数</p>
                <VChart :option="loginHourlyOption" height="240px" />
              </div>
              <div class="gov-login-chart">
                <p class="gov-chart-title">近30天访问人数</p>
                <VChart :option="login30dOption" height="240px" />
              </div>
            </div>
          </div>

          <h3 class="ds-section-title">不活跃账号清单</h3>
          <div class="ds-filters">
            <span class="ds-filter-label">账号名</span>
            <el-input v-model="govAcctFilter.name" placeholder="请输入" clearable style="width: 130px" />
            <span class="ds-filter-label">单位部门</span>
            <el-input v-model="govAcctFilter.dept" placeholder="请输入" clearable style="width: 160px" />
            <div class="spacer"></div>
            <el-button type="primary" @click="exportInactive">
              <el-icon style="margin-right: 4px"><Download /></el-icon>导出
            </el-button>
          </div>
          <el-table :data="pagedInactive">
            <el-table-column type="index" label="序号" width="70" :index="(i) => (inactivePage - 1) * 10 + i + 1" />
            <el-table-column prop="name" label="账号名" min-width="140" />
            <el-table-column prop="dept" label="单位部门" min-width="220" />
            <el-table-column prop="lastLogin" label="最近登录日期" min-width="150" />
            <el-table-column label="连续未登录天数" min-width="150">
              <template #default="{ row }">
                <span :class="{ 'gov-dormant-warn': row.dormantDays >= 90 }">{{ row.dormantDays }} 天</span>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="!filteredInactive.length" description="暂无匹配的不活跃账号" />
          <div v-else class="ds-pager">
            <el-pagination
              v-model:current-page="inactivePage"
              background
              layout="prev, pager, next, total"
              :total="filteredInactive.length"
              :page-size="10"
            />
          </div>
        </template>


        <!-- 资源情况 -->
        <template v-else-if="govBoard === 'resource'">
          <!-- 底座情况 -->
          <h3 class="ds-section-title">底座情况</h3>
          <div class="gov-base-row">
            <div v-for="b in govBaseStats" :key="b.name" class="gov-base-card">
              <p class="gov-base-title">{{ b.name }}</p>
              <p class="gov-base-sub">存储信息</p>
              <div class="gov-bar-head">
                <span>总容量</span>
                <span class="gov-bar-cap">{{ b.total }} TB</span>
              </div>
              <el-progress :percentage="Math.round((b.used / b.total) * 100)" :show-text="false" :stroke-width="8" color="#3a7bd5" />
              <div class="gov-base-metrics">
                <div class="gov-bm"><p class="l">已用</p><p class="v">{{ b.used }} TB</p></div>
                <div class="gov-bm"><p class="l">剩余</p><p class="v">{{ (b.total - b.used).toLocaleString() }} TB</p></div>
                <div class="gov-bm"><p class="l">本周新增</p><p class="v">{{ b.weekAdd }} TB</p></div>
              </div>
              <p class="gov-base-sub">资源使用率</p>
              <div class="gov-usage">
                <div class="gov-usage-head"><span>CPU</span><span class="gov-usage-num cpu">{{ b.cpu }}%</span></div>
                <el-progress :percentage="b.cpu" :show-text="false" :stroke-width="8" color="#3a7bd5" />
              </div>
              <div class="gov-usage">
                <div class="gov-usage-head"><span>内存</span><span class="gov-usage-num mem">{{ b.memory }}%</span></div>
                <el-progress :percentage="b.memory" :show-text="false" :stroke-width="8" color="#f2711c" />
              </div>
            </div>
          </div>

          <!-- 资产情况 -->
          <h3 class="ds-section-title">资产情况</h3>
          <div class="gov-asset-summary">
            <div v-for="a in govAssetSummary" :key="a.label" class="gov-asset-card">
              <span class="gov-asset-icon" :style="{ background: a.bg, color: a.color }">
                <el-icon :size="20"><component :is="a.icon" /></el-icon>
              </span>
              <div class="gov-asset-body">
                <p class="gov-asset-label">{{ a.label }}</p>
                <p class="gov-asset-value">{{ a.value }}<em v-if="a.unit">{{ a.unit }}</em></p>
              </div>
              <div class="gov-asset-delta">本周新增 {{ a.weekAdd }}<el-icon><Top /></el-icon></div>
            </div>
          </div>
          <div class="gov-asset-base-row">
            <div v-for="b in govAssetByBase" :key="b.name" class="gov-asset-base">
              <div class="gov-asset-base-head">
                <span class="gov-asset-base-name">{{ b.name }}</span>
                <span class="gov-asset-base-tag">{{ b.tag }}</span>
              </div>
              <div class="gov-asset-base-metrics">
                <div class="gov-abm">
                  <p class="l">数据库数量</p>
                  <p class="v">{{ b.dbCount }}</p>
                  <p class="d">本周新增 {{ b.dbAdd }}<el-icon><Top /></el-icon></p>
                </div>
                <div class="gov-abm">
                  <p class="l">数据表数量</p>
                  <p class="v">{{ b.tableCount }}</p>
                  <p class="d">本周新增 {{ b.tableAdd }}<el-icon><Top /></el-icon></p>
                </div>
                <div class="gov-abm">
                  <p class="l">存储用量</p>
                  <p class="v">{{ b.storage }}<em>{{ b.storageUnit }}</em></p>
                  <p class="d">本周新增 {{ b.storageAdd }}<el-icon><Top /></el-icon></p>
                </div>
              </div>
            </div>
          </div>

          <!-- 前置机统计 -->
          <div class="gov-section-bar">
            <h3 class="ds-section-title" style="margin: 0">前置机统计</h3>
            <el-select v-model="fmDept" size="small" style="width: 200px">
              <el-option v-for="d in fmDeptOptions" :key="d" :label="d" :value="d" />
            </el-select>
          </div>
          <div class="gov-fm-row">
            <div class="gov-fm-card">
              <span class="gov-fm-icon" style="background: #e8f2fd; color: #2563c9"><el-icon :size="22"><Monitor /></el-icon></span>
              <div>
                <p class="gov-fm-label">前置机总数</p>
                <p class="gov-fm-value">{{ fmStat.total }}<em>台</em></p>
              </div>
            </div>
            <div class="gov-fm-card">
              <span class="gov-fm-icon" style="background: #e8f8ee; color: #22a35c"><el-icon :size="22"><Connection /></el-icon></span>
              <div>
                <p class="gov-fm-label">使用情况</p>
                <p class="gov-fm-value">{{ fmStat.used }}<em>台已用</em> / {{ fmStat.idle }}<em>台空闲</em></p>
              </div>
            </div>
            <div class="gov-fm-card gov-fm-rate">
              <div class="gov-fm-rate-head">
                <p class="gov-fm-label">使用率</p>
                <p class="gov-fm-value">{{ fmStat.rate }}<em>%</em></p>
              </div>
              <el-progress :percentage="fmStat.rate" :show-text="false" :stroke-width="10" :color="fmStat.rate >= 80 ? '#f2711c' : '#3a7bd5'" />
            </div>
          </div>

          <!-- 前置机列表 -->
          <h3 class="ds-section-title">前置机列表</h3>
          <el-table :data="pagedFrontMachines">
            <el-table-column type="index" label="序号" width="70" :index="(i) => (fmListPage - 1) * 10 + i + 1" />
            <el-table-column prop="name" label="前置机名称" min-width="140" />
            <el-table-column prop="ip" label="IP 地址" min-width="140" />
            <el-table-column prop="dept" label="所属单位" min-width="200" />
            <el-table-column prop="usage" label="用途" min-width="110" />
            <el-table-column label="CPU 使用率" min-width="140">
              <template #default="{ row }">
                <el-progress :percentage="row.cpu" :stroke-width="8" :color="row.cpu >= 80 ? '#f2711c' : '#3a7bd5'" />
              </template>
            </el-table-column>
            <el-table-column label="内存使用率" min-width="140">
              <template #default="{ row }">
                <el-progress :percentage="row.memory" :stroke-width="8" :color="row.memory >= 80 ? '#f2711c' : '#3a7bd5'" />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '在线' ? 'success' : 'info'" size="small" effect="light">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="ds-pager">
            <el-pagination
              v-model:current-page="fmListPage"
              background
              layout="prev, pager, next, total"
              :total="fmListFiltered.length"
              :page-size="10"
            />
          </div>
        </template>


        <!-- 数据目录 -->
        <template v-else-if="govBoard === 'catalog'">
          <!-- 数据上链情况 -->
          <h3 class="ds-section-title">数据上链情况</h3>
          <div class="gov-chain-row">
            <div class="gov-chain-cards">
              <div v-for="c in govChainStats" :key="c.label" class="gov-chain-card">
                <span class="gov-chain-icon" :style="{ background: c.bg, color: c.color }">
                  <el-icon :size="22"><component :is="c.icon" /></el-icon>
                </span>
                <div class="gov-chain-body">
                  <p class="gov-chain-value">{{ c.value }}</p>
                  <p class="gov-chain-label">{{ c.label }}</p>
                </div>
              </div>
            </div>
            <div class="gov-rate-list">
              <div v-for="r in govChainRates" :key="r.label" class="gov-rate-item">
                <div class="gov-rate-head">
                  <span class="gov-rate-label">{{ r.label }}</span>
                  <span class="gov-rate-val">{{ r.value }}%</span>
                </div>
                <div class="gov-rate-track"><div class="gov-rate-fill" :style="{ width: r.value + '%' }"></div></div>
              </div>
            </div>
          </div>

          <!-- 数据归集情况 -->
          <h3 class="ds-section-title">数据归集情况</h3>
          <div class="gov-collect-row">
            <div class="gov-collect-main">
              <div class="gov-collect-top">
                <div class="gov-collect-card">
                  <span class="gov-collect-icon" style="background: #e8f2fd; color: #2563c9"><el-icon :size="24"><Coin /></el-icon></span>
                  <div><p class="gov-collect-value">{{ govCollectStats.lake }}<em>亿条</em></p><p class="gov-collect-label">数据湖</p></div>
                </div>
                <div class="gov-collect-card">
                  <span class="gov-collect-icon" style="background: #e8f8ee; color: #22a35c"><el-icon :size="24"><Coin /></el-icon></span>
                  <div><p class="gov-collect-value">{{ govCollectStats.pool }}<em>亿条</em></p><p class="gov-collect-label">数据池</p></div>
                </div>
              </div>
              <div class="gov-collect-bottom">
                <span class="gov-collect-tag">一张图</span>
                <div class="gov-collect-mini">
                  <span class="gov-collect-icon sm" style="background: #eef4fc; color: #2563c9"><el-icon :size="20"><PieChart /></el-icon></span>
                  <div><p class="gov-collect-value sm">{{ govCollectStats.structured }}<em>亿条</em></p><p class="gov-collect-label">结构化数据</p></div>
                </div>
                <div class="gov-collect-mini">
                  <span class="gov-collect-icon sm" style="background: #eef4fc; color: #2563c9"><el-icon :size="20"><Files /></el-icon></span>
                  <div><p class="gov-collect-value sm">{{ govCollectStats.unstructured }}<em>T存储</em></p><p class="gov-collect-label">非结构化数据</p></div>
                </div>
              </div>
            </div>
            <div class="gov-collect-api">
              <span class="gov-collect-icon" style="background: #e8f2fd; color: #2563c9"><el-icon :size="26"><Connection /></el-icon></span>
              <p class="gov-collect-value">{{ govCollectStats.apiCalls }}<em>亿次</em></p>
              <p class="gov-collect-label">累计接口调用量</p>
            </div>
          </div>

          <!-- 委办 / 区 数据目录数 排行 -->
          <div class="gov-rank-row">
            <div class="gov-rank-col">
              <div class="gov-rank-head">
                <h4 class="gov-rank-title">42 家市级委办数据目录数</h4>
                <el-select v-model="rankCommission" size="small" placeholder="选择委办" clearable style="width: 150px">
                  <el-option v-for="it in govCatalogByCommission" :key="it.name" :label="it.name" :value="it.name" />
                </el-select>
              </div>
              <div v-for="(it, i) in govCatalogByCommission" :key="it.name" class="gov-rank-item">
                <span class="gov-rank-no" :class="{ top: i === 0 }">{{ i + 1 }}</span>
                <div class="gov-rank-body">
                  <div class="gov-rank-line"><span class="gov-rank-name">{{ it.name }}</span><span class="gov-rank-val">{{ it.value.toLocaleString() }} 个</span></div>
                  <div class="gov-rank-bar"><div class="gov-rank-fill" :class="{ top: i === 0 }" :style="{ width: rankPct(it.value, govCatalogByCommission) }"></div></div>
                </div>
              </div>
            </div>
            <div class="gov-rank-col">
              <div class="gov-rank-head">
                <h4 class="gov-rank-title">16 个区数据目录数</h4>
                <el-select v-model="rankDistrict" size="small" placeholder="选择行政区" clearable style="width: 150px">
                  <el-option v-for="it in govCatalogByDistrict" :key="it.name" :label="it.name" :value="it.name" />
                </el-select>
              </div>
              <div v-for="(it, i) in govCatalogByDistrict" :key="it.name" class="gov-rank-item">
                <span class="gov-rank-no" :class="{ top: i === 0 }">{{ i + 1 }}</span>
                <div class="gov-rank-body">
                  <div class="gov-rank-line"><span class="gov-rank-name">{{ it.name }}</span><span class="gov-rank-val">{{ it.value.toLocaleString() }} 个</span></div>
                  <div class="gov-rank-bar"><div class="gov-rank-fill" :class="{ top: i === 0 }" :style="{ width: rankPct(it.value, govCatalogByDistrict) }"></div></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 数据停更情况 -->
          <h3 class="ds-section-title">数据停更情况</h3>
          <div class="gov-stop-filters">
            <div class="gov-stop-grid">
              <div class="gov-stop-frow">
                <span class="gov-stop-flabel">共享类型</span>
                <span v-for="o in govStopFilters.share" :key="o.label" class="gov-stop-tag" :class="{ active: stopFilter.share === o.label }" @click="stopFilter.share = o.label">{{ o.label }} ({{ o.count }})</span>
              </div>
              <div class="gov-stop-frow">
                <span class="gov-stop-flabel">所属单位</span>
                <el-input v-model="stopFilter.dept" placeholder="请输入单位名称" clearable style="width: 200px" />
              </div>
              <div class="gov-stop-frow">
                <span class="gov-stop-flabel">开放类型</span>
                <span v-for="o in govStopFilters.open" :key="o.label" class="gov-stop-tag" :class="{ active: stopFilter.open === o.label }" @click="stopFilter.open = o.label">{{ o.label }} ({{ o.count }})</span>
              </div>
              <div class="gov-stop-frow">
                <span class="gov-stop-flabel">目录状态</span>
                <span v-for="o in govStopFilters.status" :key="o.label" class="gov-stop-tag" :class="{ active: stopFilter.status === o.label }" @click="stopFilter.status = o.label">{{ o.label }} ({{ o.count }})</span>
              </div>
              <div class="gov-stop-frow">
                <span class="gov-stop-flabel">挂载情况</span>
                <span v-for="o in govStopFilters.mount" :key="o.label" class="gov-stop-tag" :class="{ active: stopFilter.mount === o.label }" @click="stopFilter.mount = o.label">{{ o.label }} ({{ o.count }})</span>
              </div>
              <div class="gov-stop-frow">
                <span class="gov-stop-flabel">资源类型</span>
                <span v-for="o in govStopFilters.resource" :key="o.label" class="gov-stop-tag" :class="{ active: stopFilter.resource === o.label }" @click="stopFilter.resource = o.label">{{ o.label }} ({{ o.count }})</span>
              </div>
            </div>
          </div>
          <el-table :data="pagedStopUpdate">
            <el-table-column type="index" label="序号" width="70" :index="(i) => (stopPage - 1) * 10 + i + 1" />
            <el-table-column prop="code" label="目录编号" min-width="160" />
            <el-table-column prop="name" label="目录名称" min-width="150" />
            <el-table-column prop="dept" label="所属单位" min-width="200" />
            <el-table-column prop="freq" label="更新频率" width="100" />
            <el-table-column prop="lastUpdate" label="最近更新时间" min-width="170" />
            <el-table-column label="断更时间" width="110">
              <template #default="{ row }">
                <span class="gov-stop-days">{{ row.stopDays }} 天</span>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="!filteredStopUpdate.length" description="暂无匹配的停更目录" />
          <div v-else class="ds-pager">
            <el-pagination
              v-model:current-page="stopPage"
              background
              layout="prev, pager, next, total"
              :total="filteredStopUpdate.length"
              :page-size="10"
            />
          </div>
        </template>

        <!-- 运维监控：待建设 -->
        <el-empty v-else :description="`${govBoardLabel}模块建设中，敬请期待`" />

      </template>

      <!-- 服务商工作台：归集任务 / 清洗任务 / 共享任务 -->
      <template v-else-if="isProvider">
        <div class="tab-head">
          <span
            v-for="b in provBoardTabs"
            :key="b.key"
            class="tab-item"
            :class="{ active: provBoard === b.key }"
            @click="provBoard = b.key"
          >{{ b.label }}</span>
          <div class="spacer"></div>
        </div>

        <div class="prov-stat-row">
          <div class="prov-stat-card">
            <span class="prov-stat-icon" style="background: #e8f2fd; color: #2563c9"><el-icon :size="20"><Files /></el-icon></span>
            <div class="prov-stat-body">
              <p class="prov-stat-label">任务总数</p>
              <p class="prov-stat-value"><CountUp :value="provStats.total" /><em>个</em></p>
            </div>
          </div>
          <div class="prov-stat-card">
            <span class="prov-stat-icon" style="background: #e8f8ee; color: #22a35c"><el-icon :size="20"><CircleCheckFilled /></el-icon></span>
            <div class="prov-stat-body">
              <p class="prov-stat-label">已完成数量</p>
              <p class="prov-stat-value"><CountUp :value="provStats.done" /><em>个</em></p>
            </div>
          </div>
          <div class="prov-stat-card">
            <span class="prov-stat-icon" style="background: #fff3e5; color: #f2711c"><el-icon :size="20"><Loading /></el-icon></span>
            <div class="prov-stat-body">
              <p class="prov-stat-label">进行中数量</p>
              <p class="prov-stat-value"><CountUp :value="provStats.doing" /><em>个</em></p>
            </div>
          </div>
        </div>

        <h3 class="ds-section-title">{{ providerBoard.label }}列表</h3>
        <el-table :data="pagedProvTasks">
          <el-table-column type="index" label="序号" width="64" :index="(i) => (provPage - 1) * 10 + i + 1" />
          <el-table-column prop="taskNo" label="任务编号" min-width="130" />
          <el-table-column prop="name" label="任务名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="source" label="来源单位" min-width="160" />
          <el-table-column prop="owner" label="责任人" width="90" />
          <el-table-column label="进度" min-width="160">
            <template #default="{ row }"><el-progress :percentage="row.progress" :stroke-width="8" /></template>
          </el-table-column>
          <el-table-column prop="plan" label="计划完成" min-width="120" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }"><el-tag size="small" :type="provStatusType(row.status)" effect="light">{{ row.status }}</el-tag></template>
          </el-table-column>
        </el-table>
        <div class="ds-pager">
          <el-pagination v-model:current-page="provPage" background layout="prev, pager, next, total" :total="providerBoard.list.length" :page-size="10" />
        </div>
      </template>

      <!-- 委办 / 区 工作台：用数 / 供数 / 数据融合 -->
      <template v-else>
      <div class="tab-head">
        <span
          v-for="b in boardTabs"
          :key="b.key"
          class="tab-item"
          :class="{ active: activeBoard === b.key }"
          @click="activeBoard = b.key"
        >{{ b.label }}</span>
        <div class="spacer"></div>
        <el-select v-if="activeBoard === 'fusion'" v-model="boardRange" size="small" style="width: 116px">
          <el-option label="最近6个月" value="6m" />
          <el-option label="最近12个月" value="12m" />
          <el-option label="本年度" value="year" />
        </el-select>
        <!-- 用数/供数全局时间筛选 -->
        <div v-else class="ds-range">
          <span
            v-for="r in ['全部', '本年度', '当月']"
            :key="r"
            class="ds-range-item"
            :class="{ active: dsRange === r }"
            @click="dsRange = r"
          >{{ r }}</span>
        </div>
      </div>

      <!-- 数据融合：总量指标 + 五级库柱状图 -->
      <template v-if="activeBoard === 'fusion'">
        <div class="board-summary">
          <p class="board-summary-label">{{ board.label }}</p>
          <div class="board-summary-num">
            <span class="board-total"><CountUp :value="board.total" />{{ board.unit }}</span>
            <span class="board-growth"><el-icon><TopRight /></el-icon>{{ board.growth }}% 环比增长</span>
          </div>
        </div>
        <VChart :option="boardOption" height="330px" />
      </template>

      <!-- 用数情况 / 供数情况：统计 + TOP5 + 清单 -->
      <template v-else>
        <div class="ds-stats-row">
          <div class="ds-panel">
            <div class="ds-panel-head"><span class="ds-panel-title">本单位资源统计</span></div>
            <div class="ds-metrics">
              <div v-for="m in wbOrgStats" :key="m.label" class="ds-metric">
                <p class="ds-metric-label">{{ m.label }}</p>
                <p class="ds-metric-value">{{ m.value }}<em>{{ m.unit }}</em></p>
              </div>
            </div>
          </div>
          <div class="ds-panel">
            <div class="ds-panel-head">
              <span class="ds-panel-title">{{ isUsage ? '用数统计' : '供数统计' }}</span>
            </div>
            <div class="ds-metrics">
              <div v-for="m in dsBoard.stats" :key="m.label" class="ds-metric">
                <p class="ds-metric-label">{{ m.label }}</p>
                <p class="ds-metric-value">{{ m.value }}<em>{{ m.unit }}</em></p>
              </div>
            </div>
          </div>
        </div>

        <h3 class="ds-section-title">{{ isUsage ? '用数TOP5' : '供数TOP5' }}</h3>
        <el-table :data="dsBoard.top5">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="name" label="数据目录名称" min-width="220" />
          <el-table-column prop="code" label="数据目录代码" min-width="180" />
          <el-table-column v-if="isUsage" prop="dept" label="职责部门" min-width="170" />
          <el-table-column v-else prop="shareType" label="共享类型" min-width="170" />
          <el-table-column prop="count" :label="isUsage ? '用数次数' : '共享次数'" width="110" />
        </el-table>

        <h3 class="ds-section-title">{{ isUsage ? '用数清单' : '供数清单' }}</h3>
        <div class="ds-filters">
          <template v-if="isUsage">
            <span class="ds-filter-label">需求单号</span>
            <el-input v-model="dsFilter.kw1" placeholder="请输入" style="width: 130px" />
            <span class="ds-filter-label">需求部门</span>
            <el-input v-model="dsFilter.kw2" placeholder="请输入" style="width: 130px" />
            <span class="ds-filter-label">责任类型</span>
            <el-select v-model="dsFilter.type" style="width: 100px"><el-option label="全部" value="全部" /></el-select>
            <span class="ds-filter-label">状态</span>
            <el-select v-model="dsFilter.status" style="width: 100px"><el-option label="全部" value="全部" /></el-select>
          </template>
          <template v-else>
            <span class="ds-filter-label">数据目录代码</span>
            <el-input v-model="dsFilter.kw1" placeholder="请输入" style="width: 140px" />
            <span class="ds-filter-label">数据目录名称</span>
            <el-input v-model="dsFilter.kw2" placeholder="请输入" style="width: 140px" />
            <span class="ds-filter-label">共享类型</span>
            <el-select v-model="dsFilter.type" style="width: 110px"><el-option label="全部" value="全部" /></el-select>
          </template>
          <span class="ds-filter-label">选择月份区间</span>
          <el-select v-model="dsFilter.month" placeholder="请选择" clearable style="width: 120px">
            <el-option v-for="mo in ['2026-05', '2026-06', '2026-07']" :key="mo" :label="mo" :value="mo" />
          </el-select>
          <div class="spacer"></div>
          <el-button type="primary" @click="ElMessage.success('筛选内容已导出')">导出筛选内容</el-button>
          <el-button type="primary" @click="ElMessage.success('查询完成')"><el-icon style="margin-right: 4px"><Search /></el-icon>查询</el-button>
          <el-button @click="dsReset"><el-icon style="margin-right: 4px"><Refresh /></el-icon>重置</el-button>
        </div>

        <el-table v-if="isUsage" :data="dsBoard.list">
          <el-table-column type="index" label="序号" width="64" />
          <el-table-column prop="orderNo" label="需求单号" min-width="160" />
          <el-table-column prop="demandDept" label="需求部门" min-width="180" />
          <el-table-column prop="dutyDept" label="责任部门" min-width="150" />
          <el-table-column prop="dutyType" label="责任类型" min-width="120" />
          <el-table-column prop="catalog" label="数据目录名称" min-width="130" />
          <el-table-column prop="catalogType" label="目录类型" min-width="100" />
          <el-table-column prop="resource" label="资源名称" min-width="160" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }"><el-tag size="small" effect="light">{{ row.status }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="expire" label="到期时间" min-width="120" />
          <el-table-column label="操作" width="70" align="right">
            <template #default><el-button link type="primary" @click="ElMessage.info('详情页建设中')">详情</el-button></template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="dsBoard.list">
          <el-table-column type="index" label="序号" width="64" />
          <el-table-column prop="code" label="数据目录代码" min-width="160" />
          <el-table-column prop="name" label="数据目录名称" min-width="200" />
          <el-table-column prop="items" label="数据项" min-width="250" show-overflow-tooltip />
          <el-table-column prop="shareType" label="共享类型" min-width="110" />
          <el-table-column label="目录状态" width="100">
            <template #default="{ row }"><el-tag size="small" type="warning" effect="light">{{ row.pubStatus }}</el-tag></template>
          </el-table-column>
          <el-table-column label="目录状态" width="100">
            <template #default="{ row }"><el-tag size="small" effect="light">{{ row.linkStatus }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="count" label="共享次数" width="100" />
          <el-table-column label="操作" width="70" align="right">
            <template #default><el-button link type="primary" @click="ElMessage.info('详情页建设中')">详情</el-button></template>
          </el-table-column>
        </el-table>
        <div class="ds-pager">
          <el-pagination v-model:current-page="dsPage" background layout="prev, pager, next" :total="50" :page-size="10" />
        </div>
      </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CountUp from '@/components/CountUp.vue'
import VChart from '@/components/VChart.vue'
import { useUserStore, WORKBENCH_PROFILES } from '@/store/user'
import { getWorkbenchMenuLeaves } from '@/config/workbenchMenus'
import { notices, myMessages, unifiedTodos, wbBoard, wbOrgStats, wbUsageBoard, wbSupplyBoard, providerTaskBoards, govAccountStats, govLoginHourly, govLogin30d, govInactiveAccounts, govBaseStats, govAssetSummary, govAssetByBase, govFrontMachines, govFrontMachineList, govChainStats, govChainRates, govCollectStats, govCatalogByCommission, govCatalogByDistrict, govStopFilters, govStopUpdateList } from '@/mock'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

// 当前工作台标识与名称（从匹配路由 meta 派生，四类工作台共用本页）
const workbench = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i--) {
    if (route.matched[i].meta?.workbench) return route.matched[i].meta.workbench
  }
  return 'commission'
})
const base = computed(() => `/workbench/${workbench.value}`)
// 欢迎卡的单位/科室按当前工作台档案展示（用户可同时拥有多个角色，切换工作台需同步切换）
const wbProfile = computed(() => WORKBENCH_PROFILES[workbench.value] || {})
const wbDept = computed(() => wbProfile.value.dept || user.dept)
const wbOffice = computed(() => wbProfile.value.office || user.office)
const wbName = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i--) {
    if (route.matched[i].meta?.wbName) return route.matched[i].meta.wbName
  }
  return '委办工作台'
})

const nowText = new Date().toLocaleString('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
}).replace(/\//g, '-')

/* ---------- 快捷操作（固定 4 个，支持从左侧菜单自定义） ---------- */
// 默认偏好顺序：按此优先取用，命中当前工作台可见菜单者才生效
const QUICK_DEFAULT_PREFS = ['统一待办', '供需对接', '数据编目', '智能运维']
// 图标底色按位次循环取用
const QUICK_PALETTE = [
  { bg: '#fff3e5', color: '#f2711c' },
  { bg: '#e8f8ee', color: '#22a35c' },
  { bg: '#e8f2fd', color: '#2563c9' },
  { bg: '#f1edfc', color: '#7c5cd6' }
]

// 候选项 = 当前角色可见的左侧菜单叶子项（与侧栏共用同一份配置）
const quickMenuLeaves = computed(() => getWorkbenchMenuLeaves(base.value, workbench.value))
const quickOptionGroups = computed(() => {
  const groups = []
  quickMenuLeaves.value.forEach((l) => {
    let g = groups.find((x) => x.group === l.group)
    if (!g) groups.push((g = { group: l.group, options: [] }))
    g.options.push(l)
  })
  return groups
})

// 当前工作台的默认 4 项：优先取偏好项中可见者，不足 4 个再按菜单顺序补齐
const quickDefaults = computed(() => {
  const visible = quickMenuLeaves.value.map((l) => l.label)
  const picked = QUICK_DEFAULT_PREFS.filter((l) => visible.includes(l))
  for (const l of visible) {
    if (picked.length >= 4) break
    if (!picked.includes(l)) picked.push(l)
  }
  return picked.slice(0, 4)
})

// 已保存的选择（按工作台分别持久化），无效项自动回退默认
const quickStorageKey = computed(() => `dh_quick_actions_${workbench.value}`)
function loadQuickLabels() {
  try {
    const saved = JSON.parse(localStorage.getItem(quickStorageKey.value) || '[]')
    const valid = saved.filter((label) => quickMenuLeaves.value.some((l) => l.label === label))
    if (valid.length === 4) return valid
  } catch { /* 忽略损坏数据 */ }
  return quickDefaults.value
}
const quickLabels = ref(loadQuickLabels())
watch(workbench, () => (quickLabels.value = loadQuickLabels()))

const quickActions = computed(() =>
  quickLabels.value
    .map((label) => quickMenuLeaves.value.find((l) => l.label === label))
    .filter(Boolean)
    .map((l, i) => ({ ...l, ...QUICK_PALETTE[i % QUICK_PALETTE.length] }))
)

// 配置弹窗
const quickConfigDialog = ref(false)
const quickDraft = ref([])
function openQuickConfig() {
  // 仅保留当前工作台可见的项，避免历史无效项占位导致无法增改
  quickDraft.value = quickLabels.value.filter((label) => quickMenuLeaves.value.some((l) => l.label === label))
  quickConfigDialog.value = true
}
function toggleQuick(opt) {
  const idx = quickDraft.value.indexOf(opt.label)
  if (idx >= 0) quickDraft.value.splice(idx, 1)
  else if (quickDraft.value.length < 4) quickDraft.value.push(opt.label)
  else ElMessage.warning('最多选择 4 个，请先取消一项')
}
function resetQuickDraft() {
  quickDraft.value = [...quickDefaults.value]
}
function saveQuickConfig() {
  quickLabels.value = [...quickDraft.value]
  localStorage.setItem(quickStorageKey.value, JSON.stringify(quickLabels.value))
  quickConfigDialog.value = false
  ElMessage.success('快捷操作已更新')
}

function onQuick(q) {
  if (q.path) router.push(q.path)
  else ElMessage.info(`「${q.label}」流程已发起，请在统一待办中跟踪进度`)
}

/* ---------- AI 找数 ---------- */
const keyword = ref('')
// 热门目录（与设计稿一致的短目录名 + 检索热度）
const hotTags = [
  { name: '人口基础信息', clicks: '2.3w次' },
  { name: '法人单位信息', clicks: '1.8w次' },
  { name: '自然资源信息', clicks: '1.5w次' },
  { name: '宏观经济数据', clicks: '1.2w次' },
  { name: '社会保障信息', clicks: '0.9w次' }
]
function doSearch(tag) {
  const kw = tag || keyword.value.trim()
  if (!kw) {
    ElMessage.warning('请输入检索关键词或需求描述')
    return
  }
  router.push({ path: '/zone/data-resource', query: { kw } })
}

/* ---------- 待办 / 公告 / 消息 页签 ---------- */
const activeTab = ref('待办事项')
const todoType = ref('全部')
const filteredTodos = computed(() =>
  todoType.value === '全部' ? unifiedTodos.slice(0, 4) : unifiedTodos.filter((t) => t.type === todoType.value)
)
function statusType(s) {
  return { 待处理: 'warning', 处理中: 'primary', 已完成: 'success' }[s]
}
function viewTodo(row) {
  if (row.status === '已完成') ElMessage.info(`「${row.id}」处理日志加载中`)
  else router.push(`${base.value}/todo`)
}

/* ---------- 数据看板 ---------- */
const boardTabs = [
  { key: 'usage', label: '用数情况' },
  { key: 'supply', label: '供数情况' },
  { key: 'fusion', label: '数据融合' }
]
const activeBoard = ref('usage')
const boardRange = ref('6m')
const board = computed(() => wbBoard[activeBoard.value])

/* 用数 / 供数页签：统计 + TOP5 + 清单 */
const isUsage = computed(() => activeBoard.value === 'usage')
const dsBoard = computed(() => (isUsage.value ? wbUsageBoard : wbSupplyBoard))
const dsRange = ref('当月')
const dsPage = ref(1)
const dsFilter = reactive({ kw1: '', kw2: '', type: '全部', status: '全部', month: '' })
function dsReset() {
  Object.assign(dsFilter, { kw1: '', kw2: '', type: '全部', status: '全部', month: '' })
  ElMessage.success('筛选条件已重置')
}

const boardOption = computed(() => ({
  grid: { left: 50, right: 24, top: 30, bottom: 40 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: {
    type: 'category',
    data: board.value.categories,
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#dce3ed' } },
    axisLabel: { color: '#8492a6' }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#eef1f6' } },
    axisLabel: { color: '#8492a6' }
  },
  series: [{
    type: 'bar',
    data: board.value.values,
    barWidth: 56,
    itemStyle: { color: '#6d7cf5', borderRadius: [3, 3, 0, 0] }
  }]
}))

/* ---------- 服务商工作台看板：归集任务 / 清洗任务 / 共享任务 ---------- */
const isProvider = computed(() => workbench.value === 'provider')
const provBoardTabs = [
  { key: 'collect', label: '归集任务' },
  { key: 'clean', label: '清洗任务' },
  { key: 'share', label: '共享任务' }
]
const provBoard = ref('collect')
const providerBoard = computed(() => providerTaskBoards[provBoard.value])
const provStats = computed(() => {
  const l = providerBoard.value.list
  return {
    total: l.length,
    done: l.filter((t) => t.status === '已完成').length,
    doing: l.filter((t) => t.status === '进行中').length
  }
})
const provPage = ref(1)
const pagedProvTasks = computed(() => providerBoard.value.list.slice((provPage.value - 1) * 10, provPage.value * 10))
watch(provBoard, () => (provPage.value = 1))
function provStatusType(s) {
  return { 已完成: 'success', 进行中: 'primary', 待开始: 'info' }[s]
}

/* ---------- 治理部工作台看板：账号统计 / 资源情况 / 数据目录 / 运维监控 ---------- */
const isGov = computed(() => workbench.value === 'governance')
const govBoardTabs = [
  { key: 'account', label: '账号统计' },
  { key: 'resource', label: '资源情况' },
  { key: 'catalog', label: '数据目录' },
  { key: 'ops', label: '运维监控' }
]
const govBoard = ref('account')
const govBoardLabel = computed(() => govBoardTabs.find((b) => b.key === govBoard.value)?.label || '')

const govAcctFilter = reactive({ name: '', dept: '' })
const filteredInactive = computed(() =>
  govInactiveAccounts.filter(
    (a) =>
      (!govAcctFilter.name || a.name.includes(govAcctFilter.name)) &&
      (!govAcctFilter.dept || a.dept.includes(govAcctFilter.dept))
  )
)
function exportInactive() {
  const rows = filteredInactive.value
  if (!rows.length) {
    ElMessage.warning('暂无可导出的数据')
    return
  }
  const header = ['序号', '账号名', '单位部门', '最近登录日期', '连续未登录天数']
  const lines = rows.map((r, i) => [i + 1, r.name, r.dept, r.lastLogin, `${r.dormantDays}天`].join(','))
  const csv = '\ufeff' + [header.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `不活跃账号清单_${nowText.slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
  ElMessage.success('不活跃账号清单已导出')
}

/* 资源情况-前置机统计（支持按单位筛选） */
const fmDept = ref('全部')
const fmDeptOptions = computed(() => ['全部', ...govFrontMachines.map((f) => f.dept)])
const fmStat = computed(() => {
  const list = fmDept.value === '全部' ? govFrontMachines : govFrontMachines.filter((f) => f.dept === fmDept.value)
  const total = list.reduce((s, f) => s + f.total, 0)
  const used = list.reduce((s, f) => s + f.used, 0)
  return { total, used, idle: total - used, rate: total ? Math.round((used / total) * 100) : 0 }
})

/* 登录情况统计：折线面积图 */
function lineAreaOption(src, color) {
  return {
    grid: { left: 34, right: 24, top: 20, bottom: 30 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: src.categories,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#dce3ed' } },
      axisLabel: { color: '#8492a6', fontSize: 11, interval: 'auto' }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: '#eef1f6' } },
      axisLabel: { color: '#8492a6' }
    },
    series: [{
      type: 'line',
      data: src.values,
      smooth: false,
      symbol: 'none',
      lineStyle: { color, width: 2 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(58, 123, 213, 0.22)' },
            { offset: 1, color: 'rgba(58, 123, 213, 0.02)' }
          ]
        }
      }
    }]
  }
}
const loginHourlyOption = computed(() => lineAreaOption(govLoginHourly, '#3a7bd5'))
const login30dOption = computed(() => lineAreaOption(govLogin30d, '#3a7bd5'))

/* 不活跃账号清单分页（每页 10 条） */
const inactivePage = ref(1)
const pagedInactive = computed(() => filteredInactive.value.slice((inactivePage.value - 1) * 10, inactivePage.value * 10))
watch(filteredInactive, () => (inactivePage.value = 1))

/* 前置机列表分页（每页 10 条，跟随单位筛选） */
const fmListPage = ref(1)
const fmListFiltered = computed(() =>
  fmDept.value === '全部' ? govFrontMachineList : govFrontMachineList.filter((f) => f.dept === fmDept.value)
)
const pagedFrontMachines = computed(() => fmListFiltered.value.slice((fmListPage.value - 1) * 10, fmListPage.value * 10))
watch(fmDept, () => (fmListPage.value = 1))

/* 数据目录-委办/区排行 */
const rankCommission = ref('')
const rankDistrict = ref('')
function rankPct(value, list) {
  const max = Math.max(...list.map((x) => x.value))
  return max ? Math.round((value / max) * 100) + '%' : '0%'
}

/* 数据目录-数据停更情况筛选 + 分页 */
const stopFilter = reactive({ share: '全部', open: '全部', mount: '全部', resource: '全部', status: '全部', dept: '' })
const filteredStopUpdate = computed(() =>
  govStopUpdateList.filter((r) => !stopFilter.dept || r.dept.includes(stopFilter.dept))
)
const stopPage = ref(1)
const pagedStopUpdate = computed(() => filteredStopUpdate.value.slice((stopPage.value - 1) * 10, stopPage.value * 10))
watch(filteredStopUpdate, () => (stopPage.value = 1))
</script>

<style scoped>
.cwb-home { display: flex; flex-direction: column; gap: 16px; }

/* ---------- 欢迎行 ---------- */
.welcome-row { display: grid; grid-template-columns: 380px 1fr; gap: 16px; }
.welcome-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(120deg, var(--gov-blue) 0%, var(--gov-blue-light) 55%, #3a7bd5 100%);
  border: none;
}
/* 装饰光晕 */
.welcome-card::before,
.welcome-card::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  pointer-events: none;
}
.welcome-card::before { width: 160px; height: 160px; right: -46px; top: -60px; }
.welcome-card::after { width: 90px; height: 90px; right: 70px; bottom: -46px; background: rgba(255, 255, 255, 0.08); }
.welcome-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  animation: cwbFloat 3.2s ease-in-out infinite;
}
@keyframes cwbFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.welcome-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 6px; position: relative; z-index: 1; }
/* 科室名称：字号缩小与单位名称区分 */
.welcome-office { font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.82); margin-left: 8px; }
.welcome-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.9;
  position: relative;
  z-index: 1;
}
.quick-card { display: flex; flex-direction: column; padding: 14px 16px 12px; }
.quick-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.quick-card-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.quick-config-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.quick-config-btn:hover { background: rgba(26, 79, 156, 0.08); color: var(--gov-blue); }
.quick-items { flex: 1; display: flex; align-items: stretch; gap: 10px; }
.quick-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
}
/* 悬停时从底部漫入的浅色渐变 */
.quick-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(26, 79, 156, 0.06) 100%);
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}
.quick-item:hover { border-color: var(--gov-blue); box-shadow: 0 4px 12px rgba(26, 79, 156, 0.14); transform: translateY(-2px); }
.quick-item:hover::before { opacity: 1; }
.quick-item:hover .quick-icon { transform: scale(1.12) rotate(-4deg); }
.quick-item:active { transform: translateY(-1px) scale(0.98); }
.quick-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.quick-label { font-size: 14.5px; font-weight: 600; color: var(--text-primary); position: relative; z-index: 1; }

/* ---------- AI 找数 ---------- */
.ai-card { padding: 20px 26px 18px; }
.ai-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.ai-robot {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--gov-blue) 0%, #4b8ce0 100%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
/* 机器人脉冲光圈 */
.ai-robot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 2px solid var(--gov-blue);
  opacity: 0;
  animation: cwbPulse 2.4s ease-out infinite;
}
@keyframes cwbPulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
}
.ai-title { font-size: 17px; font-weight: 700; color: var(--text-primary); }
.ai-sub { font-size: 12.5px; color: var(--text-secondary); }
.ai-search {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding-left: 14px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ai-search:focus-within { border-color: var(--gov-blue); box-shadow: 0 0 0 3px rgba(26, 79, 156, 0.12); }
.ai-search-icon { color: var(--text-secondary); transition: color 0.2s; }
.ai-search:focus-within .ai-search-icon { color: var(--gov-blue); }
.ai-input { flex: 1; border: none; outline: none; height: 44px; padding: 0 12px; font-size: 14px; color: var(--text-primary); }
.ai-btn {
  height: 44px;
  padding: 0 30px;
  border: none;
  background: linear-gradient(135deg, var(--gov-blue) 0%, #4b8ce0 100%);
  color: #fff;
  font-size: 14.5px;
  cursor: pointer;
  transition: filter 0.2s, box-shadow 0.2s;
}
.ai-btn:hover { filter: brightness(1.08); box-shadow: 0 4px 14px rgba(26, 79, 156, 0.35); }
.ai-btn:active { filter: brightness(0.95); }
.ai-hot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 13px; }
.ai-hot-label { font-size: 13px; color: var(--text-secondary); }
.ai-hot-tag {
  font-size: 12.5px;
  color: var(--text-regular);
  background: #f4f6fa;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 4px 12px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.ai-hot-tag:hover {
  color: #fff;
  border-color: var(--gov-blue);
  background: var(--gov-blue);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 79, 156, 0.28);
}
.ai-hot-tag:hover em { color: rgba(255, 255, 255, 0.8); }
.ai-hot-tag:active { transform: translateY(0); }
.ai-hot-tag em { font-style: normal; color: var(--text-secondary); margin-left: 6px; font-size: 11.5px; transition: color 0.2s; }
.ai-hot-more { font-size: 12.5px; color: var(--gov-blue); cursor: pointer; transition: opacity 0.2s; }
.ai-hot-more:hover { opacity: 0.7; }

/* ---------- 页签卡 ---------- */
.tab-card { padding: 6px 26px 20px; }
.tab-head { display: flex; align-items: center; gap: 32px; border-bottom: 1px solid var(--border-color); }
.tab-item {
  position: relative;
  padding: 15px 2px;
  font-size: 15px;
  color: var(--text-regular);
  cursor: pointer;
}
.tab-item:hover { color: var(--gov-blue); }
.tab-item.active { color: var(--gov-blue); font-weight: 700; }
.tab-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  border-radius: 2px;
  background: var(--gov-blue);
}
.tab-head .spacer { flex: 1; }

.todo-filters { display: flex; gap: 10px; margin: 16px 0 6px; }
.todo-pill {
  font-size: 12.5px;
  padding: 5px 14px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s;
}
.todo-pill:hover { color: var(--gov-blue); border-color: var(--gov-blue); }
.todo-pill.active { background: var(--gov-blue); border-color: var(--gov-blue); color: #fff; }

.notice-list { padding-top: 10px; }
.notice-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 4px;
  border-bottom: 1px dashed var(--border-color);
  cursor: pointer;
}
.notice-row:last-child { border-bottom: none; }
.notice-row:hover .notice-title { color: var(--gov-blue); }
.notice-title {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}
.notice-date { font-size: 12.5px; color: var(--text-secondary); flex-shrink: 0; }

/* ---------- 数据看板 ---------- */
.board-card { padding: 6px 26px 16px; }
.board-summary {
  display: inline-block;
  margin: 18px 0 6px;
  padding: 14px 22px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #fafbfd;
}
.board-summary-label { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 6px; }
.board-summary-num { display: flex; align-items: center; gap: 12px; }
.board-total { font-size: 26px; font-weight: 700; color: var(--text-primary); }
.board-growth {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #16a34a;
  background: #e8f8ee;
  border-radius: 4px;
  padding: 3px 8px;
}

/* ---------- 用数 / 供数看板 ---------- */
.ds-stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0 4px; }
.ds-panel {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: linear-gradient(180deg, #fbfcfe 0%, #f5f8fc 100%);
  padding: 16px 18px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.ds-panel:hover { box-shadow: 0 6px 18px rgba(26, 79, 156, 0.1); transform: translateY(-2px); }
.ds-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.ds-panel-title { font-size: 15px; font-weight: 700; color: var(--text-primary); display: inline-flex; align-items: center; gap: 8px; }
.ds-panel-title::before { content: ''; width: 4px; height: 15px; border-radius: 2px; background: linear-gradient(180deg, var(--gov-blue), #4b8ce0); }
.ds-range { display: inline-flex; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; background: #fff; }
.ds-range-item {
  padding: 3px 12px;
  font-size: 12.5px;
  color: var(--text-regular);
  cursor: pointer;
  border-right: 1px solid var(--border-color);
  transition: background 0.2s, color 0.2s;
}
.ds-range-item:last-child { border-right: none; }
.ds-range-item:hover { color: var(--gov-blue); }
.ds-range-item.active { background: var(--gov-blue); color: #fff; }
.ds-range-item.active:hover { color: #fff; }
.ds-metrics { display: flex; flex-wrap: nowrap; gap: 10px; }
.ds-metric { flex: 1 1 0; min-width: 0; border-radius: 8px; padding: 6px 8px; transition: background 0.2s, transform 0.2s; }
.ds-metric:hover { background: rgba(26, 79, 156, 0.06); transform: translateY(-2px); }
.ds-metric-label { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ds-metric-value { font-size: 20px; font-weight: 700; color: var(--gov-blue); white-space: nowrap; }
.ds-metric-value em { font-style: normal; font-size: 12px; font-weight: 400; color: var(--text-secondary); margin-left: 3px; }

.ds-section-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 22px 0 12px; display: flex; align-items: center; gap: 9px; }
.ds-section-title::before { content: ''; width: 4px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, var(--gov-blue), #4b8ce0); }
.ds-filters { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; margin-bottom: 14px; }
.ds-filters .spacer { flex: 1; }
.ds-filter-label { font-size: 13px; color: var(--text-regular); white-space: nowrap; }
.ds-pager { display: flex; justify-content: flex-end; margin-top: 16px; }
/* 连续未登录天数超阈值高亮 */
.gov-dormant-warn { color: #d9534f; font-weight: 700; }

/* ---------- 治理部-资源情况 ---------- */
/* 底座情况 */
.gov-base-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 4px; }
.gov-base-card {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: linear-gradient(180deg, #fbfcfe 0%, #f5f8fc 100%);
  padding: 16px 18px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.gov-base-card:hover { box-shadow: 0 6px 18px rgba(26, 79, 156, 0.1); transform: translateY(-2px); }
.gov-base-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; }
.gov-base-sub { font-size: 13px; color: var(--text-secondary); margin: 14px 0 8px; }
.gov-base-sub:first-of-type { margin-top: 0; }
.gov-bar-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.gov-bar-head span:first-child { font-size: 13px; color: var(--text-regular); }
.gov-bar-cap { font-size: 13px; font-weight: 700; color: var(--gov-blue); }
.gov-base-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }
.gov-bm { border: 1px solid var(--border-color); border-radius: 8px; background: #fff; padding: 8px 10px; }
.gov-bm .l { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
.gov-bm .v { font-size: 15px; font-weight: 700; color: var(--text-primary); white-space: nowrap; }
.gov-usage { margin-bottom: 8px; }
.gov-usage-head { display: flex; justify-content: space-between; margin-bottom: 5px; }
.gov-usage-head span:first-child { font-size: 12.5px; color: var(--text-regular); }
.gov-usage-num { font-size: 12.5px; font-weight: 700; }
.gov-usage-num.cpu { color: #3a7bd5; }
.gov-usage-num.mem { color: #f2711c; }

/* 资产情况-汇总卡 */
.gov-asset-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px; }
.gov-asset-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #fff;
  padding: 16px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.gov-asset-card:hover { box-shadow: 0 6px 18px rgba(26, 79, 156, 0.1); transform: translateY(-2px); }
.gov-asset-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gov-asset-body { flex: 1; min-width: 0; }
.gov-asset-label { font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; white-space: nowrap; }
.gov-asset-value { font-size: 22px; font-weight: 700; color: var(--text-primary); white-space: nowrap; }
.gov-asset-value em { font-style: normal; font-size: 12px; font-weight: 400; color: var(--text-secondary); margin-left: 2px; }
.gov-asset-delta { display: inline-flex; align-items: center; gap: 2px; font-size: 12px; color: #22a35c; white-space: nowrap; }

/* 资产情况-各底座明细 */
.gov-asset-base-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.gov-asset-base { border: 1px solid var(--border-color); border-radius: 10px; overflow: hidden; }
.gov-asset-base-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: linear-gradient(90deg, #eef4fc 0%, #f5f8fc 100%);
  border-bottom: 1px solid var(--border-color);
}
.gov-asset-base-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.gov-asset-base-tag { font-size: 12px; color: var(--text-secondary); }
.gov-asset-base-metrics { display: grid; grid-template-columns: repeat(3, 1fr); }
.gov-abm { padding: 14px 16px; border-right: 1px solid var(--border-color); }
.gov-abm:last-child { border-right: none; }
.gov-abm .l { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 6px; }
.gov-abm .v { font-size: 20px; font-weight: 700; color: var(--text-primary); }
.gov-abm .v em { font-style: normal; font-size: 12px; font-weight: 400; color: var(--text-secondary); margin-left: 2px; }
.gov-abm .d { display: inline-flex; align-items: center; gap: 2px; font-size: 12px; color: #22a35c; margin-top: 6px; white-space: nowrap; }

/* 前置机统计 */
.gov-section-bar { display: flex; align-items: center; justify-content: space-between; margin: 22px 0 12px; }
.gov-fm-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.gov-fm-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: linear-gradient(180deg, #fbfcfe 0%, #f5f8fc 100%);
  padding: 18px 20px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.gov-fm-card:hover { box-shadow: 0 6px 18px rgba(26, 79, 156, 0.1); transform: translateY(-2px); }
.gov-fm-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gov-fm-label { font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; }
.gov-fm-value { font-size: 22px; font-weight: 700; color: var(--gov-blue); white-space: nowrap; }
.gov-fm-value em { font-style: normal; font-size: 12px; font-weight: 400; color: var(--text-secondary); margin: 0 6px 0 2px; }
.gov-fm-rate { flex-direction: column; align-items: stretch; gap: 10px; }
.gov-fm-rate-head { display: flex; align-items: baseline; justify-content: space-between; }
.gov-fm-rate-head .gov-fm-label { margin-bottom: 0; }

/* ---------- 服务商工作台-任务统计卡 ---------- */
.prov-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 6px; }
.prov-stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: linear-gradient(180deg, #fbfcfe 0%, #f5f8fc 100%);
}
.prov-stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.prov-stat-body { min-width: 0; }
.prov-stat-label { font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; }
.prov-stat-value { font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1.1; }
.prov-stat-value em { font-style: normal; font-size: 13px; font-weight: 400; color: var(--text-secondary); margin-left: 3px; }

/* ---------- 治理部-账号数据统计（横向图标卡，缩高） ---------- */
.gov-acct-panel { height: 120px; margin-top: 12px; display: flex; flex-direction: column; justify-content: center; }
.gov-acct-panel .ds-metrics { gap: 12px; }
.gov-acct-metric { display: flex; align-items: center; gap: 10px; padding: 8px 10px; }
.gov-acct-metric:hover { background: rgba(26, 79, 156, 0.06); }
.gov-acct-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gov-acct-body { min-width: 0; }
.gov-acct-body .ds-metric-label { margin-bottom: 2px; }
.gov-acct-body .ds-metric-value { font-size: 18px; }

/* ---------- 治理部-登录情况统计 ---------- */
.gov-login-panel { margin-top: 16px; }
.gov-login-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.gov-chart-title { font-size: 13px; color: var(--text-regular); margin-bottom: 4px; }

/* ---------- 治理部-数据目录：数据上链情况 ---------- */
.gov-chain-row { display: grid; grid-template-columns: 1.15fr 1fr; gap: 24px; align-items: center; }
.gov-chain-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.gov-chain-card {
  display: flex; align-items: center; gap: 14px;
  border: 1px solid var(--border-color); border-radius: 10px;
  background: #f7f9fc; padding: 16px 18px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.gov-chain-card:hover { box-shadow: 0 6px 18px rgba(26, 79, 156, 0.1); transform: translateY(-2px); }
.gov-chain-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gov-chain-value { font-size: 22px; font-weight: 700; color: var(--text-primary); }
.gov-chain-label { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.gov-rate-list { display: flex; flex-direction: column; gap: 16px; }
.gov-rate-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.gov-rate-label { font-size: 14px; color: var(--text-regular); }
.gov-rate-val { font-size: 15px; font-weight: 700; color: #2f7be0; }
.gov-rate-track {
  position: relative; height: 10px; border-radius: 2px; overflow: hidden;
  background-image: repeating-linear-gradient(90deg, #e6ecf5 0, #e6ecf5 12px, transparent 12px, transparent 16px);
}
.gov-rate-fill {
  position: absolute; left: 0; top: 0; height: 100%;
  background-image: repeating-linear-gradient(90deg, #2f7be0 0, #2f7be0 12px, transparent 12px, transparent 16px);
}

/* ---------- 治理部-数据目录：数据归集情况 ---------- */
.gov-collect-row { display: grid; grid-template-columns: 1.8fr 1fr; gap: 16px; }
.gov-collect-main { display: flex; flex-direction: column; gap: 14px; }
.gov-collect-top { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.gov-collect-card, .gov-collect-mini, .gov-collect-api {
  display: flex; align-items: center; gap: 14px;
  border: 1px solid var(--border-color); border-radius: 10px;
  background: linear-gradient(180deg, #fbfcfe 0%, #f3f7fc 100%); padding: 18px 20px;
}
.gov-collect-bottom { display: flex; align-items: center; gap: 14px; border: 1px solid var(--border-color); border-radius: 10px; background: #f7f9fc; padding: 14px 16px; }
.gov-collect-tag { flex-shrink: 0; padding: 14px 18px; border-radius: 8px; background: #e8f2fd; color: #2563c9; font-size: 15px; font-weight: 700; }
.gov-collect-mini { flex: 1; background: #fff; padding: 12px 14px; }
.gov-collect-api { flex-direction: column; align-items: flex-start; justify-content: center; gap: 8px; }
.gov-collect-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gov-collect-icon.sm { width: 40px; height: 40px; border-radius: 10px; }
.gov-collect-value { font-size: 24px; font-weight: 700; color: var(--text-primary); white-space: nowrap; }
.gov-collect-value.sm { font-size: 20px; }
.gov-collect-value em { font-style: normal; font-size: 13px; font-weight: 400; color: var(--text-secondary); margin-left: 4px; }
.gov-collect-label { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }

/* ---------- 治理部-数据目录：委办/区排行 ---------- */
.gov-rank-row { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 24px; }
.gov-rank-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.gov-rank-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.gov-rank-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.gov-rank-no {
  width: 22px; height: 22px; flex-shrink: 0; margin-top: 1px;
  border-radius: 50%; background: #eef2f8; color: #8492a6;
  font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center;
}
.gov-rank-no.top { background: #f2711c; color: #fff; }
.gov-rank-body { flex: 1; min-width: 0; }
.gov-rank-line { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.gov-rank-name { font-size: 13.5px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gov-rank-val { font-size: 13px; color: var(--text-secondary); flex-shrink: 0; margin-left: 10px; }
.gov-rank-bar { height: 8px; border-radius: 5px; background: #eef2f8; overflow: hidden; }
.gov-rank-fill { height: 100%; border-radius: 5px; background: #a9c7ef; }
.gov-rank-fill.top { background: #f2954a; }

/* ---------- 治理部-数据目录：数据停更情况筛选 ---------- */
.gov-stop-filters { background: #f7f9fc; border: 1px solid var(--border-color); border-radius: 10px; padding: 16px 18px; margin-bottom: 16px; }
.gov-stop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 32px; }
.gov-stop-frow { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.gov-stop-flabel { font-size: 13px; color: #2563c9; margin-right: 4px; white-space: nowrap; }
.gov-stop-tag {
  padding: 3px 12px; border-radius: 6px; font-size: 13px;
  color: var(--text-regular); cursor: pointer; transition: all 0.2s;
}
.gov-stop-tag:hover { color: #2563c9; }
.gov-stop-tag.active { background: #dbeafe; color: #2563c9; font-weight: 600; }
.gov-stop-days { color: #d9534f; font-weight: 700; }

/* ---------- 卡片错落入场动效 ---------- */
@keyframes cwbFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.cwb-home > .welcome-row,
.cwb-home > .gov-card { animation: cwbFadeUp 0.5s ease both; }
.cwb-home > .welcome-row { animation-delay: 0.02s; }
.cwb-home > .ai-card { animation-delay: 0.1s; }
.cwb-home > .tab-card { animation-delay: 0.18s; }
.cwb-home > .board-card { animation-delay: 0.26s; }

/* ---------- 快捷操作配置弹窗 ---------- */
.qc-tip { font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; }
.qc-tip b { color: var(--gov-blue); }
.qc-group { margin-bottom: 14px; }
.qc-group:last-child { margin-bottom: 0; }
.qc-group-title { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 8px; }
.qc-options { display: flex; flex-wrap: wrap; gap: 8px; }
.qc-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s;
}
.qc-option:hover { border-color: var(--gov-blue); color: var(--gov-blue); }
.qc-option.selected {
  border-color: var(--gov-blue);
  background: rgba(26, 79, 156, 0.08);
  color: var(--gov-blue);
  font-weight: 600;
}
.qc-option.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.qc-option.disabled:hover { border-color: var(--border-color); color: var(--text-regular); }
.qc-check { margin-left: 2px; }
</style>
