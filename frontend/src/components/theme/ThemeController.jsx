import { useEffect, useState } from "react";

const ThemeController = () => {
  const [theme, setTheme] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";

    setTheme(savedTheme);

    document.documentElement.setAttribute("data-theme", savedTheme);
    setHasMounted(true)
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "black" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!hasMounted || theme === null) return null;

  return (
    <label className="toggle text-base-content rounded-full ">
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === "black"}
      />

      {/* Sun Icon */}
      <svg
        aria-label="sun"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-5 h-5  transition-opacity duration-300 ${theme === "black" ? "opacity-0" : "opacity-100"}`}
      >
        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </g>
      </svg>

      {/* Moon Icon */}
      <svg
        aria-label="moon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-5 h-5 rounded-full transition-opacity duration-300 ${theme === "black" ? "opacity-100" : "opacity-0"}`}
      >
        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="1" fill="none" stroke="currentColor">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </g>
      </svg>
    </label>
  );
};

export default ThemeController;
