/**
 *	Chain-util.js
 *
 * 	The ChainUtil class provides some static methods 
 * 	to provide hashing, user public keys 
 * 	and unique IDs for transactions.
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 4/27/20
 */
const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const { v1: uuidv1 } = require('uuid');
const ec = new EC('secp256k1');

class ChainUtil 
{
	/**
	 * Generates a public and private key pair that uniquely
	 * identifies users on the blockchain.
	 *
	 * return:
	 * 	the newly generated keypair.
	 */
	static genKeyPair()
	{
		return ec.genKeyPair();
	}
	
	/**
	 * Produces a unique transaction ID when user sends 
	 * currency to the transaction pool.
	 * 
	 * return:
	 * 	the newly generated transaction ID.
	 */
	static id()
	{
		return uuidv1();
	}
	
	/**
	 * Generates a hash using SHA256 based on the data held in the blockchain.
	 * 
	 * param:
	 * 	data - the data stored in the blockchain.
	 *
	 * return:
	 * 	the newly generated hash.
	 */
	static hash(data)
	{
		return SHA256(JSON.stringify(data)).toString();
	}
	
	/**
	 * Verifies that the signature of a user in the transaction pool.
	 *
	 * param:
	 * 	publicKey - a value which uniquely identifies a user on the blockchain.
	 * 	signature - a private value which proves the identity of the user.
	 * 	dataHash - the hash representation of data we want to varify
	 *
	 * return:
	 * 	TRUE - varified, FALSE - not varified.
	 */
	static verifySignature(publicKey, signature, dataHash)
	{
		return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
	}
}

module.exports = ChainUtil;
