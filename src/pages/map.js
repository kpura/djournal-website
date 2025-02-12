import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { X } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 12.974,
  lng: 123.978,
};

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [center, setCenter] = useState(defaultCenter);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlaces(data);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  }, []);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchInput(query);

    if (query.trim() === "") {
      setFilteredPlaces([]);
      return;
    }

    const filtered = places.filter((place) =>
      place.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlaces(filtered);
  };

  const handleSelectPlace = (place) => {
    if (!place.latitude || !place.longitude || isNaN(place.latitude) || isNaN(place.longitude)) {
      console.error("Invalid coordinates:", place);
      return;
    }
  
    setCenter({ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) });
    setSelectedPlace(place);
    setSearchInput(place.name);
    setFilteredPlaces([]);
    setActiveMarker(place.name);
  };

  const clearSearch = () => {
    setSearchInput("");
    setFilteredPlaces([]);
    setSelectedPlace(null);
    setActiveMarker(null);
    setCenter(defaultCenter);
  };

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-[#1E1E2E]`}>
      <div className="flex-1 flex flex-col">
        <Header darkMode={darkMode} />

        <main className="p-4 flex gap-4 h-[500px]">
          {/* Left Panel */}
          <div className="w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col justify-between relative">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6 font-[Poppins]">
                Search Location
              </h2>

              {/* Search Input */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full p-2 pr-10 border rounded font-[Poppins] bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Search for a location..."
                  value={searchInput}
                  onChange={handleSearch}
                />
                {searchInput && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-600 p-1 rounded-full"
                    onClick={clearSearch}
                  >
                    <X size={16} className="text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {filteredPlaces.length > 0 && (
                <ul className="absolute left-1/2 transform -translate-x-1/2 w-11/12 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-md z-10 max-h-[40vh] overflow-y-auto">
                  {filteredPlaces.map((place, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 font-[Poppins] text-gray-700 dark:text-gray-300"
                      onClick={() => handleSelectPlace(place)}
                    >
                      {place.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Info Panel */}
            {selectedPlace && (
              <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-700 shadow-sm">
                <h3 className="text-md font-bold font-[Poppins] text-gray-800 dark:text-gray-300">
                  {selectedPlace.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-[Poppins]">
                  {selectedPlace.vicinity}
                </p>
                <p className="text-xs mt-2 font-[Poppins] text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Mood:</span>{" "}
                  {selectedPlace.joyful}, {selectedPlace.content}, {selectedPlace.uncertain}
                </p>
              </div>
            )}
          </div>

          {/* Google Map */}
          <div className="w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                {places.map((place, index) => (
                  <Marker
                    key={place.id}
                    position={{ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }}
                    onClick={() => handleSelectPlace(place)}
                    icon={{
                      url: activeMarker === place.name
                        ? (darkMode 
                            ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            : "https://maps.google.com/mapfiles/ms/icons/red-dot.png")
                        : "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                    }}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </main>
      </div>
    </div>
  );
}
