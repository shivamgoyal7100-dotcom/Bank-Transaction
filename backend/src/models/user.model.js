const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema =  mongoose.Schema({
  email: {
    type: String ,
    required: [true, "EMAIL is required for creating a user"] ,
    trim: true,
    lowercase:true,
    match:[/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/],
  unique : [true,"Email already exist"]
  },
  name :{
      type: String ,
      require : [true, "Name is required for creating a user"],
  },
  password: {
    type: String ,
    required: [true,"password is required for creating a user"],
    minlength: [6, "password must be at least 6 characters long"],
    select: false
  },
  systemUser: {
    type: Boolean,
    default: false,
    select: false
  }
},{
  timestamps: true
}) 
userSchema.pre("save", async function(){
 if(!this.isModified("password")){
  return;
 }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
})

userSchema.methods.comparePassword = async function(password){
  if (!password || !this.password) {
    return false;
  }

  return bcrypt.compare(password, this.password);
}
const userModel = mongoose.model("user", userSchema);
module.exports=userModel ;