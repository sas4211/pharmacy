"""
Payment endpoints:
  POST /payments/stripe/intent   — create Stripe PaymentIntent, returns client_secret
  GET  /payments/info            — return manual payment account details (JazzCash, Easypaisa, bank)
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.auth import get_current_user
from app.models.user import User
from app.config import settings

router = APIRouter(prefix="/payments", tags=["payments"])


# ── Stripe payment intent ─────────────────────────────────────────────────────

class StripeIntentRequest(BaseModel):
    amount_pkr: int   # amount in paisas (PKR * 100)


class StripeIntentResponse(BaseModel):
    client_secret: str
    publishable_key: str


@router.post("/stripe/intent", response_model=StripeIntentResponse)
async def create_stripe_intent(
    body: StripeIntentRequest,
    user: User = Depends(get_current_user),
):
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Card payments are not configured yet. Please use another payment method.")

    try:
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY

        intent = stripe.PaymentIntent.create(
            amount=body.amount_pkr,          # in smallest currency unit (paisas)
            currency="pkr",
            metadata={"user_id": str(user.id), "user_email": user.email},
            automatic_payment_methods={"enabled": True, "allow_redirects": "never"},
        )
        return StripeIntentResponse(
            client_secret=intent.client_secret,
            publishable_key=settings.STRIPE_PUBLISHABLE_KEY,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Stripe error: {exc}")


# ── Manual payment info ───────────────────────────────────────────────────────

class PaymentInfoResponse(BaseModel):
    jazzcash_account: str
    jazzcash_name: str
    easypaisa_account: str
    easypaisa_name: str
    bank_name: str
    bank_account_title: str
    bank_account_number: str
    bank_iban: str
    bank_branch: str


@router.get("/info", response_model=PaymentInfoResponse)
async def get_payment_info():
    """Returns merchant account details for manual payments."""
    return PaymentInfoResponse(
        jazzcash_account=settings.JAZZCASH_ACCOUNT,
        jazzcash_name=settings.JAZZCASH_NAME,
        easypaisa_account=settings.EASYPAISA_ACCOUNT,
        easypaisa_name=settings.EASYPAISA_NAME,
        bank_name=settings.BANK_NAME,
        bank_account_title=settings.BANK_ACCOUNT_TITLE,
        bank_account_number=settings.BANK_ACCOUNT_NUMBER,
        bank_iban=settings.BANK_IBAN,
        bank_branch=settings.BANK_BRANCH,
    )
