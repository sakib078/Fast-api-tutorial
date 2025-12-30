
#ORM = object relational mapping, prevent writing SQL like code only allow python like code for database query

from collections.abc import AsyncGenerator
import uuid
from sqlalchemy import Column, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, relationship
import datetime


DATABASE_URL = "sqlite+aiosqlite:///./test.db"


class Post(DeclarativeBase):
    __tablename__ = "posts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    caption = Column(Text)
    url = Column(str, nullable=False)
    file_type = Column(str, nullable=False)
    file_name = Column(str, nullable=False)
    created_at = Column(DateTime, default= datetime.utcnow)
    
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(DeclarativeBase.metadata.create_all)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
        