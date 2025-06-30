import * as tf from '@tensorflow/tfjs'
import { ALL_STREAMERS } from '../streamStatus'

interface ViewingPattern {
  streamerId: string
  totalWatchTime: number
  frequency: number
  lastWatched: number
  category: string
  platform: string
}

interface StreamFeatures {
  category: number[]
  avgViewers: number
  streamFrequency: number
  language: number
  contentRating: number
}

export class StreamRecommendationEngine {
  private model: tf.LayersModel | null = null
  private categoryEncoder: Map<string, number> = new Map()
  private streamerFeatures: Map<string, StreamFeatures> = new Map()
  
  constructor() {
    this.initializeCategoryEncoder()
    this.initializeStreamerFeatures()
  }
  
  private initializeCategoryEncoder() {
    const categories = ['Gaming', 'Just Chatting', 'Esports', 'Music', 'Art', 'IRL', 'VTuber', 'Sports']
    categories.forEach((cat, idx) => {
      this.categoryEncoder.set(cat, idx)
    })
  }
  
  private initializeStreamerFeatures() {
    // In production, this would come from a database
    ALL_STREAMERS.forEach(streamer => {
      const categoryVector = new Array(8).fill(0)
      const categoryIdx = this.categoryEncoder.get(streamer.category)
      if (categoryIdx !== undefined) {
        categoryVector[categoryIdx] = 1
      }
      
      this.streamerFeatures.set(streamer.name, {
        category: categoryVector,
        avgViewers: Math.random() * 50000 + 1000,
        streamFrequency: Math.random() * 7, // Days per week
        language: 0, // 0 = English, 1 = Other
        contentRating: Math.random() // 0-1 family friendly score
      })
    })
  }
  
  async initializeModel() {
    // Create a simple neural network for recommendations
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [13] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    })
    
    this.model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    })
  }
  
  extractUserFeatures(viewingHistory: ViewingPattern[]): number[] {
    // Calculate user preferences from viewing history
    const categoryPreferences = new Array(8).fill(0)
    const avgWatchTime = viewingHistory.reduce((sum, v) => sum + v.totalWatchTime, 0) / viewingHistory.length || 0
    const totalStreamsWatched = viewingHistory.length
    
    // Calculate category preferences
    viewingHistory.forEach(pattern => {
      const categoryIdx = this.categoryEncoder.get(pattern.category)
      if (categoryIdx !== undefined) {
        categoryPreferences[categoryIdx] += pattern.totalWatchTime
      }
    })
    
    // Normalize category preferences
    const total = categoryPreferences.reduce((sum, val) => sum + val, 0) || 1
    const normalizedPreferences = categoryPreferences.map(val => val / total)
    
    // Calculate viewing time patterns
    const avgSessionLength = avgWatchTime / totalStreamsWatched || 0
    const viewingFrequency = totalStreamsWatched / 30 // Average streams per day over 30 days
    
    return [
      ...normalizedPreferences,
      avgSessionLength / 3600000, // Convert to hours and normalize
      viewingFrequency / 10, // Normalize to 0-1 range
      totalStreamsWatched / 100, // Normalize
      Math.random(), // Time of day preference (would be calculated from real data)
      Math.random()  // Day of week preference (would be calculated from real data)
    ]
  }
  
  combineFeatures(userFeatures: number[], streamerFeatures: StreamFeatures): number[] {
    return [
      ...userFeatures.slice(0, 8), // User category preferences
      ...streamerFeatures.category, // Streamer category
      streamerFeatures.avgViewers / 100000, // Normalize viewers
      streamerFeatures.streamFrequency / 7, // Normalize frequency
      streamerFeatures.contentRating,
      userFeatures[8], // User avg session length
      userFeatures[9]  // User viewing frequency
    ]
  }
  
  async getRecommendations(
    viewingHistory: ViewingPattern[],
    currentStreamers: string[],
    limit: number = 10
  ): Promise<Array<{ streamerId: string; score: number; reason: string }>> {
    if (!this.model) {
      await this.initializeModel()
    }
    
    const userFeatures = this.extractUserFeatures(viewingHistory)
    const recommendations: Array<{ streamerId: string; score: number; reason: string }> = []
    
    // Get all potential streamers
    const potentialStreamers = ALL_STREAMERS.filter(
      s => !currentStreamers.includes(s.name)
    )
    
    // Score each potential streamer
    for (const streamer of potentialStreamers) {
      const streamerFeatures = this.streamerFeatures.get(streamer.name)
      if (!streamerFeatures) continue
      
      const combinedFeatures = this.combineFeatures(userFeatures, streamerFeatures)
      const input = tf.tensor2d([combinedFeatures])
      
      const prediction = this.model!.predict(input) as tf.Tensor
      const score = await prediction.data()
      
      // Generate reason based on features
      let reason = 'Recommended for you'
      const userTopCategory = userFeatures.indexOf(Math.max(...userFeatures.slice(0, 8)))
      const streamerCategory = this.categoryEncoder.get(streamer.category)
      
      if (userTopCategory === streamerCategory) {
        reason = `Popular in ${streamer.category}`
      } else if (score[0] > 0.8) {
        reason = 'Highly recommended'
      } else if (viewingHistory.some(v => v.category === streamer.category)) {
        reason = `Similar to streams you watch`
      }
      
      recommendations.push({
        streamerId: streamer.name,
        score: score[0],
        reason
      })
      
      input.dispose()
      prediction.dispose()
    }
    
    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }
  
  async detectHighlights(
    streamEvents: Array<{ timestamp: number; viewerCount: number; chatActivity: number }>,
    threshold: number = 0.7
  ): Promise<Array<{ timestamp: number; score: number }>> {
    const highlights: Array<{ timestamp: number; score: number }> = []
    
    // Simple highlight detection based on viewer spikes and chat activity
    const avgViewers = streamEvents.reduce((sum, e) => sum + e.viewerCount, 0) / streamEvents.length
    const avgChat = streamEvents.reduce((sum, e) => sum + e.chatActivity, 0) / streamEvents.length
    
    streamEvents.forEach((event, idx) => {
      const viewerSpike = event.viewerCount / avgViewers
      const chatSpike = event.chatActivity / avgChat
      const combinedScore = (viewerSpike + chatSpike) / 2
      
      if (combinedScore > threshold) {
        // Check if it's a sustained spike (not just a blip)
        const sustainedSpike = idx > 0 && idx < streamEvents.length - 1 &&
          streamEvents[idx - 1].viewerCount > avgViewers * 0.8 &&
          streamEvents[idx + 1].viewerCount > avgViewers * 0.8
        
        if (sustainedSpike || combinedScore > threshold * 1.5) {
          highlights.push({
            timestamp: event.timestamp,
            score: combinedScore
          })
        }
      }
    })
    
    return highlights
  }
  
  // Chat sentiment analysis (simple implementation)
  analyzeChatSentiment(messages: string[]): { positive: number; negative: number; neutral: number } {
    // In production, use a proper NLP model
    const positiveWords = ['love', 'awesome', 'great', 'amazing', 'pog', 'poggers', 'hype', 'lets go', 'gg']
    const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'cringe', 'boring', 'trash']
    
    let positive = 0
    let negative = 0
    let neutral = 0
    
    messages.forEach(msg => {
      const lower = msg.toLowerCase()
      const hasPositive = positiveWords.some(word => lower.includes(word))
      const hasNegative = negativeWords.some(word => lower.includes(word))
      
      if (hasPositive && !hasNegative) {
        positive++
      } else if (hasNegative && !hasPositive) {
        negative++
      } else {
        neutral++
      }
    })
    
    const total = messages.length || 1
    return {
      positive: positive / total,
      negative: negative / total,
      neutral: neutral / total
    }
  }
}

// Singleton instance
export const recommendationEngine = new StreamRecommendationEngine()