
const provider = {
  pg: require('./pg'),
  mysql: require('./mysql')

}
module.exports = function stream (options) {
  if (!provider[options.type]) return Promise.reject(new Error(('Unknown DB Type')))

  return provider[options.type](options.connectionData, options.bucket, options.key, options.query.trim())
}
