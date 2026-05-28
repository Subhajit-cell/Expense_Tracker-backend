FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements file from src/app
COPY dist/ds_service-1.0.tar.gz .

# Install dependencies
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

# Copy the rest of the source code
COPY . .


# Set environment variables
ENV FLASK_APP=app/config.py


# Run the application
CMD ["python", "src/app/config.py"]


