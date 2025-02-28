import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [flokker, setFlokker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buemerkePlacements, setBuemerkePlacements] = useState({});
  const [animatedReinCount, setAnimatedReinCount] = useState(0);
  const [animatedFlokkCount, setAnimatedFlokkCount] = useState(0);
  const [statsHovered, setStatsHovered] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFlokker = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/flokk/", {
          withCredentials: true,
        });
        setFlokker(response.data.flokker);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching flokker:", err);
        setError("Failed to load flokker");
        setLoading(false);
      }
    };

    fetchFlokker();
  }, []);

  useEffect(() => {
    if (flokker.length > 0) {
      // Start animation for counts
      const totalReinsdyr = flokker.reduce(
        (sum, flokk) => sum + (flokk.reinsdyr?.length || 0),
        0
      );
      
      const animateReinCount = () => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = totalReinsdyr / steps;
        let current = 0;
        
        const interval = setInterval(() => {
          current += increment;
          if (current >= totalReinsdyr) {
            setAnimatedReinCount(totalReinsdyr);
            clearInterval(interval);
          } else {
            setAnimatedReinCount(Math.floor(current));
          }
        }, duration / steps);
      };
      
      const animateFlokkCount = () => {
        const duration = 800; // 0.8 seconds
        const steps = 60;
        const increment = flokker.length / steps;
        let current = 0;
        
        const interval = setInterval(() => {
          current += increment;
          if (current >= flokker.length) {
            setAnimatedFlokkCount(flokker.length);
            clearInterval(interval);
          } else {
            setAnimatedFlokkCount(Math.floor(current));
          }
        }, duration / steps);
      };
      
      animateReinCount();
      animateFlokkCount();
    }
  }, [flokker]);

  // Function to set buemerke placement on the image
  const setBuemerkePlacement = (flokkId, x, y) => {
    setBuemerkePlacements(prev => ({
      ...prev,
      [flokkId]: { x, y }
    }));
  };

  // Calculate pagination values
  const indexOfLastFlokk = currentPage * itemsPerPage;
  const indexOfFirstFlokk = indexOfLastFlokk - itemsPerPage;
  const currentFlokker = flokker.slice(indexOfFirstFlokk, indexOfLastFlokk);
  const totalPages = Math.ceil(flokker.length / itemsPerPage);

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading your flokker...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Min Profil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Featured Stats Box - Always visible on all pages */}
          <div 
            className="lg:col-span-2 lg:row-span-2 bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-500"
            onMouseEnter={() => setStatsHovered(true)}
            onMouseLeave={() => setStatsHovered(false)}
          >
            <div className="p-6 relative h-full">
              <div className={`mb-6 transition-all duration-500 ${statsHovered ? 'opacity-100' : 'opacity-100'}`}>
                <h2 className="text-2xl font-bold text-white mb-4">Statistikk</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-600 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">Antall reinsdyr</p>
                    <p className="text-white text-3xl font-bold">{animatedReinCount}</p>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">Antall flokker</p>
                    <p className="text-white text-3xl font-bold">{animatedFlokkCount}</p>
                  </div>
                </div>
              </div>
              
              <div className={`relative mt-4 h-64 bg-gray-600 rounded-lg overflow-hidden transition-all duration-500 ${statsHovered ? 'opacity-100' : 'opacity-0 h-0'}`}>
                {/* Map image */}
                <img 
                  src="/api/placeholder/800/400" 
                  alt="Beiteområde" 
                  className="w-full h-full object-cover"
                />
                
                {/* Buemerke overlay */}
                {flokker.map((flokk) => {
                  const placement = buemerkePlacements[flokk._id] || { x: 50, y: 50 };
                  return (
                    <div 
                      key={flokk._id}
                      className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        top: `${placement.y}%`, 
                        left: `${placement.x}%`,
                      }}
                    >
                      <img 
                        src={`http://localhost:4000/${flokk.buemerke_bilde}`} 
                        alt={flokk.buemerke_navn}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* Additional stats that appear on hover */}
              <div className={`mt-4 transition-all duration-500 ${statsHovered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                <div className="bg-gray-600 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm">Gjennomsnittlig størrelse per flokk</p>
                  <p className="text-white text-xl font-bold">
                    {flokker.length > 0 
                      ? (flokker.reduce((sum, flokk) => sum + (flokk.reinsdyr?.length || 0), 0) / flokker.length).toFixed(1) 
                      : 0}
                  </p>
                </div>
                
                <div className="bg-gray-600 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">Største flokk</p>
                  <p className="text-white text-xl font-bold">
                    {flokker.length > 0 
                      ? flokker.reduce((max, flokk) => Math.max(max, flokk.reinsdyr?.length || 0), 0)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Flokk Grid - Only show current page items */}
          {currentFlokker.map((flokk) => (
            <div 
              key={flokk._id} 
              className="bg-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-white">{flokk.navn}</h3>
                  <div className="bg-gray-600 rounded-full px-2 py-1">
                    <p className="text-gray-300 text-xs">#{flokk.serienummer}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  <div className="w-16 h-16 mr-4 bg-gray-600 rounded-lg overflow-hidden">
                    <img 
                      src={`http://localhost:4000/${flokk.buemerke_bilde}`}
                      alt={flokk.buemerke_navn}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Buemerke:</p>
                    <p className="text-white font-medium">{flokk.buemerke_navn}</p>
                    <p className="text-gray-300 text-sm mt-1">Reinsdyr:</p>
                    <p className="text-white font-medium">{flokk.reinsdyr?.length || 0}</p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition-colors">
                    Detaljer
                  </button>
                  <div>
                    <button className="bg-transparent hover:bg-gray-600 text-gray-300 p-1 rounded-md mr-2 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="bg-transparent hover:bg-gray-600 text-gray-300 p-1 rounded-md transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Flokk Card - Always visible on all pages */}
          {currentPage === 1 || currentFlokker.length < itemsPerPage - 1 ? (
            <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden flex items-center justify-center hover:bg-gray-600 transition-colors duration-300">
              <a 
                href="/CreateFlokk" 
                className="text-white hover:text-gray-200 flex flex-col items-center p-6 w-full h-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-lg font-medium">Legg til ny flokk</p>
              </a>
            </div>
          ) : null}

          {/* Pagination Controls */}
          {flokker.length > itemsPerPage && (
            <div className="lg:col-span-4 flex justify-center items-center mt-8">
              <div className="bg-gray-700 rounded-lg shadow px-4 py-3 flex items-center">
                <button 
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full mr-4 flex items-center justify-center transition-colors duration-300 ${
                    currentPage === 1 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-white hover:bg-gray-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <span className="text-white font-medium mx-4">
                  Side {currentPage} av {totalPages}
                </span>

                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ml-4 flex items-center justify-center transition-colors duration-300 ${
                    currentPage === totalPages 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-white hover:bg-gray-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;