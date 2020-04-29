/**	
 * 	
 *
 * 	index.js
 *
 * 	This is the default file for the blockchain directory.
 * 	This represents the actual 'chain' in the blockchain, 
 * 	meaning that is this the struture for which 'blocks' 
 * 	are added, validated, and replaced if needed. 
 * 	
 * 	Author: Kyle Fleskes
 * 	Lasted Updated: 4/17/2020
 *
 */

const Block = require('./block');

class Blockchain 
{
	
	/*
	 * constructs a basic chain with nothing but a 3 gensis blocks.
	 */
	constructor()
    	{
        	this.chain = [Block.genesis()];
		//this.addBlock('genesis');
		//this.addBlock("genesis");
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
	
	/**
	 * isvalidChain looks through the provided blockchain and checks to 
	 * see if data is consistent and it is connected properly.
	 *
	 * param: 
	 * 	chain - the blockchain to be varified.
	 *
	 * return:
	 * 	true - the chain is valid.
	 * 	false - the isn't valid.
	 *
	 */
    	isValidChain(chain)
    	{	
		//if the first block in the chain isnt the genesis block.
        	if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            		return false;
        	
		//loop through the whole chain
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
	
	/**
	 * replaceChain decided whether or not to replace the current chain 
	 * with the new chain in the parameter.
	 *
	 * param:
	 * 	newChain - the new proposed chain. 
	 */
    	replaceChain(newChain)
    	{
		//if the provided chain is shorter than current chain.
        	if (newChain.length <= this.chain.length)
        	{
            		console.log('The received chain is not longer than the current chain.');
            		return;
        	}

		//if it is longer, but not valid.
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
