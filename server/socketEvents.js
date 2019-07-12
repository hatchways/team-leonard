const Message = require('./models/Message');

exports = module.exports = function (io) {
    // Set socket.io listeners.
    io.on('connection', (socket) => {
        console.log('a user connected: ' + socket.id);

        socket.on('new message', (msgObject) => {

            const reply = new Message({
                conversationId: msgObject.conversationId,
                body: msgObject.msg,
                author: msgObject.userid
            });

            reply.save((err, sentReply) => {
                if (err) {
                    return next(err);
                }
            });

            const conversation = Message.find({ conversationId: msgObject.conversationId })
                .select('createdAt body author')
                .sort('-createdAt')
                .limit(10)
                .populate('author', 'username')
                .exec((err, messages) => {
                    if (err) {
                        res.send({ error: err });
                        return next(err);
                    }

                    return res.status(200).json({ conversation: messages });
                });
            io.sockets.emit('refresh message', conversation);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected: ' + socket.id);
        });
    });
};
