import React, { useEffect, useState } from 'react';
import { fetchParkingData } from '../api/parkingData';

const ParkingList = () => {
    const [parkingData, setParkingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadParkingData() {
            const data = await fetchParkingData();
            setParkingData(data);
            setLoading(false);
        }
        loadParkingData();
    }, []);

    if (loading) return <div>Loading parking data...</div>;

    return (
        <div>
            <h1>Truck Parking Spots</h1>
            <ul>
                {parkingData.map((spot, index) => (
                    <li key={index}>
                        <h2>{spot.name || 'Unknown Location'}</h2>
                        <p>{spot.description || 'No description available'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParkingList;
