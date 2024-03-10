'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	
	/**
	 * Create new options table used to store some global site settings
	 * like site title and site footer.
	 */
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('options', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			value: {
				type: Sequelize.TEXT
			}
		});
	},

	/**
	 * Drop the options table
	 */
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('options');
	}
};