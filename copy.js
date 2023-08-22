import {resolve, join} from 'node:path'
import { copyFileSync } from 'node:fs'

let srcDestTable = {
    './includes/manifest.json': './build/manifest.json',
    './includes/icon48.png': './build/icon48.png',
}

for (let srcPath of Object.keys(srcDestTable)) {
    copyFileSync(srcPath, srcDestTable[srcPath]);
}