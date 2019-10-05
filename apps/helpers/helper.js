var bcrypt = require('bcryptjs');
var config = require('config');
// hello
// Hàm mã hóa password
function hashPassword(password) {
    var saltRounds = config.get('saltRounds');

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

// Hàm kiểm tra password nhập vào có trùng với password trong database hay không
// tham số thứ nhất là password nhập vào
// tham số thứ 2 là password đã được hash trong database
function comparePassword(password, hash) {
    return bcrypt.compare(password, hash); // true
}
module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
}