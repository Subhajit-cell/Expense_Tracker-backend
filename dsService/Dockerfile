FROM python:3.11-slim

WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# 📑 FIXED: Add the nested source paths to PYTHONPATH so internal imports resolve
ENV PYTHONPATH="/app/dsenv:/app/dsenv/src:/app/dsenv/src/app"
ENV FLASK_APP=dsenv.src.app
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]