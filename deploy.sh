#!/bin/bash

# Frontend Deployment Script
# This script builds and prepares the frontend for deployment

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}Frontend Deployment Script${NC}"
echo -e "${BLUE}=====================================${NC}"

# Check if running from the correct directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found. Please run this script from the frontend directory.${NC}"
  exit 1
fi

# 1. Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm ci || npm install

# 2. Create/update .env.production file if it doesn't exist
if [ ! -f ".env.production" ]; then
  echo -e "\n${YELLOW}Creating .env.production file...${NC}"
  echo "VITE_API_URL=https://your-api-domain.com/api" > .env.production
  echo "VITE_WS_URL=https://your-api-domain.com" >> .env.production
  echo -e "${YELLOW}Please update .env.production with your production API URL.${NC}"
else
  echo -e "\n${YELLOW}.env.production already exists. Please make sure it contains the correct values.${NC}"
fi

# 3. Build the frontend
echo -e "\n${YELLOW}Building frontend...${NC}"
npm run build

# 4. Verify build
if [ -d "dist" ]; then
  echo -e "\n${GREEN}Build completed successfully!${NC}"
  echo -e "Files ready for deployment in the ${BLUE}dist${NC} directory."
else
  echo -e "\n${RED}Build failed. Check for errors above.${NC}"
  exit 1
fi

# 5. Provide deployment instructions
echo -e "\n${BLUE}=====================================${NC}"
echo -e "${GREEN}Deployment Instructions${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "1. Deploy the contents of the ${BLUE}dist${NC} directory to your hosting provider."
echo -e "2. For Netlify or Vercel, you can connect your Git repository and set the build command to ${BLUE}npm run build${NC}."
echo -e "3. For traditional hosting, upload the contents of the ${BLUE}dist${NC} directory to your server."
echo -e "4. Make sure your hosting provider supports client-side routing (SPA redirects)."
echo -e "${BLUE}=====================================${NC}"

echo -e "\n${GREEN}Frontend build ready for deployment!${NC}"
