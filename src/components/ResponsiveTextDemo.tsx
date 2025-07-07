'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/contexts/LanguageContext'
import ResponsiveText, { 
  ResponsiveHeading, 
  ResponsiveParagraph, 
  ResponsiveCardTitle, 
  ResponsiveCardDescription 
} from './ResponsiveText'
import { Globe, Type, Smartphone, Monitor, Tablet } from 'lucide-react'

export default function ResponsiveTextDemo() {
  const { t, currentLanguage } = useTranslation()
  const [selectedSize, setSelectedSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  
  const sampleTexts = {
    en: {
      title: "Multi-Stream Viewer",
      description: "Watch multiple streams simultaneously with our advanced platform",
      longText: "Experience the future of streaming with our cutting-edge multi-stream viewer. Watch up to 16 streams at once, chat with multiple communities, and never miss a moment of the action."
    },
    zh: {
      title: "多流媒体观看器",
      description: "使用我们的先进平台同时观看多个直播流",
      longText: "体验我们尖端多流媒体观看器的流媒体未来。一次观看多达16个直播流，与多个社区聊天，永远不会错过任何精彩时刻。"
    },
    ja: {
      title: "マルチストリームビューア",
      description: "私たちの高度なプラットフォームで複数のストリームを同時に視聴",
      longText: "最先端のマルチストリームビューアでストリーミングの未来を体験してください。最大16のストリームを一度に視聴し、複数のコミュニティとチャットし、アクションの瞬間を見逃すことはありません。"
    },
    ko: {
      title: "멀티 스트림 뷰어",
      description: "우리의 고급 플랫폼으로 여러 스트림을 동시에 시청하세요",
      longText: "최첨단 멀티 스트림 뷰어로 스트리밍의 미래를 경험하세요. 한 번에 최대 16개의 스트림을 시청하고, 여러 커뮤니티와 채팅하며, 액션의 순간을 놓치지 마세요."
    },
    ru: {
      title: "Мульти-стрим просмотрщик",
      description: "Смотрите несколько потоков одновременно с нашей продвинутой платформой",
      longText: "Испытайте будущее стриминга с нашим передовым мульти-стрим просмотрщиком. Смотрите до 16 потоков одновременно, общайтесь с несколькими сообществами и никогда не пропускайте момент действия."
    }
  }
  
  const currentTexts = sampleTexts[currentLanguage as keyof typeof sampleTexts] || sampleTexts.en
  
  const containerClasses = {
    mobile: 'max-w-sm',
    tablet: 'max-w-md',
    desktop: 'max-w-2xl'
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <ResponsiveHeading level={2}>
          {t('settings.accessibility.title')} - Responsive Text Demo
        </ResponsiveHeading>
        
        <ResponsiveParagraph className="text-muted-foreground">
          This demo shows how text adapts to different screen sizes and languages automatically.
        </ResponsiveParagraph>
        
        {/* Size Selector */}
        <div className="flex justify-center gap-2">
          <Button
            variant={selectedSize === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSize('mobile')}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
          <Button
            variant={selectedSize === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSize('tablet')}
          >
            <Tablet className="w-4 h-4 mr-1" />
            Tablet
          </Button>
          <Button
            variant={selectedSize === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSize('desktop')}
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
        </div>
      </div>
      
      {/* Demo Container */}
      <div className={`mx-auto transition-all duration-300 ${containerClasses[selectedSize]}`}>
        <Card className="@container">
          <CardHeader>
            <div className="flex items-center justify-between">
              <ResponsiveCardTitle as="h3">
                {currentTexts.title}
              </ResponsiveCardTitle>
              <Badge variant="secondary" className="text-responsive-xs">
                {currentLanguage.toUpperCase()}
              </Badge>
            </div>
            <ResponsiveCardDescription>
              {currentTexts.description}
            </ResponsiveCardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Text Size Examples */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <ResponsiveText size="sm" className="text-muted-foreground">
                  Text Size Examples:
                </ResponsiveText>
              </div>
              
              <div className="space-y-2 pl-6">
                <ResponsiveText size="xs" className="block">
                  Extra Small: {t('common.loading')}
                </ResponsiveText>
                <ResponsiveText size="sm" className="block">
                  Small: {t('common.success')}
                </ResponsiveText>
                <ResponsiveText size="base" className="block">
                  Base: {t('common.error')}
                </ResponsiveText>
                <ResponsiveText size="lg" className="block">
                  Large: {t('nav.discover')}
                </ResponsiveText>
                <ResponsiveText size="xl" className="block">
                  Extra Large: {t('nav.streams')}
                </ResponsiveText>
              </div>
            </div>
            
            {/* Truncation Examples */}
            <div className="space-y-3">
              <ResponsiveText size="sm" className="text-muted-foreground">
                Text Truncation Examples:
              </ResponsiveText>
              
              <div className="space-y-2 pl-6">
                <div>
                  <ResponsiveText size="sm" className="text-muted-foreground block">
                    Single line truncation:
                  </ResponsiveText>
                  <ResponsiveText truncate className="block">
                    {currentTexts.longText}
                  </ResponsiveText>
                </div>
                
                <div>
                  <ResponsiveText size="sm" className="text-muted-foreground block">
                    Two line truncation:
                  </ResponsiveText>
                  <ResponsiveText truncate={2} className="block">
                    {currentTexts.longText}
                  </ResponsiveText>
                </div>
                
                <div>
                  <ResponsiveText size="sm" className="text-muted-foreground block">
                    Three line truncation:
                  </ResponsiveText>
                  <ResponsiveText truncate={3} className="block">
                    {currentTexts.longText}
                  </ResponsiveText>
                </div>
              </div>
            </div>
            
            {/* Language-specific styling */}
            <div className="space-y-3">
              <ResponsiveText size="sm" className="text-muted-foreground">
                Language-specific styling:
              </ResponsiveText>
              
              <div className="space-y-2 pl-6">
                <ResponsiveText lang="zh" className="block">
                  Chinese: 这是中文文本示例，具有适当的行高和字间距
                </ResponsiveText>
                <ResponsiveText lang="ja" className="block">
                  Japanese: これは日本語のテキスト例で、適切な行の高さと文字間隔があります
                </ResponsiveText>
                <ResponsiveText lang="ko" className="block">
                  Korean: 이것은 적절한 줄 높이와 문자 간격을 가진 한국어 텍스트 예제입니다
                </ResponsiveText>
                <ResponsiveText lang="ru" className="block">
                  Russian: Это пример русского текста с правильной высотой строки и межбуквенным интервалом
                </ResponsiveText>
              </div>
            </div>
            
            {/* Button Examples */}
            <div className="space-y-3">
              <ResponsiveText size="sm" className="text-muted-foreground">
                Responsive Buttons:
              </ResponsiveText>
              
              <div className="flex flex-wrap gap-2">
                <Button size="sm">
                  {t('common.buttons.getStarted')}
                </Button>
                <Button variant="outline" size="sm">
                  {t('common.buttons.learnMore')}
                </Button>
                <Button variant="ghost" size="sm">
                  {t('common.buttons.cancel')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Info */}
      <div className="text-center">
        <ResponsiveText size="sm" className="text-muted-foreground">
          <Globe className="w-4 h-4 inline mr-1" />
          Text automatically adapts to screen size and language requirements
        </ResponsiveText>
      </div>
    </div>
  )
}