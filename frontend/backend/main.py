import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine
from app.models import (  # noqa: F401 — import all models so metadata is populated
    User, Address, Product, Category, Brand, Condition,
    Order, OrderItem, Prescription, CartItem, WishlistItem,
    ServiceBooking, NewsletterSubscriber,
)
from app.database.base import Base
from app.routers import (
    auth_router, products_router, cart_router, wishlist_router,
    orders_router, prescriptions_router, services_router, newsletter_router,
    payments_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure upload directory exists
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    Path(settings.UPLOAD_DIR, "prescriptions").mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static uploads ────────────────────────────────────────────────────────────
uploads_path = Path(settings.UPLOAD_DIR)
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

# ── Routers ───────────────────────────────────────────────────────────────────
API = "/api/v1"
app.include_router(auth_router,          prefix=API)
app.include_router(products_router,      prefix=API)
app.include_router(cart_router,          prefix=API)
app.include_router(wishlist_router,      prefix=API)
app.include_router(orders_router,        prefix=API)
app.include_router(prescriptions_router, prefix=API)
app.include_router(services_router,      prefix=API)
app.include_router(newsletter_router,    prefix=API)
app.include_router(payments_router,      prefix=API)


@app.get("/")
async def root():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}


@app.get("/health")
async def health():
    return {"status": "healthy"}
