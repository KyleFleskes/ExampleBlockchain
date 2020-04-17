Welcome to Our honey blockchain! There are a few things you 
need before we get started:

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

	You should see some tests run with 5 passing test suites with 31 passing indivual tests.

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
