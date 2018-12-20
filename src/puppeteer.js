const fs = require('fs')
const puppeteer = require('puppeteer')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const timeArray = require('./time')
const { fillZero } = require('./utils')
const collectPath = './src/collect'
const baseUrl = 'http://bingwallpaper.anerg.com/cn/'

const puppeteerFn = async (page, time) => {
  await page.goto(`${baseUrl}${time}`)

  const evaluate = await page.evaluate(() => {
    // 获取图片 DOM
    const images = document.querySelectorAll('#photos .panel a img')
    const collect = [...images]

    // http://bingwallpaper.anerg.com/cn/201812
    // => cn/201812 => 201812 => 12
    const pathname = window.location.pathname.split('/')[2]
    const month = pathname.slice(4, 6)
    const now = new Date()
    const nowMonth = now.getMonth() + 1
    const nowDay = now.getDate()
    const nowTime = `${now.getFullYear()}${fillZero(nowMonth)}`

    function fillZero(number) {
      return number < 10 ? `0${number}` : number
    }

    // 获取当月天数
    const date = new Date(`${pathname}`)
    date.setMonth(month)
    date.setDate(0)
    let day = date.getDate()

    if (nowTime === pathname) day = nowDay

    return collect.map(({ src, alt }) => {
      const date = fillZero(day--)
      return {
        enddate: `${pathname}${date}`,
        date: new Date(
          `${pathname.slice(0, 4)}-${pathname.slice(4, 6)}-${date}`
        ).getTime(),
        url: src,
        copyright: alt
      }
    })
  })

  if (!fs.existsSync(collectPath)) {
    await mkdir(collectPath).then(() =>
      console.log(`📂  创建 ${collectPath} 文件夹成功！`)
    )
  }

  // 写入 JSON 文件
  await writeFile(`${collectPath}/${time}.json`, JSON.stringify(evaluate)).then(
    () => {
      console.log(`📄  写入 ${time}.json 文件成功！`)
    }
  )
}

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

  for (let i = 0; i < timeArray.length; i++) {
    if (!fs.existsSync(`${collectPath}/${timeArray[i]}.json`)) {
      await puppeteerFn(page, timeArray[i])
    }
  }

  console.log('🎉  你的数据已爬取完毕 => 冲鸭！！！')
  await browser.close()
})()
