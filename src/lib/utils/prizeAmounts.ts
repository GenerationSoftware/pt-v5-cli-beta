import { BigNumber } from '@ethersproject/bignumber'
import { Amounts, Claim } from '@pooltogether/v5-utils-js'

interface amountsAsString {
  [key: string]: string;
};

interface amountPerPrizeAsString {
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

export function addTierPrizeAmountsToClaims(claims: Claim[], tierPrizeAmounts: Amounts): ClaimWithAmount[] {
  const claimsByTier = groupByTier(claims)
  const claimsWithAmounts:ClaimWithAmount[] = []
  const tierAmountPerPrize:amountPerPrizeAsString = {}

  for (const tier of Object.entries(tierPrizeAmounts)) {
    const [key, value] = tier
    const numberOfPrizes = claimsByTier[key].length
    tierAmountPerPrize[key] = BigNumber.from(value).div(numberOfPrizes).toString()
  }

  for (const claim of claims) {
    const claimWithAmount = {...claim, amount: tierAmountPerPrize[claim.tier.toString()]}
    claimsWithAmounts.push(claimWithAmount)
  }

  return claimsWithAmounts
}

const groupByTier = (claims: any) =>{
  return claims.reduce(function (accumulator:any, value:any) {
        accumulator[value.tier] = accumulator[value.tier] || [];
        accumulator[value.tier].push(value);
        return accumulator;
    }, {});
}
