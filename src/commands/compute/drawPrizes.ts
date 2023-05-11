import { ethers, Contract } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Command, Flags } from "@oclif/core";
import { getContracts, testnetContractsBlob as contracts } from "@pooltogether/v5-utils-js";
// import { BigNumber } from "@ethersproject/bignumber";
// import { PrizeDistributor, PrizePool } from "@pooltogether/v4-client-js";
// import { mainnet, testnet } from "@pooltogether/v4-pool-data";
// import {
//   calculateUserBalanceFromAccount,
//   calculateNormalizedUserBalancesFromTotalSupply,
//   utils,
//   Account,
//   NormalizedUserBalance,
//   Prize,
//   UserBalance,
// } from "@pooltogether/v4-utils-js";

// import { getUserAccountsFromSubgraphForTicket } from "../../lib/network/getUserAccountsFromSubgraphForTicket";
// import { runCalculateDrawResultsWorker } from "../../lib/workers/createWorkers";

import { createStatus, updateStatusFailure, updateStatusSuccess } from "../../lib/utils/status";
// import { getContract } from "../../lib/utils/getContract";
import { getProvider } from "../../lib/utils/getProvider";
import { isTestnet } from "../../lib/utils/isTestnet";
import { createOutputPath } from "../../lib/utils/createOutputPath";
import { createExitCode } from "../../lib/utils/createExitCode";
import { writeToOutput, writePrizesToOutput } from "../../lib/utils/writeOutput";
import { verifyAgainstSchema } from "../../lib/utils/verifyAgainstSchema";
// import { sumPrizeAmounts } from "../../lib/utils";

interface TiersContext {
  numberOfTiers: number;
  rangeArray: number[];
}

/**
 * @name DrawPrizes
 */
export default class DrawPrizes extends Command {
  static description =
    "Computes the previous draw's prizes for a PrizePool to a target output directory.";
  static examples = [
    `$ ptv5 compute drawPrizes --chainId 1 --prizePool 0x0000000000000000000000000000000000000000 --outDir ./temp
       Running compute:drawPrizes on chainId: 1 for prizePool: 0x00 using latest drawID
  `,
  ];

  static flags = {
    chainId: Flags.string({
      char: "c",
      description: "ChainId (1 for Ethereum Mainnet, 80001 for Polygon Mumbai, etc...)",
      required: true,
    }),
    prizePool: Flags.string({
      char: "p",
      description: "PrizePool Address",
      required: true,
    }),
    outDir: Flags.string({
      char: "o",
      description: "Output Directory",
      required: true,
    }),
  };

  static args = [];
  static statusLoading = createStatus();

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async catch(error: any): Promise<any> {
    console.log(error, "_error drawPrizes");
    const { flags } = await this.parse(DrawPrizes);
    const { chainId, prizePool, outDir } = flags;
    // const prizeDistributorContract = getContract(chainId, "PrizeDistributor");
    this.warn("Failed to calculate Draw Prizes (" + error + ")");
    const statusFailure = updateStatusFailure(DrawPrizes.statusLoading.createdAt, error);

    // const outDirWithSchema = createOutputPath(outDir, chainId, prizePool.toLowerCase(), drawId);
    // writeToOutput(outDirWithSchema, "status", statusFailure);
    createExitCode(error, this);
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(DrawPrizes);
    const { chainId, prizePool, outDir } = flags;
    this.log(
      `Running "calculate:prizes" on chainId: ${chainId} for prizePool: ${prizePool} using latest drawID`
    );

    const readProvider = getProvider(chainId);

    const prizePoolContract = getPrizePoolByAddress(Number(chainId), prizePool, readProvider);

    const drawId = await prizePoolContract?.getLastCompletedDrawId();
    console.log(drawId);

    // const network = isTestnet(chainId) ? testnet : mainnet;
    // console.log({ network });

    // const drawId = getLastDrawId();

    /* -------------------------------------------------- */
    // Create Status File
    /* -------------------------------------------------- */
    // const ContractPrizePool = getContract(chainId, "YieldSourcePrizePool", isTestnet(chainId));
    // const ContractPrizeDistributor = getContract(chainId, "PrizeDistributor", isTestnet(chainId));
    // const outDirWithSchema = createOutputPath(outDir, chainId, prizePool, drawId);
    // writeToOutput(outDirWithSchema, "status", DrawPrizes.statusLoading);

    /* -------------------------------------------------- */
    // Data Fetching
    /* -------------------------------------------------- */
    // console.log(testnet, 'testnet')
    // @ts-ignore
    // const prizePoolContract = new PrizePool(
    //   ContractPrizePool,
    //   getProvider(chainId),
    //   network.contracts
    // );

    // console.log(prizePoolContract);
    // @ts-ignore
    // const prizeDistributor = new PrizeDistributor(
    //   ContractPrizeDistributor,
    //   getProvider(chainId),
    //   network.contracts
    // );
    // const ContractDrawBuffer = (await prizeDistributor.getDrawBufferContract()) as any;
    // const ContractPrizeDistributionsBuffer =
    //   (await prizeDistributor.getPrizeDistributionsBufferContract()) as any;
    // const ContractTicket = (await prizePool.getTicketContract()) as any;
    // const Draw = await ContractDrawBuffer.getDraw(drawId);
    // const PrizeDistribution = await ContractPrizeDistributionsBuffer.getPrizeDistribution(drawId);
    // const drawStartTimestamp = Draw.timestamp - PrizeDistribution.startTimestampOffset;
    // const drawEndTimestamp = Draw.timestamp - PrizeDistribution.endTimestampOffset;
    // const ticketTotalSupplies: BigNumber[] = await ContractTicket.getAverageTotalSuppliesBetween(
    //   [drawStartTimestamp],
    //   [drawEndTimestamp]
    // );
    // const userAccounts = await getUserAccountsFromSubgraphForTicket(
    //   chainId,
    //   ticket,
    //   drawStartTimestamp,
    //   drawEndTimestamp
    // );

    /* -------------------------------------------------- */
    // Computation
    /* -------------------------------------------------- */
    // const userBalances: any[] = userAccounts.map((account: Account) => {
    //   const balance = calculateUserBalanceFromAccount(
    //     account,
    //     drawStartTimestamp,
    //     drawEndTimestamp
    //   );
    //   if (!balance) {
    //     return;
    //   }

    //   return {
    //     balance,
    //     address: account.id,
    //   };
    // });
    // const filteredUserBalances: UserBalance[] =
    //   utils.filterUndefinedValues<UserBalance>(userBalances);
    // const normalizedUserBalances: NormalizedUserBalance[] =
    //   calculateNormalizedUserBalancesFromTotalSupply(filteredUserBalances, ticketTotalSupplies[0]);

    /* -------------------------------------------------- */
    // Compute Prizes & Write to Disk
    /* -------------------------------------------------- */
    /**
     * @TODO: Add error handling on an account level, so if a worker fails, we can still
     *        continue to the next account while catching the error for an individual account.
     */
    // const prizes: Prize[][] = await runCalculateDrawResultsWorker(
    //   normalizedUserBalances,
    //   PrizeDistribution,
    //   Draw
    // );
    // const _flatPrizes = prizes.flat(1);
    // const prizes: Prize[][] = [];
    // !verifyAgainstSchema(_flatPrizes) &&
    //   this.error("Prizes DataStructure is not valid against schema");
    // writeToOutput(outDirWithSchema, "prizes", _flatPrizes);
    // writePrizesToOutput(outDirWithSchema, prizes);
    // writePrizesToOutput(outDirWithSchema, prizes);
    // const statusSuccess = updateStatusSuccess(DrawPrizes.statusLoading.createdAt, {
    //   prizeLength: _flatPrizes.length,
    //   amountsTotal: sumPrizeAmounts(_flatPrizes),
    // });
    // writeToOutput(outDirWithSchema, "status", statusSuccess);
  }
}

/**
 * Gather information about the given prize pool's last drawId and tiers
 * @returns {Promise} Promise with drawId and tiers
 */
const getPrizePoolData = async (
  prizePool: Contract
): Promise<{ drawId: number; tiers: TiersContext }> => {
  const drawId = await prizePool.getLastCompletedDrawId();

  const numberOfTiers = await prizePool.numberOfTiers();
  const rangeArray = Array.from({ length: numberOfTiers + 1 }, (value, index) => index);
  const tiers: TiersContext = { numberOfTiers, rangeArray };

  return { drawId, tiers };
};

const getPrizePoolByAddress = (
  chainId: number,
  prizePool: string,
  readProvider: Provider
): Contract => {
  const prizePoolContractBlob = contracts.contracts.find(
    (contract) =>
      contract.chainId === Number(chainId) &&
      contract.type === "PrizePool" &&
      contract.address.toLowerCase() === prizePool.toLowerCase()
  );

  if (!prizePoolContractBlob) {
    throw new Error(
      `Multiple Contracts Unavailable: ${prizePool} on chainId: ${chainId} not found.`
    );
  }

  return new ethers.Contract(
    prizePoolContractBlob?.address,
    prizePoolContractBlob?.abi,
    readProvider
  );
};
