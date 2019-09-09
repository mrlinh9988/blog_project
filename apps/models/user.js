var q = require('q');
var db = require('../common/database');

var conn = db.getConnection();

function addUser(user) {
    // Nếu tồn tại user 
    if (user) {
        var defer = q.defer(); // Khai báo 1 Promise
        var query = conn.query('INSERT INTO users SET ?', user, function (error, results, fields) {
            if (error) {
                // Nếu có lỗi
                defer.reject(error);
            } else {
                // Nếu nhận được kết quả
                defer.resolve(results);
            }
        });

        return defer.promise;
    }
    // Nếu không tồn tại user return false
    return false;
}

function getUserbyEmail(email) {
    if (email) {
        var defer = q.defer();
        var query = conn.query('SELECT * FROM users WHERE ?', { email: email }, (error, result) => {
            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    }
    return false;
}

function getAllUser() {
    var defer = q.defer();
    var query = conn.query('SELECT * FROM users ', (error, result) => {
        if (error) {
            defer.reject(error);
        } else {
            defer.resolve(result);
        }
    });

    return defer.promise;
}

module.exports = {
    addUser: addUser,
    getUserbyEmail: getUserbyEmail,
    getAllUser: getAllUser
}