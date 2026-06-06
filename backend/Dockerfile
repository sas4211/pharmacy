FROM python:3.12-slim

WORKDIR /app

# Copy dependency requirements
COPY requirements.txt .

# Install dependencies (instantly downloads pre-compiled wheels)
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend code into the container
COPY . .

# Expose standard FastAPI port
EXPOSE 8000

# Run FastAPI server via Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
