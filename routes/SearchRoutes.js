const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/search/", function (req, res) {
    // console.log(req.body,req.query);
  var regex = new RegExp(req.query.title, "i");
  Post.find({ title: regex }).then((result) => {
      if(result)
      res.render("posts/all_posts", { posts: result });
     
     
    // res.status(200).json(result);
    
  })
  .catch((err) => {res.redirect("/error")});
  

});
module.exports = router;