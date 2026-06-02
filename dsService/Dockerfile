FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy the distribution package
COPY dist/ds_service-1.0.tar.gz .

# Install dependencies
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# Copy everything from the context root
COPY . .

ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# 📑 SMART LAUNCHER: Finds config.py dynamically, prints its path, and runs it!
CMD ["sh", "-c", "FOUND_PATH=$(find . -name config.py | head -n 1); echo '🚀 Found config.py at: '$FOUND_PATH; python $FOUND_PATH"]