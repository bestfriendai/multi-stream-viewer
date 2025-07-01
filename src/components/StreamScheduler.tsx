'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Bell, BellOff, Repeat, Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { format, addDays, setHours, setMinutes } from 'date-fns'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function StreamScheduler() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    streamerId: '',
    platform: 'twitch' as const,
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    recurring: false,
    weekdays: new Array(7).fill(false),
    enabled: true
  })
  
  const { scheduledStreams, scheduleStream } = useAppStore()
  
  const handleAddSchedule = () => {
    if (!newSchedule.streamerId) {
      toast.error('Please enter a streamer name')
      return
    }
    
    const scheduledDate = new Date(`${newSchedule.date}T${newSchedule.time}`)
    
    const scheduleData = {
      streamerId: newSchedule.streamerId,
      platform: newSchedule.platform,
      scheduledTime: scheduledDate.getTime(),
      recurring: newSchedule.recurring,
      enabled: newSchedule.enabled,
      ...(newSchedule.recurring && {
        recurrencePattern: newSchedule.weekdays.map((enabled, idx) => enabled ? DAYS_OF_WEEK[idx] : '').filter(Boolean).join(',')
      })
    }
    
    scheduleStream(scheduleData)
    
    toast.success(`Scheduled ${newSchedule.streamerId} for ${format(scheduledDate, 'PPp')}`)
    setShowAddForm(false)
    setNewSchedule({
      streamerId: '',
      platform: 'twitch',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      recurring: false,
      weekdays: new Array(7).fill(false),
      enabled: true
    })
  }
  
  const getNextStreamTime = (schedule: any): Date => {
    if (!schedule.recurring) {
      return new Date(schedule.scheduledTime)
    }
    
    // Calculate next occurrence based on recurrence pattern
    const now = new Date()
    const days = schedule.recurrencePattern.split(',')
    const dayIndices = days.map((day: string) => DAYS_OF_WEEK.indexOf(day))
    
    let nextDate = new Date(schedule.scheduledTime)
    let found = false
    
    for (let i = 0; i < 7; i++) {
      const checkDate = addDays(now, i)
      const dayIndex = checkDate.getDay()
      
      if (dayIndices.includes(dayIndex)) {
        nextDate = setHours(checkDate, nextDate.getHours())
        nextDate = setMinutes(nextDate, nextDate.getMinutes())
        
        if (nextDate > now) {
          found = true
          break
        }
      }
    }
    
    return nextDate
  }
  
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} />
            Stream Schedule
          </h3>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={14} className="mr-1" />
            Add Schedule
          </Button>
        </div>
        
        {showAddForm && (
          <div className="space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Streamer</label>
                <Input
                  value={newSchedule.streamerId}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, streamerId: e.target.value }))}
                  placeholder="Channel name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Platform</label>
                <select
                  value={newSchedule.platform}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, platform: e.target.value as any }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                >
                  <option value="twitch">Twitch</option>
                  <option value="youtube">YouTube</option>
                  <option value="rumble">Rumble</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1"
                  disabled={newSchedule.recurring}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Recurring</label>
              <Switch
                checked={newSchedule.recurring}
                onCheckedChange={(checked) => setNewSchedule(prev => ({ ...prev, recurring: checked }))}
              />
            </div>
            
            {newSchedule.recurring && (
              <div>
                <label className="text-sm font-medium">Repeat on</label>
                <div className="flex gap-1 mt-2">
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <Button
                      key={day}
                      size="sm"
                      variant={newSchedule.weekdays[idx] ? 'default' : 'outline'}
                      onClick={() => {
                        const newWeekdays = [...newSchedule.weekdays]
                        newWeekdays[idx] = !newWeekdays[idx]
                        setNewSchedule(prev => ({ ...prev, weekdays: newWeekdays }))
                      }}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleAddSchedule}>
                Add Schedule
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* Scheduled Streams List */}
        <div className="space-y-2">
          {scheduledStreams.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No scheduled streams yet
            </p>
          ) : (
            scheduledStreams.map(schedule => {
              const nextTime = getNextStreamTime(schedule)
              const isUpcoming = nextTime.getTime() - Date.now() < 3600000 // Within 1 hour
              
              return (
                <div
                  key={schedule.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    schedule.enabled ? "bg-muted/30" : "bg-muted/10 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isUpcoming ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
                    )} />
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{schedule.streamerId}</span>
                        <Badge variant="secondary" className="text-xs">
                          {schedule.platform}
                        </Badge>
                        {schedule.recurring && (
                          <Repeat size={12} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={12} />
                        <span>{format(nextTime, 'PPp')}</span>
                        {schedule.recurring && (
                          <span className="text-xs">
                            ({schedule.recurrencePattern})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Toggle enabled state
                        toast.success(schedule.enabled ? 'Schedule disabled' : 'Schedule enabled')
                      }}
                    >
                      {schedule.enabled ? <Bell size={14} /> : <BellOff size={14} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Remove schedule
                        toast.success('Schedule removed')
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>
      
      {/* Notification Settings */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Notification Settings</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">Browser Notifications</label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Sound Alerts</label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Auto-open Streams</label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Notification Time</label>
            <select className="px-2 py-1 text-sm border rounded">
              <option>5 min before</option>
              <option>10 min before</option>
              <option>15 min before</option>
              <option>30 min before</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}