const fillZero = number => {
  return number < 10 ? `0${number}` : number
}

const sleep = time => {
  return new Promise(resolve => setTimeout(() => resolve(), time))
}

const getMonthDays = time => {
  const date = new Date(`${time}`)
  const month = String(time).slice(4, 6)
  date.setMonth(month)
  date.setDate(0)
  return date.getDate()
}

module.exports = {
  fillZero,
  sleep,
  getMonthDays
}
