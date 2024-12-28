const validator= require("validator");


const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, gender} = req.body;
  if(!firstName || !lastName){
    throw new Error("Name is not valid!");
  }else if(firstName.length<=2 || firstName.length>50){
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
    const {emailId}=req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Email Id is not Valid!");
    }
}

const validateProfileEditData= (req)=>{

  const allowedChanges= ["firstName","lastName","emailId","photoUrl","gender","age","about","skills"];

  const isEditAllowed= Object.keys(req.body).every((field)=>allowedChanges.includes(field));

  
  const { age,gender,photoUrl,skills,about} = req?.body;


if(about.length>200){
  throw new Error("about too big");
}

  if(age<18){
    throw new Error("Minimum Age of 18 is required");
  }
  if(!(gender==="male"||gender==="female"||gender==="others")){
    throw new Error("Gender can be male, female or others only !");
  }
  if(!validator.isURL(photoUrl)){
    throw new Error("URL is not correct!");
  }
  if(skills.length>10){
    throw new Error("Maximum of 10 skills");
    
  }
  return isEditAllowed;

  
}

module.exports={validateSignUpData,
    validateLoginData,
    validateProfileEditData
};