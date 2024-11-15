
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
 // This is the correct import for the server-side socket type
import Message from "../models/Chat"

export default (io: Server) => {
    io.on('connection', (socket: Socket) => {
      // Send existing messages in the room to the new user
      socket.on('chatType', (data: any) => {
        data === 'Global' ? (
          Message.find()
            .then((messages) => {
              socket.emit('chat history', messages);
          })
        ) : (
          Message.find({ chatType: data })
            .then((messages) => {
              socket.emit('chat history', messages);
            })
        )
      });

      socket.on('private message', ({ recipientId, msg }) => {
        socket.to(recipientId).emit('private message', msg);
    });

      // Listen for incoming messages
      socket.on('send message', (msg) => {
        const newMessage = new Message(msg);
        newMessage.save()
          .then(() => {
            io.to(msg.chatType).emit('chat message', msg);
          })
          .catch(err => {
            console.error('Error saving message:', err);
            socket.emit('error', 'Message could not be saved.');
        }); 
      });

      socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
      });
    });
};