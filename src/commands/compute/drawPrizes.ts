import { ethers, Contract } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Command, Flags } from "@oclif/core";
import {
  testnetContractsBlob as contracts,
  getSubgraphVaults,
  getWinnersClaims,
} from "@pooltogether/v5-utils-js";
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
       Running compute:drawPrizes on chainId: 1 for prizePool: 0x0 using latest drawID
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
    this.log(error, "_error drawPrizes");
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
    this.log("");
    this.log(
      `Running "calculate:prizes" on chainId: ${chainId} for prizePool: ${prizePool.toLowerCase()} using latest drawID`
    );

    const readProvider = getProvider(chainId);

    const prizePoolContract = getPrizePoolByAddress(Number(chainId), prizePool, readProvider);

    const drawId = await prizePoolContract?.getLastCompletedDrawId();
    this.log(`DrawID: #${drawId.toString()}`);

    /* -------------------------------------------------- */
    // Create Status File
    /* -------------------------------------------------- */
    const outDirWithSchema = createOutputPath(outDir, chainId, prizePool, drawId);
    writeToOutput(outDirWithSchema, "status", DrawPrizes.statusLoading);

    /* -------------------------------------------------- */
    // Data Fetching
    /* -------------------------------------------------- */
    // @ts-ignore
    const vaults = await getSubgraphVaults(chainId);
    if (vaults.length === 0) {
      throw new Error("No vaults found in subgraph");
    }
    this.log(`${vaults.length.toString()} vaults.`);

    /* -------------------------------------------------- */
    // Computation
    /* -------------------------------------------------- */
    const prizePoolData = await getPrizePoolData(prizePoolContract);

    const claims = await getWinnersClaims(
      readProvider,
      contracts,
      vaults,
      prizePoolData.tiers.rangeArray
    );
    this.log(`${claims.length.toString()} prizes.`);

    /* -------------------------------------------------- */
    // Write to Disk
    /* -------------------------------------------------- */
    // TODO: Verify schema:
    // !verifyAgainstSchema(claims) && this.error("Prizes DataStructure is not valid against schema");
    writeToOutput(outDirWithSchema, "prizes", claims);
    writePrizesToOutput(outDirWithSchema, claims);
    // TODO: Get amountsTotal working:
    const statusSuccess = updateStatusSuccess(DrawPrizes.statusLoading.createdAt, {
      prizeLength: claims.length,
      amountsTotal: "1234556",
      // amountsTotal: sumPrizeAmounts(_flatPrizes),
    });
    writeToOutput(outDirWithSchema, "status", statusSuccess);
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
