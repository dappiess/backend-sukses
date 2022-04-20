const express = require("express");
const app = express();
const paket = require("../models/index").paket;
const { auth } = require("./auth/auth");
// app.use(auth);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async(req, res) => {
    paket
        .findAll()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
});
app.get("/:id", async(req, res) => {
    paket
        .findOne({ where: { id: req.params.id } })
        .then((paket) => {
            res.json(paket);
        })
        .catch((error) => {
            res.json({ message: error.message });
        });
});
app.post("/", async(req, res) => {
    let newPaket = {
        id_outlet: req.body.id_outlet,
        jenis: req.body.jenis,
        nama_paket: req.body.nama_paket,
        harga: req.body.harga,
    };

    paket
        .create(newPaket)
        .then((result) => {
            res.json({
                message: "Data Success",
                data: result,
            });
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
});
app.put("/", async(req, res) => {
    let param = {
        id: req.body.id,
    };

    let data = {
        id_outlet: req.body.id_outlet,
        jenis: req.body.jenis,
        nama_paket: req.body.nama_paket,
        harga: req.body.harga,
    };

    paket
        .update(data, { where: param })
        .then((result) => {
            res.json({
                message: "Data Updated",
                data: result,
            });
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
});
app.delete("/:id", async(req, res) => {
    let param = {
        id: req.params.id,
    };

    paket
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