'use client'

// Force dynamic rendering for this protected route
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTranslation } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Star, Trash2, ExternalLink } from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'

interface FavoriteStream {
  id: string
  channelName: string
  platform: 'twitch' | 'youtube' | 'rumble'
  addedAt: string
}

export default function FavoritesPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { t } = useTranslation()
  const [favorites, setFavorites] = useState<FavoriteStream[]>([])
  const { addStream } = useStreamStore()

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('streamyyy-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const saveFavorites = (newFavorites: FavoriteStream[]) => {
    setFavorites(newFavorites)
    localStorage.setItem('streamyyy-favorites', JSON.stringify(newFavorites))
  }

  const removeFavorite = (id: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== id)
    saveFavorites(newFavorites)
  }

  const addFavoriteToStream = async (favorite: FavoriteStream) => {
    await addStream({
      channelName: favorite.channelName,
      platform: favorite.platform
    })
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitch': return 'bg-purple-600'
      case 'youtube': return 'bg-red-600'
      case 'rumble': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  // Show loading state while authentication is being determined
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            {t('favorites.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {isSignedIn ? t('favorites.savedStreamers') : t('favorites.saveStreamers')}
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">{t('favorites.noFavorites')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('favorites.startAdding')}
              </p>
              <Button onClick={() => window.history.back()}>
                {t('favorites.browseStreams')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${getPlatformColor(favorite.platform)}`} 
                      />
                      {favorite.channelName}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(favorite.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    <Badge variant="outline" className="capitalize">
                      {favorite.platform}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addFavoriteToStream(favorite)}
                      className="flex-1"
                    >
                      {t('favorites.addToStream')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = favorite.platform === 'twitch' 
                          ? `https://twitch.tv/${favorite.channelName}`
                          : favorite.platform === 'youtube'
                          ? `https://youtube.com/@${favorite.channelName}`
                          : `https://rumble.com/${favorite.channelName}`
                        window.open(url, '_blank')
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('favorites.added')} {new Date(favorite.addedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
          >
            {t('favorites.backToStreams')}
          </Button>
        </div>
      </div>
    </div>
  )
}