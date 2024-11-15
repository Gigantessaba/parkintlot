import { create } from 'zustand';
import { ParkingState, TruckSpot } from '../types';

export const useParkingStore = create<ParkingState>((set) => ({
  spots: [],
  selectedSpot: null,
  updateSpots: (spots: TruckSpot[]) => set({ spots }),
  updateSpotStatus: (spotId: number, isOccupied: boolean) =>
    set((state) => ({
      spots: state.spots.map((spot) =>
        spot.id === spotId
          ? {
              ...spot,
              isOccupied,
              lastUpdated: new Date(),
            }
          : spot
      ),
    })),
  setSelectedSpot: (spot: TruckSpot | null) =>
    set(() => ({
      selectedSpot: spot,
    })),
}));