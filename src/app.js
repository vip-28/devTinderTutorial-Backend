const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors= require("cors");

const authRouter= require("./routes/auth")
const profileRouter= require("./routes/profile")
const requestRouter= require("./routes/request");
const userRouter = require("./routes/user");

require("dotenv").config();

require("./utils/cronjob");

const app = express();

//MiddleWares
app.use(cors({
  //whitelisting domain name
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());



app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);













// app.get("/user" ,async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.find({
//       emailId: userEmail,
//     });
//     //user is an ARRAY
//     if (user.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.send(400).send("something went wrong");
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const user = await User.findByIdAndDelete(userId, {
//       runValidators: true,
//     });
//     res.send(user + "Deleted successfully");
//   } catch (err) {
//     res.status(404).send("Error occured");
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req?.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       "userId",
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//       "password",
//       "emailId",
//     ];

//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (data?.skills.length > 10) {
//       throw new Error("Array Length exceeded");
//     }
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed because of Bad Change");
//     }
//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     console.log(user);
//     res.send("User data updated successfully");
//   } catch (err) {
//     res.status(404).send("Error occured " + err.message);
//   }
// });

// app.patch("/userEmail", async (req, res) => {
//   const emailId = req.body.emailId;
//   const data = req.body;
//   try {
//     const user = await User.findOneAndUpdate({ emailId: emailId }, data, {
//       runValidators: true,
//     });
//     res.send("User data updated successfully");
//   } catch (err) {
//     res.staus(404).send("Error occured");
//   }
// });

connectDB()
  .then(() => {
    console.log("Database Connection Successful...");
    app.listen(process.env.PORT, () => console.log("successfully listening on port 3000")); // starts server on estabishing database connection
  })
  .catch((err) => {
    console.error("can't connect to Database");
  });
