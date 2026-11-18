import { ArrowUpRight, Check, Copy, ExternalLink, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

const BUILT_WEBSITE_URL = 'https://ais-pre-cf5cqpouhncsvqr46lqy5s-818663275667.asia-northeast1.run.app';

interface FeaturedWorkSectionProps {
  onOrderSimilar: (presetIdea: string, presetTier: string) => void;
}

export function FeaturedWorkSection({ onOrderSimilar }: FeaturedWorkSectionProps) {
  const [artImgErr, setArtImgErr] = useState(false);
  const [layoutImgErr, setLayoutImgErr] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(BUILT_WEBSITE_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2200);
    } catch {
      setCopiedUrl(false);
    }
  }

  return (
    <section id="work" className="border-b border-slate-200/80 bg-[#FAFAF8] py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-slate-500">Portfolio Showcase</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Built Websites
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Explore live work built by Mukund Malickarjun. Open the live project below to test the
            design, layout, and speed firsthand.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          {/* Built Websites Art + Live Project URL Card */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.14)] lg:col-span-8">
            <div className="aspect-[16/9] w-full overflow-hidden border-b border-slate-200 bg-[#F3F2EE]">
              {!artImgErr ? (
                <img
                  src="/src/assets/images/built_websites_showcase_art_1794842600364.jpg"
                  alt="Editorial architectural artwork titled Built Websites showing clean browser grids"
                  referrerPolicy="no-referrer"
                  onError={() => setArtImgErr(true)}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-[#FAFAF8] p-10 text-center">
                  <p className="font-display text-4xl font-bold tracking-tight text-slate-950">
                    BUILT WEBSITES
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Custom web architecture by Mukund Malickarjun
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-800">Live Deployment</span>
                <span aria-hidden="true">·</span>
                <span>Custom Web Build</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">₹1,000 – ₹20,000 Range</span>
              </div>

              <h3 className="mt-2 font-display text-xl font-bold text-slate-950">
                See &amp; Use a Live Built Website
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Open the live application directly in your browser or copy the link below to share
                it.
              </p>

              {/* Visible, copyable & clickable URL bar */}
              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-[#FAFAF8] p-3.5 transition-colors duration-150 hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={BUILT_WEBSITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-mono text-xs text-[#1D4ED8] underline decoration-blue-200 underline-offset-4 hover:text-[#1E40AF]"
                >
                  {BUILT_WEBSITE_URL}
                </a>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={BUILT_WEBSITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
                  >
                    <span>Open Live Site</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-xs text-slate-500">Want a custom website like this?</span>
                <button
                  type="button"
                  onClick={() =>
                    onOrderSimilar(
                      'I checked out your built website link and want a custom website for my own business or project.',
                      'Business & Storefront (₹4,500 – ₹10,000)'
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline cursor-pointer whitespace-nowrap"
                >
                  <span>Plan yours with AI</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Responsive Engineering Card */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.10)] lg:col-span-4">
            <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-200 bg-slate-100">
              {!layoutImgErr ? (
                <img
                  src="/src/assets/images/project_craft_layouts_1794840943559.jpg"
                  alt="Responsive web wireframe layouts on tablet and mobile phone"
                  referrerPolicy="no-referrer"
                  onError={() => setLayoutImgErr(true)}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200 p-6">
                  <Layers className="h-8 w-8 text-slate-600" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-800">Responsive Craft</span>
                  <span aria-hidden="true">·</span>
                  <span>Mobile &amp; Desktop</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-slate-950">
                  Every site adapts cleanly from phone to widescreen
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Most visitors open links on their phones. Every layout Mukund builds is tested for
                  crisp typography, fast loading, and effortless tap targets.
                </p>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-mono font-medium text-slate-950 tabular-nums">100%</div>
                    <div className="text-slate-500">Custom handwritten UI</div>
                  </div>
                  <div>
                    <div className="font-mono font-medium text-slate-950 tabular-nums">2–14 days</div>
                    <div className="text-slate-500">Typical launch window</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
