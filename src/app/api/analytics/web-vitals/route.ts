import { NextRequest, NextResponse } from 'next/server'

interface WebVitalData {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  url: string
  userAgent: string
  timestamp: number
}

interface MetricData {
  count: number
  totalValue: number
  ratings: {
    good: number
    'needs-improvement': number
    poor: number
  }
}

interface ProcessedMetric {
  average: number
  count: number
  ratings: {
    good: number
    'needs-improvement': number
    poor: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: WebVitalData = await request.json()

    // Validate the data
    if (!data.name || typeof data.value !== 'number' || !data.id) {
      return NextResponse.json(
        { error: 'Invalid web vital data' },
        { status: 400 }
      )
    }

    // In production, you would send this to your analytics service
    // For now, we'll just log it and store basic metrics
    
    console.log('Web Vital Received:', {
      metric: data.name,
      value: data.value,
      rating: data.rating,
      url: data.url,
      timestamp: new Date(data.timestamp).toISOString()
    })

    // You could store this in a database or send to analytics services like:
    // - Google Analytics 4
    // - DataDog
    // - New Relic
    // - Custom analytics platform

    // Example: Send to Google Analytics 4 (if configured)
    if (process.env.GA_MEASUREMENT_ID) {
      try {
        const gaResponse = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: data.id,
            events: [{
              name: 'web_vital',
              params: {
                metric_name: data.name,
                metric_value: Math.round(data.value),
                metric_rating: data.rating,
                metric_delta: Math.round(data.delta),
                page_location: data.url,
                custom_map: {
                  metric_id: data.id
                }
              }
            }]
          })
        })

        if (!gaResponse.ok) {
          console.error('Failed to send to GA4:', gaResponse.statusText)
        }
      } catch (error) {
        console.error('Error sending to GA4:', error)
      }
    }

    // Store aggregated metrics (in production, use a proper database)
    const metrics = getStoredMetrics()
    
    if (!metrics[data.name]) {
      metrics[data.name] = {
        count: 0,
        totalValue: 0,
        ratings: { good: 0, 'needs-improvement': 0, poor: 0 }
      }
    }

    const metric = metrics[data.name]
    if (metric) {
      metric.count++
      metric.totalValue += data.value
      metric.ratings[data.rating]++
    }

    storeMetrics(metrics)

    return NextResponse.json({ 
      success: true,
      message: 'Web vital recorded successfully'
    })

  } catch (error) {
    console.error('Error processing web vital:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const metrics = getStoredMetrics()
    
    // Calculate averages and percentages
    const processedMetrics = Object.entries(metrics).reduce((acc, [name, data]) => {
      const average = data.count > 0 ? data.totalValue / data.count : 0
      const total = data.ratings.good + data.ratings['needs-improvement'] + data.ratings.poor
      
      acc[name] = {
        average: Math.round(average * 100) / 100,
        count: data.count,
        ratings: {
          good: total > 0 ? Math.round((data.ratings.good / total) * 100) : 0,
          'needs-improvement': total > 0 ? Math.round((data.ratings['needs-improvement'] / total) * 100) : 0,
          poor: total > 0 ? Math.round((data.ratings.poor / total) * 100) : 0
        }
      }
      
      return acc
    }, {} as Record<string, ProcessedMetric>)

    return NextResponse.json({
      success: true,
      metrics: processedMetrics,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error retrieving metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simple in-memory storage (in production, use Redis, database, etc.)
let metricsStore: Record<string, MetricData> = {}

function getStoredMetrics() {
  return metricsStore
}

function storeMetrics(metrics: Record<string, MetricData>) {
  metricsStore = metrics
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}