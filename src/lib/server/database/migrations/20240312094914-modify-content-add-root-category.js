'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    /**
     * Add root category field to content table. This field is used
     * to link content to system (root) categories
     */
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn('content', 'rootCategoryId', {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: 'rootCategories',
                key: 'id',
            }
        });
    },

    /**
     * Drop the rootCategory column
     */
    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn('content', 'rootCategoryId');
    }
};
