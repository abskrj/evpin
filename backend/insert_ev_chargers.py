import requests
import asyncio

from models.models import EVChargerCreate, Location
from db.main import get_db_session

from dotenv import load_dotenv

load_dotenv()

async def insert_ev_chargers():
    url = 'https://backend.statiq.co.in/station/v1/markers'
    headers = {
        'accept': '*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'cache-control': 'max-age=0',
        'company-id': '90',
        'content-type': 'application/json',
        'origin': 'https://www.statiq.in',
        'priority': 'u=1, i',
        'referer': 'https://www.statiq.in/',
        'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    }
    data = {
        "latitude": 12.971599,
        "longitude": 77.594566,
        "all_chargers": 1,
        "connector_id": [],
        "vertices": [
            [77.35447057690232, 13.122346691566747],
            [77.83466142310493, 13.122346691566747],
            [77.83466142310493, 12.820759892334763],
            [77.35447057690232, 12.820759892334763],
            [77.35447057690232, 13.122346691566747]
        ]
    }

    response = requests.post(url, headers=headers, json=data)
    json_response = response.json()
    ev_stations = json_response["data"]["stations"]

    ev_chargers = []

    for ev_station in ev_stations:

        location = Location(
            type="Point",
            coordinates=[ev_station["longitude"], ev_station["latitude"]]
        )

        ev_charger = EVChargerCreate(
            **ev_station,
            is_open=ev_station["access_type"] == 1,
            title=ev_station["station_name"],
            city='Bengaluru',
            location=location,
            pin_image_url=ev_station["map_pin_url"],
            source='statiq.in',
            source_station_id=str(ev_station["station_id"]),
        )
        ev_chargers.append(ev_charger.model_dump())

    async for session in get_db_session():
        await session.ev_chargers.insert_many(ev_chargers)

if __name__ == "__main__":
    asyncio.run(insert_ev_chargers())
