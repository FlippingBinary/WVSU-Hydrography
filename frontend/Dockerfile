FROM node:14

# Switch to unprivileged user
USER node

# Create the app directory with node permissions
RUN mkdir -p /home/node/app

# Create base directory for app
WORKDIR /home/node/app

# Copy NPM installation instructions
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY --chown=node:node . .

# Build app to detect build-time errors
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Running the app
CMD ["npm", "run", "dev"]
