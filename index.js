const every = 'https://cn.bing.com/HPImageArchive.aspx'
const day = 'https://cn.bing.com/cnhp/coverstory?d=20181214'
const collect = './images'
const json = './images.json'
const dayjs = require('dayjs')
const axios = require('./axios')
const request = require('request')
const base = 'https://cn.bing.com/'

const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const params = {
  format: 'js',
  idx: -1,
  n: 10
}

async function main() {
  const { images } = await axios.get(every, { params })

  const data = await readFile(json)
  let jsonData = []
  try {
    jsonData = JSON.parse(data.toString())
    if (!Array.isArray(jsonData)) jsonData = []
  } catch (error) {}

  if (!fs.existsSync(collect)) {
    await mkdir(collect).then(() =>
      console.log(`📂  创建 ${collect} 文件夹成功！`)
    )
  }

  images.forEach(image => {
    console.log(jsonData)
    if (!jsonData.some(item => image.startdate === item.startdate)) {
      jsonData.push(image)
      writeFile(json, JSON.stringify(jsonData)).then(() => {
        console.log(`📄  写入 ${json} 文件成功！`)
      })
    }

    const { url, copyright, startdate } = image
    const source = base + url
    const name = url.split('/').slice(-1)[0]
    const target = collect + '/' + startdate + '.jpg'
    if (!fs.existsSync(target)) {
      downLoad(source, target)
    } else {
      // console.log(
      //   `😂  请注意，已经存在 ${name} 文件，为了防止文件覆盖，已经帮你中断写入啦！`
      // )
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
