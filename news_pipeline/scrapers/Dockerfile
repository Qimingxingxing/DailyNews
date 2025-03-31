# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Install Poetry
RUN pip install poetry

# Disable Poetry's virtual environment so dependencies install system-wide
ENV POETRY_VIRTUALENVS_CREATE=false

# Set the working directory inside the container
WORKDIR /app

# Copy the pyproject.toml and poetry.lock files into the container
COPY pyproject.toml poetry.lock ./

# Install dependencies system-wide
RUN poetry install --no-interaction --no-root

# Copy the rest of the application code into the container
COPY . .

# Set environment variables (if any)
ENV REDIS_HOST=redis
ENV KAFKA_SERVERS=kafka:9092
ENV PYTHONPATH=/app

# Run the application
CMD ["python", "news_pipeline/scrapers/news_fetcher.py"]
