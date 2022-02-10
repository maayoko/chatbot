# syntax=docker/dockerfile:1
FROM python:3.8.0
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ARG DEBUG
ARG SECRET_KEY
ARG DJANGO_ALLOWED_HOSTS
ARG POSTGRES_NAME
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_HOST
ARG POSTGRES_PORT

WORKDIR /code
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /code/
# collect static files
RUN python manage.py collectstatic --noinput