#!/bin/bash

# Script to properly set up Vercel environment variables
echo "Setting up Vercel environment variables..."

# Remove existing variables to start fresh
echo "Removing existing variables..."
vercel env rm TWITCH_CLIENT_ID production --yes 2>/dev/null
vercel env rm TWITCH_CLIENT_ID preview --yes 2>/dev/null
vercel env rm TWITCH_CLIENT_ID development --yes 2>/dev/null
vercel env rm TWITCH_CLIENT_SECRET production --yes 2>/dev/null
vercel env rm TWITCH_CLIENT_SECRET preview --yes 2>/dev/null
vercel env rm TWITCH_CLIENT_SECRET development --yes 2>/dev/null
vercel env rm TWITCH_REDIRECT_URI production --yes 2>/dev/null
vercel env rm TWITCH_REDIRECT_URI preview --yes 2>/dev/null
vercel env rm TWITCH_REDIRECT_URI development --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_APP_URL production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_APP_URL preview --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_APP_URL development --yes 2>/dev/null

sleep 2

# Add variables without newlines
echo "Adding TWITCH_CLIENT_ID..."
echo -n "840q0uzqa2ny9oob3yp8ako6dqs31g" | vercel env add TWITCH_CLIENT_ID production
echo -n "840q0uzqa2ny9oob3yp8ako6dqs31g" | vercel env add TWITCH_CLIENT_ID preview
echo -n "840q0uzqa2ny9oob3yp8ako6dqs31g" | vercel env add TWITCH_CLIENT_ID development

echo "Adding TWITCH_CLIENT_SECRET..."
echo -n "6359is1cljkasakhaobken9r0shohc" | vercel env add TWITCH_CLIENT_SECRET production
echo -n "6359is1cljkasakhaobken9r0shohc" | vercel env add TWITCH_CLIENT_SECRET preview
echo -n "6359is1cljkasakhaobken9r0shohc" | vercel env add TWITCH_CLIENT_SECRET development

echo "Adding TWITCH_REDIRECT_URI..."
echo -n "https://streamyyy.com/auth/twitch/callback" | vercel env add TWITCH_REDIRECT_URI production
echo -n "https://streamyyy.com/auth/twitch/callback" | vercel env add TWITCH_REDIRECT_URI preview
echo -n "http://localhost:3000/auth/twitch/callback" | vercel env add TWITCH_REDIRECT_URI development

echo "Adding NEXT_PUBLIC_APP_URL..."
echo -n "https://streamyyy.com" | vercel env add NEXT_PUBLIC_APP_URL production
echo -n "https://streamyyy.com" | vercel env add NEXT_PUBLIC_APP_URL preview
echo -n "http://localhost:3000" | vercel env add NEXT_PUBLIC_APP_URL development

echo "Environment variables set up successfully!"
echo "Deploying to production..."
vercel --prod --force

echo "Done! The Twitch integration should now be working."