import sys
import os
from pathlib import Path

# Add backend directory to sys.path
# Since this file is in frontend/api/index.py, and backend is in frontend/backend
backend_path = Path(__file__).parent.parent / "backend"
sys.path.append(str(backend_path))

# Now we can import the app
from main import app as handler

app = handler
