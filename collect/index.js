const fs = require('fs')
const puppeteer = require('puppeteer')
const axios = require('axios')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const {
  fillZero,
  getMonthDays,
  handleWriteFile,
  handleDeleteFile,
  downLoad
} = require('../utils')
const times = require('../utils/times')

const baseUrl = 'http://bingwallpaper.anerg.com/cn/'
const bingUrl = 'https://cn.bing.com/cnhp/coverstory?d='

const collectPath = './collect/data'
const imagePath = './collect/images'

;(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  // 打开页面
  const page = await browser.newPage()

  await handleDeleteFile(collectPath)

  if (!fs.existsSync(imagePath)) {
    await mkdir(imagePath).then(() =>
      console.log(`📂  创建 ${imagePath} 文件夹成功！`)
    )
  }

  // 遍历时间数组，爬取数据
  for (let i = 0; i < times.length; i++) {
    if (!fs.existsSync(`${collectPath}/${times[i]}.json`)) {
      // 收集图片信息
      const evaluate = await puppeteerFn(page, times[i])
      // 处理数据
      const collect = await handleTransCollect(evaluate, times[i])
      // 写入 JSON 文件
      await handleWriteFile(collectPath, collect, times[i])
    }
  }

  console.log('🎉  你的数据已爬取完毕 => 冲鸭！！！')
  await browser.close()
})()

// 收集图片信息
async function puppeteerFn(page, time) {
  // 输入地址
  await page.goto(`${baseUrl}${time}`)

  // 等待 img 渲染完毕
  await page.waitForSelector('#photos .panel a img')

  // 页面加载后执行回调，收集图片信息 => 在浏览器环境
  return await page.evaluate(month => {
    const images = document.querySelectorAll('#photos .panel a img')
    return [...images].map(({ src: url, alt: copyright }) => {
      return {
        url,
        copyright,
        month
      }
    })
  }, time)
}

// 处理数据
async function handleTransCollect(collect, month) {
  const now = new Date()
  const nowMonth = now.getMonth() + 1
  const nowDay = now.getDate()
  const nowTime = `${now.getFullYear()}${fillZero(nowMonth)}`
  const result = []

  collect = collect.reverse()
  if (collect.length > 31) collect.length = 31

  for (let i = 0; i < collect.length; i++) {
    const { url, copyright } = collect[i]
    const fillDay = fillZero(i + 1)
    const date = new Date(
      `${month.slice(0, 4)}-${month.slice(4, 6)}-${fillDay}`
    ).getTime()
    const name = url.replace(
      /(http:\/\/cdn.nanxiongnandi.com\/bing\/|_1366x768)/g,
      ''
    )
    const dateString = `${month}${fillDay}`
    const { Continent, Country, City } = await axios
      .get(`${bingUrl}${dateString}`)
      .then(({ data }) => data)

    const target = `${imagePath}/${name}`
    const allName = name.replace(/\.jpg/, '_1366x768.jpg')
    const imageUrl = `https://zhanghao-zhoushan.cn/image/large/${allName}`

    // 下载图片
    if (!fs.existsSync(target)) await downLoad(url, target, dateString)

    const data = {
      dateString,
      date,
      url,
      imageUrl,
      name,
      copyright,
      Continent,
      Country,
      City
    }
    result.push(data)
  }
  return result
}
