interface IQuantumMap {
  [key: string]: number[]
}

export const quantumMap: IQuantumMap = {
  '凌晨': [0, 6],
  '上午': [7, 11],
  '中午': [12, 13],
  '下午': [14, 18],
  '晚上': [19, 24]
}