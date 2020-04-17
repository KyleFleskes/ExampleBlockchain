/**
 *
 *
 *	index.test.js
 *
 *	a test file for the index.js file. it tests 
 *	functionality such as can it create a chain,
 *	add blocks, and is it valid.
 *
 *	Author: Kyle Fleskes
 *
 *	Last Updated: 4/17/2020
 *
 *
 */
const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
	let bc, bc2;
    	
	//before each test create two blockchain with just a genesis block.
    	beforeEach(() => {
        	bc = new Blockchain();
        	bc2 = new Blockchain();    
    	});
	
	//checks to see if the genesis is created properly.
    	it('starts with genesis block', () => {
            	expect(bc.chain[0]).toEqual(Block.genesis());
    	});
	
	//checks to see if adding a new block works.
    	it('adds a new block', () => {
        	const data = 'foo';
        	bc.addBlock(data);
        
        	expect(bc.chain[bc.chain.length-1].data).toEqual(data);    
    	});
	
	//checks to see if isValidChain validates a proper chain.
    	it('validates a valid chain', () => {
        	bc2.addBlock('foo');

        	expect(bc.isValidChain(bc2.chain)).toBe(true);
    	});
	
	//checks to see if isValidChain invalidates a malicious genesis block.
    	it('invalidates a chain with a corrupt genesis block', () => {
       		bc2.chain[0].data = 'Bata data';
       
       		expect(bc.isValidChain(bc2.chain)).toBe(false); 
    	});
		
	//checks to see if isValidChain invalidates a malicious added block.
    	it('invalidates a corrupt chain', () =>{
        	bc2.addBlock('foo');
        	bc2.chain[1].data = 'Not foo';
        
        	expect(bc.isValidChain(bc2.chain)).toBe(false);    
    	});
	
	//checks to see if replaceChain properly replaces the chain with the one provided.
    	it('replaces the chain with a valid chain', () =>{
        	bc2.addBlock('goo');
        	bc.replaceChain(bc2.chain);

       		expect(bc.chain).toEqual(bc2.chain);
    	});
	
	//checks to see if replaceChain rejects chains that are too short.
    	it('does not replace the chain with one of less than or equal to length', () =>{
        	bc.addBlock('foo');
        	bc.replaceChain(bc2.chain);

        	expect(bc.chain).not.toEqual(bc2.chain);
    	});
});
