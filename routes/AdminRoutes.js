const express = require("express");
const router = express.Router();

// Imports models
const Post = require("../models/Post");

const isAuth = require("../utility/isAuth");
router.get("/delete", isAuth, (req, res) => {
  Post.findById(req.query.q)
    .then((post) => {
      if (post) {
        // if (post.user == req.session.user.id) {
        Post.findByIdAndDelete(post.id)
          .then((deletePost) => {
            console.log(deletePost);
            res.redirect("back");
            res.end();
          })
          .catch((err) => console.log(err));
        // }
        // else {
        //   return res.send("page not found");
        // }
      } else {
        return res.send("page not found");
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
