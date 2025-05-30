/**
 * CI Debugger
 * 
 * Central module for enhanced debugging of CI-specific issues.
 * Provides a unified API for all debugging capabilities, including environment detection,
 * filesystem validation, browser metrics collection, and environment information capture.
 * 
 * This module coordinates all the debugging functionality implemented in other modules.
 */

import { Page, TestInfo } from '@playwright/test';
import {
  getEnvironmentInfo,
  printEnvironmentDiagnosis,
  updateBrowserInfo
} from './environment-detector';
import {
  validateArtifactStructure,
  ensureDirectoryExists,
  applyCIFilesystemOptimizations,
  FilesystemError
} from './filesystem-validator';
import {
  setupPerformanceMetrics,
  getBrowserInfo,
  MetricsCollector
} from './browser-metrics';
import {
  captureEnvironmentDiagnostics,
  setupErrorCapture
} from './environment-capture';
import path from 'path';
import fs from 'fs';

/**
 * Debug level for CI debugger
 */
export enum DebugLevel {
  // Only essential debugging information
  Essential = 'essential',
  // Standard debugging information
  Standard = 'standard',
  // Comprehensive debugging information
  Comprehensive = 'comprehensive',
  // Maximum debugging information (may impact performance)
  Maximum = 'maximum'
}

/**
 * Configuration for CI debugger
 */
export interface CIDebuggerConfig {
  // Debug level
  debugLevel: DebugLevel;
  // Standard artifact directories to create and validate
  artifactDirectories: string[];
  // Whether to capture performance metrics
  capturePerformanceMetrics: boolean;
  // Whether to capture verbose logs
  verboseLogs: boolean;
  // Whether to create HTML reports for failures
  createHtmlReports: boolean;
  // Whether to add environment information to all screenshots
  addEnvironmentToScreenshots: boolean;
}

/**
 * Default debugger configuration
 */
const DEFAULT_DEBUGGER_CONFIG: CIDebuggerConfig = {
  debugLevel: DebugLevel.Standard,
  artifactDirectories: [
    'screenshots',
    'videos',
    'traces',
    'logs',
    'reports',
    'metrics'
  ],
  capturePerformanceMetrics: true,
  verboseLogs: true,
  createHtmlReports: true,
  addEnvironmentToScreenshots: true
};

/**
 * CI Debugger class for enhanced debugging
 */
export class CIDebugger {
  private page: Page;
  private testInfo: TestInfo;
  private config: CIDebuggerConfig;
  private metricsCollector: MetricsCollector | null = null;
  private isCI: boolean;
  private errorCaptureHandler: ReturnType<typeof setupErrorCapture> | null = null;
  private logs: string[] = [];
  private initialized = false;
  
  /**
   * Create a new CI debugger
   * @param page Playwright page
   * @param testInfo Test info object
   * @param config Optional configuration overrides
   */
  constructor(page: Page, testInfo: TestInfo, config: Partial<CIDebuggerConfig> = {}) {
    this.page = page;
    this.testInfo = testInfo;
    this.config = { ...DEFAULT_DEBUGGER_CONFIG, ...config };
    
    // Auto-adjust debug level in CI
    const envInfo = getEnvironmentInfo();
    this.isCI = envInfo.isCI;
    
    if (this.isCI && this.config.debugLevel === DebugLevel.Standard) {
      this.config.debugLevel = DebugLevel.Comprehensive;
    }
    
    // Start log with timestamp
    this.log(`CI-Debugger initialized for test: ${testInfo.title}`);
    this.log(`Debug level: ${this.config.debugLevel}`);
    this.log(`Running in CI: ${this.isCI ? 'Yes' : 'No'}`);
  }
  
  /**
   * Initialize the debugger
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      // Set up browser info
      const browser = this.page.context().browser();
      if (browser) {
        const browserInfo = await getBrowserInfo(browser);
        this.log(`Browser: ${browserInfo.type} ${browserInfo.version}`);
        updateBrowserInfo(browserInfo.type, browserInfo.version);
      }
      
      // Ensure artifact directories exist
      await this.ensureArtifactDirectories();
      
      // Print environment diagnosis at Comprehensive or Maximum level
      if (this.config.debugLevel === DebugLevel.Comprehensive || 
          this.config.debugLevel === DebugLevel.Maximum) {
        printEnvironmentDiagnosis();
      }
      
      // Initialize metrics collection at Standard level or higher
      if (this.config.capturePerformanceMetrics && 
          this.config.debugLevel !== DebugLevel.Essential) {
        this.metricsCollector = await setupPerformanceMetrics(this.page, this.testInfo);
        this.log('Performance metrics collection started');
      }
      
      // Initialize error capture
      this.errorCaptureHandler = setupErrorCapture(this.page, this.testInfo);
      
      // Apply CI filesystem optimizations
      if (this.isCI) {
        await applyCIFilesystemOptimizations(this.testInfo.outputDir);
      }
      
      // Capture initial environment diagnostics
      await captureEnvironmentDiagnostics(this.testInfo);
      
      // Listen for console messages at Comprehensive or Maximum level
      if (this.config.debugLevel === DebugLevel.Comprehensive || 
          this.config.debugLevel === DebugLevel.Maximum) {
        this.page.on('console', msg => {
          this.log(`Browser console [${msg.type()}]: ${msg.text()}`);
        });
      }
      
      this.initialized = true;
      this.log('CI-Debugger initialization complete');
    } catch (error) {
      this.log(`ERROR during initialization: ${(error as Error).message}`, true);
      console.error('CI-Debugger initialization failed:', error);
      // Continue without failing - debugging shouldn't break the test
    }
  }
  
  /**
   * Ensure artifact directories exist
   */
  async ensureArtifactDirectories(): Promise<void> {
    const baseDir = this.testInfo.outputDir;
    
    this.log(`Ensuring artifact directories in ${baseDir}...`);
    
    try {
      // Create base directory
      await ensureDirectoryExists(baseDir);
      
      // Create and validate artifact directories
      const dirResults = await validateArtifactStructure(
        baseDir,
        this.config.artifactDirectories,
        true
      );
      
      // Log detailed results at Comprehensive or Maximum level
      if (this.config.debugLevel === DebugLevel.Comprehensive || 
          this.config.debugLevel === DebugLevel.Maximum) {
        for (const result of dirResults) {
          this.log(`Directory ${result.path}: ${result.hasPermission ? 'OK' : 'ISSUE'} ` +
                  `(R:${result.readable ? 'Yes' : 'No'}, W:${result.writable ? 'Yes' : 'No'}, ` +
                  `X:${result.executable ? 'Yes' : 'No'})`);
        }
      }
    } catch (error) {
      this.log(`ERROR: Failed to create artifact directories: ${(error as Error).message}`, true);
      
      if (error instanceof FilesystemError) {
        this.log(`Filesystem error details: ${error.getDetailedMessage()}`, true);
      }
    }
  }
  
  /**
   * Log a message
   * @param message Message to log
   * @param isError Whether this is an error message
   */
  log(message: string, isError = false): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${isError ? 'ERROR: ' : ''}${message}`;
    
    // Add to internal logs
    this.logs.push(formattedMessage);
    
    // Output to console
    if (isError) {
      console.error(formattedMessage);
    } else if (this.config.verboseLogs) {
      console.log(formattedMessage);
    }
  }
  
  /**
   * Handle an error
   * @param error Error to handle
   * @param stepName Optional name of the step that failed
   */
  async handleError(error: Error, stepName?: string): Promise<void> {
    this.log(`Error encountered${stepName ? ` in step "${stepName}"` : ''}: ${error.message}`, true);
    
    if (this.errorCaptureHandler) {
      await this.errorCaptureHandler(error, stepName);
    }
  }
  
  /**
   * Save debug information
   */
  async saveDebugInfo(): Promise<void> {
    try {
      // Save logs
      const logsDir = path.join(this.testInfo.outputDir, 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      const logPath = path.join(logsDir, `ci-debugger-${Date.now()}.log`);
      fs.writeFileSync(logPath, this.logs.join('\n'));
      
      // Attach to test report
      await this.testInfo.attach('ci-debugger.log', {
        path: logPath,
        contentType: 'text/plain'
      });
      
      this.log(`Debug logs saved to ${logPath}`);
    } catch (error) {
      this.log(`ERROR: Failed to save debug info: ${(error as Error).message}`, true);
    }
  }
  
  /**
   * Finalize debugging
   */
  async finalize(): Promise<void> {
    try {
      // Log test result
      this.log(`Test result: ${this.testInfo.status}`);
      
      // Save metrics if they were collected
      if (this.metricsCollector) {
        await this.metricsCollector.saveMetrics();
      }
      
      // Save the logs
      await this.saveDebugInfo();
      
      this.log('CI-Debugger finalization complete');
    } catch (error) {
      console.error('Error during CI-Debugger finalization:', error);
    }
  }
  
  /**
   * Add environment information to a screenshot
   * @param screenshotPath Path to the screenshot
   */
  async addEnvironmentToScreenshot(screenshotPath: string): Promise<string> {
    try {
      // Note: In a real implementation, this would add environment text overlay to the image
      // This is a placeholder that would typically use an image manipulation library
      // like sharp or canvas to add text overlay with environment info to the screenshot
      
      this.log(`Environment info would be added to screenshot: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      this.log(`ERROR: Failed to add environment info to screenshot: ${(error as Error).message}`, true);
      return screenshotPath;
    }
  }
}

/**
 * Setup CI debugging for a test
 * @param page Playwright page
 * @param testInfo Test info object
 * @param config Optional configuration overrides
 * @returns CIDebugger instance
 */
export async function setupCIDebugging(
  page: Page,
  testInfo: TestInfo,
  config: Partial<CIDebuggerConfig> = {}
): Promise<CIDebugger> {
  const debuggerInstance = new CIDebugger(page, testInfo, config);
  
  // Initialize the debugger
  await debuggerInstance.initialize();
  
  // Set up test hooks (using any to work around TypeScript limitations)
  const testInfoAny = testInfo as any;
  if (typeof testInfoAny.onFinish === 'function') {
    testInfoAny.onFinish(async () => {
      await debuggerInstance.finalize();
    });
  }
  
  // Return the debugger instance for direct use
  return debuggerInstance;
}

/**
 * Enhanced test function for use with CI debugging
 * @param page Playwright page
 * @param testInfo Test info object
 * @returns Object with debugger instance and step helper
 */
export async function withCIDebugging(page: Page, testInfo: TestInfo) {
  const debuggerInstance = await setupCIDebugging(page, testInfo);
  
  // Helper function for named test steps with error handling
  const step = async (name: string, action: () => Promise<void>) => {
    debuggerInstance.log(`Starting step: ${name}`);
    try {
      await action();
      debuggerInstance.log(`Completed step: ${name}`);
    } catch (error) {
      await debuggerInstance.handleError(error as Error, name);
      throw error;
    }
  };
  
  return {
    ciDebugger: debuggerInstance,
    step
  };
}