from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import json


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/hussain_healthcare"

    # JWT
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # App
    APP_NAME: str = "Hussain Healthcare API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # CORS — stored as JSON string in .env
    CORS_ORIGINS: str = '["http://localhost:3000","http://127.0.0.1:5500","http://localhost:5500"]'

    # File uploads
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10

    # Stripe (card payments)
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # JazzCash merchant account (for manual payment instructions)
    JAZZCASH_ACCOUNT: str = "0311-1234567"
    JAZZCASH_NAME: str = "Hussain Healthcare"

    # Easypaisa merchant account
    EASYPAISA_ACCOUNT: str = "0333-1234567"
    EASYPAISA_NAME: str = "Hussain Healthcare"

    # Bank transfer details
    BANK_NAME: str = "Meezan Bank"
    BANK_ACCOUNT_TITLE: str = "Hussain Healthcare (Pvt) Ltd"
    BANK_ACCOUNT_NUMBER: str = "01230100123456"
    BANK_IBAN: str = "PK36MEZN0001230100123456"
    BANK_BRANCH: str = "Gulshan-e-Iqbal, Karachi"

    @property
    def cors_origins_list(self) -> List[str]:
        try:
            return json.loads(self.CORS_ORIGINS)
        except Exception:
            return ["*"]


settings = Settings()
