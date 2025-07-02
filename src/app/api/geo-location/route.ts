import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get country from Cloudflare headers (if using Cloudflare)
    const cfCountry = request.headers.get('cf-ipcountry')
    if (cfCountry && cfCountry !== 'XX') {
      return NextResponse.json({ 
        countryCode: cfCountry,
        source: 'cloudflare' 
      })
    }

    // Get country from Vercel headers (if using Vercel)
    const vercelCountry = request.headers.get('x-vercel-ip-country')
    if (vercelCountry) {
      return NextResponse.json({ 
        countryCode: vercelCountry,
        source: 'vercel' 
      })
    }

    // Fallback to IP geolocation service
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') ||
               '1.1.1.1' // Fallback IP

    // Using ip-api.com as a free fallback (consider using a paid service in production)
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`)
    
    if (geoResponse.ok) {
      const data = await geoResponse.json()
      return NextResponse.json({ 
        countryCode: data.countryCode || 'US',
        source: 'ip-api' 
      })
    }

    // Default to US if all methods fail
    return NextResponse.json({ 
      countryCode: 'US',
      source: 'default' 
    })

  } catch (error) {
    console.error('Geo-location error:', error)
    // Default to showing consent banner on error
    return NextResponse.json({ 
      countryCode: 'GB', // Default to UK to show banner
      source: 'error',
      error: 'Failed to determine location'
    }, { status: 200 }) // Return 200 to not break the consent flow
  }
}