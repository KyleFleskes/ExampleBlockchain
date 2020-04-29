/**
 *
 *
 *	transaction-pool.test.js
 *
 *
 *	This is a tester file for the transaction-pool.js
 *	file.
 *
 *	Tests things like if transaction pool can be added to or updated,
 *	cleared, and if it can catch invalid transactions.
 *
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 2/28/20
 *
 *
 *
 */
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
	let tp, wallet, transaction, bc;
	
	//before each test set up a new transaction pool.
	beforeEach(() => {
		tp = new TransactionPool();
		wallet = new Wallet();
		bc = new Blockchain();
		transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);
	});
	
	//checks to see if a transaction can be properly added to.
	it('adds a transaction to the pool', () => {
		expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
	});
	
	//checks to see if an already exisiting transaction can be updated in the pool.
	it('updates a transaction in the pool', () => {
		const oldTransaction = JSON.stringify(transaction);
		const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
		tp.updateOrAddTransaction(newTransaction);

		expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
			.not.toEqual(oldTransaction);
	});
	
	//checks to see if transaction pool can be cleared.
	it('clears transactions', () => {
		tp.clear();
		expect(tp.transactions).toEqual([]);
	});

	describe('mixing valid and corrupt transactions', () => {
		let validTransactions;
		
		//before each test create a list of tranasaction where every odd transaction is invalid.
		beforeEach(() => {
			validTransactions = [...tp.transactions];

			for (let i=0; i<6; i++)
			{
				wallet = new Wallet();
				transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);

				if (i%2==0)
				{
					transaction.input.amount = 99999;
				}
				else
				{
					validTransactions.push(transaction);
				}
			}
		});
		
		//checks to see if transaction pool prevents invalid transactions from being added to the pool.
		it ('shows a difference between valid and corrupt transactions', () => {
			expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
		});
		
		//checks to see if transaction pool stores the valid transactions.
		it ('grabs valid transactions', () => {
			expect(tp.validTransactions()).toEqual(validTransactions);
		});
	});
});
