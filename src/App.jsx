import React from 'react';
import ParkingList from './components/ParkingList';
import { useParkingStore } from './store/parkingStore';

const App: React.FC = () => {
    const { spots } = useParkingStore((state) => state); // Accessing the `spots` from the store

    return (
        <div>
            <h1>Parking Lot App</h1>
            <p>
                Available Spots: {spots.filter((spot) => !spot.isOccupied).length} / {spots.length}
            </p>
            <ParkingList />
        </div>
    );
};

export default App;
