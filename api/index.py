import sys
import os
from pathlib import Path

# Add backend directory to sys.path so we can import from it
backend_path = Path(__file__).parent.parent / "backend"
sys.path.append(str(backend_path))

# Now we can import the app
from main import app as handler

# Vercel's Python runtime can use 'app' or we can point to it in vercel.json
app = handler
