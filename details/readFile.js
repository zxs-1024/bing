const fs = require('fs')
fs.readFile('./collect/data/201812.json', (err, data) => {
  if (err) return console.log(err)
  console.log(data.toString())
})
