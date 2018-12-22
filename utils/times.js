const { fillZero } = require('./index')

const times = []
// 列表从 20090701 开始
// 详情从 20150603 开始
const startYear = 2009
const startMonth = 7
const endYear = new Date().getFullYear()
const endMonth = new Date().getMonth() + 1

/**
 * [200907, 200908, ... , 200812]
 */
for (let year = startYear; year <= endYear; year++) {
  for (let month = 1; month <= 12; month++) {
    if (
      !(year === startYear && month < startMonth) &&
      !(year === endYear && month > endMonth)
    ) {
      times.push(`${year}${fillZero(month)}`)
    }
  }
}

module.exports = times
