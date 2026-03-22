import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Roadmap } from './pages/Roadmap.jsx';
import { Topics } from './pages/Topics.jsx';
import { TopicDetail } from './pages/TopicDetail.jsx';
import { Tests } from './pages/Tests.jsx';
import { TakeTest } from './pages/TakeTest.jsx';
import { MockInterview } from './pages/MockInterview.jsx';
import { Mentor } from './pages/Mentor.jsx';
import { Progress } from './pages/Progress.jsx';
import { Resume } from './pages/Resume.jsx';
import { Leaderboard } from './pages/Leaderboard.jsx';
import { Admin } from './pages/Admin.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="topics"
          element={
            <ProtectedRoute>
              <Topics />
            </ProtectedRoute>
          }
        />
        <Route
          path="topics/:slug"
          element={
            <ProtectedRoute>
              <TopicDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="tests"
          element={
            <ProtectedRoute>
              <Tests />
            </ProtectedRoute>
          }
        />
        <Route
          path="tests/:id"
          element={
            <ProtectedRoute>
              <TakeTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="mock-interview"
          element={
            <ProtectedRoute>
              <MockInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="mentor"
          element={
            <ProtectedRoute>
              <Mentor />
            </ProtectedRoute>
          }
        />
        <Route
          path="progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="resume"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
