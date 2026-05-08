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

        {/* Story Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <svg
              className="text-purple-500"
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
              <path d="M5 3v4" />
              <path d="M3 5h4" />
              <path d="M21 17v4" />
              <path d="M19 19h4" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Our Story
            </h2>
          </div>

          <div className="space-y-6 text-slate-600 leading-relaxed text-base md:text-lg">
            <p>
              Lucky Wheel started in September 2025 out of pure frustration. I'm
              Alex Chen, a former high school math teacher who got tired of the
              same five students always raising their hands while the rest of
              the class stayed silent. I tried the classic "popsicle sticks in a
              cup" method, but let's be honest—it's clunky, time-consuming, and
              impossible to use during virtual classes.
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
              dishes (apparently, that's a surprisingly common use case!).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
