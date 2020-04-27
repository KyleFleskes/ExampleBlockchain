Welcome to Our honey blockchain! This is a proof of concept implemenation
of a blockchain to track honey supplychains. Currently its is only a 
generic system, but more features are on the way!


____Contents of this Readme:____
1. Installation Guide
2. Usage guide



____Installation Guide:____

1. You will need some kind of **command line application**;
	I'd recommend **Iterm2** for MacOS, or **Git Bash** for Windows, 
	but any can work.

	Iterm2: https://www.iterm2.com/downloads.html

	Git Bash: https://git-scm.com/downloads

2. You might also need some kind of **code editor**;
	I use **Vim** :P but any can work.

	Vim: https://www.vim.org/download.php

3. You will need to install **NodeJS** to run this program.

	NodeJS: https://nodejs.org/en/download/

	You can varify that you have these installed by typing:
	
	node -v
	
	and
	
	npm -v

	into the command line to varify you have them installed.

4. You will need **Postman** to use the p2pserver functionality.
	
	PostMan: https://learning.postman.com/docs/postman/launching-postman/installation-and-updates/

5. You will need a number of **packages** for this program to work. 
	Luckily I have provided you with a script that installs all of them.
	They are here as listed(I have provided links for more information about them):

	1. nodemon - link: https://www.npmjs.com/package/nodemon
	2. crypto-js - link: https://www.npmjs.com/package/crypto-js
	3. express - link: https://www.npmjs.com/package/express
	4. jest - link: https://www.npmjs.com/package/jest
	5. body-parser - link: https://www.npmjs.com/package/body-parser
	6. ws - link: https://www.npmjs.com/package/ws
	7. elliptic - link: https://www.npmjs.com/package/elliptic
	8. uuid - link: https://www.npmjs.com/package/uuid
	
	To run the installation script type into the command line:

	npm run install

	Check if everything running properly type into the command line:

	npm run test

	You should see some tests run with 5 passing test suites with 31 passing individual tests.

	***if installion script didn't work please try installing the 
	packages manually using the following commands into the command line:

		npm init -y
		npm install nodemon --save-dev
		npm install crypto-js --save
		npm install jest --save-dev
		npm install express --save
		npm install body-parser --save
		npm install ws --save
		npm install elliptic --save
		npm install uuid --save


_____Usage Guide:______

1. To start the sever if you are the first user type:
	
	npm run start

	this defaults to HTTP_PORT=3001 and P2P_PORT=5001

   If you are connecting to an already exisiting p2p-server type:
   	
	HTTP_PORT=[insert your HTTP port # here] P2P_PORT=[insert your p2p port # here] PEERS=[insert peer's port # here] npm run dev

   	An example with one other peer:
		
		HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localHost:5001 npm run dev

	An example with two other peers:
		
		HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localHost:5001,ws://localHost:5002 npm run dev

   	Please note the spaces!!!!!

	Keep in mind this process of manually tpying in these commands quickly become unrealistic,
	this is a needed area of improvement.

2. Use PostMan of equivilent software to interaction with the p2p-server.

	List of commands:
		
		GET localhost:[HTTP_PORT #]/blocks
			
			Displays the blockchain on the p2pserver.
		
		GET localhost:[HTTP_PORT #]/transactions

			Displays the transactions in the transaction pool.

		GET localhost:[HTTP_PORT #]/mine-transactions
			
			Adds the transaction pool to the blockchain and clears the transaction pool.
		
		GET localhost:[HTTP_PORT #]/public-key
			
			Displays the public key of the HTTP port on the p2pserver.

		POST localhost:[HTTP_PORT #]/mine

			Adds a new block to the chain with the provided information.

			How to format data being added:
				
				make sure body of post request is RAW and JSON.
				
				Types data like so:

				{
					"data": "Yoo Hoo!"
				}
		
		POST localhost:[HTTP_PORT #]/transact

			Adds a new transaction to the transaction pool based on the information provided.

			How to format data being added:
				
				make sure body of post request is RAW and JSON.
				
				Types data like so:

				{
					"recipient": "[Insert recipient's public key]",
					"amount": 50
				}


