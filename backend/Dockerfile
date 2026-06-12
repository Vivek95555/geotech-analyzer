# Use Python 3.12 slim base image
FROM python:3.12-slim

# Install system dependencies — Tesseract OCR + Poppler (for pdf2image)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install Python dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
