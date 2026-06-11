const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const { sendWelcomeEmail } = require("../utils/sendMail")
const tokenBlacklistModel = require("../models/blacklist.modedl")


 async function userRegistrationController(req,res){
const {email,password,name}= req.body;

const isExists = await userModel.findOne({
  email:email
})

if(isExists){
  return res.status(422).json({
    message:"Email already exist",
    status:"failed"
  
  });
}

  const  user = await userModel.create({
    email,password,name
 })
 const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
  expiresIn:"3 days"})
  res.cookie("token",token)
  
  // Send welcome email
  sendWelcomeEmail(email, name).catch((err) => {
    console.log("Email sending error:", err);
  });
  
  res.status(201).json({
     user:{
      _id:user._id,
      email:user.email,
      name:user.name 
     },
     token,
     message: "Registration successful! Welcome email sent."
  })
 
}
async function userLoginController(req,res){
  const {email,password} = req.body;
  const user = await userModel.findOne({ email }).select("+password")

  if(!user){
    return res.status(401).json({
      message:"Invalid email or password",
      status:"failed"
    })
  }

  const isValidPassword = await user.comparePassword(password)

  if(!isValidPassword){
    return res.status(401).json({
      message:"Invalid email or password",
      status:"failed"
    })
  }
  const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
    expiresIn:"3 days"
  })
  res.cookie("token",token)
  res.status(200).json({
    user: {
      _id:user._id,
      email:user.email,
      name: user.name
    },
    token
  })
}
async function userLogoutController(req,res){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(200).json({
      message: "Logout successful"
    });
  }

  
  

  await tokenBlacklistModel.create({
    token: token
  });
  resclearCookie("token")
  res.status(200).json({
    message: "Logout successful"
  });
}

module.exports = {
  userRegistrationController,
  userLoginController,
  userLogoutController
};