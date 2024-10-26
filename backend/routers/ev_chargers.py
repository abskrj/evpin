from fastapi import APIRouter, Query, Request, HTTPException

from typing import Annotated
from bson import ObjectId
from models.models import EVChargerStrippedList, EVChargerStripped, EVChargerPublic

router = APIRouter(prefix="/ev-chargers")

@router.get("/nearby", response_model=EVChargerStrippedList)
async def get_ev_chargers_stripped(
    request: Request,
    longitude: Annotated[float, Query(ge=-180, le=180)], 
    latitude: Annotated[float, Query(ge=-90, le=90)], 
    radius: Annotated[float, Query(ge=0, le=1000000)] = 5000,
    limit: Annotated[int, Query(ge=1, le=200)] = 200
):
    ev_chargers = await request.app.mongodb.ev_chargers.find(
        {
            "location": {
                "$near": {
                    "$geometry": {"type": "Point", "coordinates": [longitude, latitude]},
                    "$maxDistance": radius
                }
            }
        }
    ).to_list(length=limit)
    return EVChargerStrippedList(data=[EVChargerStripped(**ev_charger) for ev_charger in ev_chargers])

@router.get("/{id}", response_model=EVChargerPublic)
async def get_ev_charger(request: Request, id: str):
    ev_charger = await request.app.mongodb.ev_chargers.find_one({"_id": ObjectId(id)})
    if ev_charger is None:
        raise HTTPException(status_code=404, detail="EV Charger not found")
    return EVChargerPublic(**ev_charger)

@router.post("/ev-chargers")
async def insert_ev_chargers():
    pass