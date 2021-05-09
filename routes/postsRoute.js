const express = require("express");
const router = express.Router();

// Imports models
const Post = require("../models/Post");

const isAuth = require("../utility/isAuth");

/*
 * @type     GET
 * @route    '/posts'
 * @desc     This route is used for load write blog page
 * @access   PRIVATE
 */
router.get("/", isAuth, (req, res) => {
  res.render("posts/write");
});

/*
 * @type     POST
 * @route    '/posts'
 * @desc     This route is used for insert new post
 * @access   PRIVATE
 */
router.post("/", isAuth, (req, res) => {
  const newPost = {
    user: req.session.user.id,
    title: req.body.title,
    body: req.body.blog,
    image: req.image
  };

  new Post(newPost)
    .save()
    .then((success) => {
      // res.send('Blog is submitted');
      res.redirect("/posts/myblogs");
    })
    .catch((err) => console.log(err));
});

/*
 * @type     GET
 * @route    '/posts/blog/single/:id'
 * @desc     This route is used for fetch blog by their ID
 * @access   PUBLIC
 */
router.get("/blog/single/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("user")
    .then((blog) => {
      if (!blog) {
        return res.status(404).send("Invalid Blog");
      }
      res.render("posts/single_post", { blog: blog });
    })
    .catch((err) => console.log(err));
});

/*
 * @type     GET
 * @route    '/posts/myblogs'
 * @desc     This route is used for fetch blog by their ID
 * @access   PRIVATE
 */
router.get("/myblogs", isAuth, (req, res) => {
  Post.find({ user: req.session.user.id })
    .populate("user")
    .then((posts) => {
      if (posts) {
        res.render("posts/user_post", {
          posts: posts,
        });
      } else {
        res.send("You have zero post published");
      }
    })
    .catch((err) => console.log(err));
});

/*
 * @type     GET
 * @route    '/posts/edit'
 * @desc     This route is used for edit blog by their ID
 * @access   PRIVATE
 */
router.get("/edit", isAuth, (req, res) => {
  let successMsg = req.flash("sussessMsg");
  if (successMsg) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  Post.findById(req.query.q)
    .then((post) => {
      if (post) {
        if (post.user == req.session.user.id) {
          return res.render("posts/edit_post", {
            post: post,
            successMsg: successMsg,
          });
        }
        return res.status(404).send("Page not found");
      } else {
        return res.status(404).send("Page not found");
      }
    })
    .catch((err) => res.status(404).send("Page not found"));
});

/*
 * @type     POST
 * @route    '/posts/edit'
 * @desc     This route is used for edit blog by their ID
 * @access   PRIVATE
 */
router.post("/edit/:post_id", isAuth, (req, res) => {
  const postUpdate = {};

  if (req.body.title) {
    postUpdate.title = req.body.title;
  }
  if (req.body.blog) {
    postUpdate.blog = req.body.blog;
  }
  if (req.body.image) {
    postUpdate.image = req.body.image;
  }
  // console.log(postUpdate);
  Post.findById(req.params.post_id)
    .then((post) => {
      if (post) {
        if (post.user == req.session.user.id) {
          Post.findByIdAndUpdate(req.params.post_id, postUpdate)
            .then((updatedPost) => {
              console.log("here:", postUpdate);
              // req.flash("sussessMsg", "Successfully Updated");
              res.redirect("/posts/myblogs");
            })
            .catch();
        } else {
          return res.status(404).send("Page not found");
        }
      } else {
        return res.status(404).send("Page not found");
      }
    })
    .catch((err) => res.status(404).send("Page not found"));
});

router.post("/like/:id", isAuth,(req, res) => {
  const postUpdate = {};
  console.log(req.body.likes);
  if (req.body.likes) {
    postUpdate.likes = req.body.likes + 1;
  }
  
  // console.log(postUpdate);
  Post.findById(req.params.post_id)
    .then((post) => {
      if (post) {
        if (post.user != req.session.user.id) {
          Post.findByIdAndUpdate(req.params.post_id, postUpdate)
            .then((updatedPost) => {
              console.log("here", postUpdate);
              // req.flash("sussessMsg", "Successfully Updated");
              res.redirect("/posts/myblogs");
            })
            .catch();
        } else {
          return res.status(404).send("1");
        }
      } else {
        return res.status(404).send("Page not found 2");
      }
    })
    .catch((err) => res.status(404).send("Page not found 3"));
});
/*router.get("/like/:id", isAuth, (req, res) => {
  Post.findById(req.params.id)
  .then((blog) => {
    if (!blog) {
      return res.status(404).send("Invalid Blog");
    }
    console.log(req.params.id,blog.title);
    Post.findOneAndUpdate(req.body.id,req.body.title = "hello").then(()=>
    {
      console.log(req.body.title);
      res.render('pages/index', { posts: posts });
      console.log("updated");
    }).catch((err) => console.log(err));
  })
    //
  });*/
/*
 * @type     GET
 * @route    '/posts/delete'
 * @desc     This route is used for delete blog by their ID
 * @access   PRIVATE
 */
router.get("/delete", isAuth, (req, res) => {
  Post.findById(req.query.q)
    .then((post) => {
      if (post) {
        if (post.user == req.session.user.id) {
          Post.findByIdAndDelete(post.id)
            .then((deletePost) => {
              console.log(deletePost);
              res.redirect("back");
              res.end();
            })
            .catch((err) => console.log(err));
        } else {
          return res.send("page not found");
        }
      } else {
        return res.send("page not found");
      }
    })
    .catch((err) => console.log(err));
});
/*router.get("/search",(req,res)=>{  
  try {  
  Post.find({$or:[{title:{'$regex':req.query.dsearch}},{body:{'$regex':req.query.dsearch}}]},(err,data)=>{  
  if(err){  
  console.log(err);  
  }else{  
    res.render('pages/index', { posts: posts });
  }  
  })  
  } catch (error) {  
  console.log(error);  
  }  
  }); */ 
module.exports = router;
