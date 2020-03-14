const pg = require('pg')
const copyTo = require('pg-copy-streams').to
const zlib = require('zlib')
const AWS = require('aws-sdk')
const s3Stream = require('s3-upload-stream')(new AWS.S3())
const { pipeline } = require('stream')
const { promisify } = require('util')
const pipe = promisify(pipeline)

module.exports = function streamData (connectionData, bucket, key, query) {
  query = 'SELECT id, catalog_id from properties limit 10'
  return new Promise((resolve, reject) => {
    const compress = zlib.createGzip()
    const upload = s3Stream.upload({
      'Bucket': `${bucket}`,
      'Key': `${key}.csv.gz`
    })

    const connectionString = `postgres://${connectionData.user || ''}:${connectionData.password || ''}@${connectionData.host}:${connectionData.port || 5432}/${connectionData.database}`

    const pgClient = new pg.Client({ connectionString: connectionString })

    pgClient.connect(async (err, client, done) => {
      if (err) throw err

      const q = `COPY (${query}) to STDOUT with csv DELIMITER ',' HEADER`
      const sqlStream = client.query(copyTo(q))
      upload.on('error', (error) => { console.log(error); reject(error) })
      upload.on('part', (details) => { console.log(details) })
      upload.on('uploaded', (details) => { console.log(details); pgClient.end(); resolve() })
      await pipe(sqlStream, compress, upload)
    })
  })
}
