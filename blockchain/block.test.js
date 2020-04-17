/**
 *
 *	block.test.js
 *
 *	This file is a test file for the block class.
 *	It tests functionality such as it properly
 *	recording data and lasthash, also that the 
 *	hash properly adjusted difficulty based on 
 *	if it was too easy or hard.
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 4/17/2020
 *
 *
 *
 */

const Block = require('./block');

describe('Block', () => {
    	let data, lastBlock, block;
	
	//before each test create a block chain with a genesis 
	//block and a single block that stores 'bar' in it.
    	beforeEach(() => {
        	data = 'bar';
        	lastBlock = Block.genesis();
        	block = Block.mineBlock(lastBlock, data);
    	});
	
	//varifies that data is properly set.
    	it('sets the `data` to match the input', () => {
        	expect(block.data).toEqual(data);    
    	});
    	
	//varifies that lasthash is properly set.
    	it('sets the `lastHash` to match the hash of the last block', () => {
        	expect(block.lastHash).toEqual(lastBlock.hash);    
    	});
	
	//varifies that hash follows the proper difficulty.
    	it('generates a hash that matches the difficulty', () => {
		expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
		console.log(block.toString());
    	});
	
	//varifies that the difficulty is reduced if mined too slowly.
	it('lowers the difficulty for the slowly mined blocks', () => {
		expect(Block.adjustDifficulty(block, block.timeStamp+360000)).toEqual(block.difficulty-1);
	});
	
	//varifies that the difficulty is increased if mined too quickly.
	it('raises the difficulty for the quickly mined blocks', () => {
		expect(Block.adjustDifficulty(block, block.timeStamp+1)).toEqual(block.difficulty+1);
	});

});
