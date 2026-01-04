# Dockerfile for Sikiya Home (Next.js)
# This is OPTIONAL - Render can deploy Next.js directly without Docker
# Use this if you want consistent environments across dev/staging/prod

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

