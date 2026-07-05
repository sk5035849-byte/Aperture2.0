import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import UploadModal from './components/UploadModal.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Feed from './pages/Feed.jsx';
import Explore from './pages/Explore.jsx';
import Trending from './pages/Trending.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  const { user, loading } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-paper/40">Loading Aperture…</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen">
      <Navbar onUploadClick={() => setShowUpload(true)} />
      <main className="md:ml-56 px-4 pt-16 pb-20 md:pt-6 md:pb-6">
        <Routes>
          <Route path="/" element={<Feed key={uploadKey} />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/u/:username" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={() => setUploadKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
