import { useRef, useState } from 'react';
import { api } from '../api.js';

const MAX_FILES = 10;

export default function UploadModal({ onClose, onUploaded }) {
  const [items, setItems] = useState([]); // { file, previewUrl, caption, location, camera, lens }
  const [dragOver, setDragOver] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [attested, setAttested] = useState(false);
  const inputRef = useRef(null);

  function addFiles(fileList) {
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    const room = MAX_FILES - items.length;
    if (room <= 0) return;
    const next = incoming.slice(0, room).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      caption: '',
      location: '',
      camera: '',
      lens: '',
    }));
    setItems((prev) => [...prev, ...next]);
  }

  function updateItem(i, patch) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function removeItem(i) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function publish() {
    if (items.length === 0) return;
    if (!attested) {
      setError('Please confirm the photos are your own original, non-AI-generated work before publishing.');
      return;
    }
    setPublishing(true);
    setError('');
    try {
      const formData = new FormData();
      items.forEach((it) => formData.append('photos', it.file));
      formData.append('attested_original', 'true');
      formData.append(
        'meta',
        JSON.stringify(items.map(({ caption, location, camera, lens }) => ({ caption, location, camera, lens })))
      );
      const { photos } = await api.upload(formData);
      onUploaded?.(photos);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-darkroom-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-darkroom-900 border border-darkroom-700 rounded-lg w-full max-w-2xl max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-darkroom-700">
          <h2 className="font-display text-xl">Upload photos</h2>
          <button onClick={onClose} className="text-paper/50 hover:text-paper text-xl leading-none">
            ×
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-thin px-5 py-4 flex-1">
          {items.length < MAX_FILES && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-safelight-400 bg-darkroom-800' : 'border-darkroom-600 hover:border-darkroom-500'
              }`}
            >
              <p className="text-sm text-paper/70">Drag & drop photos here — or click to browse</p>
              <p className="text-xs text-paper/40 mt-1">Up to {MAX_FILES} at a time · JPG, PNG, WEBP, GIF</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-4 space-y-3">
              {items.map((it, i) => (
                <div key={i} className="flex gap-3 bg-darkroom-800 border border-darkroom-700 rounded-md p-3">
                  <img src={it.previewUrl} alt="" className="w-20 h-20 object-cover rounded flex-shrink-0" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      placeholder="Caption"
                      value={it.caption}
                      onChange={(e) => updateItem(i, { caption: e.target.value })}
                      className="col-span-2 bg-darkroom-900 border border-darkroom-600 rounded px-2 py-1.5 text-sm placeholder:text-paper/30 focus:outline-none focus:border-safelight-500"
                    />
                    <input
                      placeholder="Location"
                      value={it.location}
                      onChange={(e) => updateItem(i, { location: e.target.value })}
                      className="bg-darkroom-900 border border-darkroom-600 rounded px-2 py-1.5 text-xs font-mono placeholder:text-paper/30 focus:outline-none focus:border-safelight-500"
                    />
                    <input
                      placeholder="Camera"
                      value={it.camera}
                      onChange={(e) => updateItem(i, { camera: e.target.value })}
                      className="bg-darkroom-900 border border-darkroom-600 rounded px-2 py-1.5 text-xs font-mono placeholder:text-paper/30 focus:outline-none focus:border-safelight-500"
                    />
                    <input
                      placeholder="Lens"
                      value={it.lens}
                      onChange={(e) => updateItem(i, { lens: e.target.value })}
                      className="col-span-2 bg-darkroom-900 border border-darkroom-600 rounded px-2 py-1.5 text-xs font-mono placeholder:text-paper/30 focus:outline-none focus:border-safelight-500"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    className="text-paper/40 hover:text-crimson-400 self-start"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-crimson-400 text-sm mt-3">{error}</p>}

          {items.length > 0 && (
            <label className="flex items-start gap-2.5 mt-4 p-3 bg-darkroom-900 border border-darkroom-700 rounded-md text-xs text-paper/70 cursor-pointer">
              <input
                type="checkbox"
                checked={attested}
                onChange={(e) => setAttested(e.target.checked)}
                className="mt-0.5 accent-safelight-500"
              />
              <span>
                I confirm these are my own original photographs — not AI-generated, and not someone else's work.
                Aperture is a space for real photography; photos with intact camera metadata get a{' '}
                <strong className="text-paper/90">Verified Original</strong> badge automatically.
              </span>
            </label>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-darkroom-700">
          <span className="text-xs text-paper/40">{items.length}/{MAX_FILES} selected</span>
          <button
            onClick={publish}
            disabled={items.length === 0 || !attested || publishing}
            className="px-4 py-2 rounded-md bg-safelight-500 text-darkroom-950 font-medium text-sm hover:bg-safelight-400 disabled:opacity-40 transition-colors"
          >
            {publishing ? 'Publishing…' : `Publish (${items.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
