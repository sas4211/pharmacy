"""initial schema — all tables

Revision ID: 0001
Revises:
Create Date: 2026-04-01

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # users
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("full_name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(254), unique=True, nullable=False),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("password_hash", sa.String(256), nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("is_admin", sa.Boolean, server_default=sa.text("false"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"])

    # addresses
    op.create_table(
        "addresses",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("label", sa.String(50), server_default="Home", nullable=False),
        sa.Column("street", sa.Text, nullable=False),
        sa.Column("city", sa.String(80), server_default="Karachi", nullable=False),
        sa.Column("postal_code", sa.String(20), nullable=True),
        sa.Column("is_default", sa.Boolean, server_default=sa.text("false"), nullable=False),
    )

    # categories
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(100), unique=True, nullable=False),
        sa.Column("slug", sa.String(120), unique=True, nullable=False),
        sa.Column("emoji", sa.String(10), nullable=True),
        sa.Column("item_count", sa.Integer, server_default="0", nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
    )
    op.create_index("ix_categories_name", "categories", ["name"])
    op.create_index("ix_categories_slug", "categories", ["slug"])

    # brands
    op.create_table(
        "brands",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(100), unique=True, nullable=False),
        sa.Column("slug", sa.String(120), unique=True, nullable=False),
        sa.Column("emoji", sa.String(10), nullable=True),
        sa.Column("product_count", sa.Integer, server_default="0", nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
    )
    op.create_index("ix_brands_name", "brands", ["name"])
    op.create_index("ix_brands_slug", "brands", ["slug"])

    # conditions
    op.create_table(
        "conditions",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(100), unique=True, nullable=False),
        sa.Column("slug", sa.String(120), unique=True, nullable=False),
        sa.Column("category", sa.String(50), server_default="all", nullable=False),
        sa.Column("medication_count", sa.Integer, server_default="0", nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
    )

    # products
    op.create_table(
        "products",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(220), unique=True, nullable=False),
        sa.Column("brand_id", sa.Integer, sa.ForeignKey("brands.id", ondelete="SET NULL"), nullable=True),
        sa.Column("category_id", sa.Integer, sa.ForeignKey("categories.id", ondelete="SET NULL"), nullable=True),
        sa.Column("emoji", sa.String(10), nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("original_price", sa.Numeric(12, 2), nullable=True),
        sa.Column("stock", sa.Integer, server_default="0", nullable=False),
        sa.Column("rating", sa.Numeric(3, 2), server_default="0.00", nullable=False),
        sa.Column("review_count", sa.Integer, server_default="0", nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("is_featured", sa.Boolean, server_default=sa.text("false"), nullable=False),
        sa.Column("is_flash_sale", sa.Boolean, server_default=sa.text("false"), nullable=False),
        sa.Column("flash_discount_pct", sa.Integer, nullable=True),
        sa.Column("requires_prescription", sa.Boolean, server_default=sa.text("false"), nullable=False),
        sa.Column("tags", sa.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_products_name", "products", ["name"])
    op.create_index("ix_products_slug", "products", ["slug"])

    # orders
    op.create_table(
        "orders",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("status", sa.String(30), server_default="pending", nullable=False),
        sa.Column("total_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("delivery_fee", sa.Numeric(10, 2), server_default="0.00", nullable=False),
        sa.Column("delivery_address", sa.Text, nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # order_items
    op.create_table(
        "order_items",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("order_id", sa.Integer, sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id", ondelete="SET NULL"), nullable=True),
        sa.Column("product_name", sa.String(200), nullable=False),
        sa.Column("product_emoji", sa.String(10), nullable=True),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("qty", sa.Integer, server_default="1", nullable=False),
        sa.Column("subtotal", sa.Numeric(12, 2), nullable=False),
    )

    # prescriptions
    op.create_table(
        "prescriptions",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("file_path", sa.String(500), nullable=False),
        sa.Column("original_filename", sa.String(255), nullable=False),
        sa.Column("status", sa.String(30), server_default="pending", nullable=False),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("pharmacist_notes", sa.Text, nullable=True),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # cart_items
    op.create_table(
        "cart_items",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=True),
        sa.Column("product_name", sa.String(200), nullable=False),
        sa.Column("product_emoji", sa.String(10), nullable=True),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("qty", sa.Integer, server_default="1", nullable=False),
        sa.Column("added_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_cart_items_user_id", "cart_items", ["user_id"])

    # wishlist_items
    op.create_table(
        "wishlist_items",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=True),
        sa.Column("product_name", sa.String(200), nullable=False),
        sa.Column("product_emoji", sa.String(10), nullable=True),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("added_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_wishlist_items_user_id", "wishlist_items", ["user_id"])

    # service_bookings
    op.create_table(
        "service_bookings",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("service_type", sa.String(50), nullable=False),
        sa.Column("service_name", sa.String(200), nullable=False),
        sa.Column("booking_date", sa.Date, nullable=True),
        sa.Column("booking_time", sa.Time, nullable=True),
        sa.Column("status", sa.String(30), server_default="pending", nullable=False),
        sa.Column("patient_name", sa.String(120), nullable=True),
        sa.Column("patient_phone", sa.String(20), nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("is_online", sa.Boolean, server_default=sa.text("false"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # newsletter_subscribers
    op.create_table(
        "newsletter_subscribers",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(254), unique=True, nullable=False),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True, unique=True),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("subscribed_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_newsletter_subscribers_email", "newsletter_subscribers", ["email"])


def downgrade() -> None:
    op.drop_table("newsletter_subscribers")
    op.drop_table("service_bookings")
    op.drop_table("wishlist_items")
    op.drop_table("cart_items")
    op.drop_table("prescriptions")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("products")
    op.drop_table("conditions")
    op.drop_table("brands")
    op.drop_table("categories")
    op.drop_table("addresses")
    op.drop_table("users")
