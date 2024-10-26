
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
load_dotenv()

class CommonSettings(BaseSettings):
    APP_NAME: str = "EV Charger API"
    DEBUG_MODE: bool = True


class ServerSettings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8001


class DatabaseSettings(BaseSettings):
    MONGO_URL: str | None = os.getenv("MONGO_URL")
    DB_NAME: str | None = os.getenv("DB_NAME")


class Settings(CommonSettings, ServerSettings, DatabaseSettings):
    pass

settings = Settings()
