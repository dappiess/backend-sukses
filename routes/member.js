const express = require("express");
const app = express();
const member = require("../models/index").member;
const { auth } = require("./auth/auth");
// app.use(auth);

const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = "./image/member";
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
  member
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
  member
    .findOne({ where: { id: req.params.id } })
    .then((member) => {
      res.json(member);
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
    let newMember = {
      nama: req.body.nama,
      alamat: req.body.alamat,
      jenis_kelamin: req.body.jenis_kelamin,
      tlp: req.body.tlp,
      image: req.file.filename,
    };
    member
      .create(newMember)
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
  let param = {
    id: req.body.id,
  };
  let data = {
    nama: req.body.nama,
    alamat: req.body.alamat,
    jenis_kelamin: req.body.jenis_kelamin,
    tlp: req.body.tlp,
  };

  if (req.file) {
    const row = await member.findOne({ where: param });
    let oldFileName = row.image;
    let dir = path.join(__dirname, "../image/member", oldFileName);
    fs.unlink(dir, (err) => console.log(err));
    data.image = req.file.filename;
  }

  member
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
    let param = {
      id: req.params.id,
    };

    let result = await member.findOne({ where: param });
    let oldFileName = result.image;

    let dir = path.join(__dirname, "../image/member", oldFileName);
    fs.unlink(dir, (err) => console.log(err));
    member
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

app.get("/cari", async (req, res) => {
  let keyword = request.body.keyword;

  let sequelize = require(`sequelize`);
  let Op = sequelize.Op;
  let dataMember = await member.findAll({
    where: {
      [Op.or]: {
        nama: {
          [Op.like]: `%${keyword}%`,
        },
        alamat: {
          [Op.like]: `%${keyword}%`,
        },
      },
    },
  });

  return response.json(dataMember);
});

module.exports = app;
