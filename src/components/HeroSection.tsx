import { ArrowRight, Code2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface HeroSectionProps {
  onOpenIdeaMaker: () => void;
  onInspectWork: () => void;
}

export function HeroSection({ onOpenIdeaMaker, onInspectWork }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="border-b border-slate-200/80 bg-[#FAFAF8]">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between lg:col-span-6"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                <span className="text-slate-950">Mukund Malickarjun</span>
                <span aria-hidden="true">·</span>
                <span>12 Years Old</span>
                <span aria-hidden="true">·</span>
                <span>7th Grade, AWS</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[#1D4ED8] tabular-nums">₹1,000 – ₹20,000</span>
              </div>

              <h1
                className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.05]"
                style={{ textWrap: 'balance' }}
              >
                Professional websites built with{' '}
                <span className="font-serif italic font-semibold text-[#1D4ED8]">
                  care, speed,
                </span>{' '}
                and honest pricing.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                I&apos;m Mukund Malickarjun, a 12-year-old web developer building custom, mobile-ready
                websites for local shops, startups, and creators from{' '}
                <span className="font-mono font-medium text-slate-950 tabular-nums">₹1,000</span>{' '}
                to{' '}
                <span className="font-mono font-medium text-slate-950 tabular-nums">₹20,000</span>.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={onOpenIdeaMaker}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#1E40AF] hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                >
                  <span>Build Your Idea with AI</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onInspectWork}
                  className="inline-flex min-h-[46px] items-center text-sm font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:text-[#1D4ED8] hover:decoration-[#1D4ED8] cursor-pointer whitespace-nowrap shrink-0"
                >
                  See Built Websites
                </button>
              </div>
            </div>

            <p className="mt-10 border-t border-slate-200/80 pt-5 text-xs leading-relaxed text-slate-500">
              Plan your site interactively with Gemini AI below, then send your brief and phone
              number directly to{' '}
              <a
                href="mailto:mukund.pm@outlook.com"
                className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-[#1D4ED8]"
              >
                mukund.pm@outlook.com
              </a>
              .
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.16)]">
              <div className="relative flex-1 overflow-hidden bg-slate-100">
                {!imgError ? (
                  <img
                    src="/src/assets/images/hero_developer_workspace_1794840941905.jpg"
                    alt="Mukund Malickarjun web development workspace with laptop showing clean architectural website layout"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-8 text-center">
                    <Code2 className="h-10 w-10 text-slate-500" aria-hidden="true" />
                    <p className="mt-3 font-display text-lg font-semibold text-slate-800">
                      Mukund Malickarjun Studio
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Custom responsive web architecture
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/80 bg-white px-5 py-3 text-xs text-slate-500">
                <span className="font-medium text-slate-800">Custom Handwritten Code</span>
                <span className="font-mono tabular-nums">React · Tailwind · Gemini AI</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-width 4-column studio spec strip */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-slate-200 pt-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-slate-200">
          <div className="md:pr-6">
            <div className="font-mono text-2xl font-medium text-slate-950 tabular-nums">12 yrs</div>
            <div className="mt-1 text-xs text-slate-600">Young builder, real production code</div>
          </div>
          <div className="md:px-6">
            <div className="font-mono text-2xl font-medium text-slate-950 tabular-nums">
              ₹1k – ₹20k
            </div>
            <div className="mt-1 text-xs text-slate-600">Transparent fixed project range</div>
          </div>
          <div className="md:px-6">
            <div className="font-display text-2xl font-semibold text-slate-950">Mobile-First</div>
            <div className="mt-1 text-xs text-slate-600">Fast on every phone &amp; desktop</div>
          </div>
          <div className="md:pl-6">
            <div className="font-display text-2xl font-semibold text-slate-950">Gemini AI</div>
            <div className="mt-1 text-xs text-slate-600">Instant website idea &amp; brief builder</div>
          </div>
        </div>
      </div>
    </section>
  );
}
