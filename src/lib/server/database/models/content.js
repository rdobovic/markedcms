'use strict';

import { Model } from 'sequelize';
import { parse } from '$lib/markdown.js';
import { env } from '$env/dynamic/private';
import Sequelize from 'sequelize';
import htmlExcerp from '$lib/helpers/htmlExcerp';

export default (sequelize, DataTypes) => {
	class Content extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			models.Content.belongsTo(models.User, {
				foreignKey: 'authorId'
			});
			models.Content.hasMany(models.Content, {
				foreignKey: 'parentId'
			});
			models.Content.belongsTo(models.Content, {
				foreignKey: 'parentId'
			});
		}

		static async findAllHierarchy(options) {
			const instances = await this.findAll(options);

			const idMapping = instances.reduce((acc, el, i) => {
				acc[el.id] = i;
				return acc;
			}, {});

			const root = [];
			instances.forEach(el => {

				if (el.parentId === (options.treeRoot ?? null)) {
					root.push(el);
					return;
				}

				const parent = instances[idMapping[el.parentId]];
				if (!parent) return;
				
				parent.children = [...(parent.children || []), el];
			});

			return root;
		}

		async setParent(transaction, parentId = this.parentId) {
			const oldPath = this.path;
			const oldTreeLevel = this.treeLevel;

			if (parentId) {
				const parent = await Content.findByPk(parentId, { transaction: transaction });

				this.parentId = parent.id;
				this.treeLevel = parent.treeLevel + 1;
				this.parentType = parent.type;
				this.path = `${parent.path}/${this.slug}`;

			} else {
				this.parentId = null;
				this.treeLevel = 0;
				this.parentType = null;
				this.path = `/${this.slug}`;
			}

			// If this model is updated (not created)
			if (oldPath) {
				const treeDiff = this.treeLevel - oldTreeLevel;
				
				// Update path for all children
				await Content.update({
					path: sequelize.literal(`CONCAT(${sequelize.escape(this.path)}, SUBSTR(path, ${oldPath.length + 1}))`),
					treeLevel: sequelize.literal(`treeLevel ${ treeDiff < 0 ? '-' : '+' } ${sequelize.escape(treeDiff)}`),
				},{
					hooks: false,
					transaction: transaction,
					where: {
						path: {
							[Sequelize.Op.startsWith]: oldPath,
						}
					}
				});
			}
		}

		parseBodies() {
			this.bodyAHtml = this.bodyA ? parse(this.bodyA) : null;
			this.bodyBHtml = this.bodyB ? parse(this.bodyB) : null;

			if (this.postType === 'single') {
				this.bodyBHtml = htmlExcerp(
					this.bodyAHtml, 
					(Number(env.POST_EXCERP_LENGTH) || 200)
				);
			}
		}
	}
	Content.init({
		type: {
			allowNull: false,
			type: DataTypes.STRING
		},

		postType: DataTypes.STRING,

		title: {
			allowNull: false,
			type: DataTypes.STRING
		},
		
		slug: {
			unique: true,
			allowNull: false,
			type: DataTypes.STRING
		},

		path: {
			unique: true,
			type: DataTypes.TEXT,
		},

		authorId: {
			allowNull: false,
			type: DataTypes.INTEGER
		},

		display: {
			allowNull: false,
			defaultValue: false,
			type: DataTypes.BOOLEAN
		},

		displayPosts: {
			allowNull: false,
			defaultValue: false,
			type: DataTypes.BOOLEAN
		},

		treeLevel: {
			allowNull: false,
			defaultValue: 0,
			type: DataTypes.INTEGER,
		},

		parentId: DataTypes.INTEGER,
		parentType: DataTypes.STRING,
		orderField: DataTypes.INTEGER,

		bodyA: DataTypes.TEXT,
		bodyB: DataTypes.TEXT,
		bodyAHtml: DataTypes.TEXT,
		bodyBHtml: DataTypes.TEXT
	}, {
		sequelize,
		modelName: 'Content',
		tableName: 'content',

		hooks: {
			beforeCreate: async (content, options) => {
				await content.setParent(options.transaction);
				content.parseBodies();
			},
			beforeUpdate: async (content, options) => {
				await content.setParent(options.transaction);
				content.parseBodies();
			},
		}
	});
	return Content;
};