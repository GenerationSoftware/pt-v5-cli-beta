// eslint-disable-next-line unicorn/prefer-node-protocol
import {Claim} from '@pooltogether/v5-utils-js'
import {writeFileSync, mkdirSync} from 'fs'
type File = any

export function writePrizesToOutput(
  outDir: string,
  allClaims: Claim[],
): void {
  for (const claim of allClaims) {
    const {vault, tier, winner} = claim
    writeToOutput(outDir, `${vault}-${tier}-${winner.toLowerCase()}`, claim)
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

export function writeStatus(outputDir: string, json: any): void {
  writeToOutput(outputDir, 'status', json)
}