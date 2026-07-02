import { cn } from '../../lib/utils';

const fantasyOutlets = [
  { name: 'CloudSignal', tone: 'from-sky-400 to-blue-600' },
  { name: 'Growth Galaxy', tone: 'from-fuchsia-400 to-purple-600' },
  { name: 'Local Legends', tone: 'from-emerald-400 to-teal-600' },
  { name: 'AdRocket Daily', tone: 'from-orange-400 to-amber-500' },
  { name: 'CallFlow News', tone: 'from-cyan-400 to-indigo-600' },
  { name: 'Service Titan Times', tone: 'from-lime-400 to-green-600' },
  { name: 'MainStreet AI', tone: 'from-rose-400 to-pink-600' },
  { name: 'LeadGen Universe', tone: 'from-violet-400 to-blue-600' },
  { name: 'Founder Radar', tone: 'from-yellow-300 to-orange-500' },
  { name: 'Campaign Weekly', tone: 'from-blue-400 to-cyan-500' },
  { name: 'AI Operator Club', tone: 'from-green-400 to-emerald-600' },
  { name: 'Small Biz Orbit', tone: 'from-purple-400 to-fuchsia-600' },
];

const tickerItems = [...fantasyOutlets, ...fantasyOutlets, ...fantasyOutlets];

type AsSeenOnFooterProps = {
  compact?: boolean;
};

export function AsSeenOnFooter({ compact = false }: AsSeenOnFooterProps) {
  return (
    <footer
      className={cn(
        'overflow-hidden border-t border-white/10 bg-[#050816] text-white',
        compact ? 'px-4 py-4 lg:px-8' : 'px-6 py-10',
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className={cn('text-center', compact ? 'mb-3' : 'mb-6')}>
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pulseGreen">
            AS SEEN ON
          </p>
          {!compact ? (
            <p className="mt-2 text-xs text-slate-500">
              Colorful demo strip. Replace these fantasy names with real press, partners, or customers before launch.
            </p>
          ) : null}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#050816] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#050816] to-transparent" />

          <div className="flex w-max animate-leadpulse-marquee gap-4 px-4 [animation-duration:60s]">
            {tickerItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className={cn(
                  'flex min-w-48 items-center justify-center rounded-2xl bg-gradient-to-br px-6 py-3 text-center text-sm font-black text-white shadow-glow ring-1 ring-white/20',
                  item.tone,
                )}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
