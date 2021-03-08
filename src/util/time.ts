export const changeTime = (d: string) => {
  if (!d.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.*\dZ)?$/)) {
    return '日期格式错误'
  }
  const formats = [
    { rate: 1000, suffix: '秒' },
    { rate: 60, suffix: '分钟' },
    { rate: 60, suffix: '小时' },
    { rate: 24, suffix: '天' },
    { rate: 7, suffix: '周' }
  ]
  const ms = new Date().getTime() - new Date(d).getTime()
  let t = ms
  for (let i = 1; i < formats.length; i++) {
    t = parseInt((t / formats[i - 1].rate).toString())
    if (t <= formats[i].rate) {
      return `${t}${formats[i - 1].suffix}前`
    }
  }
  return d.substr(0, 10)
}