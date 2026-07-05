import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from './Navbar.jsx';
import { HeartIcon, ThumbDownIcon, VerifiedBadge } from './PhotoCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';

export default function PhotoDetailModal({ photo, onClose, onChange }) {
  const { user } = useAuth();
  const [reported, setReported] = useState(false);
  if (!photo) return null;

  async function react(type) {
    if (!user) return;
    const { photo: updated } = type === 'like' ? await api.like(photo.id) : await api.dislike(photo.id);
    onChange?.(updated);
  }

  async function report() {
    if (!user || reported) return;
    if (!confirm('Report this photo as AI-generated or stolen work?')) return;
    await api.report(photo.id);
    setReported(true);
  }

  return (
    <div
      className="fixed inset-0 z-30 bg-darkroom-950/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-darkroom-900 border border-darkroom-700 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-darkroom-700">
          <Link to={`/u/${photo.author.username}`} className="flex items-center gap-3" onClick={onClose}>
            <Avatar user={photo.author} size={32} />
            <div>
              <p className="text-sm font-medium flex items-center gap-1.5">
                {photo.author.full_name || photo.author.username}
                {photo.has_camera_exif && photo.attested_original && <VerifiedBadge photo={photo} />}
              </p>
              <p className="text-xs text-paper/50">@{photo.author.username}</p>
            </div>
          </Link>
          <button onClick={onClose} className="text-paper/50 hover:text-paper text-xl leading-none">
            ×
          </button>
        </div>

        <img src={photo.image_url} alt={photo.caption || ''} className="w-full max-h-[60vh] object-contain bg-darkroom-950" />

        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => react('like')}
                disabled={!user}
                className={`flex items-center gap-1.5 text-sm ${
                  photo.viewer_reaction === 'like' ? 'text-crimson-400' : 'text-paper/60 hover:text-crimson-400'
                } disabled:opacity-40`}
              >
                <HeartIcon filled={photo.viewer_reaction === 'like'} className="w-5 h-5" />
                {photo.likes_count}
              </button>
              <button
                onClick={() => react('dislike')}
                disabled={!user}
                className={`flex items-center gap-1.5 text-sm ${
                  photo.viewer_reaction === 'dislike' ? 'text-safelight-400' : 'text-paper/60 hover:text-safelight-400'
                } disabled:opacity-40`}
              >
                <ThumbDownIcon filled={photo.viewer_reaction === 'dislike'} className="w-5 h-5" />
                {photo.dislikes_count}
              </button>
            </div>
            <button
              onClick={report}
              disabled={!user || reported}
              className="text-xs text-paper/40 hover:text-crimson-400 disabled:opacity-40"
            >
              {reported ? 'Reported' : 'Report'}
            </button>
          </div>

          {photo.caption && <p className="text-sm text-paper/90 mb-3">{photo.caption}</p>}

          <div className="flex flex-wrap gap-2 font-mono text-[11px] text-paper/50">
            {photo.location && <span className="px-2 py-0.5 bg-darkroom-800 rounded">📍 {photo.location}</span>}
            {photo.camera && <span className="px-2 py-0.5 bg-darkroom-800 rounded">{photo.camera}</span>}
            {photo.lens && <span className="px-2 py-0.5 bg-darkroom-800 rounded">{photo.lens}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
