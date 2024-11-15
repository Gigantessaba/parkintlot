export interface ParkingSpot {
    id: string;
    location: { lat: number; lng: number };
    isOccupied: boolean;
    number: string;
    lastUpdated: Date;
}

// Add any other exports here
