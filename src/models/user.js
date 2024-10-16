const mongoose = require("mongoose");
const validator= require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    minLength: 3,
  },
  lastName: {
    type: String,

  },
  emailId: {
    type: String,
    required:true,
    unique:true, 
    trim:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address: "+ value);
        }
    }   

  },
  password: {
    type: String,
    required:true,
    validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Password is Weak: "+ value);
        }
    }

  },
  age: {
    type: Number,
    min:18,
  },
  gender: {
    type: String,
    validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error("Gender Data is not valid");
        }
    },
  },
  photoUrl:{
    type:String,
    validate(value){
        if(!validator.isURL(value)){
            throw new Error("Invalid Photo URL: "+ value);
        }
    }
  },
  about:{
    type:String,
    default:"Hello! i am new to the Platform."
  },
  skills:{
    type:[String],
  }
},{
    timestamps:true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
