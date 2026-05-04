export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {/* NAVBAR (Giữ nguyên cấu trúc đã có) */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v10" />
                    <path d="M18 12h-6" />
                    <path d="M12 22v-10" />
                    <path d="M6 12h6" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-700">
                  Lucky-Wheel.io
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                {["Home", "Blog", "FAQ", "About", "Privacy", "Contact"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className={
                        item === "About"
                          ? "text-sm font-bold text-purple-600"
                          : "text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                      }
                    >
                      {item}
                    </a>
                  ),
                )}
              </div>
            </div>
            <div className="flex items-center gap-5 text-slate-600">
              <button>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </button>
              <div className="flex items-center gap-1 font-bold text-sm cursor-pointer">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20" />
                  <path d="M2 12h20" />
                  <path d="M12 2a14.5 14.5 0 0 1 0 20" />
                </svg>
                <span className="ml-1 uppercase">En</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ABOUT CONTENT */}
      <main className="mx-auto max-w-4xl px-4 py-16">
        {/* Header Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#8A5CF6] mb-4">
            About Lucky Wheel
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Making random selection fun, fair, and accessible for everyone
          </p>
        </div>

        {/* Story Card  */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8 md:p-12 transition-all">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="text-purple-600">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4M3 5h4M21 17v4M19 19h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Our Story
            </h2>
          </div>

          {/* Content Section */}
          <div className="space-y-8 text-slate-500 leading-relaxed text-[17px]">
            <p>
              Lucky Wheel started in September 2025 out of pure frustration.
              I&apos;m Alex Chen, a former high school math teacher who got
              tired of the same five students always raising their hands while
              the rest of the class stayed silent. I tried the classic
              &quot;popsicle sticks in a cup&quot; method, but let&apos;s be
              honest—it&apos;s clunky, time-consuming, and impossible to use
              during virtual classes.
            </p>

            <p>
              So I did what any slightly tech-savvy teacher would do: I spent a
              weekend building a simple web-based spinning wheel. Nothing fancy,
              just a tool that could randomly pick student names and keep things
              fair. I shared it with my teacher friends, and within a week,
              three of them were using it daily.
            </p>

            <p>
              Fast forward a few months, and what started as a personal project
              has grown into something much bigger. Teachers across the country
              are using it for cold-calling. Event organizers run their raffles
              with it. Families use it to decide whose turn it is to do the
              dishes (apparently, that&apos;s a surprisingly common use case!).
            </p>

            <p className="pt-2">
              The best part? It&apos;s completely free. No ads cluttering the
              screen, no premium features locked behind paywalls, no data
              harvesting. Just a clean, simple tool that does one thing really
              well: make random selection easy and engaging.
            </p>
          </div>
        </div>

        {/* Card 2: Why We Built This */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8 md:p-12">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-6">
            <div className="text-red-500">
              {/* Icon Trái tim SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Why We Built This
            </h2>
          </div>

          {/* Content Section */}
          <div className="text-slate-500 leading-relaxed text-[17px]">
            <p className="mb-6">
              Honestly? Because the existing options were terrible. Most
              spinning wheel sites were either bloated with ads, had confusing
              interfaces, or tried to upsell you on &quot;pro&quot; features you
              didn&apos;t need. We wanted something different:
            </p>

            {/* List items với icon mũi tên tím */}
            <ul className="space-y-4 mb-8">
              {[
                {
                  title: "Actually free",
                  desc: "No hidden costs, no trials, no credit card required. Ever.",
                },
                {
                  title: "Works instantly",
                  desc: "No sign-up forms. Just open the page and start spinning.",
                },
                {
                  title: "Genuinely useful",
                  desc: "Features like eliminate mode and results history that people actually need.",
                },
                {
                  title: "Privacy-first",
                  desc: "Everything saves locally on your device. We don't track, store, or sell your data.",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex gap-1 mt-1.5 flex-shrink-0 text-purple-600">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="m9 6 6 6-6 6Z" />
                    </svg>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="m9 6 6 6-6 6Z" />
                    </svg>
                  </div>
                  <p>
                    <span className="font-bold text-slate-700">
                      {item.title}:
                    </span>{" "}
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>

            <p>We built the tool we wished existed when we needed it.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
