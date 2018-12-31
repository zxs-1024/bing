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

### 图片详情页面地址

> 将图片数据以 201812.json 形式储存在 details/data 文件

```bash
// use npm
npm run detail

// use yarn
yarn detail
```

图片详情爬取页面

```js
const date = 20181221
const details = `https://cn.bing.com/cnhp/life?currentDate=${date}`
```

### 图片详情接口

```js
const date = 20181221
const details = `https://cn.bing.com/cnhp/coverstory?d=${date}`
```

### 历史图片爬取页面

```js
const url = 'http://bingwallpaper.anerg.com/cn/'
```

## 图片详情

### 列表数据

```js
const image = {
  dateString: '20181231',
  date: 1546214400000,
  url:
    'http://cdn.nanxiongnandi.com/bing/EyeFireworks_ZH-CN1712859531_1366x768.jpg',
  name: 'EyeFireworks_ZH-CN1712859531',
  copyright: '跨年烟火表演，伦敦 (© Anadolu Agency/Getty Images)(Bing China)'
}
```

### 详情数据

```js
const image = {
  dateString: '20181231',
  date: 1546214400000,
  attribute: '英国，伦敦',
  title: '“火树银花不夜天”',
  titleDescribe: '打开新年的各种方式',
  titleDescribe1: '放烟花绝不是唯一',
  titleDescribe2: '最有北方味儿的跨年城市',
  titleDescribe3: '最中国风的跨年',
  describe1:
    '直到1999年，伦敦才开始举办大规模的跨年焰火表演，但从那时起，这个狂欢便成为新年前夜的保留节目。今天的壁纸展示的是2017年烟花爆满、五彩缤纷的伦敦眼（泰晤士河岸上的大摩天轮）。尽管直到2021年塔楼维护完毕，大本钟的钟声才会再次响起，但无论你是在大城市的街道上，还是在家里，到处都洋溢着欢乐的氛围。',
  describe2:
    '元旦的北京虽然落叶萧条，但是却饱含着传统和现代的交融。漫步在故宫、太庙、天坛、南锣鼓巷……甚至连不起眼的小胡同里都保留着浓浓的京味儿。而当我们走到三里屯、世贸天阶、蓝色港湾……却又是现代范儿十足，这里是年轻人的海洋，大家聚集在一起倒数，让路过的行人都不由自主地凑个热闹。',
  describe3:
    '最具中国风年味儿的为什么是南京？因为这里文化底蕴深厚，曾是六朝古都，又是十朝都会，受外来文化的影响很小。南京素有撞钟的习俗，玄奘寺每年在元旦前夜都要举办撞钟活动。在这里日游夫子庙，夜游秦淮河，沉寂在波光粼粼的河水中，两岸灯火辉煌，你可以在悠扬的钟声中体会南京的风韵，感受跨年的温暖与浪漫。',
  miniImage1: 'http://s4.cn.bing.net/th?id=OJ.5sntxANxLQPjvw&pid=MSNJVFeeds',
  miniImage2: 'http://s2.cn.bing.net/th?id=OJ.AAkeHYHoT5HseQ&pid=MSNJVFeeds',
  miniImage3: 'http://s2.cn.bing.net/th?id=OJ.hsexk2YQM0OlWg&pid=MSNJVFeeds',
  primaryImageUrl:
    'http://hpimges.blob.core.chinacloudapi.cn/coverstory/watermark_eyefireworks_zh-cn1712859531_1920x1080.jpg',
  provider: '© Anadolu Agency/Getty Images',
  Continent: '欧洲',
  Country: '英国',
  City: '伦敦',
  Longitude: '-0.119663',
  Latitude: '51.503410'
}
```
