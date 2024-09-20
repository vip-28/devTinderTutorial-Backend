const express= require("express");

const app= express();

app.use("/hello",(req,res)=>{
    res.send("hello from the server!")
})

app.listen(3000,()=>console.log("successfully listening on port 3000")
);