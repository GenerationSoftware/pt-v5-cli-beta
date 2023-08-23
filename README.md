<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />

# PoolTogether V5 CLI

The `@generationsoftware/pt-v5-cli` [node module package](https://www.npmjs.com/package/@generationsoftware/pt-v5-cli) is a NODE command line interface (CLI) to interact with the **PoolTogether V5 protocol**. The CLI uses the `v5-autotasks-library` modules to fetch and run calculations/computations for essential PoolTogether V5 tasks.

Primary CLI Commands (help)

```sh
npx @generationsoftware/pt-v5-cli help compute drawPrizes
```

# ⌨️ CLI Installation

<!-- usage -->
```sh-session
$ npm install -g @generationsoftware/pt-v5-cli
$ ptv5 COMMAND
running command...
$ ptv5 (--version)
@generationsoftware/pt-v5-cli/0.0.1-beta.41 darwin-arm64 node-v18.16.0
$ ptv5 --help [COMMAND]
USAGE
  $ ptv5 COMMAND
...
```
<!-- usagestop -->

# Commands

## Compute Draw Prizes

```sh-session
ptv5 compute drawPrizes
```

Computes the previous draw's prizes for a PrizePool to a target output directory.

Simply pass a `chainId`, `prizePool` and `outDir` to compute and locally save the results.

```
USAGE
  $ ptv5 compute drawPrizes --chainId 1 --outDir ./temp --prizePool '0xdd4d117723C257CEe402285D3aCF218E9A8236E1'

DESCRIPTION
  Computes the previous draw's prizes for a PrizePool to a target output directory.

EXAMPLES
  $ ptv5 compute drawPrizes --chainId 1 --prizePool 0x0000000000000000000000000000000000000000 --outDir ./temp
    Running compute:drawPrizes on chainId: 1
```

## Status File (status.json)

```json
{
  "status": "LOADING",
  "createdAt": "11"
}
```

### Success

```json
{
  "status": "SUCCESS",
  "createdAt": "11",
  "updatedAt": "33",
  "runtime": "22",
  "meta": {
    "prizeLength": "10",
    "amountsTotal": "5000000"
  }
}
```

### Failure

```json
{
  "status": "FAILURE",
  "createdAt": "11",
  "updatedAt": "33",
  "runtime": "22",
  "error": "ErrorCode"
}
```

## Help

```sh-session
ptv5 help [COMMAND]
```

Display help for ptv5.

```
USAGE
  $ ptv5 help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ptv5.
```

## Development

### Using the tool in dev

You can test the CLI while developing by using the following, with whichever chain / prizePool flags you want to test with:

```
./bin/run.js compute drawPrizes --chainId 80001 -o ./temp -p '0xA32C8f94191c9295634f0034eb2b0e2749e77974'
```
