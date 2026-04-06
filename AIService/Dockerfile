FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app directory
COPY . .

# Expose port
EXPOSE 8000

# Run uvicorn - note the path to main:app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]