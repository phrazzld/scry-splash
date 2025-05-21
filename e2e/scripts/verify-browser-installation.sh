#!/bin/bash
# verify-browser-installation.sh
# Script to verify Playwright browser installation status and report detailed diagnostics

set -eo pipefail

# Color and formatting
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BOLD}Detailed Playwright Browser Verification${NC}"

# Get Playwright version info
echo -e "\n${BOLD}${BLUE}Playwright Version Information:${NC}"
npx playwright --version

# Check browser executables
echo -e "\n${BOLD}${BLUE}Checking Browser Executables:${NC}"

# Chromium verification (primary browser)
echo -e "\n${BOLD}${BLUE}Chromium Verification:${NC}"

# Check if chromium browser directories exist
CHROMIUM_DIR=$(find ~/.cache/ms-playwright -type d -name "chromium-*" 2>/dev/null || echo "")
if [ -n "$CHROMIUM_DIR" ]; then
  echo -e "${GREEN}✓ Chromium directory found: ${CHROMIUM_DIR}${NC}"
  
  # Check actual browser binary based on platform
  if [ "$(uname)" == "Darwin" ]; then
    # macOS path
    CHROME_BINARY="${CHROMIUM_DIR}/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
  elif [ "$(uname)" == "Linux" ]; then
    # Linux path
    CHROME_BINARY="${CHROMIUM_DIR}/chrome-linux/chrome"
  else
    # Windows path (when running in WSL or similar)
    CHROME_BINARY="${CHROMIUM_DIR}/chrome-win/chrome.exe"
  fi
  
  if [ -f "$CHROME_BINARY" ]; then
    echo -e "${GREEN}✓ Chromium binary found: ${CHROME_BINARY}${NC}"
    if [ -x "$CHROME_BINARY" ]; then
      echo -e "${GREEN}✓ Chromium binary is executable${NC}"
    else
      echo -e "${RED}✗ Chromium binary is not executable${NC}"
      chmod +x "$CHROME_BINARY" 2>/dev/null && echo "  - Fixed permissions" || echo "  - Failed to fix permissions"
    fi
  else
    echo -e "${RED}✗ Chromium binary not found${NC}"
    echo "Searching for chrome binary in Chromium directory:"
    find "${CHROMIUM_DIR}" -type f -name "chrome*" | head -5
  fi
else
  echo -e "${RED}✗ Chromium directory not found in ~/.cache/ms-playwright${NC}"
  echo "Searching for any chromium-related files:"
  find ~/.cache/ms-playwright -name "*chromium*" 2>/dev/null | head -5 || echo "  - No chromium files found"
fi

# Display browser-related dependencies
echo -e "\n${BOLD}${BLUE}Checking System Dependencies:${NC}"
if command -v ldd &>/dev/null; then
  echo "System libraries for Chromium:"
  if [ -f "$CHROME_BINARY" ]; then
    echo -e "${YELLOW}Top 10 shared libraries:${NC}"
    ldd "$CHROME_BINARY" 2>/dev/null | head -10 || echo "  - Unable to list dependencies"
    
    # Check for any missing libraries
    MISSING=$(ldd "$CHROME_BINARY" 2>/dev/null | grep "not found" || echo "")
    if [ -n "$MISSING" ]; then
      echo -e "${RED}Missing libraries:${NC}"
      echo "$MISSING"
    else
      echo -e "${GREEN}✓ No missing libraries detected${NC}"
    fi
  fi
else
  echo "  - ldd command not available, skipping library check"
fi

# Check cache directories and permissions
echo -e "\n${BOLD}${BLUE}Checking Cache Directories:${NC}"
CACHE_DIR=~/.cache/ms-playwright
if [ -d "$CACHE_DIR" ]; then
  echo -e "${GREEN}✓ Playwright cache directory exists${NC}"
  echo "Cache directory permissions: $(ls -ld $CACHE_DIR)"
  echo "Cache directory contents:"
  ls -la $CACHE_DIR | head -10
  
  # Check browser binary size
  if [ -f "$CHROME_BINARY" ]; then
    echo -e "\n${BOLD}${BLUE}Browser Binary Information:${NC}"
    echo "Binary size: $(du -h "$CHROME_BINARY" | cut -f1)"
    file "$CHROME_BINARY" 2>/dev/null || echo "  - Unable to determine file type"
  fi
  
  # Check disk space
  echo -e "\n${BOLD}${BLUE}Disk Space Information:${NC}"
  df -h $CACHE_DIR
else
  echo -e "${RED}✗ Playwright cache directory does not exist${NC}"
fi

# Check browser support by attempting API check
echo -e "\n${BOLD}${BLUE}Browser API Check:${NC}"
VERIFICATION_SCRIPT=$(cat <<EOF
const { chromium } = require('@playwright/test');
(async () => {
  try {
    console.log('Attempting to launch Chromium browser...');
    const browser = await chromium.launch({ headless: true });
    const version = await browser.version();
    console.log('✅ Successfully launched Chromium, version:', version);
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('✅ Successfully created browser context and page');
    await browser.close();
    console.log('✅ Browser closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to launch browser:', error.message);
    process.exit(1);
  }
})();
EOF
)

echo "Executing browser API verification..."
node -e "$VERIFICATION_SCRIPT" || echo -e "${RED}✗ Browser API verification failed${NC}"

echo -e "\n${BOLD}${BLUE}Verification Complete${NC}"