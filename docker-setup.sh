#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Ensure the script exits on any error
set -e

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}     Your House TV Docker Setup      ${NC}"
echo -e "${BLUE}======================================${NC}"

# # Check if required environment variables are set
# if [ -z "$DATABASE_URL" ]; then
#     echo -e "${RED}Error: DATABASE_URL environment variable is not set.${NC}"
#     echo -e "${YELLOW}Please set DATABASE_URL in your environment or .env file.${NC}"
#     echo -e "${YELLOW}Example: export DATABASE_URL='mongodb://your-connection-string'${NC}"
#     exit 1
# fi

# echo -e "${GREEN}✓ DATABASE_URL is set${NC}"

# Pull latest changes from git
echo -e "${BLUE}Pulling latest changes from git...${NC}"
git pull

# Set up environment variables for Docker Compose
echo -e "${BLUE}Setting up Docker environment with your settings...${NC}"

# Build and start the Docker container
# Environment variables are automatically passed to docker-compose from the current shell
echo -e "${BLUE}Building and starting Docker containers...${NC}"
docker compose build --no-cache
docker compose up -d

# Check if Docker containers started successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Docker setup completed successfully!${NC}"
    echo -e "${GREEN}Your application is now running at: http://localhost:3003${NC}"
else
    echo -e "${RED}Error: Failed to start Docker containers. Please check the logs.${NC}"
    exit 1
fi
