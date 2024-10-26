from fastapi import APIRouter

from . import ev_chargers

router = APIRouter(prefix="/api/v1")

router.include_router(ev_chargers.router)