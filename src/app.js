const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
   const user =  await User.find({
      emailId: userEmail,
    });
    res.send(user);
  } catch (err) {
    res.send(400).send("something went wrong");
  }
});

app.get("/feed", (req, res) => {});

connectDB()
  .then(() => {
    console.log("Database Connection Successful...");
    app.listen(3000, () => console.log("successfully listening on port 3000"));
  })
  .catch((err) => {
    console.error("can't connect to Database");
  });
