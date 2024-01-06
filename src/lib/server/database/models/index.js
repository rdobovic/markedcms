import Sequelize from 'sequelize';

// Import all models
import setupUser from './user.js';
import setupOption from './option.js';
import setupContent from './content.js';

import { env } from '$env/dynamic/private';
import { NODE_ENV } from '$env/static/private';

const configAll = (environment) => ({
    
    development: {
        dialect: 'mysql',

        host: env.DEV_DB_HOST,
        port: env.DEV_DB_PORT,
        database: env.DEV_DB_NAME,
        username: env.DEV_DB_USERNAME,
        password: env.DEV_DB_PASSWORD,
    },

    test: {
        dialect: 'mysql',
        
        host: env.TEST_DB_HOST,
        port: env.TEST_DB_PORT,
        database: env.TEST_DB_NAME,
        username: env.TEST_DB_USERNAME,
        password: env.TEST_DB_PASSWORD,
    },

    production: {
        dialect: 'mysql',
        logging: false,
        
        host: env.PROD_DB_HOST,
        port: env.PROD_DB_PORT,
        database: env.PROD_DB_NAME,
        username: env.PROD_DB_USERNAME,
        password: env.PROD_DB_PASSWORD,
    },

}[environment]);

const db = {};

export function init() {
    db.Sequelize = Sequelize;

    db.sequelize = new Sequelize(
        configAll(NODE_ENV).database, 
        configAll(NODE_ENV).username, 
        configAll(NODE_ENV).password,
        configAll(NODE_ENV)
    );

    db.User = setupUser(db.sequelize, Sequelize.DataTypes);
    db.Option = setupOption(db.sequelize, Sequelize.DataTypes);
    db.Content = setupContent(db.sequelize, Sequelize.DataTypes);

    db.User.associate(db);
    db.Option.associate(db);
    db.Content.associate(db);
}

// Export all models
export default db;
