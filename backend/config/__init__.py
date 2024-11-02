
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
load_dotenv()

class CommonSettings(BaseSettings):
    APP_NAME: str = "EV Charger API"
    DEBUG_MODE: bool = True
    OLA_MAPS_API_KEY: str | None = os.getenv("OLA_MAPS_API_KEY")


class ServerSettings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8001


class DatabaseSettings(BaseSettings):
    MONGO_URL: str | None = os.getenv("MONGO_URL")
    DB_NAME: str | None = os.getenv("DB_NAME")


class Settings(CommonSettings, ServerSettings, DatabaseSettings):
    pass

settings = Settings()

assert settings.OLA_MAPS_API_KEY