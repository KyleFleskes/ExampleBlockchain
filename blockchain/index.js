/**	
 * 	index.js
 *
 * 	This is the default file for the blockchain directory.
 * 	This represents the actual 'chain' in the blockchain, 
 * 	meaning that is this the struture for which 'blocks' 
 * 	are added, validated, and replaced if needed. 
 * 	
 *	Author: Kyle Fleskes
 *	Lasted Updated: 4/9/2020
 *
 */

const Block = require('./block');

class Blockchain 
{
	
	/*
	 * constructs a basic chain with nothing but a single gensis block.
	 */
	constructor()
    	{
        	this.chain = [Block.genesis()];
    	}
	
	/*
	 * addBlock creates a new block using the 'data' parameter 
	 * and adds this newly created block to the end of the chain.
	 *
	 * param: 
	 * 	data - new piece of information to be added to the chain.
	 *
	 * return:
	 * 	returns the newly added block.
	 */
    	addBlock(data)
    	{
        	const block = Block.mineBlock(this.chain[this.chain.length-1], data);
        	this.chain.push(block);

        	return block;
    	}

    	isValidChain(chain)
    	{	
        	if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            		return false;
        
        	for (let i = 1; i < chain.length; i++)
        	{
            		const block = chain[i];
            		const lastBlock = chain[i - 1];
            
            		//if not properly chained, or the current hash isn't correct.
            		if (block.lastHash !== lastBlock.hash ||
                		block.hash !== Block.blockHash(block))
			{
				return false;
			}
        	}

        	return true;
	}

    	replaceChain(newChain)
    	{
        	if (newChain.length <= this.chain.length)
        	{
            		console.log('The received chain is not longer than the current chain.');
            		return;
        	}
        	else if (!this.isValidChain(newChain))
        	{
            		console.log('The received chain is not valid.');
            		return;
        	}

        	console.log('Replacing blockchain with the new chain.');
        	this.chain = newChain;
    }
}

module.exports = Blockchain;
