const express = require("express");
const nodemailer=require("nodemailer");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Import User model
const User = require("../models/User");

const isAuth = require("../utility/isAuth");

/*
 * @type     GET
 * @route    '/auth/signup'
 * @desc     This route is used for load regitration page
 * @access   PUBLIC
 */
router.get("/signup", (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/registration", {
    errorMessage: message,
  });
});

router.get("/about", (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/aboutus", {
    errorMessage: message,
  });
});

router.get("/All_Blogs", (req, res) => {
  let message = req.flash("error");
  Post.find().populate('user')
  .then(posts => {
      res.render('posts/all_posts', { posts: posts });
  })
  .catch(err => console.log(err));
});

/*
 * @type     POST
 * @route    '/auth/signup'
 * @desc     This route is used for register new users
 * @access   PRIVATE
 */
router.post("/signup", (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  // Check for user existance
  User.findOne({ email: newUser.email })
    .then((user) => {
      if (user) {
        req.flash("error", "This email is already exist");
        return res.redirect("/auth/signup");
      }

      // Store hash in your password.
      bcrypt.hash(newUser.password, 10, function (err, hash) {
        newUser.password = hash;
        // Save user details to the database
        new User(newUser)
          .save()
          .then((result) => {
            // res.json({ message: 'User is successfully register' });
            req.session.isLoggedIn = true;
            req.session.user = {
              id: result.id,
              email: result.email,
              name: result.name,
            };
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
              to : result.email,
              subject :"Welcome to BloggersPoint",
              text : "We are happy that you become a part of BloggersPoint family. We hope you find it interesting. Regards,BloggersPoint Team"
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
              
            res.redirect("/");
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
});

/*
 * @type     GET
 * @route    '/auth/login'
 * @desc     This route is used for load login page
 * @access   PUBLIC
 */
router.get("/login", (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", { errorMessage: message });
});

/*
 * @type     POST
 * @route    '/auth/login'
 * @desc     This route is used for loggedin users
 * @access   PRIVATE
 */
router.post("/login", (req, res) => {
  email = req.body.email;
  password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Email is not register");
        return res.redirect("/auth/login");
      }
      // Compare the with hash password
      bcrypt.compare(password, user.password, (err, match) => {
        if (match) {
          req.session.isLoggedIn = true;
          req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
          };
          return res.redirect("/");
        } else {
          req.flash("error", "Invalid email or password");
          return res.redirect("/auth/login");
        }
      });
    })
    .catch((err) => console.log(err));
});

/*
 * @type     GET
 * @route    '/auth/logout'
 * @desc     This route is used for logout users
 * @access   PUBLIC
 */
router.get("/logout", (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.destroy();
    res.redirect("/auth/login");
  }
});

module.exports = router;
