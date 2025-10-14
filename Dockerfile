# 1. Use a Node.js LTS version
FROM node:20-alpine AS builder

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy all source code
COPY . .

# 5. Build the NestJS project
RUN npm run build

# 6. Use a smaller image for the final runtime
FROM node:20-alpine AS production

WORKDIR /app

# Copy only the dist folder and production dependencies
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Expose the default NestJS port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
