const express = require("express");
const cors = require("cors");
const { port } = require("./config/config");
const app = express();

app.use(cors());

const member = require("./routes/member");
app.use("/member", member);

const user = require("./routes/user");
app.use("/user", user);

const outlet = require("./routes/outlet");
app.use("/outlet", outlet);

const transaksi = require("./routes/transaksi");
app.use("/transaksi", transaksi);

const paket = require("./routes/paket");
app.use("/paket", paket);

const login = require("./routes/login");
app.use("/login", login);

app.listen(port, () => {
  console.log(`ngerun dek nek port ${port}`);
});
