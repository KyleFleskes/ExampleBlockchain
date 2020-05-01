/**
 *	config.js
 *	
 *	Stores some global varriables for ease of use.
 *
 *	Author: Kyle Fleskes
 *	Lasted Updated: 4/27/20
 */

//how many leading zeros a hash values needs to be a valid hash.
const DIFFICULTY = 3;

//how often (in milliseconds) that blocks can be put on the blockchain. 
const MINE_RATE = 10000;

//how much every new user gets in currency to test the transaction pool.
const INITIAL_BALANCE = 500;

//how much a user gets for mining a transaction on the chain.
const MINING_REWARD = 50;

module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINING_REWARD };
