'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	
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

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('options');
	}
};