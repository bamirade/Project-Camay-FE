const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8">
          The page you are looking for might have been moved or doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block bg-[#D8C1A9] hover:bg-[#E8D9C2] text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
