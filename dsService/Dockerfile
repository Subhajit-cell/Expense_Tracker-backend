FROM python:3.11-slim

WORKDIR /app

# Copy and install dependencies first for caching efficiency
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files into /app
COPY . .

# 📑 FIXED: Change the working directory context directly to the source root
WORKDIR /app/dsenv/src/app

# Set environment variables relative to our new working directory
ENV PYTHONPATH="."
ENV FLASK_APP="__init__.py"
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# Boot Flask locally from the script context
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]