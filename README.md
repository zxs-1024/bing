# bing

🌁 必应壁纸

## 更新最近图片数据，更新 8 天图片

> 将储存图片在 update/images 文件夹，数据更新在 update/index.json 文件

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

PS: 有限制，只能更新最近 16 天数据。

## 爬取所有必应图片数据

> 将图片数据以 201812.json 形式储存在 collect/data 文件

```bash
// use npm
npm run pu

// use yarn
yarn pu
```

## 网站地址 && 接口地址

### 最近图片详情接口

```js
const url = 'https://cn.bing.com/HPImageArchive.aspx'

const params = {
  format: 'js', // 数据返回格式 json
  idx: -1, // -1 今天、0 昨天、1 前天
  n: 8 // 返回图片，最大 8 组
}
```

### 图片地址

```js
const name = 'TheLongWalk_ZH-CN11094733779'
const resolution = '1920x1080'
const imageUrl = `https://cn.bing.com//az/hprichbg/rb/${name}_${resolution}.jpg`
```

### 图片详情地址

```js
const date = 20181221
const details = `https://cn.bing.com/cnhp/life?currentDate=${date}`
```

### 历史图片爬取地址

```js
const url = 'http://bingwallpaper.anerg.com/cn/'
```

## 图片详情

### 列表数据

```js
const image = {
  dateString: '20181221',
  date: 1545350400000,
  url:
    'http://cdn.nanxiongnandi.com/bing/AdobeSantaFe_ZH-CN2664241241_1366x768.jpg',
  imageName: 'AdobeSantaFe_ZH-CN2664241241',
  copyright:
    '圣达菲的Farolito，美国新墨西哥州 (© Julien McRoberts/Danita Delimont)(Bing China)'
}
```

### 详情数据

```js
const image = {
  sourceUrl:
    'https://cn.bing.com/az/hprichbg/rb/AdobeSantaFe_ZH-CN2664241241_1920x1080.jpg',
  url: '/az/hprichbg/rb/AdobeSantaFe_ZH-CN2664241241_1920x1080.jpg',
  imageName: 'AdobeSantaFe_ZH-CN2664241241',
  resolution: '1920x1080',
  date: 1545380401231,
  copyright: '黄石国家公园里正在升起的月亮  (© Tom Murphy/Getty Images)',
  topTitle: '跃于色彩之上的灯光',
  area: '美国，圣达菲',
  title: '来一场浪漫的热气球之旅',
  titleDescribe: '圆你五彩斑斓的童话梦',
  describe:
    '在圣达菲，居民们用美丽的纸灯笼来庆祝节日。“峡谷路步行Farolito活动”每年的平安夜都会在该市的峡谷路艺术区举行，这些古朴的灯笼照亮了两边都是普韦布洛风格建筑的道路。作为圣达菲最受欢迎的传统节日之一，峡谷路照亮了很多平安夜漫步在这条小径上的人们的心。一盏盏装满沙子的小纸袋被点燃，古老城墙上的灯笼照亮了历史悠久的街道和土墙。唱颂歌的人聚集在灯光周围，在寒冷的夜晚温暖着我们的心。'
}
```

## 多表关联查询

[mongoose populate 多表关联查询](https://www.jianshu.com/p/817ff51bd548)
