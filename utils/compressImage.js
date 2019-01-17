const fs = require('fs')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)

const tinify = require('./tinify.js')
const dirPath = './details/images'

;(async () => {
  if (!fs.existsSync(`${dirPath}-mini`)) {
    await mkdir(`${dirPath}-mini`).then(() =>
      console.log(`📂  创建 ${`${dirPath}-mini`} 文件夹成功！`)
    )
  }

  const files = await readdir(dirPath)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    const source = tinify.fromFile(`${dirPath}/${file}`)
    await source
      .toFile(`${dirPath}-mini/${file}`)
      .then(() => console.log(`🌁  压缩图片 ${file} 成功！`))
      .catch(err => console.log(err))
  }
})()
