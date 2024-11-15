import axios from 'axios';
import { TruckSpot } from '../types';
import { generateMockSpots } from './mockData';

const USE_MOCK_DATA = true; // Toggle this to switch between mock and real data

class ParkingApiService {
  private truckParkApi = axios.create({
    baseURL: import.meta.env.VITE_TRUCKPARK_API_URL,
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_TRUCKPARK_API_KEY}`,
    },
  });

  private truckerPathApi = axios.create({
    baseURL: import.meta.env.VITE_TRUCKERPATH_API_URL,
    headers: {
      'X-API-Key': import.meta.env.VITE_TRUCKERPATH_API_KEY,
    },
  });

  private hereApi = axios.create({
    baseURL: 'https://parking.api.here.com/parking/2.7',
    params: {
      apiKey: import.meta.env.VITE_HERE_API_KEY,
    },
  });

  async getAllParkingSpots(lat: number, lng: number, radius: number): Promise<TruckSpot[]> {
    if (USE_MOCK_DATA) {
      return generateMockSpots(lat, lng);
    }

    try {
      const [truckParkSpots, truckerPathSpots, hereSpots] = await Promise.all([
        this.fetchTruckParkData(lat, lng, radius),
        this.fetchTruckerPathData(lat, lng, radius),
        this.fetchHereData(lat, lng, radius),
      ]);

      const allSpots = [...truckParkSpots, ...truckerPathSpots, ...hereSpots];
      return this.deduplicateSpots(allSpots);
    } catch (error) {
      console.error('Error fetching parking data:', error);
      return generateMockSpots(lat, lng); // Fallback to mock data on error
    }
  }

  private async fetchTruckParkData(lat: number, lng: number, radius: number): Promise<TruckSpot[]> {
    try {
      const response = await this.truckParkApi.get('/spots', {
        params: { lat, lng, radius },
      });
      return response.data?.spots?.map(this.normalizeTruckParkSpot) || [];
    } catch (error) {
      console.error('TruckPark API Error:', error);
      return [];
    }
  }

  private async fetchTruckerPathData(lat: number, lng: number, radius: number): Promise<TruckSpot[]> {
    try {
      const response = await this.truckerPathApi.get('/parking', {
        params: { latitude: lat, longitude: lng, radius },
      });
      return response.data?.spots?.map(this.normalizeTruckerPathSpot) || [];
    } catch (error) {
      console.error('TruckerPath API Error:', error);
      return [];
    }
  }

  private async fetchHereData(lat: number, lng: number, radius: number): Promise<TruckSpot[]> {
    try {
      const response = await this.hereApi.get('/parking-availability', {
        params: {
          lat,
          lng,
          radius: radius * 1000,
          parkingType: 'truck',
        },
      });
      return response.data?.results?.map(this.normalizeHereSpot) || [];
    } catch (error) {
      console.error('HERE API Error:', error);
      return [];
    }
  }

  private normalizeTruckParkSpot(spot: any): TruckSpot {
    return {
      id: spot.id,
      number: spot.spotNumber || `TP-${spot.id}`,
      isOccupied: Boolean(spot.occupied),
      lastUpdated: new Date(spot.lastUpdated || Date.now()),
      sensorId: String(spot.sensorId || `tp-${spot.id}`),
      location: {
        lat: Number(spot.latitude),
        lng: Number(spot.longitude),
      },
      dimensions: {
        length: Number(spot.length) || 40,
        width: Number(spot.width) || 10,
      },
      amenities: {
        electric: Boolean(spot.hasElectric),
        water: Boolean(spot.hasWater),
        security: Boolean(spot.hasSecurity),
      },
    };
  }

  private normalizeTruckerPathSpot(spot: any): TruckSpot {
    return {
      id: spot.id,
      number: spot.spotId || `TP-${spot.id}`,
      isOccupied: !spot.available,
      lastUpdated: new Date(spot.lastUpdate || Date.now()),
      sensorId: `tpath-${spot.id}`,
      location: {
        lat: Number(spot.lat),
        lng: Number(spot.lng),
      },
      dimensions: {
        length: 40,
        width: 10,
      },
      amenities: {
        electric: Boolean(spot.amenities?.includes('electric')),
        water: Boolean(spot.amenities?.includes('water')),
        security: Boolean(spot.amenities?.includes('security')),
      },
    };
  }

  private normalizeHereSpot(spot: any): TruckSpot {
    return {
      id: spot.id,
      number: spot.name || `HERE-${spot.id}`,
      isOccupied: spot.availableSpots === 0,
      lastUpdated: new Date(spot.lastUpdated || Date.now()),
      sensorId: `here-${spot.id}`,
      location: {
        lat: Number(spot.position?.[0]) || 0,
        lng: Number(spot.position?.[1]) || 0,
      },
      dimensions: {
        length: 40,
        width: 10,
      },
      amenities: {
        electric: Boolean(spot.amenities?.includes('electric')),
        water: Boolean(spot.amenities?.includes('water')),
        security: Boolean(spot.amenities?.includes('security')),
      },
    };
  }

  private deduplicateSpots(spots: TruckSpot[]): TruckSpot[] {
    const uniqueSpots = new Map<string, TruckSpot>();
    
    spots.forEach(spot => {
      const key = `${spot.location.lat.toFixed(5)},${spot.location.lng.toFixed(5)}`;
      if (!uniqueSpots.has(key) || spot.lastUpdated > uniqueSpots.get(key)!.lastUpdated) {
        uniqueSpots.set(key, spot);
      }
    });

    return Array.from(uniqueSpots.values());
  }
}

export const parkingApiService = new ParkingApiService();