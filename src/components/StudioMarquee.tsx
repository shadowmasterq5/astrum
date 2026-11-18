export function StudioMarquee() {
  const items = [
    'Custom Web Design',
    'Mobile-First Layouts',
    'Built Websites',
    'Gemini AI Integration',
    '₹1,000 – ₹20,000 Fixed Range',
    'Direct Email & Phone Support',
  ];

  const track = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-b border-slate-200/80 bg-white py-3.5 select-none"
    >
      <div className="animate-studio-marquee flex w-max items-center gap-8 whitespace-nowrap text-xs font-medium tracking-wide text-slate-500">
        {track.map((label, idx) => (
          <span key={`${label}-${idx}`} className="inline-flex items-center gap-8">
            <span>{label}</span>
            <span className="text-slate-300">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
