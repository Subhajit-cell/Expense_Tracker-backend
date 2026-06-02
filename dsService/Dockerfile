FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy the distribution package
COPY dist/ds_service-1.0.tar.gz .

# Install dependencies and the package globally
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# Copy the rest of the source code into /app
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose Flask's default port
EXPOSE 5000

# 📑 FIXED: Execute as an installed module rather than a raw file path
CMD ["python", "-m", "ds_service.app.config"]