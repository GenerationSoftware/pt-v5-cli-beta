import { ethers, Contract } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Command, Flags } from "@oclif/core";
import {
  downloadContractsBlob,
  getSubgraphVaults,
  populateSubgraphVaultAccounts,
  getWinnersClaims,
  getTierPrizeAmounts,
} from "@pooltogether/v5-utils-js";
import * as core from "@actions/core";

import { createStatus, updateStatusFailure, updateStatusSuccess } from "../../lib/utils/status";
import { getProvider } from "../../lib/utils/getProvider";
import { createOutputPath } from "../../lib/utils/createOutputPath";
import { createExitCode } from "../../lib/utils/createExitCode";
import { writeToOutput, writePrizesToOutput } from "../../lib/utils/writeOutput";
import {
  sumPrizeAmounts,
  mapTierPrizeAmountsToString,
  addTierPrizeAmountsToClaims,
} from "../../lib/utils/prizeAmounts";
// import { verifyAgainstSchema } from "../../lib/utils/verifyAgainstSchema";

interface TiersContext {
  numberOfTiers: number;
  rangeArray: number[];
}

/**
 * @name DrawPrizes
 */
// @ts-ignore
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

  // TODO: Fix this so it makes sense with new v5:
  public async catch(error: any): Promise<any> {
    this.log(error, "_error drawPrizes");
    const { flags } = await this.parse(DrawPrizes);
    const { chainId, prizePool, outDir } = flags;

    const readProvider = getProvider(chainId);

    const prizePoolContract = await getPrizePoolByAddress(Number(chainId), prizePool, readProvider);

    const drawId = await prizePoolContract?.getLastCompletedDrawId();

    this.warn("Failed to calculate Draw Prizes (" + error + ")");
    const statusFailure = updateStatusFailure(DrawPrizes.statusLoading.createdAt, error);

    const outDirWithSchema = createOutputPath(outDir, chainId, prizePool.toLowerCase(), drawId);
    writeToOutput(outDirWithSchema, "status", statusFailure);
    createExitCode(error, this);

    core.setOutput("error", error);
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(DrawPrizes);
    const { chainId, prizePool, outDir } = flags;

    this.log("");
    this.log(
      `Running "calculate:prizes" on chainId: ${chainId} for prizePool: ${prizePool.toLowerCase()} using latest drawID`
    );

    const readProvider = getProvider(chainId);
    const prizePoolContract = await getPrizePoolByAddress(Number(chainId), prizePool, readProvider);
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
    const prizePoolData = await getPrizePoolData(prizePoolContract);

    // @ts-ignore
    let vaults = await getSubgraphVaults(chainId);
    if (vaults.length === 0) {
      throw new Error("No vaults found in subgraph");
    }
    this.log(`${vaults.length.toString()} vaults.`);

    // Page through and concat all accounts for all vaults
    vaults = await populateSubgraphVaultAccounts(Number(chainId), vaults);

    // Find out how much each tier won
    const contracts = await downloadContractsBlob(Number(chainId));
    const tiersRangeArray = prizePoolData.tiers.rangeArray;
    const tierPrizeAmounts = await getTierPrizeAmounts(readProvider, contracts, tiersRangeArray);

    /* -------------------------------------------------- */
    // Computation
    /* -------------------------------------------------- */
    const claims = await getWinnersClaims(readProvider, contracts, vaults, tiersRangeArray, {
      filterAutoClaimDisabled: false,
    });
    this.log(`${claims.length.toString()} prizes.`);

    const claimsWithPrizeAmounts = addTierPrizeAmountsToClaims(claims, tierPrizeAmounts);

    /* -------------------------------------------------- */
    // Write to Disk
    /* -------------------------------------------------- */
    // TODO: Verify schema:
    // TODO: Also, it would prob make sense to group claims by tier for prizes.json
    // !verifyAgainstSchema(claims) && this.error("Prizes DataStructure is not valid against schema");
    writeToOutput(outDirWithSchema, "prizes", claimsWithPrizeAmounts);
    writePrizesToOutput(outDirWithSchema, claimsWithPrizeAmounts);

    const statusSuccess = updateStatusSuccess(DrawPrizes.statusLoading.createdAt, {
      prizeLength: claimsWithPrizeAmounts.length,
      amountsTotal: sumPrizeAmounts(tierPrizeAmounts),
      tierPrizeAmounts: mapTierPrizeAmountsToString(tierPrizeAmounts),
    });
    writeToOutput(outDirWithSchema, "status", statusSuccess);

    /* -------------------------------------------------- */
    // GitHub Actions Output
    /* -------------------------------------------------- */
    core.setOutput("runStatus", "true");
    core.setOutput("drawId", drawId.toString());
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

const getPrizePoolByAddress = async (
  chainId: number,
  prizePool: string,
  readProvider: Provider
): Promise<Contract> => {
  const contracts = await downloadContractsBlob(Number(chainId));

  const prizePoolContractBlob = contracts.contracts.find(
    (contract: any) =>
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
