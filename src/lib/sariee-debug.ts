// Sariee API Debug and Testing Utilities

interface DebugConfig {
  enableLogging: boolean;
  logRequests: boolean;
  logResponses: boolean;
  logErrors: boolean;
}

class SarieeDebugger {
  private config: DebugConfig;

  constructor(config: DebugConfig = {
    enableLogging: process.env.NODE_ENV === 'development',
    logRequests: true,
    logResponses: true,
    logErrors: true,
  }) {
    this.config = config;
  }

  logRequest(method: string, url: string, data?: any) {
    if (!this.config.enableLogging || !this.config.logRequests) return;

    console.group(`🚀 Sariee API Request: ${method.toUpperCase()} ${url}`);
    console.log('Method:', method);
    console.log('URL:', url);
    if (data) {
      console.log('Data:', data);
    }
    console.groupEnd();
  }

  logResponse(url: string, response: any, duration?: number) {
    if (!this.config.enableLogging || !this.config.logResponses) return;

    console.group(`✅ Sariee API Response: ${url}`);
    console.log('Status:', response.status);
    console.log('Code:', response.code);
    console.log('Message:', response.message);
    console.log('Data:', response.data);
    if (duration) {
      console.log('Duration:', `${duration}ms`);
    }
    console.groupEnd();
  }

  logError(url: string, error: any, duration?: number) {
    if (!this.config.enableLogging || !this.config.logErrors) return;

    // Only log errors if we have real API keys (not placeholders)
    const hasRealApiKey = process.env.NEXT_PUBLIC_SARIEE_API_KEY && 
                         !process.env.NEXT_PUBLIC_SARIEE_API_KEY.includes('placeholder');
    
    if (!hasRealApiKey) {
      // Silently skip logging for placeholder API keys
      return;
    }

    console.group(`❌ Sariee API Error: ${url}`);
    console.error('Error:', error);
    if (duration) {
      console.log('Duration:', `${duration}ms`);
    }
    console.groupEnd();
  }

  logInfo(message: string, data?: any) {
    if (!this.config.enableLogging) return;

    console.log(`ℹ️ Sariee API: ${message}`, data || '');
  }

  setConfig(config: Partial<DebugConfig>) {
    this.config = { ...this.config, ...config };
  }
}

export const sarieeDebugger = new SarieeDebugger();

// Test utilities
export async function testSarieeConnection(baseUrl: string): Promise<boolean> {
  try {
    sarieeDebugger.logInfo('Testing Sariee API connection...', { baseUrl });
    
    const response = await fetch(`${baseUrl}/list-categories?per_page=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      sarieeDebugger.logInfo('Connection test successful', data);
      return true;
    } else {
      sarieeDebugger.logError('Connection test failed', {
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }
  } catch (error) {
    sarieeDebugger.logError('Connection test error', error);
    return false;
  }
}

export function validateEnvironmentVariables(): {
  isValid: boolean;
  missing: string[];
  warnings: string[];
} {
  const required = [
    'NEXT_PUBLIC_SARIEE_API_URL',
  ];

  const optional = [
    'NEXT_PUBLIC_SARIEE_API_KEY',
  ];

  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional variables
  optional.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`${varName} is not set (optional)`);
    }
  });

  // Validate URL format
  const apiUrl = process.env.NEXT_PUBLIC_SARIEE_API_URL;
  if (apiUrl && !apiUrl.startsWith('http')) {
    warnings.push('NEXT_PUBLIC_SARIEE_API_URL should start with http:// or https://');
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

export function formatSarieeRequest(method: string, endpoint: string, data?: any): string {
  let request = `${method.toUpperCase()} ${endpoint}`;
  
  if (data) {
    request += `\n\nBody:\n${JSON.stringify(data, null, 2)}`;
  }
  
  return request;
}

export function formatSarieeResponse(response: any): string {
  return JSON.stringify(response, null, 2);
}
