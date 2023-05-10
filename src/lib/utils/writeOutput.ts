// eslint-disable-next-line unicorn/prefer-node-protocol
import {Claim} from '@pooltogether/v5-utils-js'
import {writeFileSync, mkdirSync} from 'fs'
type File = any

export function writePrizesToOutput(
  outDir: string,
  allClaims: Claim[],
): void {
  for (const claim of allClaims) {
    console.log('claim')
    console.log(claim)
    // const address = claim
    const address = '0xface'
    // const address = claim[0].address.toLowerCase()
    writeToOutput(outDir, address.toLowerCase(), claim)
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
