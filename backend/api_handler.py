
# Main handler for multiple API integrations
from apis.trucker_path import fetch_parking_data as fetch_trucker_path_data
from apis.park_my_truck import fetch_parking_data as fetch_park_my_truck_data
from apis.osm import fetch_parking_data as fetch_osm_data

def get_all_parking_data():
    data = []
    # Consolidate data from all APIs with improved error handling
    try:
        data.extend(fetch_trucker_path_data())
    except Exception as e:
        print(f"Error fetching data from Trucker Path: {e}")

    try:
        data.extend(fetch_park_my_truck_data())
    except Exception as e:
        print(f"Error fetching data from Park My Truck: {e}")

    try:
        data.extend(fetch_osm_data())
    except Exception as e:
        print(f"Error fetching data from OSM: {e}")

    return data
