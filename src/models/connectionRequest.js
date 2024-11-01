const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User",//reference to the user collection
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User",//reference to the user collection
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected", "superLike"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);


//Compund Index for both these parameters in searching DB for instance 
connectionRequestSchema.index({fromUserId:1, toUserId:1});
 //Creating too many indexes is also not good and read more about it and also about indexes
  




//this will be called just before .save() function of connectionRequestSchema called and is a pre function to that i.e. we can run some validations before saving the DATA on DB
connectionRequestSchema.pre("save",function(next){ // here "save" suggest the name of the function. 
  const connectionRequest=this;
  //check if the fromUserId is same as toUserId
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("You cannot send a request to yourself");// We can write this at API level also but just to know about PRE hook of schema we are using this 
  }
  next();
})

//MODEL name always starts with capital letter ConnectionRequest
const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
