'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class rootCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.RootCategory.hasMany(models.Content, {
                foreignKey: 'rootCategoryId',
            });
        }
    }
    rootCategory.init({
        displayName: DataTypes.STRING,
        location: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'rootCategory',
        timestamps: false,
    });
    return rootCategory;
};