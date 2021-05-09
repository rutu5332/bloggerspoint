const express = require("express");
//app = express();
const bcrypt = require('bcrypt');
const User = require("../models/User");
var otpGenerator = require('otp-generator');
var nodemailer = require("nodemailer");

const router = express.Router();
 var OTP ;
 var GLmail;

router.get("/", (req, res) => {
   // console.log("here");
    res.render("auth/forgotpsswd");
  });
  

router.get("/newPsswd/",(req,res)=>{
    console.log("new Pass");
    console.log(req.query.forgotemail);
    const mail = req.query.forgotemail;
    this.GLmail = mail;
    User.findOne({ email: mail })
    .then((user) => {
      if (user) {
        //req.flash("error", "This email is already exist");
        //return res.redirect("/auth/signup");
        console.log("inside");
          const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, 
            alphabets: false });
            this.OTP=otp;
            console.log(this.OTP);
        var transporter = nodemailer.createTransport({
          host :"smtp.gmail.com",
          port : 587,
          secure : false,
          requireTLS : true,
          auth:
          {
          user: "bloggerspoint10@gmail.com",
          pass: "WebProg1105"
          }
          });
          
          
        var mailOptions = {

          from : "bloggerspoint10@gmail.com",
          to : mail,
          subject :"One Time OTP for Change password",
          text : `Welcome ${mail}, your one time Password for change password request is ${otp}.
          regards,`
          }
          
          transporter.sendMail(mailOptions,function(err,info){
          if(err)
          {
            console.log("errror occured",err);
          }
          else
          {
            console.log("snet",info.response);
          }
          });
  
          res.render("auth/changePass",{otp : otp});
    
      }
      else
      {
        console.log("ERROR:::");
      }
    }); 
});

router.get("/ChangePassword/",(req,res) =>{
  //console.log(app.local.OTP);
  
  const Email = this.GLmail;
  console.log("This is change Password",this.OTP,Email);

  if(req.query.otpField == this.OTP)
  {
    if(req.query.pass == req.query.cpass)
    {
      bcrypt.hash(req.query.pass, 10, function(err, hash) {
        
      const doc = User.findOneAndUpdate({email:Email},{password:hash}).
      then(()=>{
      }).catch((err) => console.log(err));    

      });
      return res.redirect("/auth/login");
    }
    else
    {
      console.log("pass and cpass not matched.");
    }
  }
  else
  {
    console.log("wrong OTP");
  }
  
});

  module.exports=router;