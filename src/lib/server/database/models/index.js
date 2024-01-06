import Sequelize from 'sequelize';

// Import all models
import setupUser from './user.js';
import setupOption from './option.js';
import setupContent from './content.js';

import * as env from '$env/static/private';

const configAll = {
    
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
        
        host: env.PROD_DB_HOST,
        port: env.PROD_DB_PORT,
        database: env.PROD_DB_NAME,
        username: env.PROD_DB_USERNAME,
        password: env.PROD_DB_PASSWORD,
    },
}

const config = configAll[env.NODE_ENV];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Initilize all models
const User = setupUser(sequelize, Sequelize.DataTypes);
const Option = setupOption(sequelize, Sequelize.DataTypes);
const Content = setupContent(sequelize, Sequelize.DataTypes);

// Export all models
export default {
    Sequelize, sequelize, User, Option, Content
}
