import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Avatar } from '../components/Navbar.jsx';
import { HeartIcon, ThumbDownIcon, VerifiedBadge } from '../components/PhotoCard.jsx';
import PhotoDetailModal from '../components/PhotoDetailModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Trending() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api.trending().then(({ photos }) => setPhotos(photos));
  }, []);

  function handleChange(updated) {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setActive((a) => (a && a.id === updated.id ? updated : a));
  }

  async function react(photo, type) {
    if (!user) return;
    const { photo: updated } = type === 'like' ? await api.like(photo.id) : await api.dislike(photo.id);
    handleChange(updated);
  }

  if (photos === null) {
    return <p className="text-center text-paper/40 py-16">Loading today's picks…</p>;
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="font-display text-2xl mb-2">No photos posted today, yet</h2>
        <p className="text-paper/50 text-sm">Upload one — you could be today's Trending Photo.</p>
      </div>
    );
  }

  const [top, ...rest] = photos;

  return (
    <div className="py-6 max-w-3xl mx-auto">
      <h1 className="font-display text-2xl mb-1">Trending today</h1>
      <p className="text-paper/50 text-sm mb-6">Resets at midnight. Ranked by likes on photos posted today.</p>

      {/* Hero */}
      <div className="relative bg-darkroom-800 border border-darkroom-700 rounded-md overflow-hidden mb-8">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-darkroom-950/80 backdrop-blur px-3 py-1.5 rounded-full">
          <span className="text-safelight-400 text-sm font-display">#1 TODAY</span>
        </div>
        <button className="block w-full relative" onClick={() => setActive(top)}>
          <img src={top.image_url} alt={top.caption || ''} className="w-full max-h-[480px] object-cover" />
          <GreaseCircle className="absolute -top-4 -left-4 w-28 h-28 md:w-36 md:h-36" />
        </button>
        <div className="p-4">
          <Link to={`/u/${top.author.username}`} className="flex items-center gap-3 mb-3">
            <Avatar user={top.author} size={36} />
            <div>
              <p className="text-sm font-medium flex items-center gap-1.5">
                {top.author.full_name || top.author.username}
                {top.has_camera_exif && top.attested_original && <VerifiedBadge photo={top} />}
              </p>
              <p className="text-xs text-paper/50">@{top.author.username}</p>
            </div>
          </Link>
          {top.caption && <p className="text-sm text-paper/90 mb-3">{top.caption}</p>}
          <div className="flex items-center gap-4">
            <button
              onClick={() => react(top, 'like')}
              disabled={!user}
              className={`flex items-center gap-1.5 text-sm ${
                top.viewer_reaction === 'like' ? 'text-crimson-400' : 'text-paper/60 hover:text-crimson-400'
              } disabled:opacity-40`}
            >
              <HeartIcon filled={top.viewer_reaction === 'like'} className="w-5 h-5" /> {top.likes_count}
            </button>
            <button
              onClick={() => react(top, 'dislike')}
              disabled={!user}
              className={`flex items-center gap-1.5 text-sm ${
                top.viewer_reaction === 'dislike' ? 'text-safelight-400' : 'text-paper/60 hover:text-safelight-400'
              } disabled:opacity-40`}
            >
              <ThumbDownIcon filled={top.viewer_reaction === 'dislike'} className="w-5 h-5" /> {top.dislikes_count}
            </button>
          </div>
        </div>
      </div>

      {rest.length > 0 && (
        <>
          <h2 className="font-display text-lg mb-3 text-paper/80">Also trending today</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rest.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => setActive(photo)}
                className="relative rounded-sm overflow-hidden bg-darkroom-800 text-left"
              >
                <img src={photo.image_url} alt={photo.caption || ''} className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2 bg-darkroom-950/80 px-2 py-0.5 rounded text-xs font-mono">
                  #{i + 2}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-darkroom-950/90 to-transparent p-2 flex items-center justify-between">
                  <span className="text-xs font-mono truncate">@{photo.author.username}</span>
                  <span className="flex items-center gap-1 text-xs flex-shrink-0">
                    <HeartIcon className="w-3.5 h-3.5" /> {photo.likes_count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <PhotoDetailModal photo={active} onClose={() => setActive(null)} onChange={handleChange} />
    </div>
  );
}

function GreaseCircle(props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={`grease-mark pointer-events-none ${props.className || ''}`}>
      <path
        d="M60 10c-25 2-45 20-46 42-1 20 14 40 38 46 22 5 48-4 55-25 6-18-2-38-18-47M100 22c2 3 4 6 5 10"
        stroke="#c2493f"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}
