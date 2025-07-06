#!/bin/bash

echo "🔧 Setting up development environment for Streamyyy..."

# Pull environment variables from Vercel
echo "📥 Pulling environment variables from Vercel..."
vercel env pull .env.local

if [ $? -eq 0 ]; then
    echo "✅ Environment variables pulled successfully"
else
    echo "❌ Failed to pull environment variables"
    echo "Please run: vercel login"
    exit 1
fi

# Start the development server
echo "🚀 Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for the server to start
echo "⏳ Waiting for development server to start..."
sleep 5

# Check if server is running
curl -s http://localhost:3000/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Development server is running at http://localhost:3000"
else
    echo "❌ Development server failed to start"
    kill $DEV_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Open a new terminal and run: stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo "2. Copy the webhook signing secret (whsec_...) to your .env.local file"
echo "3. Test the subscription flow at: http://localhost:3000/pricing"
echo ""
echo "🧪 To test webhooks:"
echo "stripe trigger checkout.session.completed"
echo ""
echo "🛑 To stop the development server:"
echo "kill $DEV_PID"