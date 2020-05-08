/**
 *
 *	block.js
 *
 *	This file represents a single block in a blockchain.
 *	block.js handles things like creating blocks, printing their information,
 *	making sure blocks are added around the desired MINE_RATE.
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 4/17/2020
 *
 *
 *
 */

const ChainUtil = require('../chain-util'); //needed for creating a proper hash for the blocks.
const {DIFFICULTY, MINE_RATE} = require('../config'); //needed for receiving global varriables in config.js

class Block 
{
	

	/**
	 * 
	 * creates a single block based off of data provided 
	 * and if difficulty mentioned or not.
	 *
	 * param:
	 * 	timeStamp - the time when this block was created.
	 * 	lastHash - the hash value of the last block in the chain.
	 * 	hash - the hash value of the current block in the chain.
	 * 	data - the data being stored in the block.
	 * 	nonce - the amount of iterations need to create a proper 
	 * 		hash value for current block.
	 * 	difficulty - the number of leading zeros the hash value 
	 * 		must have inorder to be valid.
	 *
	 */
    	constructor(timeStamp, lastHash, hash, name, profilePic, nonce, difficulty)
    	{
        	
		this.name = name;
		this.profilePic = profilePic;
		this.timeStamp = timeStamp;
        	this.lastHash = lastHash;
        	this.hash = hash;
		this.nonce = nonce;
		this.difficulty = difficulty || DIFFICULTY;
	}

	/**
	 * 
	 * Prints all data held in current block.
	 *
	 */
    	toString()
    	{
        	return `Block -
    		Timestamp:   ${this.timeStamp}
    		Last Hash:   ${this.lastHash.substring(0, 10)}
    		Hash:        ${this.hash.substring(0, 10)}
    		Nonce:       ${this.nonce}
    		Difficulty:  ${this.difficulty}
    		Name:        ${this.name}
		Profile Pic: ${this.profilePic}`;
    	}
	
	/**
	 *
	 * creates a genesis block.
	 *
	 * return:
	 *	the newly created genesis block.
	 *
	 */
    	static genesis()
    	{
        	return new this('Genesis time', '------', 'f1r57-h45h', [], [], 0, DIFFICULTY);
    	}
	
	/**
	 * mineBlock goes through the process of creating a proper block.
	 *
	 * param:
	 * 	lastBlock - the last block in the chain.
	 * 	data - the data to be added to the chain.
	 *
	 * return:
	 * 	the newly created block.
	 *
	 */
    	static mineBlock(lastBlock, name, profilePic)
    	{
		let hash, timeStamp;
        	const lastHash = lastBlock.hash;
		let { difficulty } = lastBlock;
       		let nonce = 0;
		
		//loop until hash has number of leading zeros specified by difficulty of last block.
		do
		{
			nonce++;
		
			timeStamp = Date.now();

			difficulty = Block.adjustDifficulty(lastBlock, timeStamp);

			hash = Block.hash(timeStamp, lastHash, name, profilePic, nonce, difficulty);

		} while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

		return new this(timeStamp, lastHash, hash, name, profilePic, nonce, difficulty);
    	}	
	
	/**
	 * hash uses the provided information to call the hash function in the ChainUtil class.
	 * 
	 * param:
	 *	timeStamp - the time when this block was created.
	 * 	lastHash - the hash value of the last block in the chain.
	 * 	hash - the hash value of the current block in the chain.
	 * 	data - the data being stored in the block.
	 * 	nonce - the amount of iterations need to create a proper 
	 * 		hash value for current block.
	 * 	difficulty - the number of leading zeros the hash value 
	 * 		must have inorder to be valid.
	 * 
	 * return:
	 * 	the hash value based on the provided information.
	 *
	 */
    	static hash(timeStamp, lastHash, name, profilePic, nonce, difficulty)
    	{
        	//console.log(`\n${JSON.stringify(profilePic)}\n`);
		return ChainUtil.hash(`${timeStamp}${lastHash}${name}${JSON.stringify(profilePic)}${nonce}${difficulty}`).toString();
    	}
	
	/**
	 *
	 * blockHash creates a hash valued based on the block provied.
	 *
	 * param:
	 *	block - the block who hash will be calculated.
	 *
	 * return:
	 * 	the newly calculated hash value.
	 *
	 */
	static blockHash(block)
    	{
        	const {timeStamp, lastHash, name, profilePic, nonce, difficulty} = block;
        	return Block.hash(timeStamp, lastHash, name, profilePic, nonce, difficulty);
    	}	
	
	/**
	 *
	 * adjustDifficulty dynamicly changes who hard it is to create 
	 * a proper hash value based on the amount of time it has taken 
	 * to mine current block.
	 * 
	 * param:
	 *	lastBlock - the last block in the chain.
	 *	currentTime - the current time in milliseconds.
	 *
	 * return:
	 *	the newly adjusted difficulty.
	 *
	 *
	 */
	static adjustDifficulty(lastBlock, currentTime)
    	{
		let { difficulty } = lastBlock;

		//if the block is taking less or more time than last block to mine, adjust difficulty by +/-1, respectively.
		difficulty = lastBlock.timeStamp + MINE_RATE > currentTime ? 
			difficulty + 1 : difficulty - 1;
		
		//difficulty can't be 0.
		difficulty = (difficulty == 0) ?
			1 : difficulty;

		return difficulty;
    	}
}

module.exports = Block;
