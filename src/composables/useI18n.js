import { ref, computed } from 'vue'
import { i18n } from '../i18n'

export function useI18n() {
  const language = ref(localStorage.getItem('lang') || 'zh')

  const lang = computed(() => language.value)

  function t(key, targetLang = null) {
    const langToUse = targetLang || language.value
    return i18n[langToUse]?.[key] || key
  }

  function updateLanguage(value) {
    language.value = value
    localStorage.setItem('lang', value)
  }

  return {
    language,
    lang,
    t,
    updateLanguage,
  }
}
