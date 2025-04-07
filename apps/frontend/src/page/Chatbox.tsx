import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Backend_Url } from '../../config';
import { useSocket } from '../../hooks/useSocket';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';

const Chatbox = () => {
  const { roomid } = useParams();
  const [messages, setmessages] = useState<{ message: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { socket, loading } = useSocket();
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    async function getmessage() {
      const response = await axios.get(`${Backend_Url}/chats/${roomid}`);
      setmessages(response.data.messages);
    }
    getmessage();
  }, [roomid]);

  useEffect(() => {
    if (!socket || !roomid) return;

    const joinRoom = () => {
      socket.send(JSON.stringify({ type: 'join', roomId: roomid }));

      socket.onmessage = (event: MessageEvent) => {
        console.log("Received message:", event);
        const data = JSON.parse(event.data);

        if (data.type === 'chat' && data.room === roomid) {
          setmessages(prev => [...prev, { message: data.message }]);
        }
      };
    };

    if (socket.readyState === WebSocket.OPEN) {
      joinRoom();
    } else {
      socket.onopen = () => {
        joinRoom();
      };
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'leave', roomId: roomid }));
      }
      socket.onmessage = null;
    };
  }, [socket, roomid]);

  const sendMessage = () => {
    if (!input.trim() || !socket || socket.readyState !== WebSocket.OPEN || !roomid) return;

    socket.send(
      JSON.stringify({
        type: 'chat',
        message: input,
        roomId: roomid,
      })
    );
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Chat Room
          </h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-400 mb-6"
        >
          Room ID: {roomid}
        </motion.div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6 h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 p-4 rounded-lg backdrop-blur-sm border border-gray-700"
              >
                {message.message}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex gap-4">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg flex items-center gap-2 font-medium"
          >
            <Send className="w-5 h-5" />
            Send
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbox;