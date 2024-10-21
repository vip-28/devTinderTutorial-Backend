const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found!");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const currentPassword = user.password;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    const reqPasswordValidation = await bcrypt.compare(
      oldPassword,
      currentPassword
    );
    if (!reqPasswordValidation) {
        throw new Error("Old password Didnt match");
    }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      
      user.password = passwordHash;
     
      user.save();
 

     
      res.cookie("token",null,{
        expires:new Date(Date.now())
      })
      res.send("Password Updated Successfully! Please Login Again with new Password");

  
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
