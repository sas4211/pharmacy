from sqlalchemy.orm import DeclarativeBase, declared_attr
import re


class Base(DeclarativeBase):
    @declared_attr.directive
    def __tablename__(cls) -> str:
        # Convert CamelCase to snake_case automatically
        name = re.sub(r"(?<!^)(?=[A-Z])", "_", cls.__name__).lower()
        return name + "s"
