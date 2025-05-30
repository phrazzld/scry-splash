#!/bin/bash
# browser-recovery.sh
# Advanced recovery script for Playwright browser installation issues
# Provides multiple fallback methods to ensure browser availability

set -eo pipefail

# Colors and formatting
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAX_RETRIES=3
CACHE_DIR=~/.cache/ms-playwright
BROWSER_TYPE=${1:-"chromium"} # Default to chromium if not specified

# Log with timestamp
log() {
  local level=$1
  local message=$2
  local color=$NC
  
  case $level in
    "INFO") color=$BLUE ;;
    "SUCCESS") color=$GREEN ;;
    "WARNING") color=$YELLOW ;;
    "ERROR") color=$RED ;;
  esac
  
  echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] ${color}${level}${NC}: ${message}"
}

# Report recovery attempt
report_attempt() {
  local method=$1
  local attempt_num=$2
  log "INFO" "Recovery Attempt #${attempt_num} using method: ${method}"
}

# Find browser binary path based on platform and browser type
get_browser_binary() {
  local browser_type=$1
  local binary_path=""
  
  # Determine browser directory
  local browser_dir=$(find $CACHE_DIR -type d -name "${browser_type}-*" 2>/dev/null | head -1)
  
  if [ -z "$browser_dir" ]; then
    log "ERROR" "No ${browser_type} directory found in $CACHE_DIR"
    return 1
  fi
  
  # Determine platform-specific binary path
  if [ "$(uname)" == "Darwin" ]; then
    # macOS
    case $browser_type in
      "chromium") binary_path="${browser_dir}/chrome-mac/Chromium.app/Contents/MacOS/Chromium" ;;
      "firefox") binary_path="${browser_dir}/firefox/Nightly.app/Contents/MacOS/firefox" ;;
      "webkit") binary_path="${browser_dir}/webkit/Webkit.app/Contents/MacOS/Webkit" ;;
    esac
  elif [ "$(uname)" == "Linux" ]; then
    # Linux
    case $browser_type in
      "chromium") binary_path="${browser_dir}/chrome-linux/chrome" ;;
      "firefox") binary_path="${browser_dir}/firefox/firefox" ;;
      "webkit") binary_path="${browser_dir}/webkit/pw_run.sh" ;;
    esac
  else
    # Windows/WSL
    case $browser_type in
      "chromium") binary_path="${browser_dir}/chrome-win/chrome.exe" ;;
      "firefox") binary_path="${browser_dir}/firefox/firefox.exe" ;;
      "webkit") binary_path="${browser_dir}/webkit/Playwright.exe" ;;
    esac
  fi
  
  echo "$binary_path"
}

# Check if browser is installed correctly
check_browser_installation() {
  local browser_type=$1
  local binary_path=$(get_browser_binary "$browser_type")
  
  # Check if binary exists and is executable
  if [ -n "$binary_path" ] && [ -f "$binary_path" ] && [ -x "$binary_path" ]; then
    log "SUCCESS" "Browser binary exists and is executable: $binary_path"
    return 0
  else
    log "ERROR" "Browser binary not found or not executable: $binary_path"
    return 1
  fi
}

# Clear browser cache for fresh installation
clear_browser_cache() {
  local browser_type=$1
  log "INFO" "Clearing ${browser_type} cache for fresh installation"
  
  # Find and remove browser-specific directory
  local browser_dir=$(find $CACHE_DIR -type d -name "${browser_type}-*" 2>/dev/null)
  if [ -n "$browser_dir" ]; then
    log "INFO" "Removing browser directory: $browser_dir"
    rm -rf "$browser_dir"
    return 0
  else
    log "WARNING" "No ${browser_type} directory found to clear"
    return 1
  fi
}

# Standard installation method
standard_installation() {
  local browser_type=$1
  report_attempt "Standard installation" 1
  
  log "INFO" "Installing ${browser_type} using standard Playwright installer"
  npx playwright install ${browser_type} --with-deps
  
  if check_browser_installation "$browser_type"; then
    log "SUCCESS" "Standard installation succeeded"
    return 0
  else
    log "ERROR" "Standard installation failed"
    return 1
  fi
}

# Forced installation with cache bypass
forced_installation() {
  local browser_type=$1
  report_attempt "Forced installation" 2
  
  log "INFO" "Attempting forced installation with cache bypass"
  # Clear any existing installation
  clear_browser_cache "$browser_type"
  
  # Force browser download by setting environment variable
  log "INFO" "Setting PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0 to force download"
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0 npx playwright install ${browser_type} --with-deps
  
  if check_browser_installation "$browser_type"; then
    log "SUCCESS" "Forced installation succeeded"
    return 0
  else
    log "ERROR" "Forced installation failed"
    return 1
  fi
}

# System package installation (for Linux)
system_package_installation() {
  local browser_type=$1
  report_attempt "System package installation" 3
  
  if [ "$(uname)" != "Linux" ]; then
    log "WARNING" "System package installation only available on Linux"
    return 1
  fi
  
  log "INFO" "Attempting to install browser dependencies via system packages"
  
  # Determine system package manager
  if command -v apt-get &>/dev/null; then
    log "INFO" "Using apt-get package manager"
    
    case $browser_type in
      "chromium")
        log "INFO" "Installing chromium-browser and dependencies"
        sudo apt-get update && sudo apt-get install -y chromium-browser
        ;;
      "firefox")
        log "INFO" "Installing firefox and dependencies"
        sudo apt-get update && sudo apt-get install -y firefox
        ;;
      "webkit")
        log "INFO" "Installing webkit dependencies"
        sudo apt-get update && sudo apt-get install -y libwoff1 libopus0 libwebp6 libwebpdemux2 libenchant1c2a libgudev-1.0-0 libsecret-1-0 libhyphen0 libgdk-pixbuf2.0-0 libegl1 libnotify4 libxslt1.1 libevent-2.1-6 libgles2 libvpx5 libxcomposite1 libatk1.0-0 libatk-bridge2.0-0 libepoxy0 libgtk-3-0 libharfbuzz-icu0
        ;;
    esac
    
    # Try installing browser with Playwright again
    npx playwright install ${browser_type} --with-deps
    
    if check_browser_installation "$browser_type"; then
      log "SUCCESS" "System package installation succeeded"
      return 0
    else
      log "ERROR" "System package installation failed"
      return 1
    fi
  else
    log "WARNING" "No supported package manager found"
    return 1
  fi
}

# Direct download fallback (last resort)
direct_download_fallback() {
  local browser_type=$1
  report_attempt "Direct download" 4
  
  log "INFO" "Attempting direct download as last resort"
  
  # Create Playwright browsers directory if it doesn't exist
  mkdir -p $CACHE_DIR
  
  # Custom download and installation based on browser type
  case $browser_type in
    "chromium")
      log "INFO" "Direct downloading Chromium from known source"
      # Create temporary download directory
      mkdir -p /tmp/playwright-download
      cd /tmp/playwright-download
      
      # Download Chromium from a known source
      if [ "$(uname)" == "Linux" ]; then
        log "INFO" "Downloading Chromium for Linux"
        wget https://playwright.azureedge.net/builds/chromium/1091/chromium-linux.zip
        unzip chromium-linux.zip -d chromium-extracted
        
        # Create browser directory in Playwright cache
        local version_dir="${CACHE_DIR}/chromium-1091"
        mkdir -p "$version_dir"
        
        # Move downloaded browser to Playwright cache
        log "INFO" "Moving downloaded browser to Playwright cache"
        mv chromium-extracted/* "$version_dir/"
        
        # Ensure binary is executable
        chmod +x "$version_dir/chrome-linux/chrome"
      else
        log "WARNING" "Direct download for $(uname) not implemented"
        return 1
      fi
      ;;
    *)
      log "WARNING" "Direct download for $browser_type not implemented"
      return 1
      ;;
  esac
  
  # Clean up
  cd $OLDPWD
  rm -rf /tmp/playwright-download
  
  if check_browser_installation "$browser_type"; then
    log "SUCCESS" "Direct download succeeded"
    return 0
  else
    log "ERROR" "Direct download failed"
    return 1
  fi
}

# Collect diagnostic information for reporting
collect_diagnostics() {
  local browser_type=$1
  log "INFO" "Collecting diagnostic information for ${browser_type} installation"
  
  # Create diagnostics directory
  local diag_dir="/tmp/playwright-diagnostics"
  mkdir -p "$diag_dir"
  
  # Collect Playwright version info
  npx playwright --version > "$diag_dir/playwright-version.txt" 2>&1
  
  # List cache directory contents
  ls -la $CACHE_DIR > "$diag_dir/cache-contents.txt" 2>&1
  
  # Check for browser-specific directories
  find $CACHE_DIR -name "*${browser_type}*" > "$diag_dir/browser-files.txt" 2>&1
  
  # System information
  uname -a > "$diag_dir/system-info.txt" 2>&1
  
  # Package versions
  if [ -f "package.json" ]; then
    grep -A 5 "\"playwright\"" package.json > "$diag_dir/playwright-package-version.txt" 2>&1
  fi
  
  # Free space
  df -h > "$diag_dir/disk-space.txt" 2>&1
  
  # Compress diagnostics
  local diag_file="${diag_dir}.tar.gz"
  tar -czf "$diag_file" "$diag_dir"
  
  log "INFO" "Diagnostic information collected at: $diag_file"
  echo "$diag_file"
}

# Main recovery function with multiple fallback mechanisms
recover_browser_installation() {
  local browser_type=$1
  local success=false
  local diagnostics_file=""
  
  log "INFO" "Starting recovery process for ${browser_type}"
  
  # Try standard installation
  if standard_installation "$browser_type"; then
    success=true
  else
    # Try forced installation
    if forced_installation "$browser_type"; then
      success=true
    else
      # Try system package installation (Linux only)
      if system_package_installation "$browser_type"; then
        success=true
      else
        # Try direct download as last resort
        if direct_download_fallback "$browser_type"; then
          success=true
        else
          log "ERROR" "All recovery methods failed"
          diagnostics_file=$(collect_diagnostics "$browser_type")
        fi
      fi
    fi
  fi
  
  if $success; then
    log "SUCCESS" "Recovery successful for ${browser_type}"
    return 0
  else
    log "ERROR" "Recovery failed for ${browser_type}. Diagnostics: ${diagnostics_file}"
    return 1
  fi
}

# Execute recovery for specified browser type
log "INFO" "Starting browser recovery for ${BROWSER_TYPE}"
recover_browser_installation "${BROWSER_TYPE}"