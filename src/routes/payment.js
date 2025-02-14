const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay.js");
const Payment = require("../models/payment.js");
const { membershipAmount } = require("../utils/constants.js");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils.js");
const User = require("../models/user.js");

require("dotenv").config();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, //this means 500 rupees
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });
    //save in my DB

    console.log(order);
    const payment = new Payment({
      userId: req.user._id,
      status: order.status,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();

    //return order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers("X-Razorpay-Signature"); // or req.get["X-Razorpay-Signature"]
    const isWebHookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebHookValid) {
      return res.status(400).json({ msg: "Invalid Webhook Signature" });
    }


    //update my payment status 
const paymentDetails=req.body.payload.payment.entity;



    const payment=await Payment.findOne({orderId:paymentDetails.order_id});
    payment.status= paymentDetails.status;
    await payment.save();


    //  mark the user premium

    const user = await User.findOne({_id:payment.userId})
    user.isPremium=true;
    user.membershipType=payment.notes.membershipType;
    await user.save();


    //return success response to razorpay
    // if (req.body.event == "payment.captured") {

    // }


    // if (req.body.event == "payment.failed") {

    // }


return res.status(200).json({msg:"Webhook recieved successfully"});

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
