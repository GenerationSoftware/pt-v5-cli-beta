export function createOutputPath(outputDir: string, chainId: string, address: string, drawId: string): string {
  return `${outputDir}/${chainId}/${address.toLowerCase()}/draw/${drawId}/`
}
