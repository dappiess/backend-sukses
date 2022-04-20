"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaksi", {
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
      kode_invoice: {
        type: Sequelize.STRING(100),
      },
      id_member: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "member",
          key: "id",
        },
      },
      tgl: {
        type: Sequelize.DATE,
      },
      batas_waktu: {
        type: Sequelize.DATE,
      },
      tgl_bayar: {
        type: Sequelize.DATE,
      },
      biaya_tambahan: {
        type: Sequelize.INTEGER(11),
      },
      diskon: {
        type: Sequelize.DOUBLE,
      },
      pajak: {
        type: Sequelize.INTEGER(11),
      },
      status: {
        type: Sequelize.ENUM("baru", "proses", "selesai", "diambil"),
      },
      dibayar: {
        type: Sequelize.ENUM("dibayar", "belum_dibayar"),
      },
      id_user: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "user",
          key: "id",
        },
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
    await queryInterface.dropTable("transaksi");
  },
};
