const express = require("express");
const app = express();
const user = require("../models/index").user;
const md5 = require("md5");
const { auth } = require("../auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
// app.use(auth);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = "./image/user";
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, "image-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  user
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

app.get("/:id", async (req, res) => {
  user
    .findOne({ where: { id: req.params.id } })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
});

app.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.json({
      message: "No uploaded file",
    });
  } else {
    let newUser = {
      nama: req.body.nama,
      username: req.body.username,
      password: md5(req.body.password),
      id_outlet: req.body.id_outlet,
      role: req.body.role,
      image: req.file.filename,
    };

    user
      .create(newUser)
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
  }
});

app.put("/", upload.single("image"), async (req, res) => {
  let param = { id: req.body.id };

  let data = {
    nama: req.body.nama,
    username: req.body.username,
    password: md5(req.body.password),
    id_outlet: req.body.id_outlet,
    role: req.body.role,
    image: req.file.filename,
  };

  if (req.body.password) {
    data.password = md5(req.body.password);
  }
  if (req.file) {
    const row = await user.findOne({ where: param });
    let oldFileName = row.image;

    let dir = path.join(__dirname, "../image/user", oldFileName);
    fs.unlink(dir, (err) => console.log(err));

    data.image = req.file.filename;
  }

  user
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

app.delete("/:id", async (req, res) => {
  try {
    let param = { id: req.params.id };

    let result = await user.findOne({ where: param });
    let oldFileName = result.image;

    let dir = path.join(__dirname, "../image/user", oldFileName);
    fs.unlink(dir, (err) => console.log(err));

    user
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
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

module.exports = app;