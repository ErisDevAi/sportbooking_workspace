export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* NAVBAR */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side: Logo & Links */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                {/* Logo Icon bằng SVG */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400 text-xl shadow-sm">
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
                    <path d="m16.2 7.8-2.9 2.9" />
                    <path d="M18 12h-6" />
                    <path d="m16.2 16.2-2.9-2.9" />
                    <path d="M12 22v-10" />
                    <path d="m7.8 16.2 2.9-2.9" />
                    <path d="M6 12h6" />
                    <path d="m7.8 7.8 2.9 2.9" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-700 tracking-tight">
                  Lucky-Wheel.io
                </span>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="#"
                  className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                >
                  FAQ
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Right Side: Icons (Dùng SVG thủ công) */}
            <div className="flex items-center gap-5 text-slate-600">
              {/* Moon Icon */}
              <button className="hover:text-purple-600 transition-colors">
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

              {/* Language Selector */}
              <div className="flex items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors font-bold text-sm">
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
                <span className="ml-1">EN</span>
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

      {/* HERO SECTION */}
      <main className="mx-auto max-w-5xl px-4 pt-24 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-8">
          <span className="bg-gradient-to-r from-[#8A5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
            Free Spin the Wheel - Random Picker & Decision Maker
          </span>
        </h1>

        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-500">
          Create custom spinning wheels for random name picking, giveaways,
          decisions, and games. Free online wheel spinner with 100% fair results
          - no signup required!
        </p>
      </main>
    </div>
  );
}
