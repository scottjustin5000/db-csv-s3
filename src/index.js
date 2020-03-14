const fs = require('fs')
const { readOptions, printOptions } = require('./parse-input')
const securePrompt = require('./secure-prompt')
const streamData = require('./stream-data')

const config = {
  h: { description: 'host', required: true },
  u: { description: 'database user', required: true },
  d: { description: 'database', required: true },
  p: { description: 'port', args: '*', required: false },
  t: { description: 'db type (mysql or pg)', required: true },
  b: { description: 's3 bucket name', required: true },
  k: { description: 'csv file name', required: true },
  f: { description: 'file containing query', required: false },
  q: { description: 'query to execute', required: false }
}

let options
try {
  options = readOptions(config)
} catch (er) {
  console.error(er)
  printOptions(config)
  process.exit(1)
}

const readFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist`)
    process.exit(1)
  }
  try {
    const rawdata = fs.readFileSync(filePath, 'utf8')
    return rawdata
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const run = async () => {
  try {
    const query = options.f ? readFile(options.f) : options.q
    let password = await securePrompt('Password: ')
    const connectionData = {
      host: options.h,
      user: options.u,
      password: password,
      database: options.d,
      port: options.p
    }
    await streamData({ type: options.t, connectionData, bucket: options.b, key: options.k, query })
    console.log('Complete')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

module.exports = run
