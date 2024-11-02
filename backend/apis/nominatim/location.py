import requests
from urllib.parse import urlencode
BASE_URL = "https://nominatim.openstreetmap.org"

BASE_QUERY_PARAMS: dict[str, int | str] = {
    "polygon_geojson": 1,
    "countrycodes": "in",
    "format": "jsonv2",
}

def get_location(query: str) -> requests.Response:
    url = f"{BASE_URL}/search?q={query}&{urlencode(BASE_QUERY_PARAMS)}"
    response = requests.get(url)
    return response.json()