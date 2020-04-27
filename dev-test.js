/**
 *	dev-test.js
 *
 *	A short tester file to see if blockchain 
 *	properly generates a wallet.
 *
 *	Author: Kyle Fleskes
 *	Lasted Update: 4/27/20
 */
const Wallet = require('./wallet');
const wallet = new Wallet();

//creates a wallet and prints it's contents 
//to the console.
console.log(wallet.toString());
