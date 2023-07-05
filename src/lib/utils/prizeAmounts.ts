import { BigNumber } from '@ethersproject/bignumber'
import { Claim } from '@generationsoftware/pt-v5-utils-js'

export interface TierPrizeAmounts {
  [tier: string]: BigNumber;
}

interface amountsAsString {
  [key: string]: string;
};

interface claimTiers {
  [key: string]: [];
};

interface ClaimWithAmount extends Claim {
  amount: string
}

export function sumPrizeAmounts(tierPrizeAmounts: TierPrizeAmounts): string {
  return Object.values(tierPrizeAmounts)
    .reduce((a, b) => a.add(b), BigNumber.from(0))
    .toString()
}

export function mapTierPrizeAmountsToString(tierPrizeAmounts: TierPrizeAmounts) {
  const obj: amountsAsString = {};
  
  for (const entry of Object.entries(tierPrizeAmounts)) {
    const [key, value] = entry;
    obj[key] = BigNumber.from(value).toString();
  }

  return obj;
};

export function addTierPrizeAmountsToClaims(claims: Claim[], tierPrizeAmounts: TierPrizeAmounts): ClaimWithAmount[] {
  const claimsByTier = groupByTier(claims, tierPrizeAmounts)
  const claimsWithAmounts:ClaimWithAmount[] = []

  const tierAmountPerPrize: amountsAsString = {};
  for (const tier of Object.keys(tierPrizeAmounts)) {
    tierAmountPerPrize[tier] = '0';
  }

  // I don't believe we want to divide the amount since the getTierPrizeSize is the
  // size of each prize, not the shared amount for the tier
  //
  // for (const tier of Object.entries(tierPrizeAmounts)) {
    // const [key, value] = tier
    // const numberOfPrizes = claimsByTier[key].length
    // if (numberOfPrizes > 0) {
    //   tierAmountPerPrize[key] = BigNumber.from(value).div(numberOfPrizes).toString()
    // }
  // }

  for (const claim of claims) {
    const claimWithAmount = { ...claim, amount: tierAmountPerPrize[claim.tier.toString()] }
    claimsWithAmounts.push(claimWithAmount)
  }

  return claimsWithAmounts
}

const groupByTier = (claims: any, tierPrizeAmounts: TierPrizeAmounts) =>{
  const initialClaims: claimTiers = {};
  for (const tier of Object.keys(tierPrizeAmounts)) {
    initialClaims[tier] = [];
  }

  return claims.reduce(function (accumulator: any, value: any) {
    accumulator[value.tier] = accumulator[value.tier] || [];
    accumulator[value.tier].push(value);
    return accumulator;
  }, initialClaims);
}
