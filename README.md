<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />


# PoolTogether V5 CLI

The `@pooltogether/v5-cli` [node module package](https://www.npmjs.com/package/@pooltogether/v5-cli) is a NODE command line interface (CLI) to interact with the **PoolTogether V5 protocol**. The CLI uses the `v5-autotasks-library` modules to fetch and run calculations/computations for essential PoolTogether V5 tasks.

Primary CLI Commands (help)

```sh
npx @pooltogether/v5-cli help compute drawPrizes
npx @pooltogether/v5-cli help compute poolPrizes
npx @pooltogether/v5-cli help compute networkPrizes
```

# ⌨️ CLI Installation
<!-- usage -->
```sh-session
$ npm install -g @pooltogether/v5-cli
$ ptv5 COMMAND
running command...
$ ptv5 (--version)
@pooltogether/v5-cli/0.1.11-beta.1 darwin-arm64 node-v16.17.0
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

Computes single Draw prizes for a PrizePool to a target output directory.

Simply pass a `chainId`, `ticket` `drawId` and `outDir` to compute and locally save the results.

```
USAGE
  $ ptv5 compute drawPrizes --chainId 1 --drawId 65 --outDir ./temp --ticket '0xdd4d117723C257CEe402285D3aCF218E9A8236E1'

DESCRIPTION
  Computes single Draw prizes for a PrizePool to a target output directory.

EXAMPLES
  $ ptv5 compute drawPrizes --chainId 1 --drawId 1 --ticket 0x0000000000000000000000000000000000000000 --outDir ./temp
    Running compute:drawPrizes on chainId: 1 using drawID: 1
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


## Compute PrizePool Prizes

Computes all historical Draw prizes for a PrizePool to a target output directory.

```sh-session
ptv5 compute poolPrizes
```

```
USAGE
  $ ptv5 compute poolPrizes --chainId 1 --outDir ./temp --ticket '0xdd4d117723C257CEe402285D3aCF218E9A8236E1'

DESCRIPTION
  Computes all historical Draw prizes for a PrizePool to a target output directory.

EXAMPLES
  $ ptv5 compute poolPrizes --chainId 1 --ticket 0x0000000000000000000000000000000000000000 --outDir ./temp
    Running compute:drawPrizes on chainId: 1 using drawID: 1
```

## Compute Network of PrizePool Prizes

Computes Draw prizes for all PoolTogether V5 network PrizePools to a target output directory.

```sh-session
ptv5 compute networkPrizes
```

```
USAGE
  $ ptv5 compute networkPrizes --outDir ./temp

DESCRIPTION
  Computes Draw prizes for all PoolTogether V5 network PrizePools to a target output directory.

EXAMPLES
  $ ptv5 compute poolPrizes --chainId 1 --ticket 0x0000000000000000000000000000000000000000 --outDir ./temp
    Running compute:drawPrizes on chainId: 1 using drawID: 1
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
