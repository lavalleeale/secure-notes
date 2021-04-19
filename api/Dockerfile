# pull official base image
FROM python:3-alpine as build

# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN apk update && apk add  --no-cache musl-dev libffi-dev postgresql-dev gcc python3-dev musl-dev make build-base cargo
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY . /app/

# Use image without build dependancies
FROM python:3-alpine as run

# Copy files from build
COPY --from=build /opt/venv /opt/venv
COPY --from=build /app /app

# install runtime dependencies
RUN apk update && apk add --no-cache postgresql-dev

# set work directory
WORKDIR /app

EXPOSE 5000

ENV PATH="/opt/venv/bin:$PATH"

ENTRYPOINT ["/app/gunicorn.sh"]