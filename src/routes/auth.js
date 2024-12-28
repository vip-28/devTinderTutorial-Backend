const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  //encrypt the password
  const { password, firstName, lastName, emailId, gender,age } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  //creating a new instance of the user model
  const user = new User({
    firstName,
    lastName,
    emailId,
    age,
    gender,
    password: passwordHash,
  });

  try {
    //validation of data
    validateSignUpData(req);

    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validateLoginData(req);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create a JWT Token
      const token = await user.getJWT();

      //Add the token to cookie and send back the response to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 10000000), // 10 seconds only = 10000
      });
      // res.send("User Login Successful!");
      res.send(user);

    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
    //usually cleaning up of databases on large productions happen at this place 
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User Logged Out Successful!");
  //  res
  //   .cookie("token", null, {
  //     expires: new Date(Date.now()),
  //   })
  //   .send("User Logged Out Successful!");

});

module.exports = authRouter;
