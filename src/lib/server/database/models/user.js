import bcrypt from 'bcrypt';
import { Model } from 'sequelize';

import { PASSWORD_SALT_ROUNDS } from '$env/static/private';

const passwordSaltRounds = Number(PASSWORD_SALT_ROUNDS) || 10;

export default (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			models.User.hasMany(models.Content, {
				foreignKey: 'authorId',
			});
		}
		
		// Check if password is valid
		async authenticate(pass) {
			return await bcrypt.compare(pass, this.password);
		}
		// Check if given token is valid token
		async validateToken(token) {
			// TODO: Validate token expired
			return this.token && this.token === token;
		}
	}
	User.init({
		username: DataTypes.STRING(1023),
		displayName: DataTypes.STRING(1023),

		password: {
			type: DataTypes.STRING(1023),

			set(value) {
				this.setDataValue('password', bcrypt.hashSync(value, passwordSaltRounds));
			}
		},
		
		token: DataTypes.STRING(1023),
		tokenExpires: DataTypes.DATE,
	}, {
		sequelize,
		modelName: 'User',
		tableName: 'users',
		timestamps: false,
	});
	return User;
};