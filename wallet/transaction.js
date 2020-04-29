/**
 *	transaction.js
 *
 *	This file represents a individual transaction
 *	in the transaction pool. It also gives the transaction
 *	it's different functionality such as: creating signing, 
 *	updating, and verifying transactions.
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 4/28/20
 *
 */
const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction
{
	/**
	 * The default constructor for the Transaction class.
	 * creates an empty transaction by default.
	 */
	constructor()
	{
		this.id = ChainUtil.id();
		this.input = null;
		this.outputs = [];
	}
	
	/**
	 * To save time, if the two users already have a transaction in the transaction pool
	 * between them, use that transaction to create another one using their shared data.
	 *
	 * param:
	 * 	senderWallet - the user sending the transaction.
	 * 	recipient - the user recieving the transaction.
	 * 	amount - the amount of currency being sent between users.
	 *
	 * return:
	 * 	the newly created transaction.
	 */
	update(senderWallet, recipient, amount)
	{
		const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
		
		//if an invalid amount is being sent.
		if(amount > senderOutput.amount)
		{
			console.log(`Amount: ${amount} exceeds balance.`);
			return;
		}

		senderOutput.amount = senderOutput.amount - amount;
		this.outputs.push({amount, address: recipient});
		Transaction.signTransaction(this, senderWallet);

		return this;
	}
	
	/**
	 * Creates the proper outputs of the transaction to be stored
	 * so it can be printed later for the users. It stores the new balance, 
	 * the senderwallet public key and the recipient.
	 *
	 * param:
	 * 	senderWallet - the user sending the transaction.
	 * 	outputs - the display data on the transaction (new amount, sender's public key, and recipient).
	 *
	 * return:
	 * 	returns the new transaction with its outputs properly stored.
	 */
	static transactionWithOutputs(senderWallet, outputs)
	{
		const transaction = new this();

		transaction.outputs.push(...outputs);
		Transaction.signTransaction(transaction, senderWallet);

		return transaction;
	}
	
	/**
	 * Creates a new transaction of cryptocurrency between users.
	 *
	 * param:
	 * 	senderWallet - the user's wallet sending the transaction.
	 * 	recipient - the recipient's wallet.
	 * 	amount - the amount of currency being sent.
	 *
	 * return:
	 */
	static newTransaction(senderWallet, recipient, amount)
	{
		const transaction = new this();
		
		//if sending an invalid amount of currency.
		if(amount > senderWallet.balance)
		{
			console.log(`Amount : ${amount} exceeds balance.`);
			return;
		}
		
		//creates the new transaction with the proper outputs.
		return Transaction.transactionWithOutputs(senderWallet, [
		{ amount: senderWallet.balance - amount, address: senderWallet.publicKey },
		{ amount, address: recipient }	
		]);
	}
	
	/**
	 * 
	 * Rewards the miner's wallet with currency specificed by MINING_REWARD.
	 *
	 * param:
	 * 	minerWallet - the wallet of the miner receiving the reward.
	 * 	blockchainWallet - the special wallet which rewards miners.
	 *
	 * return:
	 * 	the new transaction which gives the miner a reward of currency.
	 *
	 */
	static rewardTransaction(minerWallet, blockchainWallet)
	{
		return Transaction.transactionWithOutputs(blockchainWallet, [{
			amount: MINING_REWARD, address: minerWallet.publicKey
		}]);
	}
	
	/**
	 *
	 * Imprints a indiviual transaction with the sender's information.
	 *
	 * param:
	 * 	transaction - the transaction to be signed.
	 * 	senderWallet - the wallet who will sign the transaction.
	 *
	 */
	static signTransaction(transaction, senderWallet)
	{
		transaction.input = {
			timestamp: Date.now(),
			amount: senderWallet.balance,
			address: senderWallet.publicKey,
			signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
		}
	}
	
	/**
	 * 
	 * Checks to see if this transaction has a proper signature.
	 *
	 * param:
	 * 	transaction - the transaction to be varified.
	 *
	 * return:
	 * 	TRUE - verified, FALSE - not verified.	
	 *
	 */
	static verifyTransaction(transaction)
	{
		return ChainUtil.verifySignature(
			transaction.input.address,
			transaction.input.signature,
			ChainUtil.hash(transaction.outputs)
		);
	}
}

module.exports = Transaction;
