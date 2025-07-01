# Vercel Environment Variables Setup

## Required Environment Variables

You need to add these environment variables to your Vercel project for the Twitch API to work:

### 1. Go to Vercel Dashboard
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your `multi-stream-viewer` project
3. Go to "Settings" tab
4. Click on "Environment Variables" in the left sidebar

### 2. Add These Variables

Click "Add New" and add each of these:

| Key | Value | Environment |
|-----|-------|-------------|
| `TWITCH_CLIENT_ID` | `840q0uzqa2ny9oob3yp8ako6dqs31g` | Production, Preview, Development |
| `TWITCH_CLIENT_SECRET` | `6359is1cljkasakhaobken9r0shohc` | Production, Preview, Development |
| `TWITCH_REDIRECT_URI` | `https://streamyyy.com/auth/twitch/callback` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://streamyyy.com` | Production |

### 3. For Preview/Development Environments

Also add these for preview deployments:

| Key | Value | Environment |
|-----|-------|-------------|
| `TWITCH_REDIRECT_URI` | `http://localhost:3000/auth/twitch/callback` | Development |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

### 4. Redeploy

After adding all variables:
1. Go to the "Deployments" tab
2. Click on the three dots next to the latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### 5. Verify It's Working

Visit: https://streamyyy.com/test-twitch

You should see:
- ✅ All tests passed
- Live status indicators working
- No errors in the test results

### Important Notes

- Keep your Client Secret secure - never share it publicly
- These environment variables are encrypted by Vercel
- Changes to environment variables require a redeploy to take effect

### Troubleshooting

If it's still not working after setting variables:
1. Double-check the variable names (they're case-sensitive)
2. Ensure there are no extra spaces in the values
3. Try a fresh redeploy from Vercel dashboard
4. Check the Function logs in Vercel for error details