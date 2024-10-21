const express =require("express");
const User= require("../models/user")
const { userAuth } = require("../middlewares/auth");

const requestRouter= express.Router();

requestRouter.post("/sendConnectionRequest",userAuth ,async(req,res)=>{
    const user= req.user;
      //sending a connection request
      console.log("Sending connection request");
      res.send(user.firstName+" sent the Connection Request!");
    })



module.exports= requestRouter;
