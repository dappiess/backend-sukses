"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("paket", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
      },
      id_outlet: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "outlet",
          key: "id",
        },
      },
      jenis: {
        type: Sequelize.ENUM("kiloan", "selimut", "bed_cover", "kaos", "lain"),
      },
      nama_paket: {
        type: Sequelize.STRING(100),
      },
      harga: {
        type: Sequelize.INTEGER(11),
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
    await queryInterface.dropTable("paket");
  },
};
