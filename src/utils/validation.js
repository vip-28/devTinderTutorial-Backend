const validator= require("validator");


const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, gender} = req.body;
  if(!firstName || !lastName){
    throw new Error("Name is not valid!");
  }else if(firstName.length<4 || firstName.length>50){
    throw new Error("First Name should be 4-50 Characters long");
  }else if(!validator.isEmail(emailId)){
    throw new Error("Email Id is not correct!");
  }else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong enough!");
  }else if(!(gender==="male"||gender==="female"||gender==="others")){
    throw new Error("Gender can be male, female or others only !");
  }
};

const validateLoginData=(req)=>{
    const {emailId,password}=req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Email Id is not Valid!");
    }
}

module.exports={validateSignUpData,
    validateLoginData
};