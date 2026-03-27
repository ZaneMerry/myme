<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const isPlaying = ref(false)
const currentTitle = ref('歌单')
const currentArtist = ref('网易云音乐')
const coverUrl = ref('https://p2.music.126.net/pcYHpMkdC69VVvWiynNklA==/109951166952713766.jpg')
const metingHost = ref(null)
const aplayerInstance = ref(null)
const loadError = ref('')

const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isMuted = ref(false)
const isDraggingProgress = ref(false)
const isDraggingVolume = ref(false)

const playlistId = computed(() => {
  if (import.meta.env.DEV && import.meta.env.VITE_MUSIC_PLAYLIST_ID_DEV) {
    return import.meta.env.VITE_MUSIC_PLAYLIST_ID_DEV
  }
  return '17858283172'
})

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

function syncTrackMeta() {
  const player = aplayerInstance.value
  const currentAudio = player?.list?.audios?.[player?.list?.index ?? 0]
  if (!currentAudio) return
  if (currentAudio.name) currentTitle.value = currentAudio.name
  if (currentAudio.artist) currentArtist.value = currentAudio.artist
  if (currentAudio.pic) coverUrl.value = currentAudio.pic
}

function syncTimeVolume() {
  const player = aplayerInstance.value
  if (!player?.audio) return
  const audio = player.audio
  if (!isDraggingProgress.value) currentTime.value = audio.currentTime || 0
  if (!isDraggingVolume.value) {
    volume.value = audio.muted ? 0 : (audio.volume ?? 0.8)
    isMuted.value = audio.muted
  }
  duration.value = audio.duration || 0
}

function bindPlayerEvents(player) {
  player.on('play', () => { isPlaying.value = true; syncTrackMeta() })
  player.on('pause', () => { isPlaying.value = false })
  player.on('canplay', () => { loadError.value = ''; syncTrackMeta() })
  player.on('listswitch', syncTrackMeta)
  player.on('loadeddata', syncTrackMeta)
  player.on('timeupdate', syncTimeVolume)
  player.on('volumechange', syncTimeVolume)
  player.on('ended', () => { isPlaying.value = false })
  player.on('error', () => {
    loadError.value = '播放失败，请检查歌单权限或网络'
    isPlaying.value = false
  })
}

function waitForPlayer(maxRetry = 80) {
  let retry = 0
  const timer = window.setInterval(() => {
    const metingEl = metingHost.value?.querySelector('meting-js')
    const player = metingEl?.aplayer
    if (player) {
      window.clearInterval(timer)
      aplayerInstance.value = player
      bindPlayerEvents(player)
      syncTrackMeta()
      syncTimeVolume()
      return
    }
    retry += 1
    if (retry >= maxRetry) {
      window.clearInterval(timer)
      loadError.value = '播放器初始化失败，请稍后刷新重试'
    }
  }, 250)
  return timer
}

let waitTimer = null

function doPlayPause() {
  const player = aplayerInstance.value
  if (!player) { loadError.value = '播放器尚未就绪'; return }
  player.audio?.paused ? void player.play() : player.pause()
}

function skipPrev() { aplayerInstance.value?.skipBack() }
function skipNext() { aplayerInstance.value?.skipForward() }

function seekTo(percent) {
  const player = aplayerInstance.value
  if (!player?.audio?.duration) return
  player.seek(player.audio.duration * (percent / 100))
}

function setVolume(percent) {
  const player = aplayerInstance.value
  if (!player) return
  player.volume(percent / 100, true)
  if (percent > 0) player.audio.muted = false
}

function toggleMute() {
  const player = aplayerInstance.value
  if (!player) return
  const next = !player.audio.muted
  player.volume(next ? 0 : volume.value, true)
  isMuted.value = next
}

function onProgressPointerDown(e) {
  isDraggingProgress.value = true
  const bar = e.currentTarget
  const rect = bar.getBoundingClientRect()
  const percent = ((e.clientX - rect.left) / rect.width) * 100
  seekTo(Math.max(0, Math.min(100, percent)))
  const onMove = (ev) => {
    const r = bar.getBoundingClientRect()
    const p = ((ev.clientX - r.left) / r.width) * 100
    seekTo(Math.max(0, Math.min(100, p)))
  }
  const onUp = () => { isDraggingProgress.value = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onVolumePointerDown(e) {
  isDraggingVolume.value = true
  const bar = e.currentTarget
  const rect = bar.getBoundingClientRect()
  const percent = ((e.clientX - rect.left) / rect.width) * 100
  setVolume(Math.max(0, Math.min(100, percent)))
  const onMove = (ev) => {
    const r = bar.getBoundingClientRect()
    const p = ((ev.clientX - r.left) / r.width) * 100
    setVolume(Math.max(0, Math.min(100, p)))
  }
  const onUp = () => { isDraggingVolume.value = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onVolumeWheel(e) {
  e.preventDefault()
  const delta = e.deltaY < 0 ? 5 : -5
  setVolume(Math.max(0, Math.min(100, (volume.value * 100) + delta)))
}

onMounted(() => {
  if (!metingHost.value) return
  const meting = document.createElement('meting-js')
  meting.setAttribute('server', 'netease')
  meting.setAttribute('type', 'playlist')
  meting.setAttribute('id', playlistId.value)
  meting.setAttribute('mini', 'true')
  meting.setAttribute('fixed', 'false')
  meting.setAttribute('list-folded', 'true')
  meting.setAttribute('list-max-height', '220px')
  meting.setAttribute('autoplay', 'false')
  meting.setAttribute('preload', 'auto')
  meting.setAttribute('mutex', 'true')
  metingHost.value.appendChild(meting)
  waitTimer = waitForPlayer()
})

onBeforeUnmount(() => {
  if (waitTimer) window.clearInterval(waitTimer)
})
</script>

<template>
  <Teleport to="body">
    <div class="music-player">
      <div class="player-bar">
        <!-- Left: disc + info -->
        <div class="bar-left">
          <div class="bar-disc" :class="{ spinning: isPlaying }">
            <div class="disc-img">
              <img :src="coverUrl" alt="cover" />
            </div>
          </div>
          <div class="bar-info">
            <span class="bar-title">{{ currentTitle }}</span>
            <span class="bar-artist">{{ currentArtist }}</span>
          </div>
        </div>

        <!-- Center: controls -->
        <div class="bar-center">
          <div class="bar-ctrl">
            <button class="bar-btn" title="上一首" @click="skipPrev">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            <button class="bar-play" title="播放/暂停" @click="doPlayPause">
              <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            <button class="bar-btn" title="下一首" @click="skipNext">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
          <div class="bar-progress" @mousedown="onProgressPointerDown">
            <span class="time-label">{{ formatTime(currentTime) }}</span>
            <div class="prog-track">
              <div class="prog-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <span class="time-label">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Right: volume -->
        <div class="bar-right">
          <button class="vol-btn" :title="isMuted ? '取消静音' : '静音'" @click="toggleMute">
            <svg v-if="isMuted || volume === 0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <div class="vol-track" @mousedown="onVolumePointerDown" @wheel.prevent="onVolumeWheel">
            <div class="vol-fill" :style="{ width: (isMuted ? 0 : volume * 100) + '%' }"></div>
          </div>
        </div>

        <div v-if="loadError" class="bar-error">{{ loadError }}</div>

        <div ref="metingHost" class="meting-host"></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.music-player {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

@media (max-width: 768px) {
  .music-player {
    bottom: 16px;
  }
}

/* ---- Player bar ---- */
.player-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: rgba(20, 20, 30, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.12);
  position: relative;
  min-width: 540px;
}

[data-theme="light"] .player-bar {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .player-bar {
    min-width: unset;
    width: calc(100vw - 32px);
    gap: 10px;
    padding: 8px 12px;
  }
}

/* Left: disc + info */
.bar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.bar-disc {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.bar-disc.spinning {
  animation: spin 8s linear infinite;
}

.disc-img {
  width: 100%;
  height: 100%;
  background: #1a1a2e;
  border-radius: 50%;
}

.disc-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bar-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 80px;
  max-width: 100px;
}

.bar-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme="light"] .bar-title {
  color: #1a1a2e;
}

.bar-artist {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme="light"] .bar-artist {
  color: rgba(26, 26, 46, 0.5);
}

/* Center: controls + progress */
.bar-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.bar-ctrl {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.bar-btn svg {
  width: 14px;
  height: 14px;
}

[data-theme="light"] .bar-btn {
  color: rgba(26, 26, 46, 0.7);
}

.bar-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="light"] .bar-btn:hover {
  color: #1a1a2e;
  background: rgba(0, 0, 0, 0.06);
}

.bar-play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.45);
  transition: all 0.2s;
  padding: 0;
}

.bar-play svg {
  width: 16px;
  height: 16px;
}

.bar-play:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5);
}

/* Progress */
.bar-progress {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  cursor: pointer;
}

.time-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

[data-theme="light"] .time-label {
  color: rgba(26, 26, 46, 0.4);
}

.prog-track {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

[data-theme="light"] .prog-track {
  background: rgba(0, 0, 0, 0.1);
}

.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 2px;
  transition: width 0.3s;
  pointer-events: none;
}

/* Right: volume */
.bar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.vol-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.vol-btn svg {
  width: 14px;
  height: 14px;
}

[data-theme="light"] .vol-btn {
  color: rgba(26, 26, 46, 0.5);
}

.vol-btn:hover {
  color: rgba(255, 255, 255, 0.9);
}

[data-theme="light"] .vol-btn:hover {
  color: rgba(26, 26, 46, 0.9);
}

.vol-track {
  width: 64px;
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
}

@media (max-width: 600px) {
  .vol-track {
    width: 48px;
  }
}

[data-theme="light"] .vol-track {
  background: rgba(0, 0, 0, 0.1);
}

.vol-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 2px;
  transition: width 0.1s;
  pointer-events: none;
}

/* Error */
.bar-error {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #f87171;
  white-space: nowrap;
}

.meting-host {
  display: none;
}
</style>
