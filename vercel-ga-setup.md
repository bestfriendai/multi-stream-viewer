# Google Analytics Production Setup for Vercel

## Environment Variables Setup

### 1. Get Your GA4 Tracking ID
1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Go to **Admin** > **Property Settings** > **Tracking Info** > **Tracking Code**  
4. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

### 2. Set Environment Variables in Vercel

#### Via Vercel Dashboard:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_GA_TRACKING_ID=G-YOUR-ACTUAL-TRACKING-ID
NEXT_PUBLIC_GA_DEBUG=false
```

#### Via Vercel CLI:
```bash
# Set production GA tracking ID
vercel env add NEXT_PUBLIC_GA_TRACKING_ID production
# Enter your actual GA4 measurement ID when prompted

# Disable debug mode in production  
vercel env add NEXT_PUBLIC_GA_DEBUG production
# Enter: false
```

### 3. Local Development Setup
Create `.env.local` (never commit this file):
```bash
# Copy from .env.local.example and update with your values
cp .env.local.example .env.local

# Edit .env.local with your development GA tracking ID
NEXT_PUBLIC_GA_TRACKING_ID=G-YOUR-DEV-TRACKING-ID  
NEXT_PUBLIC_GA_DEBUG=true
```

## Verification Steps

### 1. Test Local Analytics
```bash
npm run dev
```
- Open browser console
- Look for "GA script loaded successfully" message
- Check Network tab for gtag requests

### 2. Test Production Analytics
After deploying to Vercel:
1. Visit your production site
2. Accept cookies when prompted
3. Check Google Analytics **Real-time** reports
4. Should see your visit within 60 seconds

### 3. Test Cookie Consent Integration
1. Visit site in incognito mode
2. Reject cookies → No GA requests should fire
3. Accept cookies → GA requests should start firing
4. Check Local Storage for `cookie-consent` key

## Debugging Production Issues

### Common Issues:
1. **No data in GA**: Check environment variables are set correctly
2. **Consent not working**: Check cookie consent localStorage
3. **Events not firing**: Verify HTTPS and cookie consent granted

### Debug Commands:
```javascript
// In browser console on production site:

// Check if GA is loaded
console.log(typeof gtag)

// Check consent status  
console.log(localStorage.getItem('cookie-consent'))

// Manually fire test event
gtag('event', 'test_event', { 
  event_category: 'debug',
  event_label: 'manual_test' 
})
```

## Production Checklist

- [ ] GA4 property created and tracking ID obtained
- [ ] Environment variables set in Vercel dashboard
- [ ] Cookie consent banner appears for EU users
- [ ] GA requests only fire after consent granted
- [ ] Real-time data appears in Google Analytics
- [ ] Custom events (stream_add, layout_change) working
- [ ] Page views tracked correctly on navigation
- [ ] Debug mode disabled in production (NEXT_PUBLIC_GA_DEBUG=false)

## Security Notes

- Environment variables are only exposed to client-side when prefixed with `NEXT_PUBLIC_`
- GA tracking respects user consent choices
- GDPR compliant with proper consent management
- Uses secure SameSite=None;Secure cookie flags