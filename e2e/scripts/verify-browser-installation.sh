#!/bin/bash
# verify-browser-installation.sh
# Script to verify Playwright browser installation status and report detailed diagnostics
# 
# Usage: 
#   verify-browser-installation.sh [options]
#
# Options:
#   --quiet        Minimal output, suitable for use in automation
#   --browser=name Verify specific browser (chromium, firefox, webkit)
#                  Default: all browsers, with focus on chromium
#   --help         Show this help message

set -eo pipefail

# Color and formatting
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default configuration
QUIET_MODE=false
SPECIFIC_BROWSER=""
VERIFICATION_ERRORS=0
VERIFICATION_WARNINGS=0

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    --quiet)
      QUIET_MODE=true
      shift
      ;;
    --browser=*)
      SPECIFIC_BROWSER="${arg#*=}"
      shift
      ;;
    --help)
      echo "Usage: verify-browser-installation.sh [options]"
      echo ""
      echo "Options:"
      echo "  --quiet        Minimal output, suitable for use in automation"
      echo "  --browser=name Verify specific browser (chromium, firefox, webkit)"
      echo "                 Default: all browsers, with focus on chromium"
      echo "  --help         Show this help message"
      exit 0
      ;;
    *)
      # Unknown option
      echo "Unknown option: $arg"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Log with proper formatting based on mode
log() {
  local level=$1
  local message=$2
  local color=$NC
  
  case $level in
    "INFO") color=$BLUE ;;
    "SUCCESS") color=$GREEN ;;
    "WARNING") 
      color=$YELLOW
      VERIFICATION_WARNINGS=$((VERIFICATION_WARNINGS + 1))
      ;;
    "ERROR") 
      color=$RED
      VERIFICATION_ERRORS=$((VERIFICATION_ERRORS + 1))
      ;;
  esac
  
  if [ "$QUIET_MODE" = true ]; then
    # In quiet mode, only show errors and warnings
    if [ "$level" = "ERROR" ] || [ "$level" = "WARNING" ]; then
      echo -e "[${level}] ${message}"
    fi
  else
    echo -e "${color}${level}${NC}: ${message}"
  fi
}

if [ "$QUIET_MODE" = false ]; then
  echo -e "${BOLD}Detailed Playwright Browser Verification${NC}"
fi

# Get Playwright version info
if [ "$QUIET_MODE" = false ]; then
  echo -e "\n${BOLD}${BLUE}Playwright Version Information:${NC}"
fi

PLAYWRIGHT_VERSION=$(npx playwright --version 2>&1)
if [ $? -eq 0 ]; then
  log "INFO" "Playwright version: ${PLAYWRIGHT_VERSION}"
else
  log "ERROR" "Failed to get Playwright version. Output: ${PLAYWRIGHT_VERSION}"
fi

# Check browser executables
if [ "$QUIET_MODE" = false ]; then
  echo -e "\n${BOLD}${BLUE}Checking Browser Executables:${NC}"
fi

# Setup browser verification functions
verify_browser() {
  local browser_type=$1
  local browser_name_capitalized=$(echo "$browser_type" | sed 's/\b\(.\)/\u\1/g')
  
  if [ "$QUIET_MODE" = false ]; then
    echo -e "\n${BOLD}${BLUE}${browser_name_capitalized} Verification:${NC}"
  fi
  
  # Find browser directory
  local browser_dir=$(find ~/.cache/ms-playwright -type d -name "${browser_type}-*" 2>/dev/null || echo "")
  if [ -n "$browser_dir" ]; then
    log "SUCCESS" "${browser_name_capitalized} directory found: ${browser_dir}"
    
    # Determine binary path based on platform
    local binary_path=""
    if [ "$(uname)" == "Darwin" ]; then
      case $browser_type in
        "chromium") binary_path="${browser_dir}/chrome-mac/Chromium.app/Contents/MacOS/Chromium" ;;
        "firefox") binary_path="${browser_dir}/firefox/Nightly.app/Contents/MacOS/firefox" ;;
        "webkit") binary_path="${browser_dir}/webkit/Webkit.app/Contents/MacOS/Webkit" ;;
      esac
    elif [ "$(uname)" == "Linux" ]; then
      case $browser_type in
        "chromium") binary_path="${browser_dir}/chrome-linux/chrome" ;;
        "firefox") binary_path="${browser_dir}/firefox/firefox" ;;
        "webkit") binary_path="${browser_dir}/webkit/pw_run.sh" ;;
      esac
    else
      case $browser_type in
        "chromium") binary_path="${browser_dir}/chrome-win/chrome.exe" ;;
        "firefox") binary_path="${browser_dir}/firefox/firefox.exe" ;;
        "webkit") binary_path="${browser_dir}/webkit/Playwright.exe" ;;
      esac
    fi
    
    # Check if binary exists and is executable
    if [ -f "$binary_path" ]; then
      log "SUCCESS" "${browser_name_capitalized} binary found: ${binary_path}"
      if [ -x "$binary_path" ]; then
        log "SUCCESS" "${browser_name_capitalized} binary is executable"
      else
        log "WARNING" "${browser_name_capitalized} binary is not executable"
        if chmod +x "$binary_path" 2>/dev/null; then
          log "SUCCESS" "Fixed permissions for ${binary_path}"
        else
          log "ERROR" "Failed to fix permissions for ${binary_path}"
        fi
      fi
    else
      log "ERROR" "${browser_name_capitalized} binary not found at expected path: ${binary_path}"
      if [ "$QUIET_MODE" = false ]; then
        log "INFO" "Searching for ${browser_type} binary in directory:"
        find "${browser_dir}" -type f -name "*${browser_type}*" -o -name "chrome*" | head -5
      fi
    fi
    
    # Check binary size if it exists
    if [ -f "$binary_path" ] && [ "$QUIET_MODE" = false ]; then
      local binary_size=$(du -h "$binary_path" 2>/dev/null | cut -f1)
      log "INFO" "${browser_name_capitalized} binary size: ${binary_size}"
      
      # Check for missing libraries on Linux
      if [ "$(uname)" == "Linux" ] && command -v ldd &>/dev/null; then
        log "INFO" "Checking for missing libraries..."
        local missing_libs=$(ldd "$binary_path" 2>/dev/null | grep "not found" || echo "")
        if [ -n "$missing_libs" ]; then
          log "ERROR" "Missing libraries detected for ${browser_name_capitalized}:"
          echo "$missing_libs"
        else
          log "SUCCESS" "No missing libraries detected for ${browser_name_capitalized}"
        fi
      fi
    fi
  else
    log "ERROR" "${browser_name_capitalized} directory not found in ~/.cache/ms-playwright"
    return 1
  fi
  
  return 0
}

# Check API functionality
verify_browser_api() {
  local browser_type=$1
  local browser_name_capitalized=$(echo "$browser_type" | sed 's/\b\(.\)/\u\1/g')
  
  if [ "$QUIET_MODE" = false ]; then
    echo -e "\n${BOLD}${BLUE}${browser_name_capitalized} API Verification:${NC}"
  fi
  
  log "INFO" "Verifying ${browser_name_capitalized} can be launched via API..."
  
  # Create verification script for specific browser
  local verification_script=$(cat <<EOF
  const { ${browser_type} } = require('@playwright/test');
  (async () => {
    try {
      console.log('Attempting to launch ${browser_name_capitalized} browser...');
      const browser = await ${browser_type}.launch({ headless: true });
      const version = await browser.version();
      console.log('✅ Successfully launched ${browser_name_capitalized}, version:', version);
      const context = await browser.newContext();
      const page = await context.newPage();
      console.log('✅ Successfully created browser context and page');
      await browser.close();
      console.log('✅ Browser closed successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Failed to launch ${browser_type}:', error.message);
      process.exit(1);
    }
  })();
EOF
  )
  
  # Run verification script
  if node -e "$verification_script" 2>&1; then
    log "SUCCESS" "${browser_name_capitalized} API verification successful"
    return 0
  else
    log "ERROR" "${browser_name_capitalized} API verification failed"
    return 1
  fi
}

# First check if Playwright cache exists and has reasonable permissions
CACHE_DIR=~/.cache/ms-playwright
if [ -d "$CACHE_DIR" ]; then
  log "SUCCESS" "Playwright cache directory exists"
  if [ "$QUIET_MODE" = false ]; then
    log "INFO" "Cache directory permissions: $(ls -ld $CACHE_DIR)"
    log "INFO" "Cache disk space available: $(df -h $CACHE_DIR | awk 'NR==2 {print $4}' 2>/dev/null || echo "unknown")"
  fi
else
  log "ERROR" "Playwright cache directory does not exist"
fi

# Check specific browser or default to all with focus on chromium
if [ -n "$SPECIFIC_BROWSER" ]; then
  verify_browser "$SPECIFIC_BROWSER"
  verify_browser_api "$SPECIFIC_BROWSER"
else
  # Chromium is the primary browser and always checked
  verify_browser "chromium"
  verify_browser_api "chromium"
  
  # Check other browsers if they exist
  if [ -d "$CACHE_DIR/firefox-"* ]; then
    verify_browser "firefox"
    # Skip API check for non-primary browsers in quiet mode
    if [ "$QUIET_MODE" = false ]; then
      verify_browser_api "firefox"
    fi
  fi
  
  if [ -d "$CACHE_DIR/webkit-"* ]; then
    verify_browser "webkit"
    # Skip API check for non-primary browsers in quiet mode
    if [ "$QUIET_MODE" = false ]; then
      verify_browser_api "webkit"
    fi
  fi
fi

# Final summary
if [ "$QUIET_MODE" = false ]; then
  echo -e "\n${BOLD}${BLUE}Verification Summary:${NC}"
  echo "Errors: $VERIFICATION_ERRORS"
  echo "Warnings: $VERIFICATION_WARNINGS"
fi

# Exit with appropriate code
if [ $VERIFICATION_ERRORS -gt 0 ]; then
  log "ERROR" "Verification completed with errors"
  exit 1
elif [ $VERIFICATION_WARNINGS -gt 0 ]; then
  log "WARNING" "Verification completed with warnings"
  exit 0
else
  log "SUCCESS" "Verification completed successfully"
  exit 0
fi