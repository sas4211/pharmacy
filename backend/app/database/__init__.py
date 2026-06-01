from .base import Base
from .session import engine, AsyncSessionLocal
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


__all__ = ["Base", "engine", "AsyncSessionLocal", "get_db"]
