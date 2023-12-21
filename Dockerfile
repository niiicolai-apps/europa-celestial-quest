# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Vite project
RUN npm run build-web

# Expose the port for the Vite production server
EXPOSE 5173

# Install a simple web server (e.g., 'serve')
RUN npm install -g serve

# Define the command to start the Vite production server using 'serve'
CMD ["serve", "-s", "dist", "-l", "5173"]