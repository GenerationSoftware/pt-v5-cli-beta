import {TESTNET_ENV_CHAIN_IDS} from '../constants'

export const isTestnet = (chainId: string) => {
  return TESTNET_ENV_CHAIN_IDS.includes(chainId)
}
