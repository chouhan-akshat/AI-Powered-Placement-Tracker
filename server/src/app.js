import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import testRoutes from './routes/testRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, name: 'AI Placement Mentor API', ts: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the React app
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// The "catch-all" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
