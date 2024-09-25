const { createHmac } = require("crypto");
require("dotenv").config();

function saltHashing(password) {
  const pswd = password;
  const hashedPassword = createHmac("sha256", process.env.SALT).update(pswd).digest("hex");

  return hashedPassword;
}

module.exports = { saltHashing };