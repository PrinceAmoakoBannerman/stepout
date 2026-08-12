import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input, Textarea, Select } from '@/components/common/Field';
import { useApp } from '@/store/AppContext';
import { usePageMeta } from '@/hooks/usePageMeta';

export const Contact = () => {
  usePageMeta('Contact · StepOut');
  const { toast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.email || !form.message) { toast('Please fill in all required fields.', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    toast('Message sent! We\'ll get back to you shortly.', 'success');
    setForm({ name: '', email: '', subject: 'general', message: '' });
    setLoading(false);
  };

  return (
    <div className="shell max-w-2xl py-14 sm:py-20">
      <p className="eyebrow mb-2">Get in touch</p>
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Contact us</h1>
      <div className="horizon-rule mt-4" />
      <p className="mt-4 text-muted">Questions, partnerships or just want to say hello — we'd love to hear from you.</p>
      <div className="card mt-8 p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" required value={form.name} onChange={set('name')} />
          <Input label="Email" type="email" required value={form.email} onChange={set('email')} />
        </div>
        <Select label="Subject" value={form.subject} onChange={set('subject')}>
          <option value="general">General enquiry</option>
          <option value="organizer">Organizer support</option>
          <option value="technical">Technical issue</option>
          <option value="partnership">Partnership</option>
        </Select>
        <Textarea label="Message" required rows={5} value={form.message} onChange={set('message')} />
        <Button loading={loading} icon={<Send className="h-4 w-4" />} onClick={submit}>Send message</Button>
      </div>
    </div>
  );
};
