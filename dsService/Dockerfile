FROM python:3.11-slim

WORKDIR /app

# Copy the distribution package
COPY dist/ds_service-1.0.tar.gz .

# Install dependencies and the package
RUN pip install --no-cache-dir ds_service-1.0.tar.gz

ENV PYTHONUNBUFFERED=1
EXPOSE 5000

# 📑 AUDIT COMMAND: Inspects python site-packages to see what module name was registered
CMD ["python", "-c", "import pkg_resources; [print('📦 Registered Package module names:', dist.get_metadata_lines('top_level.txt')) for dist in pkg_resources.working_set if 'ds-service' in dist.project_name or 'ds_service' in dist.project_name]"]