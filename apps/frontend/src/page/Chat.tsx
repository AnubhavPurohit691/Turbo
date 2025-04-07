import axios from 'axios';
import React, { useState } from 'react';
import { Backend_Url } from '../../config';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquarePlus, LogIn, Plus } from 'lucide-react';

const Chat = () => {
  const [roomid, setRoomid] = React.useState<string>();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string>('');
  const [existingroom, setexistingroom] = useState('');

  async function onsubmitslug() {
    const res = await axios.post(
      `${Backend_Url}/room`,
      {
        roomId: slug,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    setRoomid(res.data.roomid);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <MessageSquarePlus className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Chat Rooms
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
        >
          <h2 className="text-xl font-semibold mb-4 text-purple-400">Create New Room</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter room name"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onsubmitslug}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Room
              </motion.button>
              {roomid && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/chat/${roomid}`)}
                  className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Join Room
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <h2 className="text-xl font-semibold mb-4 text-purple-400">Join Existing Room</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter room ID"
              value={existingroom}
              onChange={(e) => setexistingroom(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                const res = await axios.get(`${Backend_Url}/room/${existingroom}`);
                const { room } = res.data;
                navigate(`/chat/${room.id}`);
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Join Existing Room
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Chat;