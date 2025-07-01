#!/bin/bash

echo "Fixing Vercel environment variables (removing newlines)..."

# Remove all existing variables
echo "Removing existing variables..."
vercel env rm TWITCH_CLIENT_ID production --yes
vercel env rm TWITCH_CLIENT_ID preview --yes
vercel env rm TWITCH_CLIENT_ID development --yes
vercel env rm TWITCH_CLIENT_SECRET production --yes
vercel env rm TWITCH_CLIENT_SECRET preview --yes
vercel env rm TWITCH_CLIENT_SECRET development --yes
vercel env rm TWITCH_REDIRECT_URI production --yes
vercel env rm TWITCH_REDIRECT_URI preview --yes
vercel env rm TWITCH_REDIRECT_URI development --yes
vercel env rm NEXT_PUBLIC_APP_URL production --yes
vercel env rm NEXT_PUBLIC_APP_URL preview --yes
vercel env rm NEXT_PUBLIC_APP_URL development --yes

echo "Waiting for removal to complete..."
sleep 3

echo "Adding clean variables..."

# Add TWITCH_CLIENT_ID
echo -n "840q0uzqa2ny9oob3yp8ako6dqs31g" | vercel env add TWITCH_CLIENT_ID production
echo -n "840q0uzqa2ny9oob3yp8ako6dqs31g" | vercel env add TWITCH_CLIENT_ID preview  
echo -n "840q0uzqa2ny9oob3yp8ako6dqs31g" | vercel env add TWITCH_CLIENT_ID development

# Add TWITCH_CLIENT_SECRET
echo -n "6359is1cljkasakhaobken9r0shohc" | vercel env add TWITCH_CLIENT_SECRET production
echo -n "6359is1cljkasakhaobken9r0shohc" | vercel env add TWITCH_CLIENT_SECRET preview
echo -n "6359is1cljkasakhaobken9r0shohc" | vercel env add TWITCH_CLIENT_SECRET development

# Add TWITCH_REDIRECT_URI
echo -n "https://streamyyy.com/auth/twitch/callback" | vercel env add TWITCH_REDIRECT_URI production
echo -n "https://streamyyy.com/auth/twitch/callback" | vercel env add TWITCH_REDIRECT_URI preview  
echo -n "http://localhost:3000/auth/twitch/callback" | vercel env add TWITCH_REDIRECT_URI development

# Add NEXT_PUBLIC_APP_URL
echo -n "https://streamyyy.com" | vercel env add NEXT_PUBLIC_APP_URL production
echo -n "https://streamyyy.com" | vercel env add NEXT_PUBLIC_APP_URL preview
echo -n "http://localhost:3000" | vercel env add NEXT_PUBLIC_APP_URL development

echo "All variables added successfully!"
echo "Triggering new deployment..."
vercel --prod --force

echo "Done! The Twitch integration should now work correctly."