<template>
  <footer class="gov-footer">
    <div class="footer-inner">
      <div class="footer-left">
        <div class="footer-brand">
          <img :src="logoImg" alt="logo" class="footer-logo" />
          <span>市大数据资源管理平台</span>
        </div>
        <p class="footer-org">主办单位：市大数据中心　<em>|</em>　技术支持：政务云服务平台</p>
        <p class="footer-icp">沪ICP备2026000001号-1　沪公网安备 31010101000001号　政府网站标识码：3100000001</p>
      </div>
      <div class="footer-right">
        <p>数据服务咨询：021-12345678</p>
        <p>© 2026 市大数据中心 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logoImg from '@/assets/logo.png'
</script>

<style scoped>
.gov-footer {
  background: var(--gov-blue-darker);
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}
.footer-inner {
  width: min(1280px, 94%);
  margin: 0 auto;
  padding: 28px 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 12px;
}
.footer-logo { width: 24px; height: auto; }
.footer-org em { font-style: normal; opacity: 0.4; }
.footer-icp { margin-top: 6px; font-size: 12px; color: rgba(255, 255, 255, 0.4); }
.footer-right { text-align: right; line-height: 2.2; }
</style>
