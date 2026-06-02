FROM python:3.11-slim

WORKDIR /app

# Copy the distribution package
COPY dist/ds_service-1.0.tar.gz .

# Install dependencies
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# Copy your source code into /app
COPY . .

ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# 📑 TEMP AUDIT: Print out every file inside the container to see the path layout
CMD ["ls", "-R", "/app"]