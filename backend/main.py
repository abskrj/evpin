import logging
from fastapi import FastAPI
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers.main import router


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class CustomFastAPI(FastAPI):
    mongodb: AsyncIOMotorDatabase
    mongodb_client: AsyncIOMotorClient
    ev_chargers: AsyncIOMotorCollection

async def startup_db_client(app: CustomFastAPI):
    assert settings.MONGO_URL
    assert settings.DB_NAME
    app.mongodb_client = AsyncIOMotorClient(settings.MONGO_URL, tls=True, tlsAllowInvalidCertificates=True)
    app.mongodb = app.mongodb_client[settings.DB_NAME]
    logger.info("Connected to MongoDB")

async def shutdown_db_client(app: CustomFastAPI):
    app.mongodb_client.close()
    logger.info("Disconnected from MongoDB")

@asynccontextmanager
async def lifespan(app: CustomFastAPI):
    await startup_db_client(app)
    yield
    await shutdown_db_client(app)

app = CustomFastAPI(
    title="EV Charger API",
    docs_url="/api/s3cr3t/docs",
    lifespan=lifespan
)

allowed_origins = ["http://localhost:5173", "https://evpoint.in"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)