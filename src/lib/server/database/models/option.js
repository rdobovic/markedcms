'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
	class Option extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Option.init({
		name: DataTypes.STRING,
		value: {
			type: DataTypes.TEXT,

			get() {
				return JSON.parse(this.getDataValue('value'));
			},

			set(value) {
				this.setDataValue('value', JSON.stringify(value));
			},
		},
	}, {
		sequelize,
		modelName: 'Option',
		tableName: 'options',
		timestamps: false
	});
	return Option;
};