'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

    /**
     * Since content table stores both posts and categories it makes
     * no sense that column used for type of post or category is named
     * postType, so we renamed it to subType
     */
    async up (queryInterface, Sequelize) {
        await queryInterface.renameColumn('content', 'postType', 'subType');
    },

    /**
     * Reverse the rename action
     */
    async down (queryInterface, Sequelize) {
        await queryInterface.renameColumn('content', 'subType', 'postType');
    }
};
