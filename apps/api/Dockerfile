# Start from an official Node.js image
# This gives us Ubuntu Linux + Node 20 pre-installed
FROM node:20-alpine

# Alpine is a lightweight Linux distro — smaller image size
# Regular node:20 is ~1GB, node:20-alpine is ~170MB

# Set the working directory inside the container
# All subsequent commands run from here
WORKDIR /app

# Copy package files first — before copying source code
# Why? Docker caches each step. If package.json hasn't changed,
# Docker reuses the cached node_modules layer instead of reinstalling
COPY package*.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the source code
COPY . .

# Dummy env vars to satisfy config validation at build time
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
ENV JWT_SECRET=dummy_secret_for_build
ENV JWT_EXPIRES_IN=15m
ENV NODE_ENV=production
ENV REDIS_URL=redis://localhost:6379

# Generate Prisma client inside the container
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npm run build

COPY start.sh .
RUN chmod +x start.sh

# Expose the port your app runs on
EXPOSE 8080

# Command to run when the container starts
CMD ["sh", "start.sh"]