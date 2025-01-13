# Stage 1: Build
FROM node:22 as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

# Clean existing files in the default Nginx directory
RUN rm -rf ./*

# Copy the build output from the previous stage
COPY --from=build /app/dist .

# Copy a custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 6002
EXPOSE 6002

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]

