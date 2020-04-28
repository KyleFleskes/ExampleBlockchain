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
	 *
	 * return:
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
	 * 	senderWallet -
	 * 	recipient -
	 * 	amount -
	 *
	 * return:
	 */
	static newTransaction(senderWallet, recipient, amount)
	{
		const transaction = new this();

		if(amount > senderWallet.balance)
		{
			console.log(`Amount : ${amount} exceeds balance.`);
			return;
		}

		return Transaction.transactionWithOutputs(senderWallet, [
		{ amount: senderWallet.balance - amount, address: senderWallet.publicKey },
		{ amount, address: recipient }	
		]);
	}
	
	/**
	 * param:
	 *
	 * return:
	 *
	 */
	static rewardTransaction(minerWallet, blockchainWallet)
	{
		return Transaction.transactionWithOutputs(blockchainWallet, [{
			amount: MINING_REWARD, address: minerWallet.publicKey
		}]);
	}
	
	/**
	 * param:
	 *
	 * return:
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
	 * param:
	 *
	 * return:
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
