# Base image
FROM node:18-alpine as build
# Check the github ticket to understand why libc6-compat might be needed:
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
# Create and use app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies and remove the cache from Docker layer
RUN npm ci && npm cache clean --force

# Copy app sources
COPY src ./src
COPY .env* nest-cli.json tsconfig*.json ./

# Creates a "dist" folder with the production build
RUN npm run build

# Production image
FROM node:18-alpine as prod
RUN apk add --no-cache libc6-compat
# Create and use app directory
WORKDIR /app

# Set Node to docker environment
ENV NODE_ENV .development.docker
# Set as non-root user
USER node

# Copy only the necessary files
COPY --chown=node:node --from=build /app/.env.development.docker ./
COPY --chown=node:node --from=build /app/dist ./dist
# Could be further optimized to leave out dev-dependencies from runtime
COPY --chown=node:node --from=build /app/node_modules ./node_modules

# Expose the port on which the app will run on
EXPOSE 3000

# Start the server using the production build
CMD ["node", "dist/main.js"]