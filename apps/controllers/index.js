const express = require('express');
let router = express.Router();

router.use('/admin', require(__dirname + '/admin.js'));
router.use('/blog', require(__dirname + '/blog.js'));


// router.get('/', (req, res) => {
//     // res.json({ message: 'this is home page' })
//     res.render('test');
// });

router.get('/chat', (req, res) => {
    res.render('chat');
});

module.exports = router;