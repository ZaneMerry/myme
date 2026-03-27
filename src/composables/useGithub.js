import { ref } from 'vue'
import { getGithubActivities } from '../services/githubAdapter'

export function useGithub() {
  const githubActivities = ref([])
  const githubLoading = ref(false)
  const githubError = ref('')
  const githubHint = ref('')

  async function loadGithubActivities({ username, isProd }) {
    githubLoading.value = true
    githubError.value = ''
    githubHint.value = ''

    try {
      const result = await getGithubActivities({ username, isProd })
      githubActivities.value = result.activities
      githubHint.value = result.message
    } catch (error) {
      githubError.value = 'activitiesFail'
      githubActivities.value = [
        { date: '03-23', action: '完成订单模块重构并补充单元测试', repo: 'campus-trade-backend' },
        { date: '03-24', action: '新增 Redis 缓存层与热点数据预热', repo: 'note-api' },
        { date: '03-26', action: '更新面经文档并整理项目答题模板', repo: 'interview-notes' },
      ]
      if (import.meta.env.DEV) {
        console.error(error)
      }
    } finally {
      githubLoading.value = false
    }
  }

  return {
    githubActivities,
    githubLoading,
    githubError,
    githubHint,
    loadGithubActivities,
  }
}
