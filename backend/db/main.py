import os

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from fastapi import Depends
from typing import Annotated
from contextlib import asynccontextmanager

async def get_db_session():
    mongodb_client = AsyncIOMotorClient(os.environ["MONGODB_URL"], tls=True, tlsAllowInvalidCertificates=True)
    session = mongodb_client.get_database(os.environ["DB_NAME"])
    try:
        yield session
    finally:
        mongodb_client.close()  

SessionDep = Annotated[AsyncIOMotorDatabase, Depends(get_db_session)]