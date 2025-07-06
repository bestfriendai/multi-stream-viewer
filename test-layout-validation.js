/**
 * Streamyyy Layout Testing Automation Script
 * Run this in browser console to validate layout functionality
 */

class LayoutTester {
  constructor() {
    this.testResults = [];
    this.currentTest = null;
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type, test: this.currentTest };
    this.testResults.push(logEntry);
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test if element exists and is visible
  isElementVisible(selector) {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           window.getComputedStyle(element).visibility !== 'hidden';
  }

  // Test responsive behavior
  testResponsiveBreakpoints() {
    this.currentTest = 'responsive-breakpoints';
    this.log('Testing responsive breakpoints...');
    
    const breakpoints = [
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 1366, height: 768, name: 'Desktop Standard' },
      { width: 1024, height: 768, name: 'Tablet Landscape' },
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 480, height: 854, name: 'Mobile Landscape' },
      { width: 375, height: 667, name: 'Mobile Portrait' }
    ];

    breakpoints.forEach(bp => {
      // Note: This would require browser dev tools or testing framework
      this.log(`Testing ${bp.name} (${bp.width}x${bp.height})`);
      
      // Check if mobile layout is active
      const isMobileLayout = bp.width < 768;
      const streamGrid = document.querySelector('.stream-grid, [class*="grid-layout"]');
      
      if (streamGrid) {
        const computedStyle = window.getComputedStyle(streamGrid);
        this.log(`Grid template columns: ${computedStyle.gridTemplateColumns}`);
        
        if (isMobileLayout && computedStyle.gridTemplateColumns !== '1fr') {
          this.log('WARNING: Mobile layout should use single column', 'warn');
        }
      }
    });
  }

  // Test layout switching functionality
  async testLayoutSwitching() {
    this.currentTest = 'layout-switching';
    this.log('Testing layout switching functionality...');

    const layoutOptions = ['1x1', '2x2', '3x3', 'mosaic', 'focus', 'pip', 'custom'];
    
    for (const layout of layoutOptions) {
      this.log(`Testing ${layout} layout...`);
      
      // Try to find and click layout selector
      const layoutSelector = document.querySelector(`[data-layout="${layout}"], [value="${layout}"]`);
      if (layoutSelector) {
        layoutSelector.click();
        await this.wait(500); // Wait for layout change
        
        // Verify layout applied
        const activeLayout = document.querySelector('.stream-grid, [class*="layout"]');
        if (activeLayout) {
          const classes = activeLayout.className;
          this.log(`Layout classes: ${classes}`);
        }
      } else {
        this.log(`Layout selector for ${layout} not found`, 'warn');
      }
    }
  }

  // Test stream grid performance
  testStreamGridPerformance() {
    this.currentTest = 'stream-performance';
    this.log('Testing stream grid performance...');

    const streamContainers = document.querySelectorAll('.stream-card, [class*="stream"]');
    this.log(`Found ${streamContainers.length} stream containers`);

    streamContainers.forEach((container, index) => {
      const rect = container.getBoundingClientRect();
      const aspectRatio = rect.width / rect.height;
      
      this.log(`Stream ${index + 1}: ${rect.width}x${rect.height}, aspect ratio: ${aspectRatio.toFixed(2)}`);
      
      // Check if aspect ratio is close to 16:9 (1.78)
      if (Math.abs(aspectRatio - 1.78) > 0.1) {
        this.log(`Stream ${index + 1} aspect ratio may be incorrect`, 'warn');
      }
    });
  }

  // Test heading responsive behavior
  testHeadingResponsive() {
    this.currentTest = 'heading-responsive';
    this.log('Testing heading responsive behavior...');

    const headings = document.querySelectorAll('h1');
    const targetHeading = Array.from(headings).find(h => 
      h.textContent.includes('Watch Multiple') || 
      h.textContent.includes('Live Streams')
    );

    if (targetHeading) {
      const rect = targetHeading.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(targetHeading);
      
      this.log(`Heading dimensions: ${rect.width}x${rect.height}`);
      this.log(`Font size: ${computedStyle.fontSize}`);
      this.log(`Line height: ${computedStyle.lineHeight}`);
      
      // Check if text wraps (height > line-height indicates wrapping)
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const isWrapping = rect.height > lineHeight * 1.5;
      
      if (window.innerWidth >= 768 && isWrapping) {
        this.log('WARNING: Desktop heading should not wrap to multiple lines', 'warn');
      } else if (window.innerWidth < 768 && !isWrapping) {
        this.log('INFO: Mobile heading could benefit from line breaks for readability', 'info');
      }
    } else {
      this.log('Target heading not found', 'error');
    }
  }

  // Test mobile touch interactions
  testMobileTouchTargets() {
    this.currentTest = 'mobile-touch';
    this.log('Testing mobile touch targets...');

    const touchTargets = document.querySelectorAll('button, [role="button"], .touch-target');
    let smallTargets = 0;

    touchTargets.forEach((target, index) => {
      const rect = target.getBoundingClientRect();
      const minSize = Math.min(rect.width, rect.height);
      
      if (minSize < 44) {
        smallTargets++;
        this.log(`Touch target ${index + 1} is too small: ${rect.width}x${rect.height}`, 'warn');
      }
    });

    if (smallTargets === 0) {
      this.log('All touch targets meet minimum size requirements');
    } else {
      this.log(`${smallTargets} touch targets are below 44px minimum`, 'warn');
    }
  }

  // Test layout persistence
  testLayoutPersistence() {
    this.currentTest = 'layout-persistence';
    this.log('Testing layout persistence...');

    // Check localStorage for saved layout preferences
    const savedLayout = localStorage.getItem('layout-store') || 
                       localStorage.getItem('streamyyy-layout') ||
                       localStorage.getItem('grid-layout');

    if (savedLayout) {
      this.log('Layout persistence found in localStorage');
      try {
        const parsed = JSON.parse(savedLayout);
        this.log(`Saved layout data: ${JSON.stringify(parsed, null, 2)}`);
      } catch (e) {
        this.log('Could not parse saved layout data', 'warn');
      }
    } else {
      this.log('No layout persistence found', 'warn');
    }
  }

  // Test performance metrics
  async testPerformanceMetrics() {
    this.currentTest = 'performance-metrics';
    this.log('Testing performance metrics...');

    // Memory usage (if available)
    if (performance.memory) {
      const memory = performance.memory;
      this.log(`Memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      this.log(`Memory limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
    }

    // Frame rate monitoring
    let frameCount = 0;
    const startTime = performance.now();
    
    const countFrames = () => {
      frameCount++;
      if (performance.now() - startTime < 1000) {
        requestAnimationFrame(countFrames);
      } else {
        this.log(`Approximate FPS: ${frameCount}`);
      }
    };
    requestAnimationFrame(countFrames);

    // Page load performance
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.log(`Page load time: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
      this.log(`DOM content loaded: ${navigation.domContentLoadedEventEnd - navigation.fetchStart}ms`);
    }
  }

  // Run all tests
  async runAllTests() {
    this.log('Starting comprehensive layout testing...');
    
    try {
      this.testResponsiveBreakpoints();
      await this.wait(1000);
      
      await this.testLayoutSwitching();
      await this.wait(1000);
      
      this.testStreamGridPerformance();
      await this.wait(500);
      
      this.testHeadingResponsive();
      await this.wait(500);
      
      this.testMobileTouchTargets();
      await this.wait(500);
      
      this.testLayoutPersistence();
      await this.wait(500);
      
      await this.testPerformanceMetrics();
      
      this.generateReport();
      
    } catch (error) {
      this.log(`Test execution error: ${error.message}`, 'error');
    }
  }

  // Generate test report
  generateReport() {
    this.log('Generating test report...');
    
    const totalTime = Date.now() - this.startTime;
    const errors = this.testResults.filter(r => r.type === 'error').length;
    const warnings = this.testResults.filter(r => r.type === 'warn').length;
    
    const report = {
      summary: {
        totalTests: this.testResults.length,
        errors,
        warnings,
        duration: `${totalTime}ms`,
        timestamp: new Date().toISOString()
      },
      results: this.testResults,
      recommendations: this.generateRecommendations()
    };

    console.log('=== LAYOUT TESTING REPORT ===');
    console.log(JSON.stringify(report, null, 2));
    
    // Save to localStorage for later retrieval
    localStorage.setItem('streamyyy-test-report', JSON.stringify(report));
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    const warnings = this.testResults.filter(r => r.type === 'warn');
    const errors = this.testResults.filter(r => r.type === 'error');
    
    if (errors.length > 0) {
      recommendations.push('Critical issues found that require immediate attention');
    }
    
    if (warnings.length > 0) {
      recommendations.push('Several warnings detected that should be addressed for optimal user experience');
    }
    
    recommendations.push('Test on actual mobile devices for complete validation');
    recommendations.push('Perform load testing with maximum concurrent streams');
    recommendations.push('Validate accessibility compliance for all layouts');
    
    return recommendations;
  }
}

// Auto-run tests when script is loaded
const tester = new LayoutTester();

// Export for manual testing
window.LayoutTester = LayoutTester;
window.layoutTester = tester;

console.log('Layout testing script loaded. Run layoutTester.runAllTests() to start testing.');

// Additional utility functions for comprehensive testing
window.testLayoutPerformance = async function(streamCount = 4) {
  console.log(`Testing performance with ${streamCount} streams...`);

  // Simulate adding streams
  for (let i = 0; i < streamCount; i++) {
    const addButton = document.querySelector('[data-testid="add-stream"], .add-stream-button, button[aria-label*="add"]');
    if (addButton) {
      addButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for stream to load
    }
  }

  // Run performance tests
  await tester.testPerformanceMetrics();
  await tester.testStreamGridPerformance();

  return tester.generateReport();
};

window.testAllLayouts = async function() {
  console.log('Testing all available layouts...');

  const layouts = ['1x1', '2x2', '3x3', 'mosaic', 'focus', 'pip', 'custom'];
  const results = {};

  for (const layout of layouts) {
    console.log(`Testing ${layout} layout...`);

    // Switch to layout
    const layoutButton = document.querySelector(`[data-layout="${layout}"], [value="${layout}"]`);
    if (layoutButton) {
      const startTime = performance.now();
      layoutButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      const endTime = performance.now();

      results[layout] = {
        switchTime: endTime - startTime,
        available: true
      };
    } else {
      results[layout] = {
        available: false,
        error: 'Layout selector not found'
      };
    }
  }

  console.log('Layout testing results:', results);
  return results;
};

window.testResponsiveBreakpoints = function() {
  console.log('Testing responsive breakpoints...');

  const breakpoints = [
    { width: 320, name: 'Mobile Small' },
    { width: 375, name: 'Mobile Medium' },
    { width: 414, name: 'Mobile Large' },
    { width: 768, name: 'Tablet' },
    { width: 1024, name: 'Desktop Small' },
    { width: 1366, name: 'Desktop Medium' },
    { width: 1920, name: 'Desktop Large' }
  ];

  const results = breakpoints.map(bp => {
    // Note: This would require browser dev tools or testing framework to actually resize
    const isMobile = bp.width < 768;
    const isTablet = bp.width >= 768 && bp.width < 1024;
    const isDesktop = bp.width >= 1024;

    return {
      ...bp,
      category: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      expectedBehavior: isMobile ? 'single column' : isTablet ? 'reduced columns' : 'full grid'
    };
  });

  console.log('Responsive breakpoint analysis:', results);
  return results;
};
