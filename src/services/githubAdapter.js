const DEV_MOCK_ACTIVITIES = [
  { date: '03-23', action: '完成订单模块重构并补充单元测试', repo: 'campus-trade-backend' },
  { date: '03-24', action: '新增 Redis 缓存层与热点数据预热', repo: 'note-api' },
  { date: '03-26', action: '更新面经文档并整理项目答题模板', repo: 'interview-notes' },
]

function formatDate(isoString) {
  const date = new Date(isoString)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${month}-${day}`
}

function actionByEventType(eventType) {
  const mapping = {
    PushEvent: '提交了新代码',
    PullRequestEvent: '发起或更新了 PR',
    IssuesEvent: '处理了 Issue',
    IssueCommentEvent: '参与了 Issue 讨论',
    PullRequestReviewEvent: '进行了 PR Review',
    CreateEvent: '创建了分支或仓库',
    DeleteEvent: '删除了分支或标签',
    WatchEvent: '关注了仓库',
    ForkEvent: 'Fork 了仓库',
    ReleaseEvent: '发布了新版本',
  }
  return mapping[eventType] || `产生了 ${eventType} 活动`
}

function normalizeGithubEvents(events) {
  return events.slice(0, 8).map((event) => ({
    date: formatDate(event.created_at),
    action: actionByEventType(event.type),
    repo: event.repo?.name || 'unknown-repo',
  }))
}

export async function getGithubActivities({ username, isProd }) {
  if (!username) {
    return {
      activities: DEV_MOCK_ACTIVITIES,
      fromApi: false,
      message: '未配置 GitHub 用户名，已回退到演示数据。',
    }
  }

  if (!isProd) {
    return {
      activities: DEV_MOCK_ACTIVITIES,
      fromApi: false,
      message: 'DEV 环境默认使用演示数据，可在代码中改为直连 API。',
    }
  }

  const url = `https://api.github.com/users/${username}/events/public?per_page=20`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API 请求失败：${response.status}`)
  }

  const data = await response.json()
  if (!Array.isArray(data) || data.length === 0) {
    return {
      activities: [],
      fromApi: true,
      message: '暂未获取到公开活动记录。',
    }
  }

  return {
    activities: normalizeGithubEvents(data),
    fromApi: true,
    message: '',
  }
}
