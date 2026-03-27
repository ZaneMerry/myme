<script setup>
import SiteNavigation from './components/SiteNavigation.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import { useTheme } from './composables/useTheme'

// Initialize theme on app startup
useTheme()
</script>

<template>
  <div class="app-wrapper">
    <SiteNavigation />
    <router-view />
    <MusicPlayer />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
}
</style>
