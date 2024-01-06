'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('content', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			type: {
				allowNull: false,
				type: Sequelize.STRING
			},
			postType: {
				type: Sequelize.STRING
			},
			title: {
				allowNull: false,
				type: Sequelize.STRING
			},
			slug: {
				unique: true,
				allowNull: false,
				type: Sequelize.STRING
			},
			path: {
				unique: true,
				type: Sequelize.TEXT
			},
			authorId: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			display: {
				allowNull: false,
				defaultValue: false,
				type: Sequelize.BOOLEAN
			},
			displayPosts: {
				allowNull: false,
				defaultValue: false,
				type: Sequelize.BOOLEAN
			},
			treeLevel: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			parentId: {
				type: Sequelize.INTEGER
			},
			parentType: {
				type: Sequelize.STRING
			},
			orderField: {
				type: Sequelize.INTEGER
			},
			bodyA: {
				type: Sequelize.TEXT
			},
			bodyB: {
				type: Sequelize.TEXT
			},
			bodyAHtml: {
				type: Sequelize.TEXT
			},
			bodyBHtml: {
				type: Sequelize.TEXT
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('content');
	}
};