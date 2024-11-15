import { useState, useEffect, useCallback } from 'react';
import { TruckSpot } from '../types';
import { parkingApiService } from '../services/parkingApi';
import { useParkingStore } from '../store/parkingStore';

export const useParkingData = (initialLat: number, initialLng: number, radius: number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: initialLat, lng: initialLng });
  const { updateSpots } = useParkingStore();

  const fetchParkingData = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const parkingSpots = await parkingApiService.getAllParkingSpots(lat, lng, radius);
      updateSpots(parkingSpots);
      setError(null);
    } catch (err) {
      setError('Failed to fetch parking data');
      console.error('Error fetching parking data:', err);
    } finally {
      setLoading(false);
    }
  }, [radius, updateSpots]);

  useEffect(() => {
    fetchParkingData(coordinates.lat, coordinates.lng);
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchParkingData(coordinates.lat, coordinates.lng);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [coordinates, fetchParkingData]);

  const handleMapMove = useCallback((newCenter: { lat: number; lng: number }) => {
    setCoordinates(newCenter);
  }, []);

  return { loading, error, handleMapMove };
};