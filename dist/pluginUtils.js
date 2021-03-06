const {
  existsSync,
  readFileSync,
  writeFileSync
} = require('fs')
const serialize = require('serialize-javascript')
const template = require('lodash/template')

exports.compilePlugin = function({ src, tmpFile, options, overwrite = false }) {
  if (!overwrite && existsSync(tmpFile)) {
    console.info(`compiled plugin ${tmpFile} already exists`)
    return
  } else {
    console.log(`saving compiled plugin to: ${tmpFile}`)
  }
  const content = readFileSync(src, 'utf-8')
  try {
    const compiled = template(content, { interpolate: /<%=([\s\S]+?)%>/g })
    const pluginJs = compiled({ options, serialize })
    writeFileSync(tmpFile, pluginJs)
  } catch (err) {
    throw new Error('Could not compile plugin :(' + err)
  }
}

exports.PluginContext = function(Plugin) {
  const ctx = this
  this.injected = {}
  this.inject = function(label, obj) {
    ctx.injected[label] = obj
  }
  Plugin(this, this.inject)  
}
