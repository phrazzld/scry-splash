#!/bin/bash
# validate-environment.sh
# Script to validate the E2E test environment before running tests
# Used by GitHub Actions workflow to ensure proper setup

set -eo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Configuration
ARTIFACTS_DIR="test-results/e2e-artifacts"
REQUIRED_DIRS=(
  "test-results"
  "$ARTIFACTS_DIR"
  "$ARTIFACTS_DIR/screenshots"
  "$ARTIFACTS_DIR/videos"
  "$ARTIFACTS_DIR/traces"
  "$ARTIFACTS_DIR/downloads"
  "playwright-report"
)

# Function to print section header
print_header() {
  echo -e "\n${YELLOW}=== $1 ===${NC}"
}

# Function to print success message
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error message and exit
print_error() {
  echo -e "${RED}✗ ERROR: $1${NC}"
  exit 1
}

# Function to print warning message
print_warning() {
  echo -e "${YELLOW}⚠ WARNING: $1${NC}"
}

# Check if running in CI environment
check_ci_environment() {
  print_header "Checking CI Environment"
  
  if [ -n "$CI" ]; then
    print_success "Running in CI environment"
    export IS_CI=true
  else
    print_success "Running in local environment"
    export IS_CI=false
  fi

  # Check for required environment variables in CI
  if [ "$IS_CI" = true ]; then
    if [ -z "$NEXT_PUBLIC_FORMSPARK_FORM_ID" ]; then
      print_error "Missing required environment variable: NEXT_PUBLIC_FORMSPARK_FORM_ID"
    else
      print_success "Environment variable NEXT_PUBLIC_FORMSPARK_FORM_ID is set"
    fi
  fi
}

# Verify directory structure
verify_directories() {
  print_header "Verifying Directory Structure"
  
  for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
      echo "Creating directory: $dir"
      mkdir -p "$dir"
    fi
    
    # Verify directory permissions
    if [ ! -w "$dir" ]; then
      print_error "Directory not writable: $dir"
    fi
    
    print_success "Directory verified: $dir"
  done
  
  # List directories for debugging
  echo "Directory structure:"
  ls -la test-results
  ls -la "$ARTIFACTS_DIR"
}

# Check Playwright browser installation
check_playwright_browsers() {
  print_header "Checking Playwright Browsers"
  
  # Verify we have at least Chromium installed with multiple detection methods
  if npx playwright --version &>/dev/null; then
    print_success "Playwright CLI is available"
    
    # Get browser info
    BROWSERS=$(npx playwright --version)
    echo "$BROWSERS"
    
    # Check if chromium is mentioned in the version output
    if echo "$BROWSERS" | grep -q "chromium"; then
      print_success "Chromium browser is available in version output"
    else
      print_warning "Chromium not found in version output - will check for binary"
    fi
    
    # Check if the chromium directory exists in the cache
    if [ -d "$HOME/.cache/ms-playwright/chromium-"* ]; then
      print_success "Chromium browser directory found in cache"
      CHROMIUM_DIR=$(find "$HOME/.cache/ms-playwright" -type d -name "chromium-*" | head -1)
      echo "Chromium directory: $CHROMIUM_DIR"
      
      # Determine platform-specific binary path
      if [ "$(uname)" == "Darwin" ]; then
        # macOS
        CHROME_BINARY="${CHROMIUM_DIR}/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
      elif [ "$(uname)" == "Linux" ]; then
        # Linux
        CHROME_BINARY="${CHROMIUM_DIR}/chrome-linux/chrome"
      else
        # Windows (when running in WSL or similar)
        CHROME_BINARY="${CHROMIUM_DIR}/chrome-win/chrome.exe"
      fi
      
      # Check if binary exists and is executable
      if [ -f "$CHROME_BINARY" ]; then
        print_success "Chromium binary found at: $CHROME_BINARY"
        if [ -x "$CHROME_BINARY" ]; then
          print_success "Chromium binary is executable"
        else
          print_warning "Chromium binary is not executable - attempting to fix permissions"
          chmod +x "$CHROME_BINARY" 2>/dev/null && print_success "Permission fixed" || print_warning "Failed to fix permission"
        fi
      else
        print_warning "Chromium binary not found at expected path: $CHROME_BINARY"
        echo "Searching for any chromium binaries:"
        find "$CHROMIUM_DIR" -type f -name "chrome*" | head -5
      fi
    else
      print_warning "Chromium browser directory not found in cache"
      
      # Check for binary existence as fallback
      CHROMIUM_PATHS=(
        "$HOME/.cache/ms-playwright/chromium-*/chrome-linux/chrome"
        "$HOME/.cache/ms-playwright/chromium-*/chrome-linux/chromium"
        "$HOME/.cache/ms-playwright/chromium-*/chrome-win/chrome.exe"
        "$HOME/.cache/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
        "node_modules/.pnpm/playwright*/**/chromium-*/**/{chrome,chromium,chrome.exe}"
      )
      
      for CHROME_PATH_PATTERN in "${CHROMIUM_PATHS[@]}"; do
        if ls $CHROME_PATH_PATTERN &>/dev/null; then
          print_success "Chromium binary found at $CHROME_PATH_PATTERN"
          return 0
        fi
      done
    fi
    
    # Note that detailed verification is now handled in the dedicated verification script
    # See e2e/scripts/verify-browser-installation.sh for comprehensive browser verification
    echo "Note: A dedicated browser verification step will run after this check."
    echo "Please see the 'Verify Playwright Browser Installation' step for detailed diagnostics."
    
    return 0
  else
    print_warning "Playwright CLI not available"
    if [ "$IS_CI" = true ]; then
      print_warning "Running in CI environment, will continue but expect failures in the browser verification step"
      return 0
    else
      print_error "Playwright CLI not available - installation failure"
    fi
  fi
}

# Verify Node.js environment
check_node_environment() {
  print_header "Checking Node.js Environment"
  
  # Check Node.js version
  NODE_VERSION=$(node --version)
  echo "Node.js version: $NODE_VERSION"
  
  # Check available memory
  if [ "$IS_CI" = true ]; then
    echo "CI environment memory information:"
    free -h || print_warning "Cannot get memory information"
    
    echo "Disk space information:"
    df -h || print_warning "Cannot get disk space information"
  fi
}

# Verify network access (in CI environment)
check_network() {
  print_header "Checking Network Access"
  
  # Simple network connectivity test
  if ping -c 1 google.com &>/dev/null; then
    print_success "Network connectivity verified"
  else
    print_warning "Network connectivity test failed"
  fi
  
  # Test connection to localhost (where tests will run)
  if netstat -tuln | grep -q ":3000"; then
    print_success "Port 3000 is available"
  else
    print_warning "Port 3000 is not currently being listened on (this is normal if the server hasn't started yet)"
  fi
}

# Verify web server starts correctly
verify_web_server() {
  print_header "Verifying Web Server"
  
  # Skip actual server start here, as Playwright will handle it
  # But we can validate that the server command exists
  if [ -f "package.json" ]; then
    if grep -q "\"dev\":" package.json; then
      print_success "Dev server command exists in package.json"
    else
      print_error "Dev server command not found in package.json"
    fi
  else
    print_error "package.json not found"
  fi
}

# Run all validation checks
run_validation() {
  print_header "Starting Environment Validation"
  
  check_ci_environment
  verify_directories
  check_playwright_browsers
  check_node_environment
  check_network
  verify_web_server
  
  print_header "Environment Validation Complete"
  print_success "All checks passed successfully"
}

# Execute validation
run_validation