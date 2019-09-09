const express = require('express');
var router = express.Router();
var postModels = require('../models/post');

router.get('/', (req, res) => {

    var data = postModels.getAllPosts();
    

    data.then(posts => {
        var data = {
            posts: posts, 
            error: false
        }
        console.log(posts);

        res.render('blog/index', { data: data }); 
    }).catch(err => {
        var data = {
            error: 'Could not get post data'
        }
        res.render('blog/index', { data: data });
    });
});

router.get('/post/:id', (req, res) => {
    var id = req.params.id;
    var data = postModels.getPostById(id);

    data.then(posts => {
        var post = posts[0]; // Phần tử đầu tiên
        var data = {
            post: post, 
            error: false
        }
        res.render('blog/post', { data: data })
    }).catch(err => {
        var data = {
            error: 'Could not get post detail' 
        }
        res.render('blog/post', { data: data }); 
    });
});

router.get('/about', (req, res) => {
    res.render('blog/about');
});


module.exports = router; 