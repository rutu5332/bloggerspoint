const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/like",(req,res)=>{
    Post.findById(req.query.q)
    .then((a)=>{ 
       var t=a.title;
       var l=a.likes;
       Post.findOneAndUpdate({title:t},{likes:l+1}).then(async function(){
    })
    res.redirect("back");
    }).catch((err)=>{
        console.log(err);
    }
    );
        
})

module.exports=router;