import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { mockInterviewTurn } from './services/geminiService.js';
import jwt from 'jsonwebtoken';
import { User } from './models/User.js';

const PORT = process.env.PORT || 5000;

async function main() {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required');
    process.exit(1);
  }
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Unauthorized'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.sub).select('name branch semester goal');
      if (!user) return next(new Error('Unauthorized'));
      socket.userId = user._id.toString();
      socket.userProfile = {
        name: user.name,
        branch: user.branch,
        semester: user.semester,
        goal: user.goal,
      };
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const room = `user:${socket.userId}`;
    socket.join(room);

    socket.on('mock_interview:message', async (payload, ack) => {
      try {
        const { messages } = payload || {};
        if (!Array.isArray(messages)) {
          if (typeof ack === 'function') ack({ error: 'messages[] required' });
          return;
        }
        const reply = await mockInterviewTurn({
          history: messages,
          userProfile: socket.userProfile,
        });
        socket.emit('mock_interview:reply', { reply });
        if (typeof ack === 'function') ack({ ok: true });
      } catch (e) {
        socket.emit('mock_interview:error', { message: e.message || 'AI error' });
        if (typeof ack === 'function') ack({ error: e.message });
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
