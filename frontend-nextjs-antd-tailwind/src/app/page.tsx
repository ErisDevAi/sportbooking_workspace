export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      {/* NAVBAR */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400 shadow-sm">
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
                {["Home", "Blog", "FAQ", "About", "Privacy", "Contact"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                    >
                      {item}
                    </a>
                  ),
                )}
              </div>
            </div>
            <div className="flex items-center gap-5 text-slate-600">
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
                <span className="ml-1 font-bold">EN</span>
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

      {/* MAIN CONTENT */}
      <main className="flex-grow mx-auto max-w-5xl px-4 pt-24 text-center">
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

      {/* FOOTER - Design based on image_d36c18.png */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-12 mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo & Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400">
                  <svg
                    width="18"
                    height="18"
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
                <span className="font-bold text-slate-700">Lucky-Wheel.io</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                Free online spinning wheel for random selection, decision
                making, classroom activities, and giveaways. Create custom
                wheels instantly.
              </p>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-2 gap-8">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                  Product
                </h3>
                <ul className="space-y-4">
                  {["Home", "Blog", "FAQ", "About"].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-purple-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                  Legal
                </h3>
                <ul className="space-y-4">
                  {["Privacy", "Terms of Service", "Disclaimer"].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-purple-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                  Support
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-purple-600"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:support@lucky-wheels.io"
                      className="text-sm text-slate-500 hover:text-purple-600"
                    >
                      support@lucky-wheels.io
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-50 text-center">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Lucky-Wheel.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
