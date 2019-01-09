const fs = require('fs')
const request = require('request')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)

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

// 写入 JSON 文件
const handleWriteFile = async (path, data, time) => {
  if (!fs.existsSync(path)) {
    await mkdir(path).then(() => console.log(`📂  创建 ${path} 文件夹成功！`))
  }

  // 格式化
  const formatData = JSON.stringify(data, null, 2)
  await writeFile(`${path}/${time}.json`, formatData).then(() => {
    console.log(`📄  写入 ${time}.json 文件成功！`)
  })
}

// 删除当月数据
const handleDeleteFile = async path => {
  const date = new Date()
  const year = date.getFullYear()
  const month = fillZero(date.getMonth() + 1)
  const file = `${path}/${year}${month}.json`

  if (fs.existsSync(file)) {
    await unlink(file).then(() => console.log(`📂  删除 ${file} 文件成功！`))
  }
}

// 下载文件
const downLoad = (source, target, date = '') => {
  return request(source)
    .pipe(fs.createWriteStream(target))
    .on('close', () => {
      console.log(`🌁  ${date} 下载 ${target} 文件成功！`)
    })
    .on('error', err => {
      console.log(err)
    })
}

module.exports = {
  fillZero,
  sleep,
  getMonthDays,
  handleWriteFile,
  handleDeleteFile,
  downLoad
}
