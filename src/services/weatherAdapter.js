const DEV_MOCK_WEATHER = {
  city: 'Hangzhou',
  temperature: 22,
  humidity: 56,
  windSpeed: 3.4,
  description: '多云',
}

function weatherCodeToText(code) {
  const mapping = {
    0: '晴朗',
    1: '大部晴朗',
    2: '多云',
    3: '阴天',
    45: '雾',
    48: '冻雾',
    51: '小毛毛雨',
    53: '毛毛雨',
    55: '强毛毛雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    80: '阵雨',
    81: '较强阵雨',
    82: '强阵雨',
    95: '雷暴',
  }
  return mapping[code] || '未知天气'
}

export async function getCurrentWeather({ cityName, isProd }) {
  if (!isProd) {
    return {
      weather: DEV_MOCK_WEATHER,
      fromApi: false,
      message: 'DEV 环境默认使用天气演示数据。',
    }
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=zh&format=json`
  const geoResp = await fetch(geoUrl)
  if (!geoResp.ok) {
    throw new Error(`天气地理编码失败：${geoResp.status}`)
  }

  const geoData = await geoResp.json()
  const location = geoData?.results?.[0]
  if (!location) {
    throw new Error('未匹配到城市坐标')
  }

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}` +
    `&longitude=${location.longitude}` +
    '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
    '&timezone=auto'

  const weatherResp = await fetch(weatherUrl)
  if (!weatherResp.ok) {
    throw new Error(`天气接口失败：${weatherResp.status}`)
  }

  const weatherData = await weatherResp.json()
  const current = weatherData?.current
  if (!current) {
    throw new Error('天气接口返回数据异常')
  }

  return {
    weather: {
      city: location.name || cityName,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      description: weatherCodeToText(current.weather_code),
    },
    fromApi: true,
    message: '',
  }
}
