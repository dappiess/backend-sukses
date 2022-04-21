const express = require("express");
const app = express();
const models = require("../models/index");
const transaksi = models.transaksi;
const detail_transaksi = models.detail_transaksi;
const Paket = models.paket;
const { auth } = require("../auth");

app.use(auth);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  await detail_transaksi.findAll({
      include: [
        {
          model: models.transaksi, as:"transaksi",
          include: [
            { model: models.outlet, as: "outlet" },
            { model: models.member, as: "member" },
            {
              model: models.user, as: "user",
              attribues: ["id", "name", "username", "id_outlet", "role"],
              include: {
                model: models.outlet, as: "outlet",
              },
            },
          ],
        },
        { model: models.paket, as: "paket" },
      ],
    })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.get("/:id", async (req, res) => {
  transaksi
    .findOne({ where: { id: req.params.id } })
    .then((transaksi) => {
      res.json(transaksi);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
});

app.post("/", async (req, res) => {
  let invoice = `LAUNDRY${Date.now()}`;
  let batas = new Date().setDate(new Date().getDate() + 7);
  let newTransaksi = {
    id_outlet: req.body.id_outlet,
    kode_invoice: invoice,
    id_member: req.body.id_member,
    tgl: Date.now(),
    batas_waktu: batas,
    diskon: req.body.diskon,
    pajak: req.body.pajak,
    biaya_tambahan: req.body.biaya_tambahan,
    status: "baru",
    dibayar: "belum_dibayar",
    id_user: req.body.id_user,
  };
  await transaksi.create(newTransaksi).then(async (result) => {
    let paket = await Paket.findByPk(req.body.id_paket);
    let qty = req.body.qty;
    let harga = paket.harga;
    let diskon = req.body.diskon;
    let pajak = req.body.pajak;
    let biaya_tambahan = req.body.biaya_tambahan;
    let total = qty * harga - (diskon / 100) * harga * qty + biaya_tambahan;
    let total_harga = (total = total + (pajak / 100) * total);
    let transaksi2 = {
      id_transaksi: result.id,
      id_paket: req.body.id_paket,
      qty: req.body.qty,
      keterangan: req.body.keterangan,
      total_harga: total_harga,
    };
    detail_transaksi
      .create(transaksi2)
      .then(() => {
        res.json({
          message: "Data transaksi berhasil ditambahkan",
        });
      })
      .catch((error) => {
        res.json(error);
      });
  });
});

app.put("/bayar/:id", async (req, res) => {
  let params = req.params.id;
  let data = {
    total: req.body.total,
  };
  let data2 = {
    dibayar: "dibayar",
    tgl_bayar: Date.now(),
  };
  let tagihan = await detail_transaksi.findOne({
    where: {
      id: params,
    },
  });
  console.log(tagihan.total);

  if (tagihan.total_harga > data.total) {
    res.json({
      status: "error",
      message: "maaf uang anda kurang",
    });
  } else {
    detail_transaksi
      .update(data, { where: { id: params } })
      .then(() => {
        transaksi
          .update(data2, { where: { id: params } })
          .then(() => {
            res.json({
              message: "Pembayaran berhasil",
            });
          })
          .catch((error) => {
            res.json(error);
          });
      })
      .catch((error) => {
        res.json(error);
      });
  }
});

app.put("/ubah-status/:id", async (req, res) => {
  let param = req.params.id;
  let data = {
    status: req.body.status,
  };

  transaksi
    .update(data, {
      where: {
        id: params,
      },
    })
    .then(() => {
      res.json({
        status: "success",
        massage: "status berhasil diubah",
      });
    })
    .catch((error) => {
      res.json(error);
    });
  })

app.put("/", async (req, res) => {
  let param = {
    id: req.body.id,
  };

  let newTransaksi = {
    id_outlet: req.body.id_outlet,
    kode_invoice: req.body.kode_invoice,
    id_member: req.body.id_member,
    tgl: tgl,
    batas_waktu: batas,
    tgl_bayar: tanggal,
    biaya_tambahan: req.body.biaya_tambahan,
    status: req.body.status,
    dibayar: req.body.dibayar,
    id_user: req.body.id_user,
  };

  transaksi
    .update(newTransaksi, { where: param })
    .then((result) => {
      res.json({
        message: "Data Updated",
        newTransaksi: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.delete("/:id", async (req, res) => {
  let param = {
    id: req.params.id,
  };

  transaksi
    .destroy({ where: param })
    .then((result) => {
      res.json({
        message: "Data Deleted",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

module.exports = app;
