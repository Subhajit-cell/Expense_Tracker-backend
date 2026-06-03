FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files (respecting the updated .dockerignore)
COPY . .

# Set the environment variable to point to the __init__.py where 'app' is defined
ENV FLASK_APP=dsenv.src.app
ENV PYTHONUNBUFFERED=1

# Expose Flask's default port
EXPOSE 5000

# Run Flask and bind it to all interfaces
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]