from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.product import Product, Category, Brand, Condition
from app.schemas.product import ProductOut, ProductCreate, ProductUpdate, CategoryOut, BrandOut, ConditionOut
from app.auth import get_current_admin

router = APIRouter(prefix="/products", tags=["products"])


# ── Categories ────────────────────────────────────────────────────────────────

@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.is_active == True).order_by(Category.name))  # noqa: E712
    return result.scalars().all()


# ── Brands ────────────────────────────────────────────────────────────────────

@router.get("/brands", response_model=list[BrandOut])
async def list_brands(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Brand).where(Brand.is_active == True).order_by(Brand.name))  # noqa: E712
    return result.scalars().all()


# ── Conditions ────────────────────────────────────────────────────────────────

@router.get("/conditions", response_model=list[ConditionOut])
async def list_conditions(
    category: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Condition).where(Condition.is_active == True)  # noqa: E712
    if category and category != "all":
        stmt = stmt.where(Condition.category == category)
    result = await db.execute(stmt.order_by(Condition.name))
    return result.scalars().all()


# ── Products ──────────────────────────────────────────────────────────────────

def _product_query():
    return (
        select(Product)
        .options(selectinload(Product.brand), selectinload(Product.category))
        .where(Product.is_active == True)  # noqa: E712
    )


@router.get("", response_model=list[ProductOut])
async def list_products(
    featured: bool | None = Query(None),
    flash_sale: bool | None = Query(None),
    category_id: int | None = Query(None),
    brand_id: int | None = Query(None),
    search: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = _product_query()
    if featured is not None:
        stmt = stmt.where(Product.is_featured == featured)
    if flash_sale is not None:
        stmt = stmt.where(Product.is_flash_sale == flash_sale)
    if category_id is not None:
        stmt = stmt.where(Product.category_id == category_id)
    if brand_id is not None:
        stmt = stmt.where(Product.brand_id == brand_id)
    if search:
        term = f"%{search}%"
        stmt = stmt.where(or_(Product.name.ilike(term), Product.description.ilike(term)))
    stmt = stmt.order_by(Product.is_featured.desc(), Product.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        _product_query().where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ── Admin CRUD ────────────────────────────────────────────────────────────────

@router.post("", response_model=ProductOut, status_code=201)
async def create_product(
    body: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    product = Product(**body.model_dump())
    db.add(product)
    await db.flush()
    await db.refresh(product, ["brand", "category"])
    return product


@router.patch("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: int,
    body: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(product, field, val)
    await db.flush()
    return product


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    await db.flush()
