'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {

	async up (queryInterface, Sequelize) {
		/**
		 * Create default admin user with password admin
		 */
		await queryInterface.bulkInsert('users', [{
			username: 'admin',
			displayName: 'Administrator',
			password: bcrypt.hashSync('admin', 10),
		}], {});
	},

	async down (queryInterface, Sequelize) {
		/**
		 * Remove default admin user
		 */
		await queryInterface.bulkDelete('users', { username: 'admin' }, {});
	}
};
