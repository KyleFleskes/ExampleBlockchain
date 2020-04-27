/**
 * 	miner.js
 *	
 *	Allows users to mine transactions on the transaction 
 *	pool adding the pool to the chain and being rewarded.
 *
 * 	Author: Kyle Fleskes
 * 	Last Updated: 4/27/20
 */
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner
{
	/**
	 * The constructor for the miner class.
	 *
	 * param:
	 * 	blockchain - the blockchain to be added to.
	 * 	transactionPool - the transactionpool to be added to chain.
	 * 	wallet - the wallet of the user mining the transaction pool.
	 * 	p2pServer - the p2pserver to connect to.
	 */
	constructor(blockchain, transactionPool, wallet, p2pServer)
	{
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pServer = p2pServer;
	}
	
	/**
	 * Goes through the process of adding the transaction pool 
	 * to the chain, if valid, then rewards the user.
	 *
	 * return:
	 * 	the newly created block of the mined transactions.
	 */
	mine()
	{
		const validTransactions = this.transactionPool.validTransactions();
    		
		//reward the miner for the valid transaction.
		validTransactions.push(
      			Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    		);

		//create a block consisting of the valid transactions.
    		const block = this.blockchain.addBlock(validTransactions);

		//synchronize the chains in the peer-to-peer server.
    		this.p2pServer.syncChains();
    		
		//clear the transaction pool.	
		this.transactionPool.clear();
    		
		//broadcast to every miner to clear their transaction pools.
		this.p2pServer.broadcastClearTransactions();

    		return block;
	}
}

module.exports = Miner;
