// eslint-disable-next-line unicorn/prefer-node-protocol
// import {Prize} from '@pooltogether/v4-utils-js'
import {writeFileSync, mkdirSync} from 'fs'
type File = any

export function writePrizesToOutput(
  outDir: string,
  allPrizes: Prize[][],
): void {
  for (const depositorPrizes of allPrizes) {
    const address = depositorPrizes[0].address.toLowerCase()
    writeToOutput(outDir, address.toLowerCase(), depositorPrizes)
  }
}

export function writeToOutput(
  outputDir: string,
  fileName: string,
  blob: File,
): void {
  mkdirSync(outputDir, {recursive: true})
  const outputFilePath = `${outputDir}/${fileName}.json`
  writeFileSync(outputFilePath, JSON.stringify(blob, null, 2))
}
