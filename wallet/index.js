const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet
{
	constructor() 
	{
    		this.balance = INITIAL_BALANCE;
    		this.keyPair = ChainUtil.genKeyPair();
    		this.publicKey = this.keyPair.getPublic().encode('hex');
  	}

	toString() 
	{
    		return `Wallet -
      		publicKey: ${this.publicKey.toString()}
      		balance  : ${this.balance}`
  	}

	sign(datahash)
	{
		return this.keyPair.sign(datahash);
	}

	createTransaction(recipient, amount, blockchain, transactionPool)
	{
		this.balance = this.calculateBalance(blockchain);

		if (amount > this.balance)
		{
			console.log(`Amount: ${amount} exceceds current balance: ${this.balance}`);
			return;
		}

		let transaction = transactionPool.existingTransaction(this.publicKey);

		if (transaction)
		{
			transaction.update(this, recipient, amount);
		}
		else
		{
			transaction = Transaction.newTransaction(this, recipient, amount);
			transactionPool.updateOrAddTransaction(transaction);
		}

		return transaction;
	}
	
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
	
	static blockchainWallet()
	{
		const blockchainWallet = new this();
		blockchainWallet.address = 'blockchain-wallet';
		return blockchainWallet;
	}
}

module.exports = Wallet;
