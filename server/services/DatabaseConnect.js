const mongoose = require("mongoose");

function ConnectDatabase() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/Lumia")
    .then(() => console.log("MongoDb connected.."));
}

module.exports = {ConnectDatabase};
