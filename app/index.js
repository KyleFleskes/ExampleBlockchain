/**
 *	index.js
 *	
 *	Provides the p2pserver with a series of commands 
 *	to interact with the blockchain and transaction pool.
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 4/27/20
 */

const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

// $ HTTP_PORT = 3002 npm run dev


const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

//the command for printing out the blockchain to the console.
app.get('/blocks', (req, res) => {
    res.json(bc.chain);    
});

//the command for adding blocks to the blockchain.
app.post('/mine', (req, res) => {
	const block = bc.addBlock(req.body.data);
	console.log(`New block added ${block.toString()}`);

	p2pServer.syncChains();

	res.redirect('/blocks');
});

//the command for printing out the transactions in the transaction pool.
app.get('/transactions', (req, res) => {
  	res.json(tp.transactions);
});

//the command for adding a transaction to the transaction pool.
app.post('/transact', (req, res) => {
	const { recipient, amount } = req.body;
	const transaction = wallet.createTransaction(recipient, amount, bc, tp);
	p2pServer.broadcastTransaction(transaction);	
	res.redirect('/transactions');
});

//the command for adding the transaction pool to the blockchain.
app.get('/mine-transactions', (req, res) => {
	const block = miner.mine();
	console.log(`New Block added: ${block.toString()}`);
	res.redirect('/blocks');
});

//the command for receive a public key for a user.
app.get('/public-key', (req, res) => {
	res.json({ publicKey: wallet.publicKey });
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
