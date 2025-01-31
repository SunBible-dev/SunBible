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
(deployed fine to tesnet)
```sh
npx web4-deploy BibleBase sunbible.testnet --nearfs
npx web4-deploy BibleBase sunbible.near --nearfs
```
- can be run with or without --nearfs

get ipf url from last command
```sh
near call <contract_id> <method_name> '{"url":"ipfs://bafybeig4p2xmu5or2irnyi6sjiir472busbswdegsk2jjyjnrmihle2rfe"}'

near call sunbible.testnet web4_setStaticUrl  '{"url":"ipfs://bafybeig4p2xmu5or2irnyi6sjiir472busbswdegsk2jjyjnrmihle2rfe"}' --use-account sunbible.testnet

near call sunbible.near web4_setStaticUrl  '{"url":"ipfs://bafybeig4p2xmu5or2irnyi6sjiir472busbswdegsk2jjyjnrmihle2rfe"}' --use-account sunbible.near
```


also locally with ipfs
```sh
ipfs add -r BibleBase
```

ipfs car, if running form my electron folder, does not work
```sh
ipfs-car pack ../BibleBase --output ipfs/sunbible.car
pnpm ipfs
npx web4-deploy ipfs/sunbible.car sunbible.near
pnpm web4
```

w3
```sh
w3 space info
w3 space list
w3 space change <space_id>
w3 up <file_path>
w3 space register <your_email>
w3 space create <space_name>
w3 ls
w3 rm <cid>
w3 space import <space_id>
```

```sh
w3 up BibleBase
```

last output
250 files 8.2MB
⁂ Stored 250 files
⁂ https://w3s.link/ipfs/bafybeibgupvrzloqo33spcby3jxdmntmghvgluldbk43slfvb55f3okcwi