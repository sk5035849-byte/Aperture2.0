import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import { Avatar } from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import PhotoDetailModal from '../components/PhotoDetailModal.jsx';
import { VerifiedBadge } from '../components/PhotoCard.jsx';

export default function Profile() {
  const { username } = useParams();
  const { user: viewer, updateUser } = useAuth();
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', bio: '', username: '' });
  const [active, setActive] = useState(null);
  const [error, setError] = useState('');

  const isOwn = viewer?.username === username;

  useEffect(() => {
    setData(null);
    api.profile(username).then((res) => {
      setData(res);
      setForm({ full_name: res.user.full_name || '', bio: res.user.bio || '', username: res.user.username });
    });
  }, [username]);

  async function saveEdit(e) {
    e.preventDefault();
    setError('');
    try {
      const { user } = await api.updateMe(form);
      updateUser(user);
      setData((d) => ({ ...d, user }));
      setEditing(false);
      if (user.username !== username) {
        window.history.replaceState(null, '', `/u/${user.username}`);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function deletePhoto(id) {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    await api.deletePhoto(id);
    setData((d) => ({ ...d, photos: d.photos.filter((p) => p.id !== id) }));
    setActive(null);
  }

  if (!data) return <p className="text-center text-paper/40 py-16">Loading profile…</p>;

  const { user, photos, stats } = data;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-darkroom-800 border border-darkroom-700 rounded-md p-5 mb-6">
        {editing ? (
          <form onSubmit={saveEdit} className="space-y-3">
            <input
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Username"
              className="w-full bg-darkroom-900 border border-darkroom-600 rounded px-3 py-2 text-sm"
            />
            <input
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="Full name"
              className="w-full bg-darkroom-900 border border-darkroom-600 rounded px-3 py-2 text-sm"
            />
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Bio"
              rows={2}
              className="w-full bg-darkroom-900 border border-darkroom-600 rounded px-3 py-2 text-sm"
            />
            {error && <p className="text-crimson-400 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-1.5 bg-safelight-500 text-darkroom-950 rounded text-sm font-medium">
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className="px-4 py-1.5 text-paper/60 text-sm">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start gap-4">
            <Avatar user={user} size={72} />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl">{user.full_name || user.username}</h1>
                {isOwn && (
                  <button onClick={() => setEditing(true)} className="text-paper/40 hover:text-safelight-400 text-sm">
                    Edit
                  </button>
                )}
              </div>
              <p className="text-paper/50 text-sm mb-2">@{user.username}</p>
              {user.bio && <p className="text-sm text-paper/80 mb-3">{user.bio}</p>}
              <div className="flex gap-5 text-sm">
                <span>
                  <strong>{stats.photo_count}</strong> <span className="text-paper/50">photos</span>
                </span>
                <span>
                  <strong>{stats.total_likes}</strong> <span className="text-paper/50">likes</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <p className="text-center text-paper/40 py-10">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <button onClick={() => setActive(photo)} className="block w-full aspect-square overflow-hidden rounded-sm bg-darkroom-800">
                <img src={photo.image_url} alt={photo.caption || ''} className="w-full h-full object-cover" />
              </button>
              {photo.has_camera_exif && photo.attested_original && (
                <div className="absolute top-1.5 left-1.5 bg-darkroom-950/70 rounded-full p-1">
                  <VerifiedBadge photo={photo} />
                </div>
              )}
              {isOwn && (
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 bg-darkroom-950/80 text-crimson-400 rounded p-1.5 transition-opacity"
                  aria-label="Delete photo"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <PhotoDetailModal
        photo={active ? { ...active, author: user } : null}
        onClose={() => setActive(null)}
        onChange={(updated) =>
          setData((d) => ({ ...d, photos: d.photos.map((p) => (p.id === updated.id ? updated : p)) }))
        }
      />
    </div>
  );
}

function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
