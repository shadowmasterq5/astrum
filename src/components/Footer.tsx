export function Footer() {
  return (
    <footer className="bg-[#FAFAF8] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-b border-slate-200 pb-10">
          <p className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            &ldquo;You&apos;re too young?&rdquo; That&apos;s not true.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Thank you, Google. Built by Mukund Malickarjun · 7th Grade, American World School.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-base font-bold text-slate-950">
              Mukund Malickarjun
            </div>
            <p className="mt-1 text-xs text-slate-500">
              12-year-old web developer · Custom sites from ₹1,000 to ₹20,000
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <a href="#story" className="hover:text-slate-950 hover:underline underline-offset-4">
              My Story
            </a>
            <a href="#work" className="hover:text-slate-950 hover:underline underline-offset-4">
              Built Websites
            </a>
            <a href="#services" className="hover:text-slate-950 hover:underline underline-offset-4">
              Services
            </a>
            <a href="#pricing" className="hover:text-slate-950 hover:underline underline-offset-4">
              Pricing
            </a>
            <a
              href="#idea-maker"
              className="hover:text-slate-950 hover:underline underline-offset-4"
            >
              AI Idea Maker
            </a>
            <a
              href="mailto:mukund.pm@outlook.com"
              className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 hover:text-[#1D4ED8]"
            >
              mukund.pm@outlook.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
