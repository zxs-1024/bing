const fs = require('fs')
const { promisify } = require('util')
const async = require('async')
const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)

const tinify = require('./tinify.js')

const sourceDir = './details/images'
const targetDir = `${sourceDir}-mini`

;(async () => {
  if (!fs.existsSync(targetDir)) {
    await mkdir(targetDir).then(() =>
      console.log(`📂  创建 ${targetDir} 文件夹成功！`)
    )
  }

  const files = await readdir(sourceDir)
  let i = 0

  // 异步并行压缩，限制 Limit 10
  async.mapLimit(files, 10, async function(file) {
    const sourcePath = `${sourceDir}/${file}`
    const targetPath = `${sourceDir}-mini/${file}`

    if (!fs.existsSync(targetPath)) {
      const source = tinify.fromFile(sourcePath)
      await source
        .toFile(targetPath)
        .then(() =>
          console.log(`🌁  压缩第 ${++i} 张 ${targetPath} 图片成功！`)
        )
        .catch(err => console.log(err))
    }
  })
})()
