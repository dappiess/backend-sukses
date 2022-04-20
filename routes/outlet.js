const express = require("express");
const app = express();
app.use(express.json());
const models = require("../models/index");
const outlet = models.outlet;
// const { auth } = require("./auth/auth");
// app.use(auth);
app.get("/", async (req, res) => {
  let dataOutlet = await outlet.findAll();
  return res.json(dataOutlet);
});

app.get("/", async (req, res) => {
  outlet
    .findOne({ where: { id: req.params.id } })
    .then((outlet) => {
      res.json(outlet);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
});

app.post("/", (req, res) => {
  let newOutlet = {
    nama: req.body.nama,
    alamat: req.body.alamat,
    telp: req.body.telp,
  };

  outlet
    .create(newOutlet)
    .then((result) => {
      res.json({
        message: `Data berhasil ditambahkan`,
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.put("/:id", (req, res) => {
  let data = {
    nama: req.body.nama,
    alamat: req.body.alamat,
    telp: req.body.telp,
  };

  let parameter = {
    id: req.params.id,
  };

  outlet
    .update(data, { where: parameter })
    .then((result) => {
      return res.json({
        message: `Data berhasil diubah`,
        data: result,
      });
    })
    .catch((error) => {
      return res.json({
        message: error.message,
      });
    });
});

app.delete("/:id", (req, res) => {
  let parameter = {
    id: req.params.id,
  };

  outlet
    .destroy({ where: parameter })
    .then((result) => {
      return res.json({
        message: `Data berhasil dihapus`,
      });
    })
    .catch((error) => {
      return res.json({
        message: error.message,
      });
    });
});

module.exports = app;
