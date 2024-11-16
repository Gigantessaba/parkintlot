var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useCallback } from 'react';
import { parkingApiService } from '../services/parkingApi';
import { useParkingStore } from '../store/parkingStore';
export const useParkingData = (initialLat, initialLng, radius) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coordinates, setCoordinates] = useState({ lat: initialLat, lng: initialLng });
    const { updateSpots } = useParkingStore();
    const fetchParkingData = useCallback((lat, lng) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            const parkingSpots = yield parkingApiService.getAllParkingSpots(lat, lng, radius);
            updateSpots(parkingSpots);
            setError(null);
        }
        catch (err) {
            setError('Failed to fetch parking data');
            console.error('Error fetching parking data:', err);
        }
        finally {
            setLoading(false);
        }
    }), [radius, updateSpots]);
    useEffect(() => {
        fetchParkingData(coordinates.lat, coordinates.lng);
        // Refresh data every 30 seconds
        const interval = setInterval(() => {
            fetchParkingData(coordinates.lat, coordinates.lng);
        }, 30000);
        return () => clearInterval(interval);
    }, [coordinates, fetchParkingData]);
    const handleMapMove = useCallback((newCenter) => {
        setCoordinates(newCenter);
    }, []);
    return { loading, error, handleMapMove };
};
