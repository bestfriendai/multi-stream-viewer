'use client'

import React from 'react'

interface SEOContentProps {
  keywords?: string[]
  topics?: string[]
  features?: string[]
  platforms?: string[]
}

export default function SEOContent({ 
  keywords = [], 
  topics = [], 
  features = [], 
  platforms = [] 
}: SEOContentProps) {
  return (
    <div className="sr-only" aria-hidden="true">
      {/* Hidden content for search engines */}
      <h1>Multi-Stream Viewer Platform</h1>
      <p>
        Watch multiple live streams simultaneously from different platforms. 
        Our advanced multi-stream viewer technology allows you to monitor 
        several content creators at once in a customizable grid layout.
      </p>
      
      {keywords.length > 0 && (
        <section>
          <h2>Search Keywords</h2>
          <p>{keywords.join(', ')}</p>
        </section>
      )}
      
      {topics.length > 0 && (
        <section>
          <h2>Content Topics</h2>
          <ul>
            {topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </section>
      )}
      
      {features.length > 0 && (
        <section>
          <h2>Platform Features</h2>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>
      )}
      
      {platforms.length > 0 && (
        <section>
          <h2>Supported Platforms</h2>
          <ul>
            {platforms.map((platform, index) => (
              <li key={index}>{platform} streaming platform integration</li>
            ))}
          </ul>
        </section>
      )}
      
      <section>
        <h2>Technical Specifications</h2>
        <p>
          Built with modern web technologies including React, Next.js, and TypeScript.
          Optimized for performance with lazy loading, efficient state management,
          and responsive design patterns. Supports screen readers and accessibility
          standards for inclusive viewing experiences.
        </p>
      </section>
      
      <section>
        <h2>Use Cases</h2>
        <ul>
          <li>Esports tournament viewing with multiple camera angles</li>
          <li>Content creator collaboration monitoring</li>
          <li>Gaming community event coordination</li>
          <li>Educational content comparison and analysis</li>
          <li>Live event coverage from multiple perspectives</li>
          <li>Streaming platform content discovery</li>
        </ul>
      </section>
    </div>
  )
}