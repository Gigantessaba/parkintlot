// Generate mock parking spots around a given location
export const generateMockSpots = (lat, lng, count = 20) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        number: `SPOT-${i + 1}`,
        isOccupied: Math.random() > 0.6,
        lastUpdated: new Date(),
        sensorId: `sensor-${i + 1}`,
        location: {
            lat: lat + (Math.random() - 0.5) * 0.02,
            lng: lng + (Math.random() - 0.5) * 0.02,
        },
        dimensions: {
            length: 40,
            width: 10,
        },
        amenities: {
            electric: Math.random() > 0.5,
            water: Math.random() > 0.5,
            security: Math.random() > 0.3,
        },
    }));
};
