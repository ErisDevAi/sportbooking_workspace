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
      <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Cột 1: Brand & Intro (Chiếm 4/12 cột) */}
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-md shadow-orange-200">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
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
                <span className="text-xl font-black text-slate-800 tracking-tight">
                  Lucky-Wheel<span className="text-orange-500">.io</span>
                </span>
              </div>

              <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm">
                Free online spinning wheel for random selection, decision
                making, classroom activities, and giveaways. Create custom
                wheels instantly with 100% fair results.
              </p>

              {/* Social Icons - Thêm vào cho đẹp */}
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Các cột Links (Chiếm 8/12 cột) */}
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Cột Product */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.1em] mb-7">
                  Product
                </h3>
                <ul className="space-y-4">
                  {["Home", "Blog", "FAQ", "About"].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[15px] text-slate-500 hover:text-orange-500 hover:translate-x-1 flex items-center transition-all duration-200 group"
                      >
                        <span className="h-[1.5px] w-0 bg-orange-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-200"></span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cột Legal */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.1em] mb-7">
                  Legal
                </h3>
                <ul className="space-y-4">
                  {["Privacy", "Terms of Service", "Disclaimer"].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[15px] text-slate-500 hover:text-orange-500 hover:translate-x-1 flex items-center transition-all duration-200 group"
                      >
                        <span className="h-[1.5px] w-0 bg-orange-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-200"></span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cột Support */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.1em] mb-7">
                  Support
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-[15px] text-slate-500 hover:text-orange-500 flex items-center transition-all"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:support@lucky-wheels.io"
                      className="text-[15px] text-slate-600 font-semibold hover:text-orange-500 transition-all underline underline-offset-4 decoration-slate-200 hover:decoration-orange-200"
                    >
                      support@lucky-wheels.io
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400 font-medium italic">
              © {new Date().getFullYear()} Lucky-Wheel.io. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-slate-600 transition-colors">
                Status
              </a>
              <a href="#" className="hover:text-slate-600 transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
