from flask import Flask, jsonify
from api_handler import get_all_parking_data

app = Flask(__name__)

@app.route('/api/parking-data', methods=['GET'])
def parking_data():
    try:
        data = get_all_parking_data()
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
