"""add payment fields to orders

Revision ID: 0002
Revises: 0001
Create Date: 2026-04-06

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("payment_method", sa.String(30), nullable=True))
    op.add_column("orders", sa.Column("payment_status", sa.String(30), server_default="pending", nullable=False))
    op.add_column("orders", sa.Column("payment_ref", sa.String(300), nullable=True))


def downgrade() -> None:
    op.drop_column("orders", "payment_ref")
    op.drop_column("orders", "payment_status")
    op.drop_column("orders", "payment_method")
