const express = require("express");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const secretKey = "dappiess";
const login = express();

const models = require("../models/index");
const user = models.user;

login.use(express.json());

login.post("/", async (request, response) => {
  let newLogin = {
    username: request.body.username,
    password: md5(request.body.password),
    role: request.body.role,
  };
  let dataUser = await user.findOne({
    where: newLogin,
  });

  if (dataUser) {
    let payload = JSON.stringify(dataUser);
    let token = jwt.sign(payload, secretKey);
    return response.json({
      logged: true,
      data: dataUser,
      token: token,
    });
  } else {
    return response.json({
      logged: false,
      message: `Invalid username or password`,
    });
  }
});
module.exports = login;
