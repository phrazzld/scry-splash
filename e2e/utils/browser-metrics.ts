/**
 * Browser Metrics Collection
 * 
 * Collects performance and browser metrics during test execution,
 * particularly focused on capturing detailed metrics in CI environments
 * to help diagnose performance issues and test flakiness.
 */

import { Page, TestInfo, Browser } from '@playwright/test';
import { getEnvironmentConfig, BrowserType } from './environment-detector';
import { writeDataToFile } from './filesystem-validator';
import path from 'path';

/**
 * Core Web Vital metrics
 */
export interface CoreWebVitals {
  // Largest Contentful Paint - measures loading performance
  lcp?: number;
  // First Input Delay - measures interactivity
  fid?: number;
  // Cumulative Layout Shift - measures visual stability
  cls?: number;
  // First Contentful Paint
  fcp?: number;
  // Time to Interactive
  tti?: number;
  // Total Blocking Time
  tbt?: number;
}

/**
 * JavaScript performance metrics
 */
export interface JavaScriptMetrics {
  // Total script evaluation time
  evaluationTime?: number;
  // Script compile time
  compileTime?: number;
  // Number of scripts
  scriptCount?: number;
  // Memory used by JavaScript
  jsHeapSize?: number;
  // JS Heap size limit
  jsHeapSizeLimit?: number;
  // Used JS Heap size
  usedJsHeapSize?: number;
}

/**
 * Resource metrics
 */
export interface ResourceMetrics {
  // Number of resources loaded
  resourceCount?: number;
  // Total resource size in bytes
  totalResourceSize?: number;
  // Resources by type (js, css, image, etc)
  resourceCountByType?: Record<string, number>;
  // Transfer sizes by type
  transferSizeByType?: Record<string, number>;
}

/**
 * Network metrics
 */
export interface NetworkMetrics {
  // Navigation timing
  navigationStart?: number;
  domContentLoaded?: number;
  domComplete?: number;
  loadEvent?: number;
  // Network requests
  requestCount?: number;
  transferSize?: number;
  // Connection info
  effectiveConnectionType?: string;
}

/**
 * Complete performance metrics
 */
export interface PerformanceMetrics {
  // Test metadata
  testName: string;
  timestamp: number;
  url: string;
  viewportSize?: { width: number; height: number };
  browser?: string;
  browserVersion?: string;
  
  // Core metrics
  coreWebVitals: CoreWebVitals;
  jsMetrics: JavaScriptMetrics;
  resourceMetrics: ResourceMetrics;
  networkMetrics: NetworkMetrics;
  
  // Raw metrics
  raw?: Record<string, any>;
}

/**
 * Metrics collection options
 */
export interface MetricsCollectionOptions {
  // Whether to collect core web vitals
  collectCoreWebVitals?: boolean;
  // Whether to collect JavaScript metrics
  collectJSMetrics?: boolean;
  // Whether to collect resource metrics
  collectResourceMetrics?: boolean;
  // Whether to collect network metrics
  collectNetworkMetrics?: boolean;
  // Whether to save raw metrics
  saveRawMetrics?: boolean;
  // Collection interval in ms for continuous monitoring
  collectionInterval?: number;
  // Custom selectors for tracking specific elements
  customSelectors?: string[];
}

// Default metrics collection options
const DEFAULT_METRICS_OPTIONS: MetricsCollectionOptions = {
  collectCoreWebVitals: true,
  collectJSMetrics: true,
  collectResourceMetrics: true,
  collectNetworkMetrics: true,
  saveRawMetrics: false,
  collectionInterval: 5000,
  customSelectors: []
};

/**
 * Get default metrics options based on environment
 */
export function getDefaultMetricsOptions(): MetricsCollectionOptions {
  const envConfig = getEnvironmentConfig();
  
  return {
    ...DEFAULT_METRICS_OPTIONS,
    collectionInterval: envConfig.performanceMetricsInterval,
    saveRawMetrics: envConfig.verboseLogging
  };
}

/**
 * Single snapshot of performance metrics
 * @param page Playwright page
 * @param testInfo Test info object
 * @param options Metrics collection options
 * @returns Collected performance metrics
 */
export async function collectPerformanceMetrics(
  page: Page,
  testInfo: TestInfo,
  options: MetricsCollectionOptions = {}
): Promise<PerformanceMetrics> {
  const mergedOptions = { ...getDefaultMetricsOptions(), ...options };
  
  // Basic metrics structure
  const metrics: PerformanceMetrics = {
    testName: testInfo.title,
    timestamp: Date.now(),
    url: page.url(),
    viewportSize: page.viewportSize() || undefined,
    browser: testInfo.project.name,
    coreWebVitals: {},
    jsMetrics: {},
    resourceMetrics: {},
    networkMetrics: {}
  };
  
  // Collect performance metrics via JavaScript execution in the page
  const rawMetrics = await page.evaluate(() => {
    const performance = window.performance;
    const perfMetrics: Record<string, any> = {};
    
    // Navigation timing
    if (performance.timing) {
      const timing = performance.timing;
      perfMetrics.timing = {
        navigationStart: timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        domComplete: timing.domComplete - timing.navigationStart,
        loadEvent: timing.loadEventEnd - timing.navigationStart
      };
    }
    
    // Performance entries
    if (performance.getEntriesByType) {
      try {
        perfMetrics.entries = {
          navigation: performance.getEntriesByType('navigation'),
          resource: performance.getEntriesByType('resource'),
          paint: performance.getEntriesByType('paint'),
          mark: performance.getEntriesByType('mark'),
          measure: performance.getEntriesByType('measure')
        };
      } catch (error) {
        perfMetrics.entriesError = String(error);
      }
    }
    
    // Memory info - using any for browser-specific properties
    const performanceAny = performance as any;
    if (performanceAny.memory) {
      perfMetrics.memory = {
        jsHeapSizeLimit: performanceAny.memory.jsHeapSizeLimit,
        totalJSHeapSize: performanceAny.memory.totalJSHeapSize,
        usedJSHeapSize: performanceAny.memory.usedJSHeapSize
      };
    }
    
    // LCP from PerformanceObserver (if available)
    // Using any since these are custom properties we may set in the page
    const windowAny = window as any;
    if (typeof windowAny.LargestContentfulPaint !== 'undefined') {
      perfMetrics.lcp = windowAny.LargestContentfulPaint;
    }
    
    // CLS from PerformanceObserver (if available)
    if (typeof windowAny.CumulativeLayoutShift !== 'undefined') {
      perfMetrics.cls = windowAny.CumulativeLayoutShift;
    }
    
    // Resource count and sizes
    const resources = performance.getEntriesByType('resource');
    const resourceStats: Record<string, any> = {
      count: resources.length,
      totalSize: 0,
      byType: {}
    };
    
    resources.forEach((resource: any) => {
      const type = resource.initiatorType || 'other';
      if (!resourceStats.byType[type]) {
        resourceStats.byType[type] = {
          count: 0,
          size: 0
        };
      }
      
      resourceStats.byType[type].count++;
      
      if (resource.transferSize) {
        resourceStats.byType[type].size += resource.transferSize;
        resourceStats.totalSize += resource.transferSize;
      }
    });
    
    perfMetrics.resources = resourceStats;
    
    // Paint timing
    const paintEntries = performance.getEntriesByType('paint');
    const paintTiming: Record<string, number> = {};
    
    paintEntries.forEach((entry: any) => {
      paintTiming[entry.name] = entry.startTime;
    });
    
    perfMetrics.paint = paintTiming;
    
    return perfMetrics;
  });
  
  // Process raw metrics into structured format
  if (mergedOptions.collectCoreWebVitals) {
    // Extract Core Web Vitals
    if (rawMetrics.paint) {
      metrics.coreWebVitals.fcp = rawMetrics.paint['first-contentful-paint'];
    }
    
    if (rawMetrics.lcp) {
      metrics.coreWebVitals.lcp = rawMetrics.lcp;
    }
    
    if (rawMetrics.cls) {
      metrics.coreWebVitals.cls = rawMetrics.cls;
    }
  }
  
  if (mergedOptions.collectJSMetrics && rawMetrics.memory) {
    // Extract JS Metrics
    metrics.jsMetrics = {
      jsHeapSize: rawMetrics.memory.totalJSHeapSize,
      jsHeapSizeLimit: rawMetrics.memory.jsHeapSizeLimit,
      usedJsHeapSize: rawMetrics.memory.usedJSHeapSize
    };
  }
  
  if (mergedOptions.collectResourceMetrics && rawMetrics.resources) {
    // Extract Resource Metrics
    metrics.resourceMetrics = {
      resourceCount: rawMetrics.resources.count,
      totalResourceSize: rawMetrics.resources.totalSize,
      resourceCountByType: {},
      transferSizeByType: {}
    };
    
    // Process resource types
    Object.entries(rawMetrics.resources.byType).forEach(([type, data]: [string, any]) => {
      if (metrics.resourceMetrics.resourceCountByType) {
        metrics.resourceMetrics.resourceCountByType[type] = data.count;
      }
      
      if (metrics.resourceMetrics.transferSizeByType) {
        metrics.resourceMetrics.transferSizeByType[type] = data.size;
      }
    });
  }
  
  if (mergedOptions.collectNetworkMetrics && rawMetrics.timing) {
    // Extract Network Metrics
    metrics.networkMetrics = {
      navigationStart: rawMetrics.timing.navigationStart,
      domContentLoaded: rawMetrics.timing.domContentLoaded,
      domComplete: rawMetrics.timing.domComplete,
      loadEvent: rawMetrics.timing.loadEvent,
      requestCount: rawMetrics.resources?.count,
      transferSize: rawMetrics.resources?.totalSize
    };
  }
  
  // Save raw metrics if requested
  if (mergedOptions.saveRawMetrics) {
    metrics.raw = rawMetrics;
  }
  
  return metrics;
}

/**
 * Continuous metrics collection
 */
export class MetricsCollector {
  private page: Page;
  private testInfo: TestInfo;
  private options: MetricsCollectionOptions;
  private metrics: PerformanceMetrics[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  
  constructor(page: Page, testInfo: TestInfo, options: MetricsCollectionOptions = {}) {
    this.page = page;
    this.testInfo = testInfo;
    this.options = { ...getDefaultMetricsOptions(), ...options };
  }
  
  /**
   * Start collecting metrics at the specified interval
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }
    
    this.isRunning = true;
    this.metrics = [];
    
    // Collect initial metrics
    await this.collectMetrics();
    
    // Setup interval for continuous collection
    if (this.options.collectionInterval && this.options.collectionInterval > 0) {
      this.intervalId = setInterval(async () => {
        try {
          await this.collectMetrics();
        } catch (error) {
          console.warn(`Error collecting metrics: ${(error as Error).message}`);
        }
      }, this.options.collectionInterval);
    }
  }
  
  /**
   * Stop collecting metrics
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
  }
  
  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }
  
  /**
   * Get the latest metrics
   */
  getLatestMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) {
      return null;
    }
    
    return this.metrics[this.metrics.length - 1];
  }
  
  /**
   * Save metrics to a file
   * @param filePath Path to save metrics to
   */
  async saveMetrics(filePath?: string): Promise<string> {
    let metricsPath = filePath;
    
    if (!metricsPath) {
      const artifacts = this.testInfo.outputDir;
      const sanitizedTestName = this.testInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
      metricsPath = path.join(artifacts, `metrics-${sanitizedTestName}-${Date.now()}.json`);
    }
    
    const metricsData = JSON.stringify({
      test: this.testInfo.title,
      metrics: this.metrics
    }, null, 2);
    
    await writeDataToFile(metricsPath, metricsData);
    return metricsPath;
  }
  
  /**
   * Collect a single metrics sample
   */
  private async collectMetrics(): Promise<void> {
    try {
      const metrics = await collectPerformanceMetrics(this.page, this.testInfo, this.options);
      this.metrics.push(metrics);
    } catch (error) {
      console.warn(`Error collecting metrics: ${(error as Error).message}`);
    }
  }
}

/**
 * Setup performance metrics collection for a page
 * @param page Playwright page
 * @param testInfo Test info object
 * @param options Metrics collection options
 * @returns MetricsCollector instance
 */
export async function setupPerformanceMetrics(
  page: Page,
  testInfo: TestInfo,
  options: MetricsCollectionOptions = {}
): Promise<MetricsCollector> {
  const collector = new MetricsCollector(page, testInfo, options);
  
  // Start collecting metrics
  await collector.start();
  
  // In a real implementation, we would use testInfo.onFinish
  // Since TypeScript doesn't recognize this property, we use a workaround
  // Register a hook to save metrics at the end
  try {
    // TypeScript doesn't know about onFinish, so we use a workaround
    const testInfoAny = testInfo as any;
    if (typeof testInfoAny.onFinish === 'function') {
      testInfoAny.onFinish(async () => {
        collector.stop();
        
        try {
          // Only save metrics if we actually collected any
          if (collector.getMetrics().length > 0) {
            const filePath = await collector.saveMetrics();
            
            // Attach metrics to test report
            await testInfo.attach('performance-metrics.json', {
              path: filePath,
              contentType: 'application/json'
            });
          }
        } catch (error) {
          console.warn(`Error saving metrics: ${(error as Error).message}`);
        }
      });
    } else {
      // Fallback if onFinish isn't available
      console.warn('TestInfo.onFinish not available - metrics will need to be saved manually');
    }
  } catch (error) {
    console.warn(`Error setting up metrics collection: ${(error as Error).message}`);
  }
  
  return collector;
}

/**
 * Get browser information from Playwright browser instance
 * @param browser Playwright browser
 * @returns Browser type and version
 */
export async function getBrowserInfo(browser: Browser): Promise<{ type: BrowserType; version: string }> {
  // Default values
  let type = BrowserType.Unknown;
  let version = 'unknown';
  
  try {
    // Get browser version
    const versionInfo = await browser.version();
    
    // Determine browser type
    if (versionInfo.toLowerCase().includes('chrome')) {
      type = BrowserType.Chromium;
    } else if (versionInfo.toLowerCase().includes('firefox')) {
      type = BrowserType.Firefox;
    } else if (versionInfo.toLowerCase().includes('webkit') || versionInfo.toLowerCase().includes('safari')) {
      type = BrowserType.WebKit;
    }
    
    // Clean up version string
    version = versionInfo.replace(/^.+\/([0-9.]+).*$/, '$1');
    
    return { type, version };
  } catch (error) {
    console.warn(`Error getting browser info: ${(error as Error).message}`);
    return { type, version };
  }
}