FROM python:3.11-slim

WORKDIR /app

# Copy the package from your isolated dsService folder scope
COPY dist/ds_service-1.0.tar.gz .

# This unpacks and installs your actual application code into /usr/local/lib/python3.11/site-packages/
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# 📑 FIXED: Run via the global python environment flask module runner
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]