import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white p-4 flex items-center justify-between">
      <div className="flex grow-0 lg:hidden">
        <button
          onClick={toggleMenu}
          className="text-black hover:text-gray-600 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div
        className={`flex items-center ${
          isMenuOpen ? "hidden" : "lg:block md:grow justify-center"
        }`}
        style={{
          flexGrow: window.matchMedia("(max-width: 768px)").matches ? "1" : "0",
          justifyContent: window.matchMedia("(max-width: 768px)").matches
            ? "center"
            : "flex-start",
        }}
      >
        <a href="/">
          <img src="/icon2.png" alt="Logo" className="h-auto w-64" />
        </a>
      </div>

      <div
        className={`lg:flex space-x-4 items-center ${
          isMenuOpen ? "flex h-16 items-center" : "hidden"
        }`}
      >
        <a
          href="/login"
          className="text-black hover:text-gray-600 transition duration-300"
        >
          Login
        </a>
        <a
          href="/cart"
          className="text-black hover:text-gray-600 transition duration-300"
        >
          <div className="relative py-2">
            <div className="t-0 absolute left-3">
              <p className="flex h-1 w-1 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                1
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="file: h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
        </a>
      </div>
    </header>
  );
}

export default Header;
