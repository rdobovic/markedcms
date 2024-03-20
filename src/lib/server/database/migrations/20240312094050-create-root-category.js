'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    /**
     * Create new rootCategories table, this table stores system categories
     * and their display location, these categories are not ment to be changed
     * by the users. Table is populated by the seeders.
     */
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('rootCategories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            displayName: {
                type: Sequelize.STRING
            },
            location: {
                type: Sequelize.STRING
            },
        });
    },

    /**
     * Drop the rootCategories table
     */
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('rootCategories');
    }
};