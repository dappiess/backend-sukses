const jwt = require("jsonwebtoken");
const secretKey = "dappiess";

const auth = (request, response, next) => {
  let header = request.headers.authorization;
  let token = header && header.split(" ")[1];

  if (token == null) {
    return response.status(401).json({
      message: `Unauthorized`,
    });
  } else {
    let jwtHeader = {
      algorithm: "HS256",
    };
    jwt.verify(token, secretKey, jwtHeader, (error) => {
      if (error) {
        return response.status(401).json({
          message: `Invalid Token`,
        });
      } else {
        next();
      }
    });
  }
};
module.exports = { auth };
