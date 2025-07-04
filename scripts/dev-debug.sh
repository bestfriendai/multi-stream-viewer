#!/bin/bash

# Enhanced Development Server with Debugging
# This script starts the Next.js development server with comprehensive debugging enabled

echo "🚀 Starting Streamyyy.com Development Server with Enhanced Debugging"
echo "=================================================="

# Set debug environment variables
export NODE_ENV=development
export DEBUG=true
export NEXT_DEBUG=true
export VERBOSE_LOGGING=true
export CONSOLE_DEBUG=true
export COMPONENT_DEBUG=true
export API_DEBUG=true
export STREAM_DEBUG=true
export STATE_DEBUG=true
export PERFORMANCE_DEBUG=true

# Enable React DevTools
export REACT_EDITOR=code

# Disable telemetry for faster startup
export NEXT_TELEMETRY_DISABLED=1

# Enable TypeScript checking
export TYPESCRIPT_CHECK=true

# Set development server settings
export PORT=3000
export HOSTNAME=localhost

echo "🔧 Debug Configuration:"
echo "  - Node Environment: $NODE_ENV"
echo "  - Debug Mode: $DEBUG"
echo "  - Next.js Debug: $NEXT_DEBUG"
echo "  - Verbose Logging: $VERBOSE_LOGGING"
echo "  - Console Debug: $CONSOLE_DEBUG"
echo "  - Component Debug: $COMPONENT_DEBUG"
echo "  - API Debug: $API_DEBUG"
echo "  - Stream Debug: $STREAM_DEBUG"
echo "  - State Debug: $STATE_DEBUG"
echo "  - Performance Debug: $PERFORMANCE_DEBUG"
echo "  - Server: http://$HOSTNAME:$PORT"
echo ""

echo "🐛 Debug Features Available:"
echo "  - Debug Panel: Press Ctrl/Cmd + Shift + D or click Debug button"
echo "  - Console Logging: Enhanced logging with timestamps and context"
echo "  - Component Lifecycle: Mount/unmount/update tracking"
echo "  - API Request/Response: Detailed API debugging"
echo "  - Stream Events: Stream lifecycle and error tracking"
echo "  - State Changes: Store state change monitoring"
echo "  - Performance Monitoring: Memory usage and timing"
echo "  - System Information: Browser and device details"
echo "  - Network Information: Connection quality monitoring"
echo ""

echo "⌨️  Keyboard Shortcuts:"
echo "  - Ctrl/Cmd + Shift + D: Toggle Debug Panel"
echo "  - Ctrl/Cmd + Shift + C: Clear Console"
echo "  - Ctrl/Cmd + Shift + R: Reload with Cache Clear"
echo ""

echo "📝 Debug Tips:"
echo "  - Check browser console for detailed logs"
echo "  - Use debug panel to export logs for analysis"
echo "  - Monitor network tab for API requests"
echo "  - Use React DevTools for component inspection"
echo "  - Check Application tab for localStorage/sessionStorage"
echo ""

# Check if required dependencies are installed
echo "🔍 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Some features may not work properly."
    echo "   Please ensure you have the required environment variables set."
fi

# Start the development server
echo "🎬 Starting development server..."
echo "   Access your app at: http://$HOSTNAME:$PORT"
echo "   Press Ctrl+C to stop the server"
echo ""

# Use npm run dev with turbopack for faster development
npm run dev
