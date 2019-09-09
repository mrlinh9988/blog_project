var express = require('express');
var router = express.Router();
var userModels = require('../models/user');
var postModels = require('../models/post');
var helper = require('../helpers/helper');

router.get('/', (req, res) => {
    if (req.session.user) {
        var data = postModels.getAllPosts();

        // Sau khi nhận được data:
        data.then(posts => {
            var data = {
                posts: posts,
                error: false
            }
            res.render('admin/dashboard', { data: data } );
        }).catch(err => {
            res.render('admin/dashboard', { data: { error: 'Get posts data error' } });
        });
    } else {
        res.redirect('/admin/signin')
    }

});

// 1. Chức năng sign up (đăng ký)
router.get('/signup', (req, res) => {
    res.render('signup', { data: {} });
});

router.post('/signup', (req, res) => {
    var user = req.body;


    // Nếu email chưa được nhập hoặc toàn khoảng trắng
    if (user.email.trim().length == 0) {
        res.render('signup', { data: { error: 'Email is required' } });
    }

    // check password và re-password có trùng nhau hay không
    if (user.passwd != user.rePasswd && user.passwd.trim().length != 0) {
        res.render('signup', { data: { error: 'Password is not match' } });
    }

    var password = helper.hashPassword(user.passwd); // Mã hóa password
    // Insert to database
    var user = {
        email: user.email,
        password: password,
        first_name: user.firstname,
        last_name: user.lastname,
    }

    var result = userModels.addUser(user);

    // Khi add ueser thành công, nếu có data trả về từ Promise
    result.then(function (data) {
        // Nếu đăng ký thành công thì chuyển sang trang đăng nhập luôn
        res.redirect('/admin/signin');
    }).catch(function (err) {
        res.render('signup', { data: { error: 'Could not insert user to database' } });
    });

});


// 1. Chức năng sign in (đăng nhập)
router.get('/signin', (req, res) => {
    res.render('signin', { data: {} });
});

router.post('/signin', (req, res) => {
    var params = req.body;

    // Nếu không nhập email (hoặc nhập toàn ký tự khoảng trắng )
    if (params.email.trim().length == 0) {
        res.render('signin', { data: { error: "Email is required" } })
    } else {
        var data = userModels.getUserbyEmail(params.email);
        if (data) {
            data.then(users => {
                var user = users[0];

                // Kiểm tra xem password nhập vào có trùng với password trong database không (true/false)
                var status = helper.comparePassword(params.password, user.password);

                // Nếu không trùng password
                if (!status) {
                    res.render('signin', { data: { error: 'Wrong password' } });
                } else {
                    // Lưu thông tin user vừa đăng nhập vào session
                    req.session.user = user;
                    console.log(req.session.user);
                    res.redirect('/admin'); // Nếu trùng password thì redirect sang trang admin
                }
            })
        } else {
            // Nếu không tồn tại user 
            res.render('signin', { data: { error: 'User is not exist' } });
        }
    }
});


// 3. Chức năng tạo post mới
router.get('/post/new', (req, res) => {
    if (req.session.user) {
        res.render('admin/post/new', { data: { error: false } });
    } else {
        res.redirect('/admin/signin')
    }

});

router.post('/post/new', (req, res) => {
    var params = req.body;

    // Validate form add post:
    // 1. Check title có được nhập hay không :

    // Nếu không nhập title thì hiển thị lỗi
    if (params.title.trim().length == 0) {
        var data = {
            error: 'Please enter a title'
        }

        res.render('admin/post/new', { data: data });

    } else { // Nếu người dùng có nhập title thì mới insert dữ liệu vào database
        var now = new Date();
        params.created_at = now;
        params.updated_at = now;

        var data = postModels.addPost(params);

        data.then(posts => {
            res.redirect('/admin');
        }).catch(err => {
            var data = {
                error: 'Could not insert post'
            }
            res.render('admin/post/new', { data: data });
        });
    }
});

// 4. Chức năng cập nhật post:
router.get('/post/edit/:id', (req, res) => {
    if (req.session.user) {
        var id = req.params.id;

        var data = postModels.getPostById(id);

        // Nếu có dữ liệu post trả về
        if (data) {

            data.then(posts => {
                var post = posts[0];
                var data = {
                    post: post,
                    error: false
                }
                res.render('admin/post/edit', { data: data });
            }).catch(err => {
                var data = {
                    error: 'Could not get post by id'
                }
                res.render('admin/post/edit', { data: data })
            });

        } else {

            var data = {
                error: 'Could not get post by id'
            }
            res.render('admin/post/edit', { data: data });

        }
    } else {
        res.redirect('/admin/signin');
    }

});

router.put('/post/edit', (req, res) => {
    var params = req.body;
    var data = postModels.updatePost(params);

    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(result => {
            res.json({ status_code: 200 });
        }).catch(err => {
            res.json({ status_code: 500 });
        });
    }

});

// 5. Chức năng xóa post
router.delete('/post/delete', (req, res) => {
    var id = parseInt(req.body.id);
    var data = postModels.deletePostById(id);
    if (!id) {
        res.json({ status_code: 500 });
    } else {
        data.then(result => {
            res.json({ status_code: 200 });
        }).catch(err => {
            res.json({ status_code: 500 });
        });
    }
});

router.get('/post', (req, res) => {
    if (req.session.user) {
        res.redirect('/admin');
    } else {
        res.redirect('/admin/signin')
    }

});

// router user:
router.get('/user', (req, res) => {
    if (req.session.user) {
        var data = userModels.getAllUser();
        data.then(users => {
            res.render('admin/user', {
                data: {
                    users: users,
                    error: false
                }
            });
        }).catch(err => {
            var data = { error: 'Could not get all users' }
            res.render('admin/user', { data: data })
        });
    } else {
        res.redirect('/admin/signin');
    }

});

module.exports = router;

