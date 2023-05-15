import { BigNumber } from '@ethersproject/bignumber'
import { Amounts } from '@pooltogether/v5-utils-js'

export function sumPrizeAmounts(tierPrizeAmounts: Amounts): string {
  return Object.values(tierPrizeAmounts)
    .reduce((a, b) => a.add(b), BigNumber.from(0))
    .toString()
}
