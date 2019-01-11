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
  dateString: '20190111',
  date: 1547164800000,
  url:
    'http://cdn.nanxiongnandi.com/bing/NapoleonsHat_ZH-CN2968205603_1366x768.jpg',
  imageUrl:
    'https://zhanghao-zhoushan.cn/image/large/NapoleonsHat_ZH-CN2968205603_1366x768.jpg',
  name: 'NapoleonsHat_ZH-CN2968205603.jpg',
  copyright:
    '泰夫劳特镇，摩洛哥 (© Doug Pearson Photography/plainpicture)(Bing China)',
  Continent: '非洲',
  Country: '摩洛哥',
  City: '泰夫劳特'
}
```

### 详情数据

```js
const detail = {
  dateString: '20190111',
  date: 1547164800000,
  attribute: '摩洛哥，泰夫劳特',
  title: '隐秘之城',
  story: [
    {
      title: '多彩摩洛哥',
      au: '看你千遍也不倦',
      describe:
        '这个几乎隐藏在山谷中的小镇叫泰夫劳特镇，这里与摩洛哥的大城市相距较远，镇上较小的聚居点Aguerd Oudad被阿特拉斯山脉的红色山丘所环绕。这里虽然偏僻，但依然有很多登山者造访。若是游客过来，那可真得在路上费一番功夫。不过正如许多旅游作家所说，一切努力都是值得的。与马拉喀什等摩洛哥繁忙的城市相比，当地的柏柏尔人过着安静、慢节奏的生活。',
      miniImage: 'http://s1.cn.bing.net/th?id=OJ.8JB0mEqDJpz0LQ&pid=MSNJVFeeds',
      miniUrl:
        'https://zhanghao-zhoushan.cn/image/story/s1.OJ.8JB0mEqDJpz0LQ.png'
    },
    {
      title: '阿汤哥飙戏的地方',
      au: '乌达雅城堡',
      describe:
        '一部《碟中谍5》捧红了摩洛哥拉巴特老城以东的乌达雅城堡，阿汤哥从城堡台阶飞车入海的镜头便是在这里取景。乌达雅城堡曾是海角上的军事要塞，黄色的砖石诉说着历史的沧桑，城堡内的花园却又是优雅精致、花木茂盛。站在城堡的高空平台上，俯视着海角全貌，饮上一杯咖啡，惬意自在。',
      miniImage: 'http://s.cn.bing.net/th?id=OJ.QrKezuvuyP0VOw&pid=MSNJVFeeds',
      miniUrl:
        'https://zhanghao-zhoushan.cn/image/story/s.OJ.QrKezuvuyP0VOw.png'
    },
    {
      title: '马拉喀什的世外桃源',
      au: '马若雷勒花园',
      describe:
        '马若雷勒花园是摩洛哥马拉喀什艺术家集聚的艺术圣地，是艺术家雅克·马若雷勒所完成的最复杂、最宏大的作品。碧蓝色的墙壁和生机勃勃的绿色仙人掌交相辉映，院内花繁叶茂，小桥流水，小到一草一木，大到亭台楼阁都不由得让人赞叹设计者和建造者的匠心。',
      miniImage: 'http://s1.cn.bing.net/th?id=OJ.xHwxQAwWtJ9cGA&pid=MSNJVFeeds',
      miniUrl:
        'https://zhanghao-zhoushan.cn/image/story/s1.OJ.xHwxQAwWtJ9cGA.png'
    }
  ],
  primaryImageUrl:
    'http://hpimges.blob.core.chinacloudapi.cn/coverstory/watermark_napoleonshat_zh-cn2968205603_1920x1080.jpg',
  imageUrl: '',
  downLoadUrl: '',
  provider: '© Doug Pearson Photography/plainpicture',
  Continent: '非洲',
  Country: '摩洛哥',
  City: '泰夫劳特',
  Longitude: '-8.988823',
  Latitude: '29.730064'
}
```
