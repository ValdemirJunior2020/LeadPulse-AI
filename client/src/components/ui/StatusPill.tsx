import { cn } from '../../lib/utils';

const styles = {
  good: 'bg-green-50 text-green-700 ring-green-200',
  warn: 'bg-amber-50 text-amber-700 ring-amber-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function StatusPill({ tone = 'neutral', children }: { tone?: keyof typeof styles; children: React.ReactNode }) {
  return <span className={cn('rounded-full px-3 py-1 text-xs font-semibold ring-1', styles[tone])}>{children}</span>;
}
