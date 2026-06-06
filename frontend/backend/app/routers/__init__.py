from app.routers.auth import router as auth_router
from app.routers.products import router as products_router
from app.routers.cart import router as cart_router
from app.routers.wishlist import router as wishlist_router
from app.routers.orders import router as orders_router
from app.routers.prescriptions import router as prescriptions_router
from app.routers.services import router as services_router
from app.routers.newsletter import router as newsletter_router
from app.routers.payments import router as payments_router

__all__ = [
    "auth_router",
    "products_router",
    "cart_router",
    "wishlist_router",
    "orders_router",
    "prescriptions_router",
    "services_router",
    "newsletter_router",
    "payments_router",
]
