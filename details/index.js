const fs = require('fs')
const puppeteer = require('puppeteer')
const { promisify } = require('util')
const async = require('async')
const axios = require('axios')

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const { fillZero, getMonthDays, handleWriteFile } = require('../utils')
const times = require('../utils/times').reverse()

const detailUrl = 'https://cn.bing.com/cnhp/life?currentDate='
const bingUrl = 'https://cn.bing.com/cnhp/coverstory?d='
const collectPath = './details/data'

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

  // 遍历时间数组，爬取数据
  for (let i = 0; i < times.length; i++) {
    if (!fs.existsSync(`${collectPath}/${times[i]}.json`)) {
      const monthCollect = await handleEachDay(page, times[i])
      await handleWriteFile(collectPath, monthCollect, times[i])
    }
  }

  console.log('🎉  你的数据已爬取完毕 => 冲鸭！！！')

  await browser.close()
})()

// 处理每一天
async function handleEachDay(page, month) {
  const collect = []
  // 获取当月天数
  let day = getMonthDays(month)

  while (day) {
    const fillDay = fillZero(day--)

    const {
      provider,
      Continent,
      Country,
      City,
      Longitude,
      Latitude,
      primaryImageUrl
    } = await axios.get(`${bingUrl}${month}${fillDay}`).then(({ data }) => data)

    const data = await puppeteerFn(page, `${month}${fillDay}`)

    collect.push({
      ...data,
      primaryImageUrl,
      provider,
      Continent,
      Country,
      City,
      Longitude,
      Latitude
    })
  }

  return collect
}

// 收集图片详情
async function puppeteerFn(page, date) {
  await page.goto(`${detailUrl}${date}`)

  // 等待页面渲染
  await page.waitForSelector('#hplaT .hplaTtl')
  await page.waitForSelector('.hplaCata .hplats')
  await page.waitForSelector('#hplaSnippet')

  return await page.evaluate(time => {
    function handleGetInnerText(name) {
      return (
        document.querySelector(name) && document.querySelector(name).innerText
      )
    }

    // 获取文本
    const title = handleGetInnerText('#hplaT .hplaTtl')
    const attribute = handleGetInnerText('#hplaT .hplaAttr')

    const titleDescribes = document.querySelectorAll('.hplats')
    const titleDescribe = handleGetInnerText('.hplaCata .hplatt')
    const titleDescribe1 = handleGetInnerText('.hplaCata .hplats')
    const titleDescribe2 = titleDescribes[1] && titleDescribes[1].innerText
    const titleDescribe3 = titleDescribes[2] && titleDescribes[2].innerText

    const describes = document.querySelectorAll('.hplatxt')
    const describe1 = handleGetInnerText('#hplaSnippet')
    const describe2 = describes[0] && describes[0].innerText
    const describe3 = describes[1] && describes[1].innerText

    const images = document.querySelectorAll('.hplaCard .rms_img')
    const miniImage1 = document.querySelectorAll('#hpla .rms_img')[1].src
    const miniImage2 = images[1] && images[1].src
    const miniImage3 = images[3] && images[3].src

    const date = new Date(
      `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}`
    ).getTime()

    // 合并成对象
    return {
      dateString: time,
      date,
      attribute,
      title,
      titleDescribe,
      titleDescribe1,
      titleDescribe2,
      titleDescribe3,
      describe1,
      describe2,
      describe3,
      miniImage1,
      miniImage2,
      miniImage3
    }
  }, date)
}
