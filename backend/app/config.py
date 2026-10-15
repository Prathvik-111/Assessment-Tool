from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Smart Assessment Tool"
    app_env: str = "development"
    database_url: str | None = None
    n8n_webhook_url: str | None = None
    n8n_webhook_secret: str | None = None
    llm_provider: str | None = None
    llm_model: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
