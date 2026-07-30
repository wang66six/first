<template>
  <div class="portal-layout">
    <TopNavbar />
    <GovBreadcrumb v-if="$route.path !== '/home'" />
    <main class="portal-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <GovFooter />
  </div>
</template>

<script setup>
import TopNavbar from '@/components/TopNavbar.vue'
import GovBreadcrumb from '@/components/GovBreadcrumb.vue'
import GovFooter from '@/components/GovFooter.vue'
</script>

<style scoped>
.portal-layout { min-height: 100%; display: flex; flex-direction: column; }
.portal-main { flex: 1; }
</style>
