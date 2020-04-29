/**
 *
 *	index.js
 *
 *	This is the default file for the wallet directory.
 *	Represents a user's cryptocurrency wallet.
 *
 *
 *	Author: Kyle Fleskes
 *	Lasted Updated: 4/28/20
 *
 *
 */
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet
{
	/**
	 *
	 * The default constructor for the wallet class.
	 * Sets the starting balance based off of a global variable
	 * defined in ../config.js and creates the public key and a key pair.
	 *
	 */
	constructor() 
	{
    		this.balance = INITIAL_BALANCE;
    		this.keyPair = ChainUtil.genKeyPair();
    		this.publicKey = this.keyPair.getPublic().encode('hex');
  	}
	
	/**
	 * Displays non-sensitive data in current wallet.
	 */
	toString() 
	{
    		return `Wallet -
      		publicKey: ${this.publicKey.toString()}
      		balance  : ${this.balance}`
  	}
	
	/**
	 * Signs a transaction with a private squenqence of 
	 * characters that can identify the user signing it.
	 * 
	 * param:
	 * 	datahash - the hash value of the transaction. 
	 *
	 * return:
	 * 	the signature for this transaction.
	 */
	sign(datahash)
	{
		return this.keyPair.sign(datahash);
	}
	
	/**
	 * Creates or updates a transaction to the transaction pool.
	 *
	 * param:
	 * 	recipient - the user recieving the transaction.
	 * 	amount - the amount of currency being sent
	 * 	blockchain - the shared referenced blockchain.
	 * 	transactionPool - the shared referenced transaction pool.
	 *
	 * return:
	 * 	return the newly created transaction, if any.
	 */
	createTransaction(recipient, amount, blockchain, transactionPool)
	{
		this.balance = this.calculateBalance(blockchain);
		
		//if user sents an invalid amount.
		if (amount > this.balance)
		{
			console.log(`Amount: ${amount} exceceds current balance: ${this.balance}`);
			return;
		}

		let transaction = transactionPool.existingTransaction(this.publicKey);
		
		//if transaction has already been started between the two users add to it.
		if (transaction)
		{
			transaction.update(this, recipient, amount);
		}
		
		//create a new transaction if there is none already.
		else
		{
			transaction = Transaction.newTransaction(this, recipient, amount);
			transactionPool.updateOrAddTransaction(transaction);
		}

		return transaction;
	}
	
	/**
	 * 
	 * Calculates the current balance of the user based on the transactions on the blockchain.
	 *
	 *
	 * param:
	 * 	blockchain - the central blockchain on the p2pserver.
	 *
	 * return:
	 * 	returns the current balance of the user.
	 *
	 */
	calculateBalance(blockchain)
	{
		let balance = this.balance;
		let transactions = [];
		
		//look at each transaction in every block on the blockchain and store them in transactions.
		blockchain.chain.forEach(block => block.data.forEach(transaction => {
			transactions.push(transaction);
		}));
		
		//filter out all transactions not relating to wallet.
		const walletInputTs = transactions
			.filter(transaction => transaction.input.address === this.publicKey);
		
		let startTime = 0;

		//if there are any relevent transaction to this wallet.
		if (walletInputTs.length > 0)
		{

			//get the most recent transaction for this wallet.
			const recentInputT = walletInputTs.reduce(
				(prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
			);
			
			//the current balance last recorded on the blockchain.
			balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
			
			startTime = recentInputT.input.timestamp;
		}
		
		//add together all transaction amounts after last recorded transaction on blockchain.
		transactions.forEach(transaction => {
			
			//if transaction comes after last recorded transaction on blockchain
			if (transaction.input.timestamp > startTime)
			{
				transaction.outputs.find(output => {

					//if transaction amount goes to this current wallet, adds its amount to it.
					if (output.address === this.publicKey)
					{
						balance += output.amount;
					}
				});
			}
		});

		return balance;
	}
	
	/**
	 * A static method that creates the wallet which rewards user's 
	 * when they mine the tranaction pool.
	 *
	 * return:
	 *	the instance of the newly created wallet.
	 */
	static blockchainWallet()
	{
		const blockchainWallet = new this();
		blockchainWallet.address = 'blockchain-wallet';
		return blockchainWallet;
	}
}

module.exports = Wallet;
