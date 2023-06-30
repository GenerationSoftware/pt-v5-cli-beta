import { BigNumber, ethers, Contract } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Command, Flags } from "@oclif/core";
import {
  downloadContractsBlob,
  getPrizePoolInfo,
  computeDrawWinners,
  Claim,
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
  TierPrizeAmounts,
} from "../../lib/utils/prizeAmounts";

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
    // Data Fetching && Compute
    /* -------------------------------------------------- */
    // Find out how much each tier won
    const contracts = await downloadContractsBlob(Number(chainId));
    const prizePoolInfo = await getPrizePoolInfo(readProvider, contracts);

    const tierPrizeAmounts: TierPrizeAmounts = {};
    Object.entries(prizePoolInfo.tierPrizeData).forEach(
      (tier) => (tierPrizeAmounts[tier[0]] = tier[1].amount)
    );

    const filterAutoClaimDisabled = false;
    const claims: Claim[] = await computeDrawWinners(
      readProvider,
      contracts,
      Number(chainId),
      filterAutoClaimDisabled
    );
    this.log(`${claims.length.toString()} prizes.`);

    const claimsWithPrizeAmounts = addTierPrizeAmountsToClaims(claims, tierPrizeAmounts);

    /* -------------------------------------------------- */
    // Write to Disk
    /* -------------------------------------------------- */
    writeToOutput(outDirWithSchema, "prizes", claimsWithPrizeAmounts);
    writePrizesToOutput(outDirWithSchema, claimsWithPrizeAmounts);

    const statusSuccess = updateStatusSuccess(DrawPrizes.statusLoading.createdAt, {
      numberOfTiers: prizePoolInfo.numberOfTiers,
      prizeLength: claims.length,
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
