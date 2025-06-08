source .env
forge create --private-key $DEPLOYER_PRIVATE_KEY --rpc-url $MONAD_RPC  --broadcast src/AIScorer.sol:AIScorer