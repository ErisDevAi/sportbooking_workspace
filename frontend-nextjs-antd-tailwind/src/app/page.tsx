export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to the Decision Maker Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Make informed decisions with ease.
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
          Get Started
        </button>
      </div>

      {/* NAVBAR */}
      <nav className="relative bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
                alt="logo"
              />
            </div>

            <div className="hidden sm:flex space-x-4">
              <a className="text-white">Dashboard</a>
              <a className="text-gray-300">Team</a>
              <a className="text-gray-300">Projects</a>
              <a className="text-gray-300">Calendar</a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
