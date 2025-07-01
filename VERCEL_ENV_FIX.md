# 🚨 Fix Twitch API 500 Errors - Vercel Environment Setup

## The Issue
The Twitch API is returning 500 errors because the environment variables are not set in Vercel.

## Quick Fix (2 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your **multi-stream-viewer** project

### Step 2: Add Environment Variables
1. Click **Settings** tab
2. Click **Environment Variables** in the left sidebar
3. Click **Add New** and add each variable:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `TWITCH_CLIENT_ID` | `840q0uzqa2ny9oob3yp8ako6dqs31g` | ✅ Production, ✅ Preview, ✅ Development |
| `TWITCH_CLIENT_SECRET` | `6359is1cljkasakhaobken9r0shohc` | ✅ Production, ✅ Preview, ✅ Development |
| `TWITCH_REDIRECT_URI` | `https://streamyyy.com/auth/twitch/callback` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_APP_URL` | `https://streamyyy.com` | ✅ Production, ✅ Preview, ✅ Development |

**Important**: Make sure to check all three environment boxes (Production, Preview, Development) for each variable!

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Click **Redeploy** in the popup

### Step 4: Verify It's Working
After deployment completes (about 1-2 minutes):

1. Visit: https://streamyyy.com/api/health
   - Should show `"status": "ok"` with all variables as `true`

2. Visit: https://streamyyy.com/test-twitch
   - Click "Run Tests"
   - All tests should pass ✅

## If Still Not Working

### Check Function Logs
1. In Vercel Dashboard, go to **Functions** tab
2. Click on **streams** function
3. Check the logs for any errors

### Common Issues
- **Typo in variable names**: They are case-sensitive
- **Extra spaces**: Make sure no spaces before/after values
- **Not redeployed**: Must redeploy after adding variables
- **Wrong environment**: Make sure Production is checked

### Test Endpoints
- Health Check: https://streamyyy.com/api/health
- Verify Config: https://streamyyy.com/api/twitch/verify
- Test Page: https://streamyyy.com/test-twitch

## Still Need Help?
The code is working correctly - it just needs the environment variables. Once you add them in Vercel and redeploy, everything will work!