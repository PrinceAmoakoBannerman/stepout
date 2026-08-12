import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Field';
import { usePageMeta } from '@/hooks/usePageMeta';

export const Login = () => {
  usePageMeta('Sign in · StepOut');
  const { signIn, toast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!email || !password) { setError('Email and password are required.'); return; }
    setLoading(true);
    try {
      await signIn({ email, password });
      toast('Welcome back!', 'success');
      navigate('/');
    } catch (e: any) {
      setError(e.message ?? 'Could not sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo size="lg" showTagline className="justify-center" />
          <h1 className="mt-6 font-display text-3xl font-extrabold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to save events, get tickets and more.</p>
        </div>

        <div className="card p-6 space-y-4">
          {error && <div className="rounded-xl border border-magenta/30 bg-magenta/5 px-4 py-3 text-sm text-magenta">{error}</div>}
          <Input
            label="Email" type="email" id="email" placeholder="you@example.com" required
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          <div className="relative">
            <Input
              label="Password" type={showPw ? 'text' : 'password'} id="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
            <button
              type="button" onClick={() => setShowPw(v => !v)} aria-label="Toggle password visibility"
              className="absolute right-3 top-9 text-muted hover:text-fg"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-semibold text-green hover:underline">Forgot password?</Link>
          </div>
          <Button full size="lg" loading={loading} icon={<LogIn className="h-4 w-4" />} onClick={submit}>Sign in</Button>

          <div className="relative my-2 flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs text-muted">Demo accounts</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid gap-2">
            {[['organizer@stepout.gh','Organizer'],['admin@stepout.gh','Admin']].map(([e,l]) => (
              <button key={e} onClick={() => { setEmail(e); setPassword('stepout123'); }}
                className="rounded-xl border border-line bg-raised px-4 py-2.5 text-left text-xs font-semibold hover:border-green/50 transition-colors">
                <span className="text-green">{l}</span> — {e}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-muted">
          New to StepOut?{' '}
          <Link to="/register" className="font-semibold text-green hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};
