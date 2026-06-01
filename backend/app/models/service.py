from sqlalchemy import String, DateTime, Text, ForeignKey, Integer, Boolean, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime, date, time
from app.database.base import Base


class ServiceBooking(Base):
    __tablename__ = "service_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    service_type: Mapped[str] = mapped_column(String(50))
    service_name: Mapped[str] = mapped_column(String(200))
    booking_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    booking_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="pending")
    patient_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    patient_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_online: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped["User"] = relationship("User", back_populates="service_bookings")
