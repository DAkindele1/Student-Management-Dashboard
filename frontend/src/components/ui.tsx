import { createPortal } from 'react-dom';
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

type IconProps = {
  className?: string;
};

const Icon = ({ className = '', children }: IconProps & { children: ReactNode }) => (
  <svg className={`h-5 w-5 shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </Icon>
);

export const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-3.2-3.2" />
  </Icon>
);

export const MoonIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z" />
  </Icon>
);

export const SunIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.9 4.9 1.4 1.4" />
    <path d="m17.7 17.7 1.4 1.4" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m4.9 19.1 1.4-1.4" />
    <path d="m17.7 6.3 1.4-1.4" />
  </Icon>
);

export const BellIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M15 17H5.8a1.8 1.8 0 0 1-1.5-2.8l1.3-2A6.7 6.7 0 0 0 6.8 9v-.5a5.2 5.2 0 0 1 10.4 0V9c0 1.2.3 2.4.9 3.4l1.3 2a1.8 1.8 0 0 1-1.5 2.8H15" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </Icon>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m7 10 5 5 5-5" />
  </Icon>
);

export const UsersIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-5A4.5 4.5 0 0 0 2 18.5V20" />
    <circle cx="8" cy="7.5" r="3.5" />
    <path d="M22 20v-1a4 4 0 0 0-3-3.9" />
    <path d="M15.5 4.7a3.5 3.5 0 1 1 0 6.6" />
  </Icon>
);

export const CubeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2.8 4.5 6.5V17.5L12 21.2l7.5-3.7V6.5L12 2.8Z" />
    <path d="M4.7 6.4 12 10l7.3-3.6" />
    <path d="M12 10v11.2" />
  </Icon>
);

export const CalendarIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M3 9h18" />
  </Icon>
);

export const GridIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Icon>
);

export const LayoutIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </Icon>
);

export const ChatIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 17.8 3 21l3.2-1.4a10 10 0 1 0-1.7-1.8Z" />
    <path d="M8 10h8" />
    <path d="M8 14h5" />
  </Icon>
);

export const HeadsetIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12a8 8 0 0 1 16 0" />
    <path d="M4 12v4a3 3 0 0 0 3 3h1v-7H7a3 3 0 0 0-3 0Z" />
    <path d="M20 12v4a3 3 0 0 1-3 3h-1v-7h1a3 3 0 0 1 3 0Z" />
  </Icon>
);

export const MailIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </Icon>
);

export const MoreVerticalIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5.5v.2" />
    <path d="M12 12v.2" />
    <path d="M12 18.3v.2" />
  </Icon>
);

export const ArrowUpIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m7 14 5-5 5 5" />
    <path d="M12 9v10" />
  </Icon>
);

export const ArrowDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m7 10 5 5 5-5" />
    <path d="M12 5v10" />
  </Icon>
);


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export const Button = ({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) => {
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400',
    secondary: 'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-white/10',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400',
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
};

export const Card = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <div className={`rounded-[20px] border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900 ${className}`}>{children}</div>
);

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-500/20 ${className}`}
    {...props}
  />
);

export const Select = ({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) => (
  <select
    className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-sky-500/20 ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const Textarea = ({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-500/20 ${className}`}
    {...props}
  />
);

export const Label = ({ children }: { children: ReactNode }) => (
  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{children}</label>
);

export const Badge = ({ tone = 'slate', children }: { tone?: 'slate' | 'sky' | 'accent' | 'amber' | 'red'; children: ReactNode }) => {
  const classes: Record<typeof tone, string> = {
    slate: 'bg-slate-100 text-slate-700',
    sky: 'bg-sky-100 text-sky-700',
    accent: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes[tone]}`}>{children}</span>;
};

export const FormError = ({ message }: { message?: string }) =>
  message ? <p className="mt-2 text-sm text-red-600">{message}</p> : null;

export const StatCard = ({
  label,
  value,
  helper,
  tone = 'sky',
  icon,
}: {
  label: string;
  value: string | number;
  helper?: string;
  tone?: 'sky' | 'accent' | 'amber' | 'slate';
  icon?: ReactNode;
}) => {
  const tones = {
    sky: 'text-slate-700 dark:text-slate-300',
    accent: 'text-slate-700 dark:text-slate-300',
    amber: 'text-slate-700 dark:text-slate-300',
    slate: 'text-slate-700 dark:text-slate-300',
  };


  return (
    <Card className={`${tones[tone]} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
          {helper ? <div className="mt-2 text-sm text-slate-500">{helper}</div> : null}
        </div>
        {icon ? <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">{icon}</div> : null}
      </div>
    </Card>
  );
};

export const LoadingState = ({ label = 'Loading...' }: { label?: string }) => (
  <Card className="p-8 text-center text-sm text-slate-500">{label}</Card>
);

export const EmptyState = ({ title, description, action }: { title: string; description: string; action?: ReactNode }) => (
  <Card className="p-10 text-center">
    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-slate-100" />
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm text-slate-500">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </Card>
);

export const Pagination = ({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
    <div>
      Page {page} of {totalPages}
    </div>
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
        Previous
      </Button>
      <Button variant="secondary" size="sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
        Next
      </Button>
    </div>
  </div>
);

export const Modal = ({ open, title, description, onClose, children, maxWidth = 'max-w-2xl' }: { open: boolean; title: string; description?: string; onClose: () => void; children: ReactNode; maxWidth?: string }) => {
  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full ${maxWidth} rounded-[28px] bg-white p-6`} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button className="rounded-full px-3 py-1 text-2xl text-slate-400 hover:bg-slate-100" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export const ConfirmDialog = ({ open, title, description, confirmLabel = 'Delete', onClose, onConfirm, tone = 'danger' }: { open: boolean; title: string; description: string; confirmLabel?: string; onClose: () => void; onConfirm: () => void; tone?: 'danger' | 'primary' }) => (
  <Modal open={open} title={title} description={description} onClose={onClose} maxWidth="max-w-lg">
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant={tone} onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);
