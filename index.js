const dayjs = require('dayjs')
const request = require('request')
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const axios = require('./axios')
let max = 2000
const every = 'https://cn.bing.com/HPImageArchive.aspx'
const day = 'https://cn.bing.com/cnhp/coverstory?d=20181214'
const collect = './images'
const json = './images.json'
const base = 'https://cn.bing.com/'
const params = {
  format: 'js', // 数据返回格式 json
  idx: 17, // -1 今天、0 昨天、1 前天
  n: 8 // 返回图片，最大 8 组
}

const data = fs.readFileSync(json)
let jsonData = []
try {
  jsonData = JSON.parse(data.toString())
  if (!Array.isArray(jsonData)) jsonData = []
} catch (error) {}

async function main() {
  const { images } = await axios.get(every, { params })
  if (!fs.existsSync(collect)) {
    await mkdir(collect).then(() =>
      console.log(`📂  创建 ${collect} 文件夹成功！`)
    )
  }

  images.forEach(image => {
    if (!jsonData.some(item => image.startdate === item.startdate)) {
      jsonData.push(image)
      writeFile(json, JSON.stringify(jsonData)).then(() => {
        console.log(`📄  写入 ${json} 文件成功！`)
      })
    }

    const { url, copyright, startdate } = image
    const source = base + url
    const name = url.split('/').slice(-1)[0]
    const target = collect + '/' + name
    if (!fs.existsSync(target)) {
      downLoad(source, target)
      downLoad(source, collect + '/' + startdate + '.jpg')
    } else {
      console.log(
        `😂  请注意，已经存在 ${name} 文件，为了防止文件覆盖，已经帮你中断写入啦！`
      )
    }
  })
}

function downLoad(source, target) {
  return request(source)
    .pipe(fs.createWriteStream(target))
    .on('close', () => {
      console.log(`🌁  下载 ${target} 文件成功！`)
    })
}

main()
