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
    const user = await User.find({
      emailId: userEmail,
    });

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
    try{
        const users=await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});


app.delete("/user", async(req,res)=>{
    const userId= req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId);
        res.send(user+"Deleted successfully");
    }catch(err){
        res.staus(404).send("Error occured");
    }
})


app.patch("/user", async (req,res)=>{
    const userId= req.body.userId;
    const data= req.body;
    try{
        const user =await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument:"after"
        })
        console.log(user)
        res.send("User data updated successfully");
    }catch(err){
        res.staus(404).send("Error occured");
    }
})

connectDB()
  .then(() => {
    console.log("Database Connection Successful...");
    app.listen(3000, () => console.log("successfully listening on port 3000"));
  })
  .catch((err) => {
    console.error("can't connect to Database");
  });
