import * as find from 'find'
import { join } from 'path'
import debug from 'debug'
import { generateValidator } from './generateValdiator'
const log = debug('typeschema')
const argv = process.argv.slice(2)
const dirs = argv.filter(arg => arg.indexOf('-') !== 0)
const flags = argv.filter(arg => arg.indexOf('-') === 0)
function extractOption(option: string) {
  const val = option.split('=')[1]
  if (!val) throw new Error('malformed flag: ' + option)
  return val
}
const defaultPattern = '--pattern="\\.schema\\.(json|yml)"'
const options = {
  dirs: dirs.length ? dirs : ['.'],
  flags,
  watch: !!flags.find(arg => arg === '--watch' || arg === '-w'),
  pattern: extractOption(
    flags.find(arg => arg.indexOf('--pattern=') === 0 || arg.indexOf('-p=') === 0) || defaultPattern
  )
}
log('options: ', options)
async function main() {
  options.dirs
    .map(dir => join(process.cwd(), dir))
    .forEach(dir => {
      log('checking directory', dir)
      find.file(new RegExp(options.pattern), dir, function(files) {
        log('---->', files)
        files.forEach(generateValidator)
      })
    })
}
main().catch(e => console.error(e))
