import { ref, onMounted, onUnmounted } from 'vue'

export function useClock() {
  const currentTime = ref('')
  const currentDate = ref(new Date())
  const hourDeg = ref(0)
  const minuteDeg = ref(0)
  const secondDeg = ref(0)
  let timeTimer = null

  function formatCurrentTime(date) {
    return new Intl.DateTimeFormat('zh-CN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  function updateCurrentTime() {
    currentDate.value = new Date()
    currentTime.value = formatCurrentTime(currentDate.value)
    const hours = currentDate.value.getHours() % 12
    const minutes = currentDate.value.getMinutes()
    const seconds = currentDate.value.getSeconds()
    hourDeg.value = hours * 30 + minutes * 0.5
    minuteDeg.value = minutes * 6 + seconds * 0.1
    secondDeg.value = seconds * 6
  }

  onMounted(() => {
    updateCurrentTime()
    timeTimer = setInterval(updateCurrentTime, 1000)
  })

  onUnmounted(() => {
    if (timeTimer) {
      clearInterval(timeTimer)
      timeTimer = null
    }
  })

  return {
    currentTime,
    currentDate,
    hourDeg,
    minuteDeg,
    secondDeg,
  }
}
