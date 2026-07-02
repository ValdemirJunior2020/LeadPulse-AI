import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';

const firstNames = [
  'Alex',
  'Maria',
  'Daniel',
  'Sophia',
  'James',
  'Isabella',
  'Michael',
  'Olivia',
  'David',
  'Emma',
  'Lucas',
  'Mia',
  'Ethan',
  'Ava',
  'Noah',
  'Luna',
  'Gabriel',
  'Camila',
  'Mateo',
  'Grace',
];

const lastNames = ['Rivera', 'Johnson', 'Silva', 'Brown', 'Martinez'];

const sampleCompanies = [
  'BrightPath Roofing',
  'Palm Coast HVAC',
  'Summit Dental Care',
  'BlueLine Plumbing',
  'Evergreen Landscaping',
  'Golden Key Realty',
  'Premier Auto Works',
  'ClearView Cleaning',
  'Nova Med Spa',
  'Harbor Legal Group',
];

const samplePeople = firstNames.flatMap((firstName) => lastNames.map((lastName) => `${firstName} ${lastName}`));

const activityItems = [
  ...samplePeople.map((name) => `${name} started a LeadPulse AI demo`),
  ...sampleCompanies.map((company) => `${company} explored campaign tracking`),
];

export function SignupActivityPopup() {
  const items = useMemo(() => activityItems, []);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const showNext = () => {
      setIndex((current) => (current + 1) % items.length);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 4500);
    };

    const firstTimer = setTimeout(showNext, 2500);
    const interval = setInterval(showNext, 8000);

    return () => {
      clearTimeout(firstTimer);
      if (hideTimer) clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [items.length]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-5 z-50 max-w-sm transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <div className="rounded-2xl border border-white/10 bg-white/95 p-4 text-slate-950 shadow-glow backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-pulseGreen/15 p-2 text-pulseGreen">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Demo activity</p>
            <p className="mt-1 text-sm font-semibold">{items[index]}</p>
            <p className="mt-1 text-xs text-slate-500">Replace with real Firestore signup events when live.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
