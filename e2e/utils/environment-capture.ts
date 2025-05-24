/**
 * Environment Capture
 * 
 * Provides utilities for capturing comprehensive environment information,
 * especially useful when diagnosing CI-specific failures.
 */

import { TestInfo, Page, Browser } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { getEnvironmentInfo, BrowserType } from './environment-detector';
import { writeDataToFile, getDirectoryContents } from './filesystem-validator';
import { getBrowserInfo } from './browser-metrics';
import { v4 as uuidv4 } from 'uuid';

/**
 * Failure information data structure
 */
export interface FailureInfo {
  // Failure metadata
  id: string;
  timestamp: string;
  testTitle: string;
  failureMessage: string;
  failureType: string;
  failureStack?: string;
  stepName?: string;
  
  // Environment information
  environment: {
    isCI: boolean;
    ciProvider?: string;
    ciPipelineId?: string;
    ciJobId?: string;
    os: string;
    nodeVersion: string;
    browser?: string;
    browserVersion?: string;
  };
  
  // Test metadata
  testMetadata: {
    file: string;
    line?: number;
    column?: number;
    retries: number;
    attempt: number;
    duration: number;
  };
  
  // Resource information
  resources: {
    cpuCores: number;
    totalMemory: number;
    freeMemory: number;
    loadAverage: number[];
    diskSpace?: string;
  };
  
  // Artifacts
  artifacts: {
    screenshot?: string;
    video?: string;
    trace?: string;
    html?: string;
    logs?: string;
    performance?: string;
  };
}

/**
 * Failure type classification
 */
export enum FailureType {
  Timeout = 'timeout',
  Assertion = 'assertion',
  Navigation = 'navigation',
  ElementNotFound = 'element-not-found',
  ElementInteraction = 'element-interaction',
  NetworkError = 'network-error',
  JavaScriptError = 'js-error',
  EnvironmentError = 'environment-error',
  PermissionError = 'permission-error',
  Unknown = 'unknown'
}

/**
 * Capture failure information
 * @param error Error that caused the failure
 * @param page Playwright page
 * @param testInfo TestInfo object
 * @param stepName Optional name of the step that failed
 * @returns FailureInfo object
 */
export async function captureFailureInfo(
  error: Error,
  page: Page,
  testInfo: TestInfo,
  stepName?: string
): Promise<FailureInfo> {
  // Create a unique ID for this failure
  const failureId = uuidv4();
  
  // Get environment information
  const envInfo = getEnvironmentInfo();
  
  // Determine browser information
  let browserInfo: { type: BrowserType; version: string } | undefined;
  try {
    browserInfo = await getBrowserInfo(page.context().browser() as Browser);
  } catch (e) {
    // Browser info might not be available
  }
  
  // Classify failure type
  const failureType = classifyFailure(error);
  
  // Get system resources
  const loadAvg = os.loadavg();
  
  // Create failure info object
  const failureInfo: FailureInfo = {
    id: failureId,
    timestamp: new Date().toISOString(),
    testTitle: testInfo.title,
    failureMessage: error.message,
    failureType,
    failureStack: error.stack,
    stepName,
    
    environment: {
      isCI: envInfo.isCI,
      ciProvider: envInfo.ciProvider,
      ciPipelineId: envInfo.ciPipelineId,
      ciJobId: envInfo.ciJobId,
      os: envInfo.os,
      nodeVersion: envInfo.nodeVersion,
      browser: browserInfo?.type,
      browserVersion: browserInfo?.version
    },
    
    testMetadata: {
      file: testInfo.file,
      retries: testInfo.retry,
      attempt: testInfo.retry + 1,
      duration: Date.now() - ((testInfo as any).startTime?.getTime() || Date.now())
    },
    
    resources: {
      cpuCores: envInfo.cpuCores,
      totalMemory: envInfo.totalMemory,
      freeMemory: envInfo.freeMemory,
      loadAverage: [loadAvg[0], loadAvg[1], loadAvg[2]]
    },
    
    artifacts: {}
  };
  
  // Get line and column number from stack trace if available
  const locationMatch = error.stack?.match(/at.+?(\w+\.(?:spec|test)\.[jt]sx?):(\d+):(\d+)/);
  if (locationMatch) {
    failureInfo.testMetadata.line = parseInt(locationMatch[2], 10);
    failureInfo.testMetadata.column = parseInt(locationMatch[3], 10);
  }
  
  // Get disk space info for CI environments
  if (envInfo.isCI) {
    try {
      const diskSpaceOutput = execSync('df -h').toString();
      failureInfo.resources.diskSpace = diskSpaceOutput;
    } catch (e) {
      // Disk space info might not be available
    }
  }
  
  return failureInfo;
}

/**
 * Classify failure based on error message and stack
 * @param error Error to classify
 * @returns Failure type
 */
export function classifyFailure(error: Error): string {
  const errorText = `${error.message} ${error.stack || ''}`;
  
  if (errorText.includes('timeout') || errorText.includes('timed out')) {
    return FailureType.Timeout;
  }
  
  if (errorText.includes('net::ERR_') || errorText.includes('ECONNREFUSED') || 
      errorText.includes('network error') || errorText.includes('Navigation failed')) {
    return FailureType.NetworkError;
  }
  
  if (errorText.includes('Cannot find element') || errorText.includes('waiting for selector') ||
      errorText.includes('element not found')) {
    return FailureType.ElementNotFound;
  }
  
  if (errorText.includes('expect(') || errorText.includes('AssertionError')) {
    return FailureType.Assertion;
  }
  
  if (errorText.includes('navigation failed') || errorText.includes('page.goto')) {
    return FailureType.Navigation;
  }
  
  if (errorText.includes('click') || errorText.includes('type') || 
      errorText.includes('press') || errorText.includes('fill')) {
    return FailureType.ElementInteraction;
  }
  
  if (errorText.includes('EACCES') || errorText.includes('permission denied') ||
      errorText.includes('PermissionError')) {
    return FailureType.PermissionError;
  }
  
  if (errorText.includes('ReferenceError') || errorText.includes('TypeError') ||
      errorText.includes('SyntaxError') || errorText.includes('Cannot read property')) {
    return FailureType.JavaScriptError;
  }
  
  if (errorText.includes('environment') || errorText.includes('CI environment') ||
      errorText.includes('system error')) {
    return FailureType.EnvironmentError;
  }
  
  return FailureType.Unknown;
}

/**
 * Save failure information to files
 * @param failureInfo Failure information object
 * @param testInfo TestInfo object
 * @returns Path to the saved failure info file
 */
export async function saveFailureInfo(
  failureInfo: FailureInfo,
  testInfo: TestInfo
): Promise<string> {
  const failureDir = path.join(testInfo.outputDir, 'failures');
  
  // Ensure the failure directory exists
  if (!fs.existsSync(failureDir)) {
    fs.mkdirSync(failureDir, { recursive: true });
  }
  
  // Create a file name based on the failure ID
  const failureFilePath = path.join(failureDir, `failure-${failureInfo.id}.json`);
  
  // Write the failure info to a file
  await writeDataToFile(failureFilePath, JSON.stringify(failureInfo, null, 2));
  
  // Attach to test report
  await testInfo.attach('failure-info.json', {
    path: failureFilePath,
    contentType: 'application/json'
  });
  
  return failureFilePath;
}

/**
 * Capture environment diagnostic information
 * @param testInfo TestInfo object
 * @returns Path to the saved environment info file
 */
export async function captureEnvironmentDiagnostics(testInfo: TestInfo): Promise<string> {
  // Get environment information
  const envInfo = getEnvironmentInfo();
  
  // Create diagnostics object
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: envInfo,
    resources: {
      loadAverage: os.loadavg(),
      uptime: os.uptime(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      cpuInfo: os.cpus()
    },
    test: {
      title: testInfo.title,
      file: testInfo.file,
      line: testInfo.line,
      column: testInfo.column,
      repeat: testInfo.repeatEachIndex,
      retries: testInfo.retry,
      project: testInfo.project.name
    }
  };
  
  // Add CI-specific information
  if (envInfo.isCI) {
    try {
      // Use type assertion to add CI-specific properties
      (diagnostics as any).ci = {
        diskSpace: execSync('df -h').toString(),
        processInfo: execSync('ps aux').toString(),
        networkInterfaces: os.networkInterfaces()
      };
    } catch (error) {
      // Some commands might not be available in all CI environments
      console.warn(`Error collecting CI diagnostics: ${(error as Error).message}`);
    }
  }
  
  // Save diagnostics to file
  const diagnosticsDir = path.join(testInfo.outputDir, 'diagnostics');
  
  // Ensure the diagnostics directory exists
  if (!fs.existsSync(diagnosticsDir)) {
    fs.mkdirSync(diagnosticsDir, { recursive: true });
  }
  
  const diagnosticsFilePath = path.join(diagnosticsDir, `env-diagnostics-${Date.now()}.json`);
  await writeDataToFile(diagnosticsFilePath, JSON.stringify(diagnostics, null, 2));
  
  // Attach to test report
  await testInfo.attach('environment-diagnostics.json', {
    path: diagnosticsFilePath,
    contentType: 'application/json'
  });
  
  return diagnosticsFilePath;
}

/**
 * Capture artifact information for a test
 * @param testInfo TestInfo object
 * @returns Object mapping artifact type to path
 */
export async function captureArtifactInfo(testInfo: TestInfo): Promise<Record<string, string>> {
  const artifactInfo: Record<string, string> = {};
  
  try {
    // Get list of files in output directory
    const outputDir = testInfo.outputDir;
    const files = await getDirectoryContents(outputDir);
    
    // Categorize files by type
    for (const file of files) {
      const filePath = path.join(outputDir, file);
      
      if (file.includes('screenshot') && file.endsWith('.png')) {
        artifactInfo.screenshot = filePath;
      } else if (file.endsWith('.webm') || file.endsWith('.mp4')) {
        artifactInfo.video = filePath;
      } else if (file.includes('trace') && (file.endsWith('.zip') || file.endsWith('.trace'))) {
        artifactInfo.trace = filePath;
      } else if (file.endsWith('.html')) {
        artifactInfo.html = filePath;
      } else if (file.includes('log') && file.endsWith('.txt')) {
        artifactInfo.logs = filePath;
      } else if (file.includes('metrics') && file.endsWith('.json')) {
        artifactInfo.performance = filePath;
      }
    }
    
    return artifactInfo;
  } catch (error) {
    console.warn(`Error capturing artifact info: ${(error as Error).message}`);
    return artifactInfo;
  }
}

/**
 * Create an HTML summary report for a test failure
 * @param failureInfo Failure information
 * @param testInfo TestInfo object
 * @returns Path to the HTML report
 */
export async function createFailureReport(
  failureInfo: FailureInfo,
  testInfo: TestInfo
): Promise<string> {
  // Create a basic HTML report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Test Failure Report - ${failureInfo.testTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        h1 { color: #e53e3e; margin-bottom: 10px; }
        h2 { color: #3182ce; margin-top: 30px; border-bottom: 1px solid #cbd5e0; padding-bottom: 5px; }
        pre { background-color: #f7fafc; padding: 15px; border-radius: 5px; overflow: auto; }
        .failure-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 14px; font-weight: bold; color: white; background-color: #e53e3e; }
        .metadata { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
        .metadata-item { background-color: #f7fafc; padding: 10px; border-radius: 5px; flex: 1; min-width: 200px; }
        .metadata-item h3 { margin-top: 0; font-size: 16px; }
        img { max-width: 100%; border: 1px solid #cbd5e0; margin-top: 10px; }
        .resources { display: flex; flex-wrap: wrap; gap: 10px; }
        .resource-item { background-color: #f7fafc; padding: 10px; border-radius: 5px; flex: 1; min-width: 150px; }
        footer { margin-top: 50px; font-size: 12px; color: #718096; }
      </style>
    </head>
    <body>
      <h1>Test Failure Report</h1>
      <div class="failure-badge">${failureInfo.failureType}</div>
      <p><strong>Test:</strong> ${failureInfo.testTitle}</p>
      <p><strong>Time:</strong> ${failureInfo.timestamp}</p>
      
      <h2>Failure Information</h2>
      <p><strong>Message:</strong> ${failureInfo.failureMessage}</p>
      ${failureInfo.stepName ? `<p><strong>Step:</strong> ${failureInfo.stepName}</p>` : ''}
      <h3>Stack Trace</h3>
      <pre>${failureInfo.failureStack || 'No stack trace available'}</pre>
      
      <h2>Environment Information</h2>
      <div class="metadata">
        <div class="metadata-item">
          <h3>Test Environment</h3>
          <p><strong>CI Environment:</strong> ${failureInfo.environment.isCI ? 'Yes' : 'No'}</p>
          ${failureInfo.environment.ciProvider ? `<p><strong>CI Provider:</strong> ${failureInfo.environment.ciProvider}</p>` : ''}
          <p><strong>Operating System:</strong> ${failureInfo.environment.os}</p>
          <p><strong>Node Version:</strong> ${failureInfo.environment.nodeVersion}</p>
          <p><strong>Browser:</strong> ${failureInfo.environment.browser || 'Unknown'} ${failureInfo.environment.browserVersion || ''}</p>
        </div>
        
        <div class="metadata-item">
          <h3>Test Metadata</h3>
          <p><strong>File:</strong> ${failureInfo.testMetadata.file}</p>
          ${failureInfo.testMetadata.line ? `<p><strong>Line:</strong> ${failureInfo.testMetadata.line}</p>` : ''}
          <p><strong>Attempt:</strong> ${failureInfo.testMetadata.attempt} of ${failureInfo.testMetadata.retries + 1}</p>
          <p><strong>Duration:</strong> ${Math.round(failureInfo.testMetadata.duration / 1000)}s</p>
        </div>
        
        <div class="metadata-item">
          <h3>System Resources</h3>
          <p><strong>CPU Cores:</strong> ${failureInfo.resources.cpuCores}</p>
          <p><strong>Total Memory:</strong> ${Math.round(failureInfo.resources.totalMemory / 1024 / 1024)}MB</p>
          <p><strong>Free Memory:</strong> ${Math.round(failureInfo.resources.freeMemory / 1024 / 1024)}MB</p>
          <p><strong>Load Average:</strong> ${failureInfo.resources.loadAverage.map(load => load.toFixed(2)).join(', ')}</p>
        </div>
      </div>
      
      <h2>Artifacts</h2>
      <div class="resources">
        ${failureInfo.artifacts.screenshot ? `
          <div class="resource-item">
            <h3>Screenshot</h3>
            <img src="${path.basename(failureInfo.artifacts.screenshot)}" alt="Failure Screenshot">
          </div>
        ` : ''}
        
        ${failureInfo.artifacts.video ? `
          <div class="resource-item">
            <h3>Video Recording</h3>
            <a href="${path.basename(failureInfo.artifacts.video)}" target="_blank">View Video</a>
          </div>
        ` : ''}
        
        ${failureInfo.artifacts.trace ? `
          <div class="resource-item">
            <h3>Trace</h3>
            <a href="${path.basename(failureInfo.artifacts.trace)}" target="_blank">View Trace</a>
          </div>
        ` : ''}
      </div>
      
      <h2>Troubleshooting Suggestions</h2>
      <pre>${generateTroubleshootingSuggestions(failureInfo)}</pre>
      
      <footer>
        Generated by Scry Splash at ${new Date().toISOString()}
      </footer>
    </body>
    </html>
  `;
  
  // Save the report to a file
  const reportDir = path.join(testInfo.outputDir, 'reports');
  
  // Ensure the report directory exists
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, `failure-report-${failureInfo.id}.html`);
  await writeDataToFile(reportPath, htmlContent);
  
  // Attach to test report
  await testInfo.attach('failure-report.html', {
    path: reportPath,
    contentType: 'text/html'
  });
  
  return reportPath;
}

/**
 * Generate troubleshooting suggestions based on failure type
 * @param failureInfo Failure information
 * @returns Troubleshooting suggestions text
 */
function generateTroubleshootingSuggestions(failureInfo: FailureInfo): string {
  const suggestions: string[] = [];
  
  // Common suggestions for all failure types
  suggestions.push(
    'General suggestions:',
    '- Check the screenshot and video recordings to see the state of the UI at failure time',
    '- Examine the test\'s file and line number to understand the context of the failure',
    '- Consider whether the failure is consistent or intermittent'
  );
  
  // Type-specific suggestions
  switch (failureInfo.failureType) {
    case FailureType.Timeout:
      suggestions.push(
        '\nTimeout failures:',
        '- Increase the timeout value for the action or test',
        '- Check for long-running animations or network requests',
        '- Verify that the expected condition will actually be met',
        '- Consider if the selector is correct and the element appears in the DOM'
      );
      break;
      
    case FailureType.ElementNotFound:
      suggestions.push(
        '\nElement not found failures:',
        '- Verify the selector is correct and matches the expected element',
        '- Check if the element is being added to the DOM asynchronously',
        '- Consider if the element is inside an iframe or shadow DOM',
        '- Try using a more robust selector (data-testid is recommended)'
      );
      break;
      
    case FailureType.NetworkError:
      suggestions.push(
        '\nNetwork error failures:',
        '- Check if the server is running and accessible',
        '- Examine if there are CORS issues or certificate problems',
        '- Verify network conditions and firewall settings',
        '- Look for network timeouts or connection resets'
      );
      break;
      
    case FailureType.Assertion:
      suggestions.push(
        '\nAssertion failures:',
        '- Verify the expected value matches the actual value',
        '- Consider if the assertion needs to wait for a state change',
        '- Check if there are timing issues with the assertion',
        '- Look for inconsistencies between environments (CI vs local)'
      );
      break;
      
    case FailureType.ElementInteraction:
      suggestions.push(
        '\nElement interaction failures:',
        '- Check if the element is visible, enabled and not covered by another element',
        '- Verify the element is in the viewport and not off-screen',
        '- Look for animation or transition issues affecting interaction',
        '- Consider if the element changes state during interaction'
      );
      break;
      
    case FailureType.PermissionError:
      suggestions.push(
        '\nPermission error failures:',
        '- Check file and directory permissions',
        '- Verify the test has the necessary permissions for the operation',
        '- Look for environment-specific permission issues (CI vs local)',
        '- Consider if there are permission issues with artifact directories'
      );
      break;
      
    case FailureType.JavaScriptError:
      suggestions.push(
        '\nJavaScript error failures:',
        '- Examine the exact error type and message',
        '- Check for undefined properties or null references',
        '- Look for type errors or syntax issues',
        '- Consider if there are browser compatibility issues'
      );
      break;
      
    case FailureType.EnvironmentError:
      suggestions.push(
        '\nEnvironment error failures:',
        '- Check system resource availability (memory, disk space)',
        '- Verify environment variables are set correctly',
        '- Look for CI-specific configuration issues',
        '- Consider differences between CI and local environments'
      );
      break;
      
    case FailureType.Navigation:
      suggestions.push(
        '\nNavigation failures:',
        '- Verify the URL is correct and accessible',
        '- Check for redirect issues or navigation timeouts',
        '- Look for HTTPS/certificate problems',
        '- Consider if there are authentication or session issues'
      );
      break;
  }
  
  // CI-specific suggestions
  if (failureInfo.environment.isCI) {
    suggestions.push(
      '\nCI-specific suggestions:',
      '- Check CI runner resource constraints (memory, CPU)',
      '- Verify artifact paths and permissions in CI environment',
      '- Look for differences in browser behavior between CI and local',
      '- Consider timeouts and performance differences in CI'
    );
  }
  
  return suggestions.join('\n');
}

/**
 * Setup comprehensive error capture for a test
 * @param page Playwright page
 * @param testInfo TestInfo object
 * @returns Function to call when an error occurs
 */
export function setupErrorCapture(page: Page, testInfo: TestInfo): (error: Error, stepName?: string) => Promise<void> {
  return async (error: Error, stepName?: string) => {
    try {
      // Capture basic information about the test
      await captureEnvironmentDiagnostics(testInfo);
      
      // Capture failure information
      const failureInfo = await captureFailureInfo(error, page, testInfo, stepName);
      
      // Capture artifact information
      failureInfo.artifacts = await captureArtifactInfo(testInfo);
      
      // Save failure information
      await saveFailureInfo(failureInfo, testInfo);
      
      // Create a failure report
      await createFailureReport(failureInfo, testInfo);
    } catch (captureError) {
      console.error('Error capturing failure information:', captureError);
    }
  };
}