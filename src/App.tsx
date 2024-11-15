import { ParkingMap } from './components/ParkingMap';
import { useParkingStore } from './store/parkingStore';
import { useParkingData } from './hooks/useParkingData';

function App() {
  const { spots, selectedSpot, setSelectedSpot } = useParkingStore();
  const { loading, error, handleMapMove } = useParkingData(42.3601, -71.0589, 50); // Boston coordinates

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading parking data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Real-Time Truck Parking Monitor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ParkingMap 
              spots={spots} 
              onSpotSelect={setSelectedSpot}
              onMapMove={handleMapMove}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Parking Information</h2>
            {selectedSpot ? (
              <div>
                <h3 className="text-lg font-medium">Spot {selectedSpot.number}</h3>
                <div className="mt-4 space-y-2">
                  <p>Status: <span className={selectedSpot.isOccupied ? 'text-red-600' : 'text-green-600'}>
                    {selectedSpot.isOccupied ? 'Occupied' : 'Available'}
                  </span></p>
                  <p>Dimensions: {selectedSpot.dimensions.length}' x {selectedSpot.dimensions.width}'</p>
                  <p>Last Updated: {selectedSpot.lastUpdated.toLocaleTimeString()}</p>
                  <div className="mt-4">
                    <h4 className="font-medium">Amenities:</h4>
                    <ul className="mt-2 space-y-1">
                      {selectedSpot.amenities.electric && <li>✓ Electric Hookup</li>}
                      {selectedSpot.amenities.water && <li>✓ Water Access</li>}
                      {selectedSpot.amenities.security && <li>✓ 24/7 Security</li>}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Select a parking spot on the map to view details</p>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Available Spots</h3>
              <p className="text-2xl font-bold text-green-600">
                {spots.filter(spot => !spot.isOccupied).length} / {spots.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;