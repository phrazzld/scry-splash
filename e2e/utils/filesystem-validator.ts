/**
 * Filesystem Validator
 * 
 * Provides utilities for validating filesystem permissions, paths, and handling
 * filesystem operations with robust error handling and recovery strategies.
 * 
 * This module is particularly useful for ensuring reliable filesystem operations
 * in CI environments where permissions and path handling may differ from local environments.
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { isRunningInCI, detectOperatingSystem, OperatingSystem } from './environment-detector';

// Promisified fs functions
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const chmod = promisify(fs.chmod);

/**
 * Error codes for filesystem operations
 */
export enum FilesystemErrorCode {
  PATH_NOT_FOUND = 'PATH_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  PATH_NOT_DIRECTORY = 'PATH_NOT_DIRECTORY',
  PATH_ALREADY_EXISTS = 'PATH_ALREADY_EXISTS',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_PATH = 'INVALID_PATH',
  WRITE_ERROR = 'WRITE_ERROR',
  READ_ERROR = 'READ_ERROR'
}

/**
 * Custom error class for filesystem operations
 */
export class FilesystemError extends Error {
  code: FilesystemErrorCode;
  path: string;
  operation: string;
  originalError?: Error;
  
  constructor(
    code: FilesystemErrorCode,
    message: string,
    path: string,
    operation: string,
    originalError?: Error
  ) {
    super(message);
    this.name = 'FilesystemError';
    this.code = code;
    this.path = path;
    this.operation = operation;
    this.originalError = originalError;
  }
  
  /**
   * Get a detailed description of the error
   */
  getDetailedMessage(): string {
    let message = `Filesystem Error: ${this.message}\n`;
    message += `Code: ${this.code}\n`;
    message += `Path: ${this.path}\n`;
    message += `Operation: ${this.operation}\n`;
    
    if (this.originalError) {
      message += `Original Error: ${this.originalError.message}\n`;
      message += `Original Stack: ${this.originalError.stack}\n`;
    }
    
    return message;
  }
}

/**
 * Permission result interface
 */
export interface PermissionResult {
  hasPermission: boolean;
  readable: boolean;
  writable: boolean;
  executable: boolean;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
  error?: string;
}

/**
 * Check if a path exists
 * @param filePath Path to check
 * @returns True if the path exists
 */
export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get absolute path (normalized for the current OS)
 * @param filePath Path to normalize
 * @returns Normalized absolute path
 */
export function getAbsolutePath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return path.normalize(filePath);
  }
  
  return path.resolve(process.cwd(), filePath);
}

/**
 * Check if a path is valid (syntactically, not if it exists)
 * @param filePath Path to check
 * @returns True if the path is syntactically valid
 */
export function isValidPath(filePath: string): boolean {
  try {
    path.parse(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check permissions for a path
 * @param filePath Path to check
 * @returns Permission result object
 */
export async function checkPermissions(filePath: string): Promise<PermissionResult> {
  const absPath = getAbsolutePath(filePath);
  const result: PermissionResult = {
    hasPermission: false,
    readable: false,
    writable: false,
    executable: false,
    path: absPath,
    isDirectory: false,
    isFile: false
  };
  
  try {
    // Check if path exists
    const exists = await pathExists(absPath);
    if (!exists) {
      result.error = 'Path does not exist';
      return result;
    }
    
    // Get file stats
    const stats = await stat(absPath);
    result.isDirectory = stats.isDirectory();
    result.isFile = stats.isFile();
    
    // Check read permission
    try {
      await access(absPath, fs.constants.R_OK);
      result.readable = true;
    } catch (error) {
      result.readable = false;
    }
    
    // Check write permission
    try {
      await access(absPath, fs.constants.W_OK);
      result.writable = true;
    } catch (error) {
      result.writable = false;
    }
    
    // Check execute permission
    try {
      await access(absPath, fs.constants.X_OK);
      result.executable = true;
    } catch (error) {
      result.executable = false;
    }
    
    result.hasPermission = result.readable && result.writable;
    return result;
  } catch (error) {
    result.error = (error as Error).message;
    return result;
  }
}

/**
 * Create directory with proper error handling and permissions
 * @param dirPath Directory path to create
 * @param recursive Whether to create parent directories
 * @param permissions Permissions to set (octal notation, e.g. 0o755)
 * @returns True if directory was created or already exists
 * @throws FilesystemError if creation fails
 */
export async function ensureDirectoryExists(
  dirPath: string,
  recursive = true,
  permissions = 0o755
): Promise<boolean> {
  const absPath = getAbsolutePath(dirPath);
  
  try {
    // Check if directory already exists
    if (await pathExists(absPath)) {
      const stats = await stat(absPath);
      
      // Check if it's a directory
      if (!stats.isDirectory()) {
        throw new FilesystemError(
          FilesystemErrorCode.PATH_NOT_DIRECTORY,
          `Path exists but is not a directory: ${absPath}`,
          absPath,
          'ensureDirectoryExists'
        );
      }
      
      // Check permissions
      const permResult = await checkPermissions(absPath);
      if (!permResult.readable || !permResult.writable) {
        // Try to fix permissions automatically
        try {
          await chmod(absPath, permissions);
          return true;
        } catch (chmodError) {
          throw new FilesystemError(
            FilesystemErrorCode.PERMISSION_DENIED,
            `Directory exists but has insufficient permissions: ${absPath}`,
            absPath,
            'ensureDirectoryExists',
            chmodError as Error
          );
        }
      }
      
      return true;
    }
    
    // Create directory if it doesn't exist
    await mkdir(absPath, { recursive, mode: permissions });
    
    // Verify directory was created
    const exists = await pathExists(absPath);
    if (!exists) {
      throw new FilesystemError(
        FilesystemErrorCode.UNKNOWN_ERROR,
        `Failed to create directory: ${absPath}`,
        absPath,
        'ensureDirectoryExists'
      );
    }
    
    return true;
  } catch (error) {
    if (error instanceof FilesystemError) {
      throw error;
    }
    
    // Handle common error cases
    const originalError = error as Error;
    
    if (originalError.message.includes('ENOENT')) {
      throw new FilesystemError(
        FilesystemErrorCode.PATH_NOT_FOUND,
        `Parent directory does not exist: ${path.dirname(absPath)}`,
        absPath,
        'ensureDirectoryExists',
        originalError
      );
    }
    
    if (originalError.message.includes('EACCES')) {
      throw new FilesystemError(
        FilesystemErrorCode.PERMISSION_DENIED,
        `Permission denied creating directory: ${absPath}`,
        absPath,
        'ensureDirectoryExists',
        originalError
      );
    }
    
    throw new FilesystemError(
      FilesystemErrorCode.UNKNOWN_ERROR,
      `Unknown error creating directory: ${absPath}`,
      absPath,
      'ensureDirectoryExists',
      originalError
    );
  }
}

/**
 * Write data to file with proper error handling
 * @param filePath Path to write to
 * @param data Data to write
 * @param ensureDir Whether to ensure the directory exists
 * @returns True if file was written successfully
 * @throws FilesystemError if write fails
 */
export async function writeDataToFile(
  filePath: string,
  data: string | Buffer,
  ensureDir = true
): Promise<boolean> {
  const absPath = getAbsolutePath(filePath);
  
  try {
    // Ensure parent directory exists if requested
    if (ensureDir) {
      const dirPath = path.dirname(absPath);
      await ensureDirectoryExists(dirPath);
    }
    
    // Write file
    await writeFile(absPath, data);
    return true;
  } catch (error) {
    const originalError = error as Error;
    
    if (originalError.message.includes('ENOENT')) {
      throw new FilesystemError(
        FilesystemErrorCode.PATH_NOT_FOUND,
        `Parent directory does not exist: ${path.dirname(absPath)}`,
        absPath,
        'writeDataToFile',
        originalError
      );
    }
    
    if (originalError.message.includes('EACCES')) {
      throw new FilesystemError(
        FilesystemErrorCode.PERMISSION_DENIED,
        `Permission denied writing file: ${absPath}`,
        absPath,
        'writeDataToFile',
        originalError
      );
    }
    
    throw new FilesystemError(
      FilesystemErrorCode.WRITE_ERROR,
      `Failed to write file: ${absPath}`,
      absPath,
      'writeDataToFile',
      originalError
    );
  }
}

/**
 * Get directory contents with proper error handling
 * @param dirPath Directory path to list
 * @returns Array of filenames in the directory
 * @throws FilesystemError if listing fails
 */
export async function getDirectoryContents(dirPath: string): Promise<string[]> {
  const absPath = getAbsolutePath(dirPath);
  
  try {
    // Check if directory exists
    if (!(await pathExists(absPath))) {
      throw new FilesystemError(
        FilesystemErrorCode.PATH_NOT_FOUND,
        `Directory does not exist: ${absPath}`,
        absPath,
        'getDirectoryContents'
      );
    }
    
    // Check if it's a directory
    const stats = await stat(absPath);
    if (!stats.isDirectory()) {
      throw new FilesystemError(
        FilesystemErrorCode.PATH_NOT_DIRECTORY,
        `Path is not a directory: ${absPath}`,
        absPath,
        'getDirectoryContents'
      );
    }
    
    // List directory contents
    return await readdir(absPath);
  } catch (error) {
    if (error instanceof FilesystemError) {
      throw error;
    }
    
    const originalError = error as Error;
    
    if (originalError.message.includes('EACCES')) {
      throw new FilesystemError(
        FilesystemErrorCode.PERMISSION_DENIED,
        `Permission denied reading directory: ${absPath}`,
        absPath,
        'getDirectoryContents',
        originalError
      );
    }
    
    throw new FilesystemError(
      FilesystemErrorCode.READ_ERROR,
      `Failed to read directory: ${absPath}`,
      absPath,
      'getDirectoryContents',
      originalError
    );
  }
}

/**
 * Generate a platform-compatible paths for tests
 * @param basePath Base directory path
 * @param segments Path segments to join
 * @returns Platform-compatible path
 */
export function testPath(basePath: string, ...segments: string[]): string {
  const normalizedBase = getAbsolutePath(basePath);
  return path.join(normalizedBase, ...segments);
}

/**
 * Validate an entire directory structure for test artifacts
 * @param rootDir Root directory to validate
 * @param requiredDirs Array of required subdirectories (relative to rootDir)
 * @returns Array of validation results for each directory
 * @throws FilesystemError if validation fails and autoFix fails
 */
export async function validateArtifactStructure(
  rootDir: string,
  requiredDirs: string[] = [],
  autoFix = true
): Promise<PermissionResult[]> {
  const results: PermissionResult[] = [];
  
  // Validate root directory
  const rootResult = await checkPermissions(rootDir);
  results.push(rootResult);
  
  // Create root directory if needed and requested
  if (!rootResult.hasPermission && autoFix) {
    await ensureDirectoryExists(rootDir);
    
    // Check again after fix
    const fixedRootResult = await checkPermissions(rootDir);
    if (!fixedRootResult.hasPermission) {
      throw new FilesystemError(
        FilesystemErrorCode.PERMISSION_DENIED,
        `Failed to create or fix permissions for root directory: ${rootDir}`,
        rootDir,
        'validateArtifactStructure'
      );
    }
    
    results[0] = fixedRootResult;
  }
  
  // Validate required subdirectories
  for (const subDir of requiredDirs) {
    const fullPath = path.join(rootDir, subDir);
    const dirResult = await checkPermissions(fullPath);
    results.push(dirResult);
    
    // Create or fix directory if needed and requested
    if (autoFix && (!await pathExists(fullPath) || !dirResult.hasPermission)) {
      await ensureDirectoryExists(fullPath);
      
      // Check again after fix
      const fixedDirResult = await checkPermissions(fullPath);
      if (!fixedDirResult.hasPermission) {
        throw new FilesystemError(
          FilesystemErrorCode.PERMISSION_DENIED,
          `Failed to create or fix permissions for directory: ${fullPath}`,
          fullPath,
          'validateArtifactStructure'
        );
      }
      
      // Update the result
      results[results.length - 1] = fixedDirResult;
    }
  }
  
  return results;
}

/**
 * Apply CI-specific filesystem optimizations
 * @param rootDir Root directory for artifacts
 */
export async function applyCIFilesystemOptimizations(rootDir: string): Promise<void> {
  // Only apply in CI environments
  if (!isRunningInCI()) {
    return;
  }
  
  const os = detectOperatingSystem();
  
  try {
    // Ensure the root directory exists
    await ensureDirectoryExists(rootDir);
    
    // Apply different optimizations based on OS
    switch (os) {
      case OperatingSystem.Linux:
        // In Linux CI environments, ensure wide permissions
        // This helps with issues where different users/groups need access
        try {
          await chmod(rootDir, 0o777);
        } catch (error) {
          console.warn(`Warning: Could not set 777 permissions on ${rootDir}: ${(error as Error).message}`);
        }
        break;
        
      case OperatingSystem.Windows:
        // Windows-specific optimizations could go here
        break;
        
      default:
        // No specific optimizations for other platforms
        break;
    }
  } catch (error) {
    // Log but don't fail - these are optimizations, not requirements
    console.warn(`Warning: Failed to apply CI filesystem optimizations: ${(error as Error).message}`);
  }
}