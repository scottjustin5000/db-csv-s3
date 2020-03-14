const readline = require('readline')

const securePrompt = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl._writeToOutput = function _writeToOutput (stringToWrite) {
    if (rl.stdoutMuted && (stringToWrite && stringToWrite.length < 2)) {
      rl.output.write('*')
    } else {
      rl.output.write(stringToWrite)
    }
  }
  return new Promise((resolve, reject) => {
    rl.stdoutMuted = true
    rl.question(question, function (password) {
      rl.history = rl.history.slice(1)
      rl.stdoutMuted = false
      rl.close()
      return resolve(password)
    })
  })
}

module.exports = securePrompt
