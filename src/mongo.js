const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://118.24.8.202:27017'
const dbName = 'fire'
const db = mongoose.connection

MongoClient.connect(
  url,
  function(err, client) {
    if (err) {
      return console.log(err)
    }
    console.log('数据库连接成功')
    const db = client.db(dbName)
    const col = db.collection('name')
    col.find().toArray((err, res) => {
      console.log(res)
    })
  }
)
