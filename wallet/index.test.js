/**
 *	index.test.js
 *	
 *	A tester file for the wallet class.
 *	Tests things like if it can create a wallet correctly,
 *	make transactions and if it can accurately calculate 
 *	the wallet's balance.
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 4/28/20
 *
 *
 */
const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
	let wallet, tp, bc;
	
	//create a new wallet, transaction pool, and blockchain before each test.
	beforeEach(() => {
		wallet = new Wallet();
		tp = new TransactionPool();
		bc = new Blockchain();
	});

	describe('creating a transaction', () => {
		let transaction, sendAmount, recipient;
		
		//creates a transaction before each test. 
		beforeEach(() => {
			sendAmount = 50;
			recipient = 'r4nd0m-4ddr355';
			transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
		});

		describe('and doing the same transaction', () => {
			
			//creates another transaction before each test
			//(now there are two transaction in the transaction pool).
			beforeEach(() => {
				wallet.createTransaction(recipient, sendAmount, bc, tp);
			});
			
			//makes sure that wallet balance is updated properly.
			it('double the `sendAmount` subtracted from the wallet balance', () => {
				expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
					.toEqual(wallet.balance - sendAmount * 2);
			});
			
			//makes sure recipient recieves same information as well.
			it('clones the `sendAmount` output for the recipient', () => {
				expect(transaction.outputs.filter(output => output.address === recipient)
					.map(output => output.amount)).toEqual([sendAmount, sendAmount]);
			});

		});
	});

	describe('calculating a balance', () => {
		
		let addBalance, repeatAdd, senderWallet;
		
		/**
		 * creates another wallet before each test.
		 * and makes a transaction pool for it with 
		 * some transactions in it, then adds it 
		 * to the blockchain.
		 */
		beforeEach(() => {
			senderWallet = new Wallet();
			addBalance = 100;
			repeatAdd = 3;
			
			for (let i=0; i<repeatAdd; i++)
			{
				senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
			}

			bc.addBlock(tp.transactions);
		});
		
		//makes sure user's wallet takes into account information on the blockchain for current balance.
		it('calculates the balance for blockchain transactions matching the recipient', () => {
			expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
		});
		
		//makes sure wallet sender's wallet properly takes into account the correct balance as well. 
		it('calculates the balance for blockchain transactions matchin the sender', () => {
			expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
		});
		
		describe('and the recipient conducts a transaction', () => {
			let subtractBalance, recipientBalance;
			
			//before each test clear the transaction pool and make another one.
			//Which is added to the blockchain.
			beforeEach(() => {
				tp.clear();
				subtractBalance = 60;
				recipientBalance = wallet.calculateBalance(bc);
				wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
				bc.addBlock(tp.transactions);
			});
			
			describe('and the sender sends another transaction to the recipient', () => {
				
				//tests to see if the user can add another transaction block to the blockchain.
				beforeEach(() => {
					tp.clear();
					senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
					bc.addBlock(tp.transactions);
				});
				
				//checks to see if wallet properly reads blokchain to calculate balance.
				it('calculates the recipient balance only using transaction since its most recent one', () => {
					expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
				});

			});
		});
	});

});
