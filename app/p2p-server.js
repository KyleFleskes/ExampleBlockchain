/**
 *
 *	p2p-server.js
 *
 *	This file represent the p2pserver, giving its connectivity functions.
 *
 *	Author: Kyle Fleskes
 *	Lasted Updated: 4/27/20
 *
 */

const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
	chain: 'CHAIN',
	transaction: 'TRANSACTION',
	clear_transactions: 'CLEAR_TRANSACTIONS'
};


//$ HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

class P2pServer 
{
	/**
	 * A contrustor for the p2pserver connecting the 
	 * blockchain and transaction pool to it.
	 *
	 * param:
	 * 	blockchain - the blockchain associated w/ the p2pserver.
	 * 	transactionPool - the transaction pool associated w/ the p2pserver.
	 */
	constructor(blockchain, transactionPool)
	{
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.sockets = [];
	}
	
	/**
	 *
	 * Starts the server locally for user and connect to peers. 
	 * 
	 */
	listen()
	{
		//Starts the server/
		const server = new Websocket.Server({port: P2P_PORT});
		server.on('connection', socket => this.connectSocket(socket));
		
		//connects to peers.
		this.connectToPeers();

		console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
	}
	
	/**
	 * 
	 * Adds the local connection to the other users in p2pserver.
	 *
	 */
	connectToPeers()
	{	
		//for each peer adds the current connection to it.
		peers.forEach(peer => {
			// ws://localhost:5001
			const socket = new Websocket(peer);

			socket.on('open', () => this.connectSocket(socket));
		});
	}
	
	/**
	 * Adds user to the p2pserver.
	 *
	 * param:
	 * 	socket - the new socket to be connected to the p2pserver.
	 *
	 */
	connectSocket(socket)
	{
		this.sockets.push(socket);
		console.log('Socket connected');

		this.messageHandler(socket);

		this.sendChain(socket);
	}
	
	/**
	 *
	 * Handles the cases when other users send messages to their local p2pserver.
	 *
	 * param:
	 * 	socket - the socket sending the message. 
	 *
	 */
	messageHandler(socket) 
	{
    		socket.on('message', message => {
      		const data = JSON.parse(message);
      			switch(data.type) 
			{
				//when another user has a more updated chain.	
        			case MESSAGE_TYPES.chain:
          				this.blockchain.replaceChain(data.chain);
          				break;
				//when another user adds to the transaction pool.
        			case MESSAGE_TYPES.transaction:
          				this.transactionPool.updateOrAddTransaction(data.transaction);
          				break;
				//when another user clears the transaction pool(only happends when mine completes).
				case MESSAGE_TYPES.clear_transactions:
					this.transactionPool.clear();
					break;
      			}	
		});
	}
	
	/**
	 * 
	 * Sends your copy of the chain to other users in the p2pserver.
	 *
	 */
	sendChain(socket) 
	{
   		socket.send(JSON.stringify({ type: MESSAGE_TYPES.chain, chain: this.blockchain.chain }));
 	}
	
	/**
	 *
	 * Sends your copy of the transaction people to other users in the p2pserver.
	 *
	 */
	sendTransaction(socket, transaction) 
	{
   		socket.send(JSON.stringify({ type: MESSAGE_TYPES.transaction, transaction }));
 	}
	
	/**
	 * 
	 * Sends a copy of your blockchain to all users in p2pserver.
	 *
	 */
	syncChains()
	{
		this.sockets.forEach(socket => this.sendChain(socket));
	}
	
	/**
	 *
	 * Sends your transaction to each user in the p2pserver.
	 *
	 */
	broadcastTransaction(transaction) 
	{
  		this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
	}
	
	/**
	 * tells the other users to clear their transaction pool.
	 */
	broadcastClearTransactions() {
    		this.sockets.forEach(socket => socket.send(JSON.stringify({
      			type: MESSAGE_TYPES.clear_transactions
    		})));
  	}
}

module.exports = P2pServer;
