// #! /usr/bin/env node

import find from 'find'

const argv = process.argv.slice(1)
const dirs = argv.filter(arg => arg.indexOf('-') !== 0)
const flags = argv.filter(arg => arg.indexOf('-') === 0)
function extractOption(option: string) {
  const val = option.split('=')[1]
  if (!val) throw new Error('malformed flag: ' + option)
  return val
}
const defaultPattern = '--pattern=\\.schema\\.(json|yml)'
const options = {
  dirs,
  flags,
  watch: !!flags.find(arg => arg === '--watch' || arg === '-w'),
  pattern: extractOption(
    flags.find(arg => arg.indexOf('--pattern=') === 0 || arg.indexOf('-p=') === 0) || defaultPattern
  )
}
console.log(options)
async function main() {
  find.file(/\.js$/, __dirname, function(files) {
    console.log(files.length)
  })
}

if (process.argv[0] === __filename) {
  main().catch(e => console.error(e))
}
