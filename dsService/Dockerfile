FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy the distribution package
COPY dist/ds_service-1.0.tar.gz .

# Install dependencies
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# Copy your source code into /app
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose Flask's default port
EXPOSE 5000

# 📑 FIXED: Step directly into the folder containing config.py and execute it locally
WORKDIR /app/src/app
CMD ["python", "config.py"]