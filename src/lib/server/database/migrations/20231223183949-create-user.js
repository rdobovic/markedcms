'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

	/**
	 * Create new users table, this table is used to store list of all
	 * admin user accounts. Those accounts are used to access admin panel
	 * and edit the site content.
	 */
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			username: {
				type: Sequelize.STRING(1023)
			},
			displayName: {
				type: Sequelize.STRING(1023)
			},
			password: {
				type: Sequelize.STRING(1023)
			},
			token: {
				type: Sequelize.STRING(1023)
			},
			tokenExpires: {
				type: Sequelize.DATE
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	}
};