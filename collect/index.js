const fs = require('fs')
const puppeteer = require('puppeteer')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const { fillZero, getMonthDays } = require('../utils')
const times = require('../utils/times')

const baseUrl = 'http://bingwallpaper.anerg.com/cn/'
const collectPath = './collect/data'

;(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  // 打开页面
  const page = await browser.newPage()

  // 遍历时间数组，爬取数据
  for (let i = 0; i < times.length; i++) {
    if (!fs.existsSync(`${collectPath}/${times[i]}.json`)) {
      // 收集图片信息
      const evaluate = await puppeteerFn(page, times[i])
      // 处理数据
      const collect = handleTransCollect(evaluate, times[i])
      // 写入 JSON 文件
      await handleWriteFile(collect, times[i])
    }
  }

  console.log('🎉  你的数据已爬取完毕 => 冲鸭！！！')
  await browser.close()
})()

// 写入 JSON 文件
async function handleWriteFile(evaluate, time) {
  if (!fs.existsSync(collectPath)) {
    await mkdir(collectPath).then(() =>
      console.log(`📂  创建 ${collectPath} 文件夹成功！`)
    )
  }

  // 格式化
  const data = JSON.stringify(evaluate, null, 2)
  await writeFile(`${collectPath}/${time}.json`, data).then(() => {
    console.log(`📄  写入 ${time}.json 文件成功！`)
  })
}

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
function handleTransCollect(collect, month) {
  const now = new Date()
  const nowMonth = now.getMonth() + 1
  const nowDay = now.getDate()
  const nowTime = `${now.getFullYear()}${fillZero(nowMonth)}`

  // 获取当月天数
  let day = getMonthDays(month)

  if (nowTime === month) day = nowDay

  return collect.map(({ url, copyright }) => {
    const fillDay = fillZero(day--)
    const date = new Date(
      `${month.slice(0, 4)}-${month.slice(4, 6)}-${fillDay}`
    ).getTime()
    const name = url.replace(
      /(http:\/\/cdn.nanxiongnandi.com\/bing\/|_1366x768.jpg)/g,
      ''
    )
    const dateString = `${month}${fillDay}`
    return {
      dateString,
      date,
      url,
      name,
      copyright
    }
  })
}
