/**
 *
 *
 *	transaction.test.js
 *
 *
 *	A tester file to see if a transaction works properly
 *	and interacts with a wallet correctly.
 *
 *	Tests things like if the file catches bad transaction,
 *	it if updates the balance of the wallet correctly, and 
 *	can it update a transaction properly.
 *
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 4/28/20
 *
 *
 *
 */
const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

describe('Transaction', () =>{
	let transaction, wallet, recipient, amount;
	
	//before each test create a new wallet 
	//and a transaction sending 50 to another wallet.
	beforeEach(() => {
		wallet = new Wallet();
		amount = 50;
		recipient = 'r3c1p13nt';
		transaction = Transaction.newTransaction(wallet, recipient, amount);
	});
	
	//checks to see if amount sent to recipient is removed from sender's wallet.
	it('outputs the `amount` substraction from the wallet balance', () =>{
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
	});
	
	//checks to see if amount sent to recipient is added to the recipient's wallet.
	it('outputs the `amount` added to the recipient', () =>{
		expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
	});
	
	//checks to see if transaction tracks expected result of transaction balance.
	it('inputs the balance of the wallet', () => {
		expect(transaction.input.amount).toEqual(wallet.balance);
	});
	
	//checks to see if transaction can validate a valid transaction.
	it('validates a valid transaction', () => {
		expect(Transaction.verifyTransaction(transaction)).toBe(true);
	});
	
	//checks to see if tranasction can invalidate a invalid transaction.
	it('invalidates a valid transaction', () => {
		transaction.outputs[0].amount = 50000;
		expect(Transaction.verifyTransaction(transaction)).toBe(false);
	});

	describe('transacting with an amount that exceeds the balance', () => {
		
		//before each test create a transaction that exceeds sender's balance.
		beforeEach(() => {
			amount = 50000;
			transaction = Transaction.newTransaction(wallet, recipient, amount);
		});
		
		//checks to see if transaction is properly invalidated.
		it('does not create the transaction', () =>{
			expect(transaction).toEqual(undefined);
		});

	});

	describe('and updating a transaction', () => {
		let nextAmount, nextRecipient;
		
		//before each test create another transaction sending 20 currency 
		//to another wallet.
		beforeEach(() => {
			nextAmount = 20;
			nextRecipient = 'n3xt-4ddr355';
			transaction = transaction.update(wallet, nextRecipient, nextAmount);
		});
		
		//checks to see if senders wallet takes into account all transaction for wallet balance.
		it(`substracts the next amount from the sender's output`, () => {
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
			.toEqual(wallet.balance - amount - nextAmount);
		});
		
		//checks to see if recipient proper received amount from sender wallet.
		it('outputs an amount from the next recipient', () => {
			expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
			.toEqual(nextAmount);
		});
	});

	describe('creating a reward transaction', () => {
		
		//before each test mine reward a user.
		beforeEach(() => {
			transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
		});
		
		//check to see if user's wallet properly received the reward.
		it(`reward the miner's wallet`, () => {
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
		});
	});
});
