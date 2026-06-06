from sqlalchemy import DateTime, ForeignKey, Integer, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
from decimal import Decimal
from app.database.base import Base


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    product_id: Mapped[int | None] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=True)
    product_name: Mapped[str] = mapped_column(String(200))
    product_emoji: Mapped[str | None] = mapped_column(String(10), nullable=True)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="wishlist_items")
    product: Mapped["Product | None"] = relationship("Product", back_populates="wishlist_items")
