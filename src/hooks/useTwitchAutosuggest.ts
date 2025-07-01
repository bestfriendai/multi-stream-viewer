import { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'

export interface TwitchChannel {
  id: string
  login: string
  display_name: string
  profile_image_url: string | null
  is_live: boolean
  game_name: string
  title: string
  stream?: {
    viewer_count: number
    started_at: string
    thumbnail_url: string
    language: string
  }
}

export interface SearchResponse {
  results: TwitchChannel[]
  query: string
  count: number
}

interface UseTwitchAutosuggestOptions {
  enabled?: boolean
}

export function useTwitchAutosuggest(query: string = '', options: UseTwitchAutosuggestOptions = {}) {
  const { enabled = true } = options
  const [suggestions, setSuggestions] = useState<TwitchChannel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/twitch/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: searchQuery, limit: 8 }),
        })

        if (!response.ok) {
          throw new Error('Failed to search')
        }

        const data: SearchResponse = await response.json()
        setSuggestions(data.results)
      } catch (err) {
        setError('Failed to load suggestions')
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  // Effect to trigger search when query changes
  useEffect(() => {
    if (enabled && query.trim().length >= 2) {
      debouncedSearch(query)
    } else {
      setSuggestions([])
      setIsLoading(false)
    }
  }, [query, enabled, debouncedSearch])

  const searchChannels = useCallback((searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    debouncedSearch(searchQuery)
  }, [debouncedSearch])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  return {
    suggestions,
    loading: isLoading,
    isLoading,
    error,
    searchChannels,
    clearSuggestions,
  }
}