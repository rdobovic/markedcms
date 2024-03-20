'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	
	/**
	 * Create new content table, this table is used to store posts and
	 * categories created by the user, which is basically all the content
	 * on the site
	 */
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
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				}
			},
			display: {
				allowNull: false,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
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
				type: Sequelize.INTEGER,
				references: {
					model: 'content',
					key: 'id',
				}
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

	/**
	 * Drop the content table
	 */
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('content');
	}
};