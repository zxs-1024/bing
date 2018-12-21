const fillZero = number => {
  return number < 10 ? `0${number}` : number
}

const sleep = time => {
  return new Promise(resolve => setTimeout(() => resolve(), time))
}

module.exports = {
  fillZero,
  sleep
}
