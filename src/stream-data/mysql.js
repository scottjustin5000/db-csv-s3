const zlib = require('zlib')
const mysql = require('mysql2')
const csv = require('fast-csv')
const AWS = require('aws-sdk')
const s3Stream = require('s3-upload-stream')(new AWS.S3())

module.exports = function streamData (connectionData, bucket, key, q) {
  const connection = mysql.createConnection({
    host: `${connectionData.host}`,
    user: `${connectionData.user || ''}`,
    password: `${connectionData.password}`,
    database: `${connectionData.database}`,
    port: `${connectionData.port || 3306}`
  })
  return new Promise((resolve, reject) => {
    connection.connect()
    const csvStream = csv.format()
    const compress = zlib.createGzip()
    const upload = s3Stream.upload({
      'Bucket': `${bucket}`,
      'Key': `${key}.csv.gz`
    })
    let sqlStream = connection.query(`${q}`).stream()
    upload.on('error', (error) => { console.log(error); reject(error) })
    upload.on('part', (details) => { console.log(details) })
    upload.on('uploaded', (details) => { console.log(details); connection.destroy(); resolve() })
    sqlStream.pipe(csvStream).pipe(compress).pipe(upload)
  })
}
