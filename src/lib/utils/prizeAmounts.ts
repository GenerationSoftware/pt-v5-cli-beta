import { BigNumber } from '@ethersproject/bignumber'
import { Amounts, Claim } from '@pooltogether/v5-utils-js'

interface amountsAsString {
  [key: string]: string;
};

interface ClaimWithAmount extends Claim {
  amount: string
}

export function sumPrizeAmounts(tierPrizeAmounts: Amounts): string {
  return Object.values(tierPrizeAmounts)
    .reduce((a, b) => a.add(b), BigNumber.from(0))
    .toString()
}

export function mapTierPrizeAmountsToString(tierPrizeAmounts: Amounts) {
  const obj: amountsAsString = {};
  
  for (const entry of Object.entries(tierPrizeAmounts)) {
    const [key, value] = entry;
    obj[key] = BigNumber.from(value).toString();
  }

  return obj;
};

// export function addTierPrizeAmountsToClaims(claims: Claim[], tierPrizeAmounts: Amounts): ClaimWithAmount[] {
export function addTierPrizeAmountsToClaims(claims: Claim[], tierPrizeAmounts: Amounts): Claim[] {
  const claimsByTier = groupByTier(claims)
  console.log('claimsByTier')
  console.log(claimsByTier)

  for (const tier of Object.entries(tierPrizeAmounts)) {
    const [key, value] = tier
  console.log('----------NEWNEWN---------')
  console.log('----------NEWNEWN---------')
  console.log('key')
  console.log(key)
  console.log('typeof key')
  console.log(typeof key)
  console.log('value')
    console.log(value)
    const numberOfPrizes = claimsByTier[key].length
    console.log('numberOfPrizes')
    console.log(numberOfPrizes)

    tierPrizeAmounts[key] = BigNumber.from(value).div(numberOfPrizes)
  }

  return claims
}

const groupByTier = (claims: any) =>{
  return claims.reduce(function (accumulator:any, value:any) {
        accumulator[value.tier] = accumulator[value.tier] || [];
        accumulator[value.tier].push(value);
        return accumulator;
    }, {});
}

// it would prob make sense to group claims by tier for prizes.json