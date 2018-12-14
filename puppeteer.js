const fs = require('fs')
const puppeteer = require('puppeteer')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const collectPath = './collect'
const timeArray = require('./time')

const puppeteerFn = async (page, time) => {
  await page.goto(`http://bingwallpaper.anerg.com/cn/${time}`)

  const evaluate = await page.evaluate(() => {
    const images = document.querySelectorAll('#photos .panel a img')
    const collect = [...images]

    const pathname = window.location.pathname.split('/')[2]
    const month = pathname.slice(4, 6)

    const date = new Date(`${pathname}`)
    date.setMonth(month)
    date.setDate(0)
    let day = date.getDate() + 1

    return collect.map(({ src, alt }) => {
      return {
        enddate: `${pathname}${day-- < 10 ? `0${day}` : day}`,
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

  await writeFile(`${collectPath}/${time}.json`, JSON.stringify(evaluate)).then(
    () => {
      console.log(`📄  写入 ${time}.json 文件成功！`)
    }
  )
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
    ignoreHTTPSErrors: true
  })

  const page = await browser.newPage()

  let result = Promise.resolve()

  // timeArray.forEach(time => {
  //   result = result.then(() => {
  //     return puppeteerFn(time)
  //   })
  // })

  for (let i = 0; i < timeArray.length; i++) {
    if (!fs.existsSync(`${collectPath}/${timeArray[i]}`)) {
      await puppeteerFn(page, timeArray[i])
    }
  }

  await browser.close()
}

main()
