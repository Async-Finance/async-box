# Setup
Create a file `.env`
```
SECRET_KEY=YOUR_WALLET_SECRET_KEY
```

# Compile
`npx hardhat compile`

# Test
TODO...

# Deploy
## Deploy AsyncBox.sol
Change the `owner` Param in `ignition/parameters.json`.
```
npx hardhat ignition deploy ignition/modules/AsyncBox.ts --network MerlinTestnet --parameters ignition/parameters.json --verify
```
## Deploy Claim.sol
Change the `token` Param in `ignition/parameters.json`. Should be the deployed AsyncBox token address.
```
npx hardhat ignition deploy ignition/modules/Claim.ts --network MerlinTestnet --parameters ignition/parameters.json --verify
```