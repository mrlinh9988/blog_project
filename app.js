var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var session = require('express-session');
var socketio = require('socket.io');

var app = express();
var host = config.get('server.host');
var port = config.get('server.port');
var  controllers = require(__dirname + '/apps/controllers'); // => trỏ vào file index.js trong thư mục controllers]

app.set('views', __dirname + '/apps/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json()); // decode ra dạng JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Cài đặt session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get('secretKey'),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/static', express.static(__dirname + '/public'));
app.use(controllers);

var server = app.listen(port, host, () => {
    console.log('Server is running on port ', port);
});

var io = socketio(server);

var socketcontrol = require('./apps/common/socketcontrol')(io);