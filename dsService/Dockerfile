FROM python:3.11-slim

WORKDIR /app

# Copy the package distribution
COPY dist/ds_service-1.0.tar.gz .

# Install your application code globally inside the container
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# 📑 FIXED: Point Flask directly to the installed application module path
ENV FLASK_APP=ds_service.app.config
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# Run via the global Flask runner module
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]