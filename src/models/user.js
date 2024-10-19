const mongoose = require("mongoose");
const validator= require("validator");
const jwt= require("jsonwebtoken")
const bcrypt= require("bcrypt");

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
    default:"https://www.pngkey.com/png/detail/230-2301779_best-classified-apps-default-user-profile.png",
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

userSchema.methods.getJWT= async function(){
  const user =this;
  const token = await jwt.sign({_id:user._id},"Dev@VipVer-28Under$Dev",{
    expiresIn:"7d"
  })
  return token;
}

userSchema.methods.validatePassword= async function(passwordInputByUser){
  const user= this;
  const passwordHash= user.password
  const isPasswordValid= await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;

}

const User = mongoose.model("User", userSchema);

module.exports = User;
