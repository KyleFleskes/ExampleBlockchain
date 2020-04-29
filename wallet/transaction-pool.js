/**
 *
 *
 *	transaction-pool.js
 *
 *
 *	This file represents the transaction pool,
 *	in other words where all the transaction are stored
 *	before being added to the blockchain.
 *
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 4/28/20
 *
 *
 */
const Transaction = require('../wallet/transaction');

class TransactionPool
{
	/**
	 * The default constructor for the TransactionPool
	 * class. Creates a empty transaction pool.
	 *
	 */
	constructor ()
	{
		this.transactions = [];
	}
	
	/**
	 * Updates a already exisiting transaction
	 * or adds one if not already created.
	 *
	 * param:
	 * 	transaction - the new transaction to be added to the pool.
	 */
	updateOrAddTransaction(transaction)
	{
		let transactionWithId = this.transactions.find(t => t.id === transaction.id);
		
		//if the transaction already exists in the pool.
		if (transactionWithId)
		{
			this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
		}
		//if the transaction is not in the pool.
		else
		{
			this.transactions.push(transaction);
		}
	}
	
	/**
	 * Checks to see if transaction is already in the pool.
	 *
	 * param:
	 * 	address - the address of the transaction.
	 *
	 * return:
	 */
	existingTransaction(address)
	{
		return this.transactions.find(t => t.input.address === address);
	
	}
	
	/**
	 * 
	 * Checks to see if the transaction pool is valid.
	 *
	 * return:
	 * 	it returns the transaction pool if valid.
	 */
	validTransactions()
	{
		return this.transactions.filter(transaction => {
			
			//finds total amount of current in transaction
			const outputTotal = transaction.outputs.reduce((total, output) => {
				return total + output.amount;
			}, 0);

			if (transaction.input.amount !== outputTotal)
			{
				console.log(`Invalid transaction from ${transaction.input.address}.`);
				return;
			}

			if (!Transaction.verifyTransaction(transaction))
			{
				console.log(`Invalid signature from ${transaction.input.address}.`);
				return;
			}

			return transaction;
		});
	}
	
	/**
	 * This empties out the transaction pool.
	 */
	clear()
	{
		this.transactions = [];
	}
}

module.exports = TransactionPool;
