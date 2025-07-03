FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Change ownership of the working directory
RUN chown -R appuser:appuser /usr/src/app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
