// Frontend script to fetch parking data from the backend
export async function fetchParkingData() {
    try {
        const response = await fetch('/api/parking-data');
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            console.error('Error fetching parking data:', data.error);
            return [];
        }
    } catch (error) {
        console.error('Network error:', error);
        return [];
    }
}
