'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, TrendingUp, Users, Gamepad2, Music, Palette, ChefHat, MessageSquare, Trophy, Tv, Search, Loader2, RefreshCw, Eye, Sparkles, Youtube, Dumbbell } from 'lucide-react'
import { useStreamStore } from '@/store/streamStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { name: 'All', icon: Sparkles, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { name: 'Gaming', icon: Gamepad2, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { name: 'Just Chatting', icon: MessageSquare, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
  { name: 'IRL', icon: Users, color: 'bg-gradient-to-r from-orange-500 to-yellow-500' },
  { name: 'Esports', icon: Trophy, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
  { name: 'VTuber', icon: Tv, color: 'bg-gradient-to-r from-purple-600 to-indigo-600' },
  { name: 'Art', icon: Palette, color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  { name: 'Music', icon: Music, color: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
  { name: 'Sports', icon: Dumbbell, color: 'bg-gradient-to-r from-green-600 to-teal-600' },
]

// Static list of top streamers from streamStatusReal.ts
const TOP_STREAMERS = [
  // Top Overall Streamers
  { name: 'xqcow', platform: 'twitch', category: 'Gaming', viewers: 52430, title: 'VARIETY GAMING | !newvid' },
  { name: 'kai_cenat', platform: 'twitch', category: 'Just Chatting', viewers: 48945, title: 'MAFIATHON 2 IS LIVE' },
  { name: 'hasanabi', platform: 'twitch', category: 'Just Chatting', viewers: 42100, title: 'POLITICS AND GAMING' },
  { name: 'pokimane', platform: 'twitch', category: 'Gaming', viewers: 38340, title: 'VALORANT RANKED GRIND' },
  { name: 'shroud', platform: 'twitch', category: 'Gaming', viewers: 35890, title: 'PUBG AND CHILL' },
  { name: 'ninja', platform: 'twitch', category: 'Gaming', viewers: 32150, title: 'FORTNITE CHAPTER 5' },
  { name: 'tfue', platform: 'twitch', category: 'Gaming', viewers: 29200, title: 'WARZONE WINS ONLY' },
  { name: 'summit1g', platform: 'twitch', category: 'Gaming', viewers: 28750, title: 'SEA OF THIEVES' },
  { name: 'lirik', platform: 'twitch', category: 'Gaming', viewers: 26800, title: 'VARIETY STREAM' },
  { name: 'sodapoppin', platform: 'twitch', category: 'Gaming', viewers: 25920, title: 'WOW CLASSIC' },
  
  // Gaming Category Leaders
  { name: 'mizkif', platform: 'twitch', category: 'Just Chatting', viewers: 24580, title: 'REACT CONTENT' },
  { name: 'ludwig', platform: 'twitch', category: 'Gaming', viewers: 23240, title: 'CHESS TOURNAMENT' },
  { name: 'asmongold', platform: 'twitch', category: 'Gaming', viewers: 22670, title: 'WOW RAIDS' },
  { name: 'nickmercs', platform: 'twitch', category: 'Gaming', viewers: 21890, title: 'WARZONE DUOS' },
  { name: 'myth', platform: 'twitch', category: 'Gaming', viewers: 20420, title: 'VALORANT RANKED' },
  { name: 'timthetatman', platform: 'twitch', category: 'Gaming', viewers: 19650, title: 'WARZONE WINS' },
  { name: 'drlupo', platform: 'twitch', category: 'Gaming', viewers: 18890, title: 'FORTNITE FRIDAY' },
  { name: 'dakotaz', platform: 'twitch', category: 'Gaming', viewers: 17720, title: 'PUBG SQUADS' },
  { name: 'drdisrespect', platform: 'twitch', category: 'Gaming', viewers: 16850, title: 'CHAMPIONS CLUB' },
  { name: 'sykkuno', platform: 'twitch', category: 'Gaming', viewers: 15940, title: 'AMONG US NIGHT' },
  
  // Just Chatting & IRL
  { name: 'amouranth', platform: 'twitch', category: 'Just Chatting', viewers: 15320, title: 'JUST CHATTING' },
  { name: 'alinity', platform: 'twitch', category: 'Just Chatting', viewers: 14750, title: 'CHATTING AND GAMING' },
  { name: 'keffals', platform: 'twitch', category: 'Just Chatting', viewers: 13890, title: 'POLITICS TALK' },
  { name: 'austinshow', platform: 'twitch', category: 'Just Chatting', viewers: 13420, title: 'LOVE OR HOST' },
  { name: 'qvc', platform: 'twitch', category: 'Just Chatting', viewers: 12980, title: 'QVC SHOPPING' },
  { name: 'jschlatt', platform: 'twitch', category: 'Just Chatting', viewers: 12560, title: 'GAMING AND CHAOS' },
  { name: 'willneff', platform: 'twitch', category: 'Just Chatting', viewers: 12190, title: 'REACT ANDY' },
  { name: 'nmplol', platform: 'twitch', category: 'Just Chatting', viewers: 11820, title: 'MALENA AND NICK' },
  { name: 'brookeab', platform: 'twitch', category: 'Just Chatting', viewers: 11450, title: 'CHATTING TIME' },
  { name: 'Maya', platform: 'twitch', category: 'Just Chatting', viewers: 11120, title: 'ANIMAL SANCTUARY' },
  
  // VALORANT
  { name: 'tenz', platform: 'twitch', category: 'Esports', viewers: 19850, title: 'RANKED GRIND' },
  { name: 'shahzam', platform: 'twitch', category: 'Esports', viewers: 16720, title: 'PRO PLAYER GAMEPLAY' },
  { name: 'tarik', platform: 'twitch', category: 'Esports', viewers: 15890, title: 'RANKED TO RADIANT' },
  { name: 'kyedae', platform: 'twitch', category: 'Gaming', viewers: 14560, title: 'VALORANT WITH FRIENDS' },
  { name: 'sinatraa', platform: 'twitch', category: 'Esports', viewers: 13480, title: 'RADIANT GAMEPLAY' },
  { name: 'zombs', platform: 'twitch', category: 'Esports', viewers: 12340, title: 'COMPETITIVE VALORANT' },
  { name: 'wardell', platform: 'twitch', category: 'Esports', viewers: 11780, title: 'OPERATOR ONLY' },
  { name: 'subroza', platform: 'twitch', category: 'Esports', viewers: 11220, title: 'TSM PRACTICE' },
  
  // Fortnite
  { name: 'bugha', platform: 'twitch', category: 'Gaming', viewers: 18960, title: 'WORLD CUP WINNER' },
  { name: 'clix', platform: 'twitch', category: 'Gaming', viewers: 17840, title: 'RANKED ARENA' },
  { name: 'mongraal', platform: 'twitch', category: 'Gaming', viewers: 16720, title: 'EU CREATIVE' },
  { name: 'benjyfishy', platform: 'twitch', category: 'Gaming', viewers: 15680, title: 'FNCS PRACTICE' },
  { name: 'zayt', platform: 'twitch', category: 'Gaming', viewers: 14590, title: 'TRIO SCRIMS' },
  { name: 'aqua', platform: 'twitch', category: 'Gaming', viewers: 13450, title: 'WORLD CUP DUO' },
  { name: 'savage', platform: 'twitch', category: 'Gaming', viewers: 12380, title: 'FNCS CHAMPION' },
  
  // League of Legends
  { name: 'tyler1', platform: 'twitch', category: 'Gaming', viewers: 25690, title: 'RANK 1 DRAVEN' },
  { name: 'yassuo', platform: 'twitch', category: 'Gaming', viewers: 18540, title: 'YASUO MAIN' },
  { name: 'tfblade', platform: 'twitch', category: 'Gaming', viewers: 16890, title: 'CHALLENGER CLIMB' },
  { name: 'sneaky', platform: 'twitch', category: 'Gaming', viewers: 15760, title: 'ADC GAMEPLAY' },
  { name: 'imaqtpie', platform: 'twitch', category: 'Gaming', viewers: 14580, title: 'THE PIE' },
  { name: 'voyboy', platform: 'twitch', category: 'Gaming', viewers: 13490, title: 'EDUCATIONAL' },
  { name: 'hashinshin', platform: 'twitch', category: 'Gaming', viewers: 12370, title: 'TOP LANE' },
  { name: 'nightblue3', platform: 'twitch', category: 'Gaming', viewers: 11280, title: 'JUNGLE CARRY' },
  
  // Minecraft
  { name: 'dream', platform: 'twitch', category: 'Gaming', viewers: 34560, title: 'SPEEDRUN PRACTICE' },
  { name: 'georgenotfound', platform: 'twitch', category: 'Gaming', viewers: 28490, title: 'MANHUNT' },
  { name: 'sapnap', platform: 'twitch', category: 'Gaming', viewers: 24780, title: 'DREAM SMP' },
  { name: 'tommyinnit', platform: 'twitch', category: 'Gaming', viewers: 22150, title: 'CHAOS MINECRAFT' },
  { name: 'tubbo', platform: 'twitch', category: 'Gaming', viewers: 20340, title: 'SMP BUILDING' },
  { name: 'ranboo', platform: 'twitch', category: 'Gaming', viewers: 19680, title: 'VARIETY MINECRAFT' },
  { name: 'wilbursoot', platform: 'twitch', category: 'Music', viewers: 18920, title: 'MUSIC AND MINECRAFT' },
  { name: 'technoblade', platform: 'twitch', category: 'Gaming', viewers: 17840, title: 'POTATO WAR' },
  { name: 'quackity', platform: 'twitch', category: 'Gaming', viewers: 16750, title: 'DREAM SMP LORE' },
  { name: 'philza', platform: 'twitch', category: 'Gaming', viewers: 15680, title: 'HARDCORE MINECRAFT' },
  
  // World of Warcraft
  { name: 'esfandtv', platform: 'twitch', category: 'Gaming', viewers: 16890, title: 'CLASSIC PALADIN' },
  { name: 'methodjosh', platform: 'twitch', category: 'Gaming', viewers: 15740, title: 'MYTHIC RAIDING' },
  { name: 'maximilian_dood', platform: 'twitch', category: 'Gaming', viewers: 14620, title: 'WARRIOR GAMEPLAY' },
  { name: 'savix', platform: 'twitch', category: 'Gaming', viewers: 13580, title: 'PVP ARENA' },
  { name: 'cdewx', platform: 'twitch', category: 'Gaming', viewers: 12490, title: 'GLADIATOR GAMEPLAY' },
  
  // VTubers
  { name: 'ironmouse', platform: 'twitch', category: 'VTuber', viewers: 18670, title: 'SINGING STREAM' },
  { name: 'zentreya', platform: 'twitch', category: 'VTuber', viewers: 16890, title: 'VARIETY GAMING' },
  { name: 'silvervale', platform: 'twitch', category: 'VTuber', viewers: 15420, title: 'HORROR GAMES' },
  { name: 'nyanners', platform: 'twitch', category: 'VTuber', viewers: 14750, title: 'CHATTING AND GAMING' },
  { name: 'veibae', platform: 'twitch', category: 'VTuber', viewers: 13890, title: 'APEX LEGENDS' },
  { name: 'froot', platform: 'twitch', category: 'Art', viewers: 12940, title: 'ART STREAM' },
  { name: 'haruka_karibu', platform: 'twitch', category: 'VTuber', viewers: 11870, title: 'MINECRAFT BUILD' },
  { name: 'snuffy', platform: 'twitch', category: 'VTuber', viewers: 10950, title: 'VARIETY NIGHT' },
  
  // Music & Art
  { name: 'deadmau5', platform: 'twitch', category: 'Music', viewers: 15680, title: 'LIVE MUSIC PRODUCTION' },
  { name: 'marshmello', platform: 'twitch', category: 'Music', viewers: 14520, title: 'DJ SET' },
  { name: 'bobross', platform: 'twitch', category: 'Art', viewers: 13890, title: 'JOY OF PAINTING' },
  { name: 'lilsimsie', platform: 'twitch', category: 'Gaming', viewers: 12760, title: 'SIMS 4 BUILD' },
  { name: 'artosis', platform: 'twitch', category: 'Gaming', viewers: 11690, title: 'STARCRAFT CASTING' },
  
  // Chess
  { name: 'gmhikaru', platform: 'twitch', category: 'Gaming', viewers: 22450, title: 'GRANDMASTER GAMEPLAY' },
  { name: 'chessbrah', platform: 'twitch', category: 'Gaming', viewers: 16780, title: 'CHESS EDUCATION' },
  { name: 'chess', platform: 'twitch', category: 'Gaming', viewers: 15690, title: 'OFFICIAL CHESS.COM' },
  { name: 'chessnetwork', platform: 'twitch', category: 'Gaming', viewers: 14520, title: 'CHESS PUZZLES' },
  { name: 'botezlive', platform: 'twitch', category: 'Gaming', viewers: 13890, title: 'CHESS SISTERS' },
  
  // Sports & Fitness
  { name: 'rocketleague', platform: 'twitch', category: 'Sports', viewers: 19560, title: 'RLCS CHAMPIONSHIP' },
  { name: 'fl0m', platform: 'twitch', category: 'Esports', viewers: 16890, title: 'CS:GO RANK S' },
  { name: 'steel_tv', platform: 'twitch', category: 'Esports', viewers: 15420, title: 'TACTICAL FPS' },
  
  // IRL & Travel
  { name: 'jakenbakeLIVE', platform: 'twitch', category: 'IRL', viewers: 18940, title: 'JAPAN IRL STREAM' },
  { name: 'jinnyty', platform: 'twitch', category: 'IRL', viewers: 16780, title: 'KOREA TRAVEL' },
  { name: 'robcdee', platform: 'twitch', category: 'IRL', viewers: 15620, title: 'TOKYO WALKING' },
  { name: 'yuggie_tv', platform: 'twitch', category: 'IRL', viewers: 14490, title: 'SINGAPORE IRL' },
  
  // Variety Streamers
  { name: 'moonmoon', platform: 'twitch', category: 'Gaming', viewers: 17890, title: 'VARIETY GAMING' },
  { name: 'cohh', platform: 'twitch', category: 'Gaming', viewers: 16750, title: 'INDIE GAMES' },
  { name: 'dansgaming', platform: 'twitch', category: 'Gaming', viewers: 15680, title: 'RETRO GAMING' },
  { name: 'ezekiel_iii', platform: 'twitch', category: 'Gaming', viewers: 14590, title: 'STORY GAMES' }
].map(stream => ({
  ...stream,
  platform: stream.platform as 'twitch' | 'youtube'
}))

export default function SuggestedStreams() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { addStream, streams } = useStreamStore()
  
  // Add some randomization to viewer counts to make it feel more live
  const randomizeViewers = (baseViewers: number) => {
    const variation = Math.floor(Math.random() * 1000) - 500 // ±500 viewers
    return Math.max(baseViewers + variation, 100)
  }
  
  // Filter streams
  const filteredStreams = TOP_STREAMERS.filter(stream => {
    // Category filter
    if (selectedCategory !== 'All' && stream.category !== selectedCategory) {
      return false
    }
    
    // Search filter
    if (searchQuery && !stream.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })
  
  // Sort by viewer count (with randomization)
  const sortedStreams = [...filteredStreams].sort((a, b) => {
    return randomizeViewers(b.viewers) - randomizeViewers(a.viewers)
  })
  
  const handleAddStream = async (stream: typeof TOP_STREAMERS[0]) => {
    if (streams.length >= 16) {
      toast.error('Maximum 16 streams allowed')
      return
    }
    
    const input = stream.platform === 'twitch' 
      ? stream.name 
      : stream.platform === 'youtube'
        ? `youtube:${stream.name}`
        : stream.name
    
    const success = await addStream(input)
    if (success) {
      toast.success(`✨ Added ${stream.name} to your view`, {
        description: `${stream.platform} • ${stream.category}`,
        duration: 3000,
      })
    } else {
      toast.error(`Failed to add ${stream.name}`, {
        description: 'This stream might already be added or there was an error.',
      })
    }
  }
  
  const isStreamAdded = (streamName: string) => {
    return streams.some(s => s.channelName === streamName)
  }
  
  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Live Streams
            </h3>
            <div className="text-sm text-muted-foreground mt-1">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="font-medium">{TOP_STREAMERS.length} top streamers</span>
                  <Badge variant="secondary" className="text-xs">
                    📺 Curated
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Showing {filteredStreams.length} streams • All categories available
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search streamers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base border-2 focus:border-primary transition-colors"
          />
        </div>
        
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(category => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.name
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  "whitespace-nowrap flex-shrink-0",
                  isSelected ? [
                    "text-white shadow-lg scale-105",
                    category.color
                  ] : [
                    "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  ]
                )}
              >
                <Icon size={16} />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Stream Grid */}
      {sortedStreams.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
            <Search size={32} className="text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-2">No live streams found</p>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery ? (
              <>No streams match &quot;<strong>{searchQuery}</strong>&quot;. Try a different search term.</>
            ) : selectedCategory !== 'All' ? (
              <>No live streams in <strong>{selectedCategory}</strong> right now. Try a different category.</>
            ) : (
              'All streamers are currently offline. Check back later for live content!'
            )}
          </p>
          <div className="flex gap-2 justify-center mt-6">
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
            {selectedCategory !== 'All' && (
              <Button variant="outline" onClick={() => setSelectedCategory('All')}>
                Show All Categories
              </Button>
            )}
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw size={14} className="mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedStreams.map(stream => {
            const isAdded = isStreamAdded(stream.name)
            const viewerCount = randomizeViewers(stream.viewers)
            
            return (
              <Card 
                key={`${stream.platform}-${stream.name}`} 
                className={cn(
                  "group relative overflow-hidden transition-all duration-300",
                  "hover:shadow-xl hover:scale-[1.02] hover:border-primary/50",
                  isAdded && "opacity-75"
                )}
              >
                {/* Stream Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                  </div>
                  
                  {/* Stream Avatar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {stream.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Live Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="destructive" className="gap-1 shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      LIVE
                    </Badge>
                  </div>
                  
                  {/* Platform Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="gap-1 shadow-lg">
                      {stream.platform === 'youtube' ? (
                        <>
                          <Youtube size={12} />
                          YouTube
                        </>
                      ) : (
                        <>
                          <Tv size={12} />
                          Twitch
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  {/* Viewer Count */}
                  <div className="absolute bottom-3 left-3">
                    <div className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      <Eye size={12} />
                      {formatViewerCount(viewerCount)}
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs">
                      {stream.category}
                    </Badge>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-sm font-medium">Click to add</div>
                  </div>
                </div>
                
                {/* Stream Info */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate text-base">
                        {stream.name}
                      </h4>
                      {viewerCount > 50000 && (
                        <Badge variant="outline" className="text-xs">
                          🔥 Hot
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {stream.title}
                    </p>
                  </div>
                  
                  {/* Stream Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {formatViewerCount(viewerCount)}
                    </span>
                    <span className="capitalize">{stream.category}</span>
                  </div>
                  
                  {/* Add Button */}
                  <Button
                    size="sm"
                    variant={isAdded ? 'secondary' : 'default'}
                    onClick={() => handleAddStream(stream)}
                    disabled={isAdded}
                    className={cn(
                      "w-full transition-all",
                      !isAdded && "hover:shadow-md"
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Eye size={14} className="mr-2" />
                        Added to view
                      </>
                    ) : (
                      <>
                        <Plus size={14} className="mr-2" />
                        Add Stream
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}