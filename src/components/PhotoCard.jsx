import { Link } from 'react-router-dom';
import { Avatar } from './Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso.replace(' ', 'T') + 'Z').getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PhotoCard({ photo, onChange, onOpen }) {
  const { user } = useAuth();

  async function react(type) {
    if (!user) return;
    const { photo: updated } = type === 'like' ? await api.like(photo.id) : await api.dislike(photo.id);
    onChange?.(updated);
  }

  return (
    <article className="animate-fade-in bg-darkroom-800 border border-darkroom-700 rounded-md overflow-hidden">
      <Link to={`/u/${photo.author.username}`} className="flex items-center gap-3 px-4 py-3">
        <Avatar user={photo.author} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate flex items-center gap-1.5">
            {photo.author.full_name || photo.author.username}
            {photo.has_camera_exif && photo.attested_original && <VerifiedBadge photo={photo} />}
          </p>
          <p className="text-xs text-paper/50">
            @{photo.author.username} · {timeAgo(photo.created_at)}
          </p>
        </div>
      </Link>

      <div className="sprocket-edge" />
      <button className="block w-full film-frame" onClick={() => onOpen?.(photo)}>
        <img src={photo.image_url} alt={photo.caption || 'photo'} className="w-full max-h-[560px] object-cover" />
      </button>
      <div className="sprocket-edge" />

      <div className="px-4 py-3">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => react('like')}
            disabled={!user}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              photo.viewer_reaction === 'like' ? 'text-crimson-400' : 'text-paper/60 hover:text-crimson-400'
            } disabled:opacity-40`}
          >
            <HeartIcon filled={photo.viewer_reaction === 'like'} className="w-5 h-5" />
            {photo.likes_count}
          </button>
          <button
            onClick={() => react('dislike')}
            disabled={!user}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              photo.viewer_reaction === 'dislike' ? 'text-safelight-400' : 'text-paper/60 hover:text-safelight-400'
            } disabled:opacity-40`}
          >
            <ThumbDownIcon filled={photo.viewer_reaction === 'dislike'} className="w-5 h-5" />
            {photo.dislikes_count}
          </button>
        </div>

        {photo.caption && <p className="text-sm text-paper/90 mb-2">{photo.caption}</p>}

        <div className="flex flex-wrap gap-2 font-mono text-[11px] text-paper/50">
          {photo.location && <span className="px-2 py-0.5 bg-darkroom-900 rounded">📍 {photo.location}</span>}
          {photo.camera && <span className="px-2 py-0.5 bg-darkroom-900 rounded">{photo.camera}</span>}
          {photo.lens && <span className="px-2 py-0.5 bg-darkroom-900 rounded">{photo.lens}</span>}
        </div>
      </div>
    </article>
  );
}

export function VerifiedBadge({ photo }) {
  const tip = photo.exif_camera_make || photo.exif_camera_model
    ? `Verified original — camera metadata confirms this was shot on ${[photo.exif_camera_make, photo.exif_camera_model].filter(Boolean).join(' ')}`
    : 'Verified original — camera metadata intact';
  return (
    <span title={tip} className="inline-flex text-safelight-400 flex-shrink-0">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M12 2l2.4 2.2 3.2-.6.6 3.2L20.4 8.8 19.8 12l.6 3.2-3.2-.6-.6 3.2L12 22l-2.4-2.2-3.2.6-.6-3.2L3.6 15.2 4.2 12l-.6-3.2 3.2.6.6-3.2L12 2z" />
        <path d="M9 12l2 2 4-4" stroke="#0c0b0a" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function HeartIcon({ filled, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} {...props}>
      <path
        d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4a5 5 0 0 1 6.5 2 5 5 0 0 1 6.5-2c3.5.5 5 4 3 7.5C19 15.65 12 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThumbDownIcon({ filled, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} {...props}>
      <path
        d="M7 14V4M7 14l-3 0a2 2 0 0 1-2-2.5l1.5-6A2 2 0 0 1 5.5 4H16a2 2 0 0 1 2 1.6L19.5 13a2 2 0 0 1-2 2.4H14v3a2 2 0 0 1-3.6 1.2L7 14z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
