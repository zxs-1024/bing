const fs = require('fs')
const puppeteer = require('puppeteer')
const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)

const times = require('../utils/times')
const {
  fillZero,
  handleWriteFile,
  handleDeleteFile,
  downLoad
} = require('../utils')

const wallPaperPath = 'https://bingwallpaper.anerg.com/cn/'
const collectPath = './collect/data'
const imagePath = './collect/images'

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

  await handleDeleteFile(collectPath)

  if (!fs.existsSync(imagePath)) {
    await mkdir(imagePath).then(() =>
      console.log(`📂  创建 ${imagePath} 文件夹成功！`)
    )
  }

  for (let i = 0; i < times.length; i++) {
    if (!fs.existsSync(`${collectPath}/${times[i]}.json`)) {
      const evaluate = await puppeteerFn(page, times[i])
      const collect = await handleTransCollect(evaluate, times[i])
      await handleWriteFile(collectPath, collect, times[i])
    }
  }

  console.log('🎉  你的数据已爬取完毕 => 冲鸭！！！')
  await browser.close()
})()

// use puppeteer open page
async function puppeteerFn(page, time) {
  await page.goto(`${wallPaperPath}${time}`)

  return await page.evaluate(month => {
    const images = document.querySelectorAll(
      '#jssor_1 div div div div div div img'
    )
    const copyrights = document.querySelectorAll('.intro')
    const collect = {}

    return [...images].map(({ src: url }, i) => {
      const copyright = copyrights[i] && copyrights[i].innerHTML
      if (url && copyright && !collect[copyright]) {
        collect[copyright] = true
        return {
          url,
          copyright,
          month
        }
      }
    }).filter(item => !!item)
  }, time)
}

// trans image data
async function handleTransCollect(collect, month) {
  const result = []

  for (let i = 0; i < collect.length; i++) {
    const fillDay = fillZero(i + 1)
    const dateString = `${month}${fillDay}`
    const date = new Date(
      `${month.slice(0, 4)}-${month.slice(4, 6)}-${fillDay}`
    ).getTime()

    const { url, copyright } = collect[i]
    const allName = url.split('/')[4]
    const name = allName
      .replace('_1920x1080.jpg', '')
      .replace('_1366x768.jpg', '')
    const target = `${imagePath}/${name}.jpg`
    const imageUrl = `https://zhanghao-zhoushan.cn/image/large/${allName}`

    // down load image
    if (!fs.existsSync(target)) await downLoad(url, target, dateString)

    const data = {
      dateString,
      date,
      url,
      imageUrl,
      name,
      copyright
    }
    result.push(data)
  }
  return result
}
