# bing

🌁 必应壁纸

## 爬取所有必应图片数据

> 以 201812.json 形式储存在 src/collect 文件

```bash
// use npm
npm run pu

// use yarn
yarn pu
```

## 更新最近图片数据

> 储存图片在 src/images 文件夹，更新数据在 src/images.json 文件

```bash
// use npm
npm run update -1

// use yarn
yarn update -1
```

```js
// -1 今天、0 昨天、1 前天
const idx = process.argv[2] || -1
```

idx 默认 -1，更新今天近 8 天数据，顺便更新图片数据 JSON，下载图片
