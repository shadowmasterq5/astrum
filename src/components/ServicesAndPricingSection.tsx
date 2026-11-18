import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import type { PricingTier } from '../types';

interface ServicesAndPricingSectionProps {
  selectedTier: string;
  onSelectTier: (tierLabel: string) => void;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Site',
    priceRange: '₹1,000 – ₹3,500',
    turnaround: '2–4 Days',
    summary: 'Ideal for personal portfolios, freelancers, tuition teachers, and quick business cards.',
    deliverables: [
      'Clean single-page responsive website',
      'Mobile and desktop layout',
      'Direct WhatsApp, call & email links',
      'Custom typography and color styling',
    ],
  },
  {
    id: 'business',
    name: 'Business & Storefront',
    priceRange: '₹4,500 – ₹10,000',
    turnaround: '5–7 Days',
    summary:
      'Built for bakeries, local shops, cafes, clinics, and growing brands ready for a complete storefront.',
    deliverables: [
      'Multi-section website with your brand logo',
      'Interactive menu, product, or service showcase',
      'Customer inquiry & booking request form',
      'Fast loading & SEO metadata setup',
    ],
    highlighted: true,
  },
  {
    id: 'custom-ai',
    name: 'Custom Web App & AI',
    priceRange: '₹12,000 – ₹20,000',
    turnaround: '7–14 Days',
    summary: 'For startups and growing businesses needing custom backend workflows or Gemini AI chat.',
    deliverables: [
      'Full-stack React + Express architecture',
      'Custom Gemini AI assistant or idea tool',
      'Dynamic forms, calculators, or dashboards',
      'Post-launch adjustments & walkthrough',
    ],
  },
];

const SERVICES = [
  {
    number: '01.',
    title: 'Brand-First Design & Custom Logos',
    description:
      'Every website starts with clean typography, balanced spacing, and your brand colors so your logo, products, and story look unmistakable.',
  },
  {
    number: '02.',
    title: 'Fast Mobile & Desktop Development',
    description:
      'Handwritten modern React and Tailwind CSS code—no bloated templates. Pages open quickly on affordable mobile data connections and crisp desktop monitors alike.',
  },
  {
    number: '03.',
    title: 'Interactive AI & Direct Customer Leads',
    description:
      'Need interactive menus, booking forms, or a Gemini AI helper that turns visitor questions into leads sent straight to your email? Everything works out of the box.',
  },
];

export function ServicesAndPricingSection({
  selectedTier,
  onSelectTier,
}: ServicesAndPricingSectionProps) {
  return (
    <>
      <section id="services" className="border-b border-slate-200/80 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-500">Capabilities</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Young developer energy, clean professional engineering.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-slate-200 pt-10 md:grid-cols-3">
            {SERVICES.map((service) => (
              <div key={service.number} className="flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-950">
                    <span className="mr-2 font-mono text-sm font-medium text-[#1D4ED8] tabular-nums">
                      {service.number}
                    </span>
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-slate-200/80 bg-[#FAFAF8] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-medium text-slate-500">Transparent Pricing</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Websites from ₹1,000 to ₹20,000
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Pick a range that fits your project size. Not sure which one fits? Chat with the AI
              Idea Maker below and it will recommend the right tier.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {PRICING_TIERS.map((tier) => {
              const tierLabel = `${tier.name} (${tier.priceRange})`;
              const isSelected = selectedTier === tierLabel;
              const isFeatured = Boolean(tier.highlighted);

              return (
                <div
                  key={tier.id}
                  className={`flex flex-col justify-between rounded-2xl border p-7 transition-all duration-150 hover:-translate-y-0.5 ${
                    isFeatured
                      ? 'border-slate-300 border-t-2 border-t-[#1D4ED8] bg-white shadow-[0_22px_45px_-24px_rgba(29,78,216,0.22)]'
                      : isSelected
                        ? 'border-[#1D4ED8] bg-white shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-900">{tier.name}</span>
                      <span className="font-mono tabular-nums">{tier.turnaround}</span>
                    </div>

                    <div className="mt-4 font-mono text-2xl font-medium text-slate-950 tabular-nums sm:text-3xl">
                      {tier.priceRange}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{tier.summary}</p>

                    <ul className="mt-6 space-y-2.5 border-t border-slate-200 pt-5">
                      {tier.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTier(tierLabel)}
                    className={`mt-8 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isFeatured || isSelected
                        ? 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                        : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? 'Selected in Idea Maker' : `Choose ${tier.name}`}
                  </button>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
