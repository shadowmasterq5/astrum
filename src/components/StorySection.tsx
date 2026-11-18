import { User } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function StorySection() {
  const [storyImgErr, setStoryImgErr] = useState(false);

  const milestones = [
    {
      index: '01.',
      title: 'The ASUS TUF Loophole',
      detail:
        'Joined American World School (AWS) in 7th grade with a new ASUS TUF laptop and one rule: no playing video games.',
    },
    {
      index: '02.',
      title: 'Vibe-Coding 3D Games',
      detail: 'Started making games instead—combining 3D files and vibe-coding with Claude.',
    },
    {
      index: '03.',
      title: 'First Neighbor Business Site',
      detail:
        'Built a website for a neighbor starting a new business. Their reaction sparked the idea to do this professionally.',
    },
  ];

  return (
    <section id="story" className="border-b border-slate-200/80 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <span className="text-slate-900">About Mukund</span>
          <span aria-hidden="true">·</span>
          <span>7th Grade, American World School (AWS)</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 grid grid-cols-1 items-start gap-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <h2
              className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              How a no-gaming rule turned into{' '}
              <span className="font-serif italic font-semibold text-[#1D4ED8]">
                building websites.
              </span>
            </h2>

            <div className="mt-7 space-y-4 text-base leading-[1.75] text-slate-700">
              <p className="text-lg leading-relaxed text-slate-800">
                Hi, I am Mukund, and I study in 7th grade at American World School (AWS). It all
                started at the beginning of the year when I joined my new school and needed a
                laptop—so my dad got me an ASUS TUF. He restricted just one thing: playing video
                games.
              </p>
              <p>
                So I thought about what to do, and I found a loophole—he never told me I could not{' '}
                <span className="font-semibold text-slate-950">make</span> games. I started
                vibe-coding video games by taking 3D files and building them with Claude.
              </p>
              <p>
                After that, I got so interested in building with code that I asked myself: why not
                build a website? Right around then, my neighbor started a new business. I built a
                website for them, and they were very impressed—so I decided to turn this into a
                business of my own. Thank you for stopping by.
              </p>
            </div>
          </div>

          {/* Right Column: Integrated Native-Resolution Founder Card & Milestones */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-[#FAFAF8] p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.12)] sm:p-7">
              <div className="flex items-center gap-5 border-b border-slate-200 pb-6">
                <div className="w-[116px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white sm:w-[124px]">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    {!storyImgErr ? (
                      <img
                        src="/assets/aistudio/image_a29912ff.png"
                        alt="Mukund Malickarjun, 12-year-old web developer"
                        referrerPolicy="no-referrer"
                        onError={() => setStoryImgErr(true)}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-100 p-4">
                        <User className="h-8 w-8 text-slate-400" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="font-display text-lg font-bold text-slate-950">
                    Mukund Malickarjun
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    12 Years Old · 7th Grade
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">American World School (AWS)</p>
                  <p className="mt-3 font-mono text-xs font-medium text-[#1D4ED8] tabular-nums">
                    Websites ₹1,000 – ₹20,000
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-200 pt-2">
                {milestones.map((item, idx) => (
                  <div
                    key={item.index}
                    className={idx === milestones.length - 1 ? 'pt-4' : 'py-4'}
                  >
                    <h3 className="font-display text-sm font-bold text-slate-950">
                      <span className="mr-1.5 font-mono text-xs font-medium text-[#1D4ED8] tabular-nums">
                        {item.index}
                      </span>
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
