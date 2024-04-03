## Next.js latest version image
FROM node:20.12.0-alpine3.19

## Labels
LABEL maintaner="Rober de Avila Abraira"
LABEL website="https://www.linkedin.com/in/rober85/"
LABEL description=""
LABEL version="1.0.0"
LABEL release-date="3-04-2024"

## Operations
# Create app folder in container
RUN mkdir -p /app

# Change working directory to app folder
WORKDIR /app

# Copying source files
COPY ./ /app

# Install dependencies packages
RUN yarn install

# Disable telemetry
RUN yarn next telemetry disable

# Exposed port
EXPOSE 3000

# Running the app
CMD ["yarn", "run", "dev"]
