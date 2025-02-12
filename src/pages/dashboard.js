import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function Dashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const [places, setPlaces] = useState([]);

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

    useEffect(() => {
        fetch("/api/places")
            .then((res) => res.json())
            .then((data) => setPlaces(data))
            .catch((err) => console.error("Failed to fetch data:", err));
    }, []);

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-[#1E1E2E]`}>
            <div className="flex-1 flex flex-col">
                <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

                <main className="p-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6 font-[Poppins]">
                            Sorsogon Tourist Spots
                        </h2>

                        <div className="max-h-96 overflow-y-auto border dark:border-gray-700 rounded-lg">
                            <table className="min-w-full table-auto border-collapse text-sm font-[Poppins]">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 sticky top-0 z-10">
                                    <tr>
                                        <th className="py-3 px-6 border-b dark:border-gray-600 text-left w-1/3">Tourist Spot</th>
                                        <th className="py-3 px-6 border-b dark:border-gray-600 text-left w-1/3">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {places.length > 0 ? (
                                        places.map((place) => (
                                            <tr key={place.id} className="text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="py-4 px-6">{place.name}</td>
                                                <td className="py-4 px-6">{place.vicinity}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="py-4 px-6" colSpan="2">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
