import { useEffect, useState } from 'react';
import { api } from '../api.js';
import PhotoCard from '../components/PhotoCard.jsx';
import PhotoDetailModal from '../components/PhotoDetailModal.jsx';

export default function Feed() {
  const [photos, setPhotos] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api.feed().then(({ photos }) => setPhotos(photos));
  }, []);

  function handleChange(updated) {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setActive((a) => (a && a.id === updated.id ? updated : a));
  }

  if (photos === null) {
    return <p className="text-center text-paper/40 py-16">Loading the feed…</p>;
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="font-display text-2xl mb-2">The feed is empty</h2>
        <p className="text-paper/50 text-sm">Be the first to publish a photo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onChange={handleChange} onOpen={setActive} />
      ))}
      <PhotoDetailModal photo={active} onClose={() => setActive(null)} onChange={handleChange} />
    </div>
  );
}
