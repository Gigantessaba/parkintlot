import { create } from 'zustand';
import { ParkingState, ParkingSpot } from '../types';

export const useParkingStore = create<ParkingState>((set) => ({
  spots: [],
  selectedSpot: null,
  updateSpots: (spots: ParkingSpot[]) => set({ spots }),
  updateSpotStatus: (spotId: string, isOccupied: boolean) =>
    set((state) => ({
      spots: state.spots.map((spot) =>
        spot.id === spotId
          ? { ...spot, isOccupied, lastUpdated: new Date() }
          : spot
      ),
    })),
  setSelectedSpot: (spot: ParkingSpot | null) => set({ selectedSpot: spot }),
}));
