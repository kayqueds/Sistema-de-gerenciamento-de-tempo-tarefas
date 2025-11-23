import { useContext, useEffect } from "react";
import { ThemeContext } from "../theme/Theme.jsx";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-16 h-8 flex items-center rounded-full 
        transition-all duration-300
        ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}
      `}
    >
      {/* Knob */}
      <span
        className={`
          absolute w-7 h-7 rounded-full flex items-center justify-center
          transition-all duration-300 transform
          ${theme === "dark" ? "translate-x-8 bg-yellow-400" : "translate-x-1 bg-white"}
          shadow-md
        `}
        style={{ pointerEvents: "none" }}
      >
        {/* Ícone animado */}
        <span
          className={`
            transition-transform duration-500
            ${theme === "dark" ? "rotate-180" : "rotate-0"}
          `}
        >
          {theme === "light" ? (
            // SOL
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-yellow-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2m6.364.636l-1.414 1.414M21 12h-2m-.636 6.364l-1.414-1.414M12 19v2m-6.364-.636l1.414-1.414M5 12H3m.636-6.364l1.414 1.414M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            // LUA
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-gray-900"
            >
              <path d="M21.75 15.004A9.718 9.718 0 0112 22C6.477 22 2 17.523 2 12c0-5.523 4.477-10 10-10 .75 0 1.478.083 2.176.24a.75.75 0 01.152 1.414A7.5 7.5 0 0018 14.5c0 1.618-.514 3.116-1.39 4.35a.75.75 0 011.14.887z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
