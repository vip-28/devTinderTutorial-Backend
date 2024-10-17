const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//MiddleWares
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  //encrypt the password
  const { password, firstName, lastName, emailId, gender } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  //creating a new instance of the user model
  const user = new User({
    firstName,
    lastName,
    emailId,
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validateLoginData(req);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    
    if (isPasswordValid) {
      //Create a JWT Token
      const token = await jwt.sign({ _id: user._id }, "Dev@VipVer-28Under$Dev");
      

      //Add the token to cookie and send back the response to the user
      res.cookie("token", token);
      res.send("User Login Successful!");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if(!token){
      throw new Error("Invalid Token!");
    }
    //validate token
    const decodedMessage = await jwt.verify(token, "Dev@VipVer-28Under$Dev");
    const { _id } = decodedMessage;
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("User not found!");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({
      emailId: userEmail,
    });
    //user is an ARRAY
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.send(400).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId, {
      runValidators: true,
    });
    res.send(user + "Deleted successfully");
  } catch (err) {
    res.status(404).send("Error occured");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req?.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
      "password",
      "emailId",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (data?.skills.length > 10) {
      throw new Error("Array Length exceeded");
    }
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed because of Bad Change");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User data updated successfully");
  } catch (err) {
    res.status(404).send("Error occured " + err.message);
  }
});

app.patch("/userEmail", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;
  try {
    const user = await User.findOneAndUpdate({ emailId: emailId }, data, {
      runValidators: true,
    });
    res.send("User data updated successfully");
  } catch (err) {
    res.staus(404).send("Error occured");
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection Successful...");
    app.listen(3000, () => console.log("successfully listening on port 3000"));
  })
  .catch((err) => {
    console.error("can't connect to Database");
  });
