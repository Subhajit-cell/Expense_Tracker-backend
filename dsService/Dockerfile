FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy the distribution package
COPY dist/ds_service-1.0.tar.gz .

# Install dependencies and the package
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# Copy the rest of the source code into /app
COPY . .

# Set environment variables for Flask
ENV FLASK_APP=src/app/config.py
ENV PYTHONUNBUFFERED=1

# Expose Flask's default port
EXPOSE 5000

# 📑 FIXED: Run via Flask CLI and bind to 0.0.0.0 so Render can route to it
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]