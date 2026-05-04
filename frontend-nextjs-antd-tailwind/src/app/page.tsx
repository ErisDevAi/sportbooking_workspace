import { Moon, Globe, ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side: Logo & Links */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                {/* Thay thế bằng icon hoặc img logo của bạn */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400 text-xl shadow-sm">
                  🎡
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

            {/* Right Side: Icons */}
            <div className="flex items-center gap-5 text-slate-600">
              <button className="hover:text-purple-600 transition-colors">
                <Moon size={20} />
              </button>
              <div className="flex items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors font-bold text-sm">
                <Globe size={20} />
                <span className="ml-1">EN</span>
                <ChevronDown size={14} />
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
