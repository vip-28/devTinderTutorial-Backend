const cron= require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const sendEmail = require("../utils/sendEmail")



cron.schedule("0 8 * * *", async ()=>{
    // console.log("Hello World, "+ new Date());
    //SEND EMAILS to all people who get request
    
    
    
    try{

        // const yesterday = subDays(new Date(),1);
        // const yesterdayStart=startOfDay(yesterday);
        // const yesterdayEnd= endOfDay(yesterday);


        // const pendingRequest=ConnectionRequest.find({
        //     status:"interested",
        //     createdAt:{
        //         $gte: yesterdayStart,
        //         $lte: yesterdayEnd
        //     }
        // }).populate("fromUserId toUserId")

        // const listofEmail=[
        //     ... new Set( pendingRequest.map((req)=> req.toUserId.emailId)),
        // ]

     const emailRes= await sendEmail.run();
        
        

    }catch(err){
        console.log(err);
    }
});