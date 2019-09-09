module.exports = (io) => {
    var userNames = [];
    io.on('connection', (socket) => {
        console.log('Have a new user connected');

        // Listen addUser Event
        socket.on('addUser', (userName) => {
            socket.userName = userName;
            userNames.push(userName);   

            // Notify to myself
            var data = {
                sender: "SERVER",
                message: "You have join chat room"
            }

            socket.emit('updateMessage', data);

            // Notify to other users
            var data = { 
                sender: "SERVER",
                message: userName + ' have join to chat room'
            }
            // Gửi cho các user khác trừ chính user vừa vào
            socket.broadcast.emit('updateMessage', data);
        });

        // Listen send_message: 
        socket.on('send_message', (message) => {
            // Notify to myself
            var data = {
                sender: "You",
                message: message
            }
            socket.emit('updateMessage', data);

            // Notify to other user :
            var data = {
                sender: socket.userName,
                message: message
            }
            socket.broadcast.emit('updateMessage', data);
        });

        // Listen disconnect event:
        socket.on('disconnect', function() {
            // Delete userName:
            for(var i = 0; i < userNames.length; i++) {
                if(userNames[i] == socket.userName) {
                    userNames.splice(i, 1);
                }
            }

            // Notify to other user: 
            var data = {
                sender: 'SERVER',
                message: socket.userName + ' left chat room'
            }

            socket.broadcast.emit('updateMessage', data);
        });
    });
}
