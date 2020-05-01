/**
 *
 *
 *	data.js
 *
 *	This file represents what data is stored on the blockchain.
 *
 *	Author: Kyle Fleskes
 *	Last Updated: 5/1/20
 *
 *
 *
 */
class Data
{	
	/**
	 * The default constructore for the Data class.
	 * Sets value of data equal to params.
	 *
	 * param:
	 * 	name - name of user.
	 *
	 */
	constructor(name)
	{
		this.name = name;
	}
	
	//Prints all information held in data.
	toString()
	{
		return `Data - 
				Name:	${this.name}`;
	}
	
	/**
	 * getter method for name field.
	 */
	getName()
	{
		return this.name;
	}

	/**
	 * setter method for name field.
	 */
	setName(name)
	{
		this.name = name;
	}
}

module.exports = Data;
