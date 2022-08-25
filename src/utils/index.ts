import dayjs from 'dayjs'
import { quantumMap } from './config'

/**
 * xxxx年x月x日 上午x点x分
 * @param time 
 */
export const fmtLocalTime = (time: string) => {
  const fmt = dayjs(time)
  const date = fmt.format('YYYY年M月D日')
  const hour = fmt.hour()
  const minute = fmt.minute() === 0 ? '整' : fmt.minute() + '分'
  let quantum = ''
  Object.keys(quantumMap).find((key: string) => {
    const range: number[] = quantumMap[key]
    if ((hour >= range[0] && hour < range[1]) || (hour > range[0] && hour <= range[1])) {
      quantum = key
      return true
    }
  })
  return `${date} ${quantum}${hour}点${minute}`
}