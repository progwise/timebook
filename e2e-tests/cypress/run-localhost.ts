import {series} from 'async'
import { exec } from 'child_process'

console.log('starting...')
series([
  () => exec('npm run dev --prefix ../../frontend'),
  () => exec('npm test'),
])
