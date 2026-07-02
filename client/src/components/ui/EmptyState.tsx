import { Sparkles } from 'lucide-react';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <Sparkles className="mx-auto h-10 w-10 text-pulseBlue" />
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{message}</p>
    </div>
  );
}
