import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({ username: '', full_name: '', email: '', password: '', emailOrUsername: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup({
          username: form.username,
          full_name: form.full_name,
          email: form.email,
          password: form.password,
        });
      } else {
        await login({ emailOrUsername: form.emailOrUsername, password: form.password });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <ApertureMark />
          <h1 className="font-display text-3xl mt-3">Aperture</h1>
          <p className="text-paper/50 text-sm mt-1 text-center">Where photographers share their best work.</p>
        </div>

        <div className="flex bg-darkroom-800 rounded-md p-1 mb-6">
          <button
            className={`flex-1 py-2 text-sm rounded transition-colors ${
              mode === 'signup' ? 'bg-safelight-500 text-darkroom-950 font-medium' : 'text-paper/60'
            }`}
            onClick={() => setMode('signup')}
          >
            Create account
          </button>
          <button
            className={`flex-1 py-2 text-sm rounded transition-colors ${
              mode === 'login' ? 'bg-safelight-500 text-darkroom-950 font-medium' : 'text-paper/60'
            }`}
            onClick={() => setMode('login')}
          >
            Sign in
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' ? (
            <>
              <Input placeholder="Username" value={form.username} onChange={update('username')} required />
              <Input placeholder="Full name (optional)" value={form.full_name} onChange={update('full_name')} />
              <Input type="email" placeholder="Email" value={form.email} onChange={update('email')} required />
              <Input
                type="password"
                placeholder="Password (6+ characters)"
                value={form.password}
                onChange={update('password')}
                required
              />
            </>
          ) : (
            <>
              <Input
                placeholder="Email or username"
                value={form.emailOrUsername}
                onChange={update('emailOrUsername')}
                required
              />
              <Input type="password" placeholder="Password" value={form.password} onChange={update('password')} required />
            </>
          )}

          {error && <p className="text-crimson-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-gradient-to-r from-safelight-500 to-crimson-500 text-darkroom-950 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full bg-darkroom-800 border border-darkroom-600 rounded-md px-3 py-2.5 text-sm placeholder:text-paper/30 focus:outline-none focus:border-safelight-500"
    />
  );
}

function ApertureMark() {
  return (
    <svg width="44" height="44" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" stroke="#e8a33d" strokeWidth="1.5" />
      <path d="M13 4 L13 13 L20 17" stroke="#e8a33d" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="13" r="3" fill="#a83a32" />
    </svg>
  );
}
