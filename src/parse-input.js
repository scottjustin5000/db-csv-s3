const printOptions = (config) => {
  console.log('Available Options:')
  for (let k in config) {
    console.log(`-${k}   ${config[k].description}, ${config[k].required ? 'required' : ''}`)
  }
}

const collectOptions = (input, config) => {
  let i = 0
  while (i < input.length) {
    let key = input[i]
    config[key.substring(1, key.length)].value = input[i + 1]
    i = i + 2
  }
}

const validateOptions = (config) => {
  // check for required options
  for (let k in config) {
    if (config[k].required && !config[k].value) {
      throw new Error(`Missing Required Param -${k}`)
    }
  }
  if (!config['q'].value && !config['f'].value) {
    throw new Error(`a query or query file required`)
  }
}

const readOptions = (config) => {
  const input = process.argv.slice(2)
  if (!input.length) {
    throw new Error('No Input Found')
  }
  if (input[0] === '--help') {
    printOptions(config)
    process.exit(1)
  }
  collectOptions(input, config)
  validateOptions(config)
  let options = {}
  for (let k in config) {
    options[k] = config[k].value
  }
  return options
}

module.exports = {
  readOptions,
  printOptions
}
