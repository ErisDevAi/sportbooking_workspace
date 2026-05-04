export default function Home() {
  return (
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
  );
}
