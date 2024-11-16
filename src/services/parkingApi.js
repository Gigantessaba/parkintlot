var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { generateMockSpots } from './mockData';
const USE_MOCK_DATA = true; // Toggle this to switch between mock and real data
class ParkingApiService {
    constructor() {
        this.truckParkApi = axios.create({
            baseURL: import.meta.env.VITE_TRUCKPARK_API_URL,
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_TRUCKPARK_API_KEY}`,
            },
        });
        this.truckerPathApi = axios.create({
            baseURL: import.meta.env.VITE_TRUCKERPATH_API_URL,
            headers: {
                'X-API-Key': import.meta.env.VITE_TRUCKERPATH_API_KEY,
            },
        });
        this.hereApi = axios.create({
            baseURL: 'https://parking.api.here.com/parking/2.7',
            params: {
                apiKey: import.meta.env.VITE_HERE_API_KEY,
            },
        });
    }
    getAllParkingSpots(lat, lng, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            if (USE_MOCK_DATA) {
                return generateMockSpots(lat, lng);
            }
            try {
                const [truckParkSpots, truckerPathSpots, hereSpots] = yield Promise.all([
                    this.fetchTruckParkData(lat, lng, radius),
                    this.fetchTruckerPathData(lat, lng, radius),
                    this.fetchHereData(lat, lng, radius),
                ]);
                const allSpots = [...truckParkSpots, ...truckerPathSpots, ...hereSpots];
                return this.deduplicateSpots(allSpots);
            }
            catch (error) {
                console.error('Error fetching parking data:', error);
                return generateMockSpots(lat, lng); // Fallback to mock data on error
            }
        });
    }
    fetchTruckParkData(lat, lng, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.truckParkApi.get('/spots', {
                    params: { lat, lng, radius },
                });
                return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.spots) === null || _b === void 0 ? void 0 : _b.map(this.normalizeTruckParkSpot)) || [];
            }
            catch (error) {
                console.error('TruckPark API Error:', error);
                return [];
            }
        });
    }
    fetchTruckerPathData(lat, lng, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.truckerPathApi.get('/parking', {
                    params: { latitude: lat, longitude: lng, radius },
                });
                return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.spots) === null || _b === void 0 ? void 0 : _b.map(this.normalizeTruckerPathSpot)) || [];
            }
            catch (error) {
                console.error('TruckerPath API Error:', error);
                return [];
            }
        });
    }
    fetchHereData(lat, lng, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.hereApi.get('/parking-availability', {
                    params: {
                        lat,
                        lng,
                        radius: radius * 1000,
                        parkingType: 'truck',
                    },
                });
                return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.map(this.normalizeHereSpot)) || [];
            }
            catch (error) {
                console.error('HERE API Error:', error);
                return [];
            }
        });
    }
    normalizeTruckParkSpot(spot) {
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
    normalizeTruckerPathSpot(spot) {
        var _a, _b, _c;
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
                electric: Boolean((_a = spot.amenities) === null || _a === void 0 ? void 0 : _a.includes('electric')),
                water: Boolean((_b = spot.amenities) === null || _b === void 0 ? void 0 : _b.includes('water')),
                security: Boolean((_c = spot.amenities) === null || _c === void 0 ? void 0 : _c.includes('security')),
            },
        };
    }
    normalizeHereSpot(spot) {
        var _a, _b, _c, _d, _e;
        return {
            id: spot.id,
            number: spot.name || `HERE-${spot.id}`,
            isOccupied: spot.availableSpots === 0,
            lastUpdated: new Date(spot.lastUpdated || Date.now()),
            sensorId: `here-${spot.id}`,
            location: {
                lat: Number((_a = spot.position) === null || _a === void 0 ? void 0 : _a[0]) || 0,
                lng: Number((_b = spot.position) === null || _b === void 0 ? void 0 : _b[1]) || 0,
            },
            dimensions: {
                length: 40,
                width: 10,
            },
            amenities: {
                electric: Boolean((_c = spot.amenities) === null || _c === void 0 ? void 0 : _c.includes('electric')),
                water: Boolean((_d = spot.amenities) === null || _d === void 0 ? void 0 : _d.includes('water')),
                security: Boolean((_e = spot.amenities) === null || _e === void 0 ? void 0 : _e.includes('security')),
            },
        };
    }
    deduplicateSpots(spots) {
        const uniqueSpots = new Map();
        spots.forEach(spot => {
            const key = `${spot.location.lat.toFixed(5)},${spot.location.lng.toFixed(5)}`;
            if (!uniqueSpots.has(key) || spot.lastUpdated > uniqueSpots.get(key).lastUpdated) {
                uniqueSpots.set(key, spot);
            }
        });
        return Array.from(uniqueSpots.values());
    }
}
export const parkingApiService = new ParkingApiService();
