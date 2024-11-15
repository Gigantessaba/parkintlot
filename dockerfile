# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files from backend context
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . ./

# Build the app
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Uncomment if custom Nginx settings are required
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
