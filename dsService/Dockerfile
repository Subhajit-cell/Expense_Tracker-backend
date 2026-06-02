FROM python:3.11-slim

WORKDIR /app

# Copy the package from the dist folder inside dsService
COPY dist/ds_service-1.0.tar.gz .

RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# Copy everything from dsService into /app
COPY . .

ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# 📑 FIX: Step directly into the relative path from the context root
WORKDIR /app/src/app
CMD ["python", "config.py"]