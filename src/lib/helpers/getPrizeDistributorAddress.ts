// import {
//   MAINNET_USDC_PRIZE_DISTRIBUTOR_ADDRESS,
//   AVALANCHE_USDC_PRIZE_DISTRIBUTOR_ADDRESS,
//   POLYGON_USDC_PRIZE_DISTRIBUTOR_ADDRESS,
//   OPTIMISM_USDC_PRIZE_DISTRIBUTOR_ADDRESS,
//   MAINNET_USDC_TICKET_ADDRESS,
//   POLYGON_USDC_TICKET_ADDRESS,
//   AVALANCHE_USDC_TICKET_ADDRESS,
//   OPTIMISM_USDC_TICKET_ADDRESS,
//   GOERLI_USDC_TICKET_ADDRESS,
//   GOERLI_USDC_PRIZE_DISTRIBUTOR_ADDRESS,
//   OPTIMISM_GOERLI_USDC_TICKET_ADDRESS,
//   OPTIMISM_GOERLI_USDC_PRIZE_DISTRIBUTOR_ADDRESS,
//   ARBITRUM_GOERLI_USDC_TICKET_ADDRESS,
//   ARBITRUM_GOERLI_USDC_PRIZE_DISTRIBUTOR_ADDRESS,
// } from '../constants'

// function getPrizeDistributorAddress(chainId: string | number, ticket: string): string {
//   if (chainId === '1' && ticket === MAINNET_USDC_TICKET_ADDRESS) {
//     return MAINNET_USDC_PRIZE_DISTRIBUTOR_ADDRESS
//   }

//   if (chainId === '137' && ticket === POLYGON_USDC_TICKET_ADDRESS) {
//     return POLYGON_USDC_PRIZE_DISTRIBUTOR_ADDRESS
//   }

//   if (chainId === '43114' && ticket === AVALANCHE_USDC_TICKET_ADDRESS) {
//     return AVALANCHE_USDC_PRIZE_DISTRIBUTOR_ADDRESS
//   }

//   if (chainId === '10' && ticket === OPTIMISM_USDC_TICKET_ADDRESS) {
//     return OPTIMISM_USDC_PRIZE_DISTRIBUTOR_ADDRESS
//   }

//   if (chainId === '5' && ticket === GOERLI_USDC_TICKET_ADDRESS) {
//     return GOERLI_USDC_PRIZE_DISTRIBUTOR_ADDRESS
//   }

//   if (chainId === '420' && ticket === OPTIMISM_GOERLI_USDC_TICKET_ADDRESS) {
//     return OPTIMISM_GOERLI_USDC_PRIZE_DISTRIBUTOR_ADDRESS
//   }

//   if (chainId === '421613' && ticket === ARBITRUM_GOERLI_USDC_TICKET_ADDRESS) {
//     return ARBITRUM_GOERLI_USDC_PRIZE_DISTRIBUTOR_ADDRESS
//   }

//   throw new Error(
//     `prize distributor address not defined for chainId: ${chainId} and ticket: ${ticket}`,
//   )
// }

// export default getPrizeDistributorAddress
