const express = require("express");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const sendEmail = require("../utils/sendEmail")

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    //sending a connection request
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        ////     //if there is an existing connectionRequest
        //inverse queries

        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already sent!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save(); // so here we are calling .save() function and
      //a pre function will be called which will run some validations before saving the data on DB


      const emailRes= await sendEmail.run();
      console.log(emailRes);


      if (status == "interested") {
        res.json({
          message: req.user.firstName + " is interested in " + toUser.firstName,
          data,
        });
      } else {
        res.json({
          message: req.user.firstName + " ignored " + toUser.firstName,
          data,
        });
      }
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    // check for status entries
    // toUserId should be same as logged in Id
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        toUserId: loggedInUser._id,
        _id: requestId,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found" });
      }
      
      connectionRequest.status=status;

      const data =await connectionRequest.save();
       
      res.json({message: "Connection request "+ status, data });

    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);



module.exports = requestRouter;
