"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("outlet", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
      },
      nama: {
        type: Sequelize.STRING(100),
      },
      alamat: {
        type: Sequelize.TEXT,
      },
      tlp: {
        type: Sequelize.STRING(15),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("outlet");
  },
};
