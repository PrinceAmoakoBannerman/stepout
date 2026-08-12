import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { Input, Select } from '@/components/common/Field';
import { cities } from '@/data/cities';
import { usePageMeta } from '@/hooks/usePageMeta';

export const Register = () => {
  usePageMeta('Create an account · StepOut');
  const { signUp, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', cityId: 'accra' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await signUp(form);
      toast('Account created!', 'success');
      navigate('/onboarding/interests');
    } catch (e: any) {
      setError(e.message ?? 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo size="lg" showTagline className="justify-center" />
          <h1 className="mt-6 font-display text-3xl font-extrabold">Join StepOut</h1>
          <p className="mt-2 text-sm text-muted">Discover what's happening, save events, get tickets.</p>
        </div>
        <div className="card p-6 space-y-4">
          {error && <div className="rounded-xl border border-magenta/30 bg-magenta/5 px-4 py-3 text-sm text-magenta">{error}</div>}
          <Input label="Full name" id="name" placeholder="Kwame Mensah" required value={form.name} onChange={set('name')} />
          <Input label="Email" id="email" type="email" placeholder="you@example.com" required value={form.email} onChange={set('email')} />
          <Input label="Password" id="password" type="password" placeholder="At least 6 characters" required value={form.password} onChange={set('password')} />
          <Select label="Your city" id="city" value={form.cityId} onChange={set('cityId')}>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}, {c.region}</option>)}
          </Select>
          <Button full size="lg" loading={loading} icon={<UserPlus className="h-4 w-4" />} onClick={submit}>Create account</Button>
        </div>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-green hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
