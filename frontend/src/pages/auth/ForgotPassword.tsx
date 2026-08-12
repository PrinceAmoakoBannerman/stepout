import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailOpen } from 'lucide-react';
import { authService } from '@/services/authService';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Field';
import { usePageMeta } from '@/hooks/usePageMeta';

export const ForgotPassword = () => {
  usePageMeta('Reset password · StepOut');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) return;
    setLoading(true);
    await authService.requestReset(email);
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo size="lg" className="justify-center" />
          <h1 className="mt-6 font-display text-3xl font-extrabold">Reset your password</h1>
          <p className="mt-2 text-sm text-muted">Enter your email and we'll send a reset link.</p>
        </div>
        {sent ? (
          <div className="card p-6 text-center space-y-4">
            <MailOpen className="mx-auto h-12 w-12 text-green" />
            <h2 className="font-display text-xl font-bold">Check your inbox</h2>
            <p className="text-sm text-muted">If {email} is registered, a reset link is on its way.</p>
            <Link to="/login"><Button full variant="outline">Back to sign in</Button></Link>
          </div>
        ) : (
          <div className="card p-6 space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
            <Button full size="lg" loading={loading} onClick={submit}>Send reset link</Button>
          </div>
        )}
        <p className="text-center text-sm">
          <Link to="/login" className="text-green hover:underline font-semibold">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};
