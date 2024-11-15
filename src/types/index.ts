export interface TruckSpot {
  id: number;
  number: string;
  isOccupied: boolean;
  lastUpdated: Date;
  sensorId: string;
  dimensions: {
    length: number;
    width: number;
  };
  location: {
    lat: number;
    lng: number;
  };
  amenities: {
    electric: boolean;
    water: boolean;
    security: boolean;
  };
}

export interface ParkingState {
  spots: TruckSpot[];
  selectedSpot: TruckSpot | null;
  updateSpots: (spots: TruckSpot[]) => void;
  updateSpotStatus: (spotId: number, isOccupied: boolean) => void;
  setSelectedSpot: (spot: TruckSpot | null) => void;
}