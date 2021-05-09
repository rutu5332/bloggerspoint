const express = require('express');
const router = express.Router();

// Import Post Model
const Post = require('../models/Post');

/* 
* @type     GET
* @route    '/'
* @desc     this route is used for load home page
* @access   PUBLIC    
*/
router.get('/', (req, res) => {
    Post.find().populate('user')
        .then(posts => {
            res.render('pages/index', { posts: posts });
        })
        .catch(err => console.log(err));
});

module.exports = router;