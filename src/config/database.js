const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vipulwork28:ZUAIkjLDxlfPwGGD@namastenode.tl3af.mongodb.net/devTinder"
  );
};


module.exports= connectDB;