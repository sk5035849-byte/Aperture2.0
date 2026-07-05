import { useEffect, useState } from 'react';
import { api } from '../api.js';
import PhotoDetailModal from '../components/PhotoDetailModal.jsx';
import { HeartIcon, VerifiedBadge } from '../components/PhotoCard.jsx';

export default function Explore() {
  const [photos, setPhotos] = useState(null);
  const [active, setActive] = useState(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    setPhotos(null);
    api.explore(verifiedOnly).then(({ photos }) => setPhotos(photos));
  }, [verifiedOnly]);

  function handleChange(updated) {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setActive((a) => (a && a.id === updated.id ? updated : a));
  }

  if (photos === null) {
    return <p className="text-center text-paper/40 py-16">Loading explore…</p>;
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="page-title font-display text-2xl">Explore</h1>
        <label className="flex items-center gap-2 text-xs text-paper/60 cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="accent-safelight-500"
          />
          Verified only
        </label>
      </div>
      {photos.length === 0 && (
        <p className="text-center text-paper/40 py-16">No verified-original photos yet — check back soon.</p>
      )}
      <div className="columns-2 md:columns-4 gap-2 [column-fill:_balance]">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setActive(photo)}
            className="block w-full mb-2 relative group break-inside-avoid rounded-sm overflow-hidden bg-darkroom-800"
          >
            <img src={photo.image_url} alt={photo.caption || ''} className="w-full object-cover" />
            {photo.has_camera_exif && photo.attested_original && (
              <div className="absolute top-2 right-2 bg-darkroom-950/70 rounded-full p-1">
                <VerifiedBadge photo={photo} />
              </div>
            )}
            <div className="absolute inset-0 bg-darkroom-950/0 group-hover:bg-darkroom-950/50 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
              <span className="text-xs font-mono">@{photo.author.username}</span>
              <span className="flex items-center gap-1 text-xs">
                <HeartIcon className="w-4 h-4" /> {photo.likes_count}
              </span>
            </div>
          </button>
        ))}
      </div>
      <PhotoDetailModal photo={active} onClose={() => setActive(null)} onChange={handleChange} />
    </div>
  );
}
