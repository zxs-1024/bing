const collect = []
const startYear = 2009
const startMonth = 7
const endYear = new Date().getFullYear()
const endMonth = new Date().getMonth() + 1

for (let i = startYear; i <= endYear; i++) {
  for (let j = 1; j <= 12; j++) {
    if (
      !(i === startYear && j < startMonth) &&
      !(i === endYear && j > endMonth)
    ) {
      collect.push(`${i}${j < 10 ? `0${j}` : j}`)
    }
  }
}
console.log(JSON.stringify(collect))

module.exports = collect
