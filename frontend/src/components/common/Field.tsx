import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/utils/cn';

const control =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/70 transition-colors focus:border-green focus:outline-none focus:ring-2 focus:ring-green/25 disabled:opacity-60';

interface Wrap {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  id?: string;
}

export const FieldShell = ({ label, hint, error, required, children, id }: Wrap) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-semibold text-fg">
        {label}
        {required && <span className="ml-1 text-magenta">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className="text-xs font-medium text-magenta">{error}</p>
    ) : hint ? (
      <p className="text-xs text-muted">{hint}</p>
    ) : null}
  </div>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leading?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leading, className, id, ...rest }, ref) => (
    <FieldShell label={label} hint={hint} error={error} required={rest.required} id={id}>
      <div className="relative">
        {leading && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            {leading}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(control, leading && 'pl-10', error && 'border-magenta', className)}
          aria-invalid={Boolean(error)}
          {...rest}
        />
      </div>
    </FieldShell>
  ),
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, className, id, children, ...rest }, ref) => (
    <FieldShell label={label} hint={hint} error={error} required={rest.required} id={id}>
      <select ref={ref} id={id} className={cn(control, 'appearance-none pr-9 bg-[length:0]', className)} {...rest}>
        {children}
      </select>
    </FieldShell>
  ),
);
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, ...rest }, ref) => (
    <FieldShell label={label} hint={hint} error={error} required={rest.required} id={id}>
      <textarea ref={ref} id={id} rows={rest.rows ?? 4} className={cn(control, 'resize-y', className)} {...rest} />
    </FieldShell>
  ),
);
Textarea.displayName = 'Textarea';

export const Toggle = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="flex items-center gap-3 text-sm font-medium text-fg"
  >
    <span
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-green' : 'bg-line',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </span>
    {label}
  </button>
);
