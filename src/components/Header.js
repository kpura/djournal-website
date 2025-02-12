import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // Import icons

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname; // Get the current route

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <img src="/logo2.png" alt="Djournal Logo" className="h-6 w-auto ml-2 mr-20" />
        <ul className="flex space-x-6">
          <li
            className={`text-sm p-2 rounded cursor-pointer font-medium font-[Poppins] ${
              currentPath === "/dashboard"
                ? "text-blue-600 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </li>
          <li
            className={`text-sm p-2 rounded cursor-pointer font-medium font-[Poppins] ${
              currentPath === "/map"
                ? "text-blue-600 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => router.push("/map")}
          >
            Tourist Map
          </li>
        </ul>
      </div>

      <div className="flex items-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <div className="relative w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full transition mr-3">
            <div
              className={`absolute w-4 h-4 bg-white dark:bg-gray-300 rounded-full shadow-md top-1 left-1 transition-transform ${
                darkMode ? "translate-x-5" : ""
              } flex items-center justify-center`}
            >
              {darkMode ? <Moon size={12} className="text-gray-700" /> : <Sun size={12} className="text-yellow-500" />}
            </div>
          </div>
        </label>
      </div>
    </header>
  );
}
