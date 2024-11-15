
export interface ParkingSpot {
  id: string;
  location: { lat: number; lng: number };
  isOccupied: boolean;
  number: string;
  lastUpdated: Date;
}

export interface TruckSpot extends ParkingSpot {
  truckType: string;
  amenities: string[];
}
