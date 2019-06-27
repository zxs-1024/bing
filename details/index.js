const fs = require('fs')
const puppeteer = require('puppeteer')
const { promisify } = require('util')
const async = require('async')
const axios = require('axios')
const path = require('path')

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

const {
  fillZero,
  getMonthDays,
  handleWriteFile,
  downLoad
} = require('../utils')
const times = require('../utils/times').reverse()

const detailUrl = 'https://cn.bing.com/cnhp/life?currentDate='
const bingUrl = 'https://cn.bing.com/cnhp/coverstory?d='
const collectPath = './details/data'
const imagePath = './details/images'

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

  if (!fs.existsSync(imagePath)) {
    await mkdir(imagePath).then(() =>
      console.log(`📂  创建 ${imagePath} 文件夹成功！`)
    )
  }

  times.length = 5
  // 遍历时间数组，爬取数据
  for (let i = 0; i < times.length; i++) {
    if (!fs.existsSync(`${collectPath}/${times[i]}.json`)) {
      const copyPath = path.resolve(
        __dirname,
        `../collect/data/${times[i]}.json`
      )
      let copyData = []
      if (fs.existsSync(copyPath)) {
        try {
          copyData = await readFile(copyPath)
          copyData = JSON.parse(copyData.toString())
        } catch (error) {
          console.log(`😂  解析 ${copyPath} 文件数据错误！`, error)
        }
      }

      const monthCollect = await handleEachDay(page, times[i], copyData)

      await handleWriteFile(collectPath, monthCollect, times[i])
    }
  }

  console.log('🎉  你的数据已爬取完毕 => 冲鸭！！！')

  await browser.close()
})()

// 处理每一天
async function handleEachDay(page, month, copyData) {
  const collect = []
  let day = 0
  while (day++ < copyData.length) {
    const fillDay = fillZero(day)

    const {
      provider,
      Continent,
      Country,
      City,
      Longitude,
      Latitude,
      primaryImageUrl
    } = await axios.get(`${bingUrl}${month}${fillDay}`).then(({ data }) => data)

    console.log(`💦  打开 ${month}${fillDay} 页面，爬取数据中。。。`)

    const data = await puppeteerFn(page, `${month}${fillDay}`)
    const { copyright, name, url, imageUrl = '', dateString } =
      copyData[day] || {}

    const downLoadUrl = imageUrl.replace(/1920x1080|_1366x768/g, '')

    const { story } = data

    for (let i = 0; i < story.length; i++) {
      const { miniImage = '' } = story[i]
      const match =
        miniImage.match(
          /http:\/\/(.*)cn\.bing\.net\/th\?id=(.*)&pid=MSNJVFeeds/
        ) || []
      const type = match[1]
      const name = match[2]

      const target = `${imagePath}/${type}${name}.png`

      if (type && name) {
        story[
          i
        ].miniUrl = `https://zhanghao-zhoushan.cn/image/story/${type}${name}.png`
        // 下载图片
        if (!fs.existsSync(target))
          await downLoad(miniImage, target, `${month}${fillDay}`)
      }
    }

    collect.push({
      ...data,
      primaryImageUrl,
      imageUrl,
      downLoadUrl,
      url,
      name,
      provider,
      copyright,
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
  // await page.waitForSelector('#hplaT .hplaTtl')
  // await page.waitForSelector('.hplaCata .hplats')
  // await page.waitForSelector('#hplaSnippet')

  return await page.evaluate(time => {
    function handleGetInnerText(name) {
      return (
        document.querySelector(name) && document.querySelector(name).innerText
      )
    }

    // 获取文本
    const title = handleGetInnerText('#hplaT .hplaTtl')
    const attribute = handleGetInnerText('#hplaT .hplaAttr')
    const titleDescribes = document.querySelectorAll('.hplats') || [{}, {}, {}]
    const Au = document.querySelectorAll('.hplatt') || [{}, {}, {}]
    const titleDescribe1 = handleGetInnerText('.hplaCata .hplatt')
    const titleDescribeAu1 = handleGetInnerText('.hplaCata .hplats')
    const titleDescribe2 = titleDescribes[1] && titleDescribes[1].innerText
    const titleDescribeAu2 = Au[1] && Au[1].innerText
    const titleDescribe3 = titleDescribes[2] && titleDescribes[2].innerText
    const titleDescribeAu3 = Au[2] && Au[2].innerText

    const describes = document.querySelectorAll('.hplatxt') || [{}, {}, {}]
    const describe1 = handleGetInnerText('#hplaSnippet')
    const describe2 = describes[0] && describes[0].innerText
    const describe3 = describes[1] && describes[1].innerText

    const images = document.querySelectorAll('.hplaCard .rms_img')
    const miniImage1 = (document.querySelectorAll('#hpla .rms_img')[1] || {})
      .src
    const miniImage2 = images[1] && images[1].src
    const miniImage3 = images[3] && images[3].src

    const date = new Date(
      `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}`
    ).getTime()

    const story = []

    if (titleDescribe1 || describe1 || miniImage1) {
      story.push({
        title: titleDescribe1,
        au: titleDescribeAu1,
        describe: describe1,
        miniImage: miniImage1
      })
    }

    if (titleDescribe2 || describe2 || miniImage2) {
      story.push({
        title: titleDescribe2,
        au: titleDescribeAu2,
        describe: describe2,
        miniImage: miniImage2
      })
    }

    if (titleDescribe3 || describe3 || miniImage3) {
      story.push({
        title: titleDescribe3,
        au: titleDescribeAu3,
        describe: describe3,
        miniImage: miniImage3
      })
    }

    // 合并成对象
    return {
      dateString: time,
      date,
      attribute,
      title,
      story
    }
  }, date)
}
