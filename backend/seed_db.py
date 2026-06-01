import asyncio
from decimal import Decimal
from sqlalchemy import select
from app.database import AsyncSessionLocal, engine
from app.models.product import Category, Brand, Condition, Product


async def seed_data():
    async with AsyncSessionLocal() as session:
        print("Starting seed script...")
        
        # 1. Categories
        categories_data = [
            {"name": "Medicine", "emoji": "💊", "slug": "medicine", "desc": "OTC & prescription"},
            {"name": "Nutrition & Supplements", "emoji": "🥗", "slug": "nutrition-supplements", "desc": "Vitamins, omega-3, protein"},
            {"name": "Skin Care", "emoji": "✨", "slug": "skin-care", "desc": "Cleansers, SPF, serums"},
            {"name": "Baby Care", "emoji": "👶", "slug": "baby-care", "desc": "Formula, nappies, wellness"},
            {"name": "Medical Devices", "emoji": "🩺", "slug": "medical-devices", "desc": "BP monitors, glucometers"},
            {"name": "Mother Care", "emoji": "🤱", "slug": "mother-care", "desc": "Prenatal, postnatal, breastfeeding"},
            {"name": "Sexual Wellness", "emoji": "🌸", "slug": "sexual-wellness", "desc": "Discreet, trusted products"},
            {"name": "General Health", "emoji": "🏥", "slug": "general-health", "desc": "First aid, diagnostics & more"}
        ]
        
        db_categories = {}
        for cat in categories_data:
            stmt = select(Category).where(Category.slug == cat["slug"])
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            if not existing:
                new_cat = Category(
                    name=cat["name"],
                    emoji=cat["emoji"],
                    slug=cat["slug"],
                    item_count=0
                )
                session.add(new_cat)
                await session.flush()
                db_categories[cat["name"]] = new_cat
                print(f"Created category: {cat['name']}")
            else:
                db_categories[cat["name"]] = existing
                print(f"Category already exists: {cat['name']}")
                
        # 2. Brands
        brands_data = [
            {"name": "Abbott", "emoji": "💊", "slug": "abbott"},
            {"name": "CeraVe", "emoji": "🧴", "slug": "cerave"},
            {"name": "Himalaya", "emoji": "🌿", "slug": "himalaya"},
            {"name": "Accu-Chek", "emoji": "🩸", "slug": "accu-chek"},
            {"name": "Centrum", "emoji": "🥗", "slug": "centrum"},
            {"name": "Pfizer", "emoji": "💙", "slug": "pfizer"},
            {"name": "Aptamil", "emoji": "🍼", "slug": "aptamil"},
            {"name": "Philips", "emoji": "⚕️", "slug": "philips"},
            {"name": "Neutrogena", "emoji": "🧴", "slug": "neutrogena"},
            {"name": "L'Oréal", "emoji": "✨", "slug": "loreal"},
            {"name": "GSK", "emoji": "🫀", "slug": "gsk"},
            {"name": "Bayer", "emoji": "🧪", "slug": "bayer"},
            {"name": "Reckitt", "emoji": "🌱", "slug": "reckitt"},
            {"name": "Sanofi", "emoji": "💫", "slug": "sanofi"},
            {"name": "AstraZeneca", "emoji": "🔵", "slug": "astrazeneca"},
            {"name": "Novartis", "emoji": "🟢", "slug": "novartis"},
            {"name": "Nature's Way", "emoji": "🫐", "slug": "natures-way"},
            {"name": "Dr. Morepen", "emoji": "🩺", "slug": "dr-morepen"}
        ]
        
        db_brands = {}
        for b in brands_data:
            stmt = select(Brand).where(Brand.slug == b["slug"])
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            if not existing:
                new_brand = Brand(
                    name=b["name"],
                    emoji=b["emoji"],
                    slug=b["slug"],
                    product_count=0
                )
                session.add(new_brand)
                await session.flush()
                db_brands[b["name"]] = new_brand
                print(f"Created brand: {b['name']}")
            else:
                db_brands[b["name"]] = existing
                print(f"Brand already exists: {b['name']}")

        # 3. Conditions
        conditions_data = [
            {"name": "Headache", "slug": "headache", "category": "Pain", "count": 12},
            {"name": "Migraine", "slug": "migraine", "category": "Pain", "count": 9},
            {"name": "Back Pain", "slug": "back-pain", "category": "Pain", "count": 15},
            {"name": "Acidity / GERD", "slug": "acidity-gerd", "category": "Digestive", "count": 18},
            {"name": "Cough & Cold", "slug": "cough-cold", "category": "Respiratory", "count": 22},
            {"name": "Diabetes", "slug": "diabetes", "category": "Chronic", "count": 30},
            {"name": "Hypertension", "slug": "hypertension", "category": "Chronic", "count": 26},
            {"name": "Acne", "slug": "acne", "category": "Skin", "count": 19}
        ]
        
        for cond in conditions_data:
            stmt = select(Condition).where(Condition.slug == cond["slug"])
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            if not existing:
                new_cond = Condition(
                    name=cond["name"],
                    slug=cond["slug"],
                    category=cond["category"],
                    medication_count=cond["count"]
                )
                session.add(new_cond)
                print(f"Created condition: {cond['name']}")
            else:
                print(f"Condition already exists: {cond['name']}")

        # 4. Products
        products_data = [
            # Featured / Grid Products
            {
                "name": "Moisturising Cream 250ml",
                "emoji": "🧴",
                "brand": "CeraVe",
                "category": "Skin Care",
                "price": Decimal("1850.00"),
                "original_price": Decimal("2200.00"),
                "rating": Decimal("4.50"),
                "description": "Lightweight, non-greasy moisturising cream developed with dermatologists. Contains hyaluronic acid and 3 essential ceramides.",
                "slug": "moisturising-cream-250ml",
                "is_featured": True,
                "is_flash_sale": False,
                "stock": 100
            },
            {
                "name": "Brufen 400mg Tablets (20s)",
                "emoji": "💊",
                "brand": "Abbott",
                "category": "Medicine",
                "price": Decimal("180.00"),
                "original_price": None,
                "rating": Decimal("4.70"),
                "description": "Brufen 400mg contains ibuprofen. Used for pain relief, fever reduction and anti-inflammatory treatment.",
                "slug": "brufen-400mg-tablets-20s",
                "is_featured": True,
                "is_flash_sale": False,
                "stock": 250
            },
            {
                "name": "Blood Glucose Monitor Kit",
                "emoji": "🩸",
                "brand": "Accu-Chek",
                "category": "Medical Devices",
                "price": Decimal("4500.00"),
                "original_price": Decimal("5200.00"),
                "rating": Decimal("4.80"),
                "description": "Accu-Chek Instant blood glucose monitor with Bluetooth connectivity. Get results in 4 seconds.",
                "slug": "blood-glucose-monitor-kit",
                "is_featured": True,
                "is_flash_sale": False,
                "stock": 50
            },
            {
                "name": "Silver Multivitamin Adults 50+ (60 Tabs)",
                "emoji": "🥗",
                "brand": "Centrum",
                "category": "Nutrition & Supplements",
                "price": Decimal("2100.00"),
                "original_price": None,
                "rating": Decimal("4.60"),
                "description": "Complete multivitamin for adults 50+. Contains vitamins A, C, D, E, K and essential minerals including calcium and zinc.",
                "slug": "silver-multivitamin-adults-50-60-tabs",
                "is_featured": True,
                "is_flash_sale": False,
                "stock": 80
            },
            {
                "name": "Neem Face Wash 150ml",
                "emoji": "🧪",
                "brand": "Himalaya",
                "category": "Skin Care",
                "price": Decimal("420.00"),
                "original_price": Decimal("550.00"),
                "rating": Decimal("4.40"),
                "description": "Natural neem face wash that purifies skin, prevents pimples and keeps skin clean and fresh throughout the day.",
                "slug": "neem-face-wash-150ml",
                "is_featured": True,
                "is_flash_sale": False,
                "stock": 120
            },
            {
                "name": "Stage 1 Infant Formula 400g",
                "emoji": "🍼",
                "brand": "Aptamil",
                "category": "Baby Care",
                "price": Decimal("3200.00"),
                "original_price": None,
                "rating": Decimal("4.90"),
                "description": "Aptamil Stage 1 is a whey-based infant formula for babies from birth. Enriched with DHA, ARA and prebiotics for healthy development.",
                "slug": "stage-1-infant-formula-400g",
                "is_featured": True,
                "is_flash_sale": False,
                "stock": 40
            },
            {
                "name": "Upper Arm Blood Pressure Monitor",
                "emoji": "🫁",
                "brand": "Philips",
                "category": "Medical Devices",
                "price": Decimal("7800.00"),
                "original_price": Decimal("9000.00"),
                "rating": Decimal("4.70"),
                "description": "Clinically validated upper arm blood pressure monitor with irregular heartbeat detection and memory for 2 users.",
                "slug": "upper-arm-blood-pressure-monitor",
                "is_featured": True,
                "is_flash_sale": False,
                "stock": 35
            },
            {
                "name": "Omega-3 Fish Oil 1000mg (60 Caps)",
                "emoji": "🫐",
                "brand": "Nature's Way",
                "category": "Nutrition & Supplements",
                "price": Decimal("1650.00"),
                "original_price": None,
                "rating": Decimal("4.50"),
                "description": "High-quality fish oil supplement providing 1000mg EPA & DHA per capsule. Supports heart, brain and joint health.",
                "slug": "omega-3-fish-oil-1000mg-60-caps",
                "is_featured": True,
                "is_flash_sale": False,
                "stock": 90
            },
            
            # Flash Sale Products
            {
                "name": "Hydro Boost Water Gel 50ml",
                "emoji": "🧴",
                "brand": "Neutrogena",
                "category": "Skin Care",
                "price": Decimal("1400.00"),
                "original_price": Decimal("2000.00"),
                "rating": Decimal("4.60"),
                "description": "Oil-free gel with hyaluronic acid — intense hydration for all skin types",
                "slug": "hydro-boost-water-gel-50ml",
                "is_featured": False,
                "is_flash_sale": True,
                "flash_discount_pct": 30,
                "stock": 8
            },
            {
                "name": "Vitamin C 1000mg Effervescent (10s)",
                "emoji": "💊",
                "brand": "Pfizer",
                "category": "Nutrition & Supplements",
                "price": Decimal("375.00"),
                "original_price": Decimal("500.00"),
                "rating": Decimal("4.50"),
                "description": "High-dose Vitamin C for immunity, energy & collagen production",
                "slug": "vitamin-c-1000mg-effervescent-10s",
                "is_featured": False,
                "is_flash_sale": True,
                "flash_discount_pct": 25,
                "stock": 18
            },
            {
                "name": "Digital Thermometer Pro",
                "emoji": "🩺",
                "brand": "Dr. Morepen",
                "category": "Medical Devices",
                "price": Decimal("640.00"),
                "original_price": Decimal("800.00"),
                "rating": Decimal("4.20"),
                "description": "Fast 10-second reading with flexible tip — clinically accurate",
                "slug": "digital-thermometer-pro",
                "is_featured": False,
                "is_flash_sale": True,
                "flash_discount_pct": 20,
                "stock": 3
            },
            {
                "name": "Revitalift Day Cream SPF 30",
                "emoji": "✨",
                "brand": "L'Oréal",
                "category": "Skin Care",
                "price": Decimal("1560.00"),
                "original_price": Decimal("2400.00"),
                "rating": Decimal("4.40"),
                "description": "Anti-ageing SPF moisturiser with Pro-Retinol — dermatologist tested",
                "slug": "revitalift-day-cream-spf-30",
                "is_featured": False,
                "is_flash_sale": True,
                "flash_discount_pct": 35,
                "stock": 24
            },
            {
                "name": "Adults Complete Multivitamin (30s)",
                "emoji": "🥗",
                "brand": "Centrum",
                "category": "Nutrition & Supplements",
                "price": Decimal("980.00"),
                "original_price": Decimal("1400.00"),
                "rating": Decimal("4.30"),
                "description": "26 vitamins & minerals in one tablet — complete daily nutrition",
                "slug": "adults-complete-multivitamin-30s",
                "is_featured": False,
                "is_flash_sale": True,
                "flash_discount_pct": 30,
                "stock": 11
            },
            {
                "name": "Foaming Facial Cleanser 236ml",
                "emoji": "🧴",
                "brand": "CeraVe",
                "category": "Skin Care",
                "price": Decimal("1650.00"),
                "original_price": Decimal("2100.00"),
                "rating": Decimal("4.50"),
                "description": "Non-comedogenic cleanser with ceramides for oily & normal skin",
                "slug": "foaming-facial-cleanser-236ml",
                "is_featured": False,
                "is_flash_sale": True,
                "flash_discount_pct": 21,
                "stock": 20
            }
        ]

        for prod in products_data:
            stmt = select(Product).where(Product.slug == prod["slug"])
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            if not existing:
                brand_obj = db_brands.get(prod["brand"])
                cat_obj = db_categories.get(prod["category"])
                
                new_prod = Product(
                    name=prod["name"],
                    slug=prod["slug"],
                    brand_id=brand_obj.id if brand_obj else None,
                    category_id=cat_obj.id if cat_obj else None,
                    emoji=prod["emoji"],
                    description=prod["description"],
                    price=prod["price"],
                    original_price=prod["original_price"],
                    rating=prod["rating"],
                    stock=prod["stock"],
                    is_featured=prod["is_featured"],
                    is_flash_sale=prod["is_flash_sale"],
                    flash_discount_pct=prod.get("flash_discount_pct")
                )
                session.add(new_prod)
                print(f"Created product: {prod['name']}")
            else:
                print(f"Product already exists: {prod['name']}")

        await session.commit()
        print("Data seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
