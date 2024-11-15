# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# List files to debug
RUN ls -al /app

# Install dependencies
RUN npm install

# Copy the remaining backend source files
COPY . ./

# Expose the API port
EXPOSE 5000

# Start the backend service
CMD ["node", "app.js"]
