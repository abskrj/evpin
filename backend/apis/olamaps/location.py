import requests
from config import settings
BASE_URL = 'https://api.olamaps.io/'

def auto_complete_places(query: str, latitude: float | None = None, longitude: float | None = None) -> dict:
    url = f'{BASE_URL}/places/v1/autocomplete'
    params = {'input': query, 'api_key': settings.OLA_MAPS_API_KEY}

    if latitude and longitude:
        params['location'] = f'{latitude},{longitude}'
    response = requests.get(url, params=params)
    return response.json()
