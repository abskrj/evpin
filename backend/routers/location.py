from fastapi import APIRouter, Query, Request, HTTPException

from typing import Annotated, Optional, Any
from models.models import OlaMapsPlace
# from apis.nominatim import location as nominatim
from apis.olamaps import location as olamaps
router = APIRouter(prefix="/location", tags=["location"])

@router.get("/search", response_model=Any)
async def get_location(
    query: Annotated[str, Query(min_length=1)],
    lng: Optional[Annotated[float, Query(ge=-180, le=180)]] = None, 
    lat: Optional[Annotated[float, Query(ge=-90, le=90)]] = None,
):
    try:
        resp = olamaps.auto_complete_places(query, lat, lng)
        predictions = resp.get("predictions", [])
        errors = resp.get("errors", None)
        if errors:
            raise HTTPException(status_code=400, detail=errors)
        
        return [OlaMapsPlace.model_validate(place) for place in predictions]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
