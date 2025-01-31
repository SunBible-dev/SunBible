# Web4 Distribution


using https://github.com/vgrichina/web4-min-contract

first deploy web4-min-contract
```sh
near deploy sunbible.testnet web4-min.wasm
near deploy sunbible.near web4-min.wasm
```

near cli network
```sh
export NEAR_NETWORK=testnet
export NEAR_NETWORK=mainnet
echo $NEAR_NETWORK 
echo $NEAR_ENV
```

deploy
```sh
npx web4-deploy BibleBase sunbible.testnet
npx web4-deploy BibleBase sunbible.near
```