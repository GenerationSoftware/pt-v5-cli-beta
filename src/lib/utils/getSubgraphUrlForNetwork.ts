import {
  MAINNET_TWAB_SUBGRAPH_URL,
  GOERLI_TWAB_SUBGRAPH_URL,
} from '../constants'

function getSubgraphUrlForNetwork(chainId: string): string {
  switch (chainId) {
  case '1':
    return MAINNET_TWAB_SUBGRAPH_URL
  case '5':
    return GOERLI_TWAB_SUBGRAPH_URL
  default:
    throw new Error(`Unsupported network: ${chainId}`)
  }
}

export default getSubgraphUrlForNetwork
