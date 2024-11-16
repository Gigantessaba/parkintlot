import { create } from 'zustand';
export const useParkingStore = create((set) => ({
    spots: [],
    selectedSpot: null,
    updateSpots: (spots) => set({ spots }),
    updateSpotStatus: (spotId, isOccupied) => set((state) => ({
        spots: state.spots.map((spot) => spot.id === spotId
            ? Object.assign(Object.assign({}, spot), { isOccupied, lastUpdated: new Date() }) : spot),
    })),
    setSelectedSpot: (spot) => set(() => ({
        selectedSpot: spot,
    })),
}));
