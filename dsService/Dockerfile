FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy the distribution package
COPY dist/ds_service-1.0.tar.gz .

# Install dependencies
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# Copy ONLY your clean source code (ignoring dsenv thanks to .dockerignore)
COPY . .

# Set environment variables so Python can see the 'src' folder layout
ENV PYTHONPATH="/app"
ENV PYTHONUNBUFFERED=1

# Expose Flask's default port
EXPOSE 5000

# Run the config file directly from its physical location
CMD ["python", "src/app/config.py"]