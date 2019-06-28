const fs = require('fs')
const { promisify } = require('util')
const path = require('path')

const mkdir = promisify(fs.mkdir)
const readFile = promisify(fs.readFile)

const times = require('../utils/times')
const { handleWriteFile, handleDeleteFile } = require('../utils')

const collectPath = './details/data'
const imagePath = './details/images'

;(async () => {

  if (!fs.existsSync(imagePath)) {
    await mkdir(imagePath).then(() =>
      console.log(`📂  创建 ${imagePath} 文件夹成功！`)
    )
  }

  handleDeleteFile(collectPath)

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

      const monthCollect = await handleTransEveryDay(times[i], copyData)
      await handleWriteFile(collectPath, monthCollect, times[i])
    }
  }

  console.log('🎉  你的数据已处理完毕 => 冲鸭！！！')
})()

async function handleTransEveryDay(month, copyData) {
  return copyData.map(item => {
    const downLoadUrl = item.imageUrl.replace(/_1920x1080|_1366x768/g, '')
    return {
      ...item,
      attribute: null,
      title: null,
      story: [],
      downLoadUrl
    }
  })
  // "dateString": "20190401",
  // "date": 1554076800000,
  // "attribute": null,
  // "title": null,
  // "story": [],
  // "imageUrl": "https://zhanghao-zhoushan.cn/image/large/HCABooks_ZH-CN3645291678_1366x768.jpg",
  // "downLoadUrl": "https://zhanghao-zhoushan.cn/image/large/HCABooks_ZH-CN3645291678.jpg",
  // "url": "http://cdn.nanxiongnandi.com/bing/th?id=OHR.HCABooks_ZH-CN3645291678_1920x1080.jpg&rf=NorthMale_1920x1080.jpg&pid=hp",
  // "name": "HCABooks_ZH-CN3645291678",
  // "copyright": "安徒生的作品 (© radiokafka/Adobe Stock)(Bing China)"

  // "dateString": "20190601",
  // "date": 1559347200000,
  // "url": "https://bing.nanxiongnandi.com/201906/HighTrestleTrail_1920x1080.jpg",
  // "imageUrl": "https://zhanghao-zhoushan.cn/image/large/HighTrestleTrail_1920x1080.jpg",
  // "name": "HighTrestleTrail",
  // "copyright": "爱荷华州中部的高架栈桥 (© Kelly van Dellen/Getty Images Plus)(Bing China)"
}
