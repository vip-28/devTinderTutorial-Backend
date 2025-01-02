const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vipulwork28:LqqY8rD4LWl2eyqX@namastenode.tl3af.mongodb.net/devTinder"
  );
};


module.exports= connectDB;