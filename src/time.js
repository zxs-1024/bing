const { fillZero } = require('./utils')

const collect = []
const startYear = 2009
const startMonth = 7
const endYear = new Date().getFullYear()
const endMonth = new Date().getMonth() + 1

/**
 * [200907, 200908, ... , 20812]
 */
for (let year = startYear; year <= endYear; year++) {
  for (let month = 1; month <= 12; month++) {
    if (
      !(year === startYear && month < startMonth) &&
      !(year === endYear && month > endMonth)
    ) {
      collect.push(`${year}${fillZero(month)}`)
    }
  }
}

module.exports = collect
