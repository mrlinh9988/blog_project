var q = require('q');
var db = require('../common/database');

var conn = db.getConnection();

// 1. Lấy ra tất cả bài post
function getAllPosts() {
    var defer = q.defer();
    var query = conn.query('SELECT * FROM posts', function (error, posts, fields) {
        if (error) {
            // Nếu có lỗi
            defer.reject(error);
        } else {
            // Nếu nhận được kết quả
            defer.resolve(posts);
        }
    });

    return defer.promise;
}

// 2. Thêm mới 1 bài post
function addPost(params) {
    // Nếu có thông tin nhập vào
    if (params) {
        var defer = q.defer(); // Khai báo 1 Promise
        var query = conn.query('INSERT INTO posts SET ?', params, function (error, result, fields) {
            if (error) {
                // Nếu có lỗi
                defer.reject(error);
            } else {
                // Nếu nhận được kết quả
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    // Nếu không có param truyền vào return false
    return false;
}

// 3.Tìm post theo id
function getPostById(id) {
    var defer = q.defer();
    // Lấy ra bài post theo id:
    var query = conn.query('SELECT * FROM posts WHERE ?', { id: id }, function (error, posts, fields) {
        if (error) {
            // Nếu có lỗi
            defer.reject(error);
        } else {
            // Nếu nhận được kết quả
            defer.resolve(posts);
        }
    });

    return defer.promise;
}

// 4. Cập nhật thông tin post
function updatePost(params) {
    // Nếu có thông tin nhập vào
    if (params) {
        var defer = q.defer(); // Khai báo 1 Promise
        var sql = 'UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?';
        var query = conn.query(sql, [params.title, params.content, params.author, new Date(), params.id], function (error, result, fields) {
            if (error) {
                // Nếu có lỗi
                defer.reject(error);
            } else {
                // Nếu nhận được kết quả
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    // Nếu không có param truyền vào return false
    return false;
}

// 5. Xóa post
function deletePostById(id) {
    if (id) {
        var defer = q.defer(); // Khai báo 1 Promise
        var sql = 'DELETE FROM posts WHERE id = ?';
        var query = conn.query(sql, id, function (error, result, fields) {
            if (error) {
                // Nếu có lỗi
                defer.reject(error);
            } else {
                // Nếu nhận được kết quả
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    // Nếu không có param truyền vào return false
    return false;
}
module.exports = {
    getAllPosts: getAllPosts,
    addPost: addPost,
    getPostById: getPostById,
    updatePost: updatePost,
    deletePostById: deletePostById
}