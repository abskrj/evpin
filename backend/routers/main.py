from fastapi import APIRouter

from . import ev_chargers, location

router = APIRouter(prefix="/api/v1")

router.include_router(ev_chargers.router)
router.include_router(location.router)