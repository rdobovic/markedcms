'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    
    async up (queryInterface, Sequelize) {
        /**
         * Insert default root categories
         */
        await queryInterface.bulkInsert('rootCategories', [
            {
                location: 'header',
                displayName: 'Header',
            },
            {
                location: 'sidebar',
                displayName: 'Sidebar',
            },
            {
                location: 'nowhere',
                displayName: 'Hidden',
            },
        ], {});
    },

    async down (queryInterface, Sequelize) {
        /**
         * Remove default root categories
         */
        await queryInterface.bulkDelete('rootCategories', {
            [Op.or]: [
                { location: 'header' },
                { location: 'sidebar' },
                { location: 'nowhere' },
            ]
        }, {});
    }
};
