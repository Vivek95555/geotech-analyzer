# Use Python 3.12 slim base image
FROM python:3.12-slim

# Install Poppler only (needed by pdf2image to convert PDF to images)
# No Tesseract needed — using Gemini Vision for OCR
RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
