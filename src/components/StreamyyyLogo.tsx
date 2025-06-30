import React from 'react';
import { cn } from '@/lib/utils';

interface StreamyyyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'white' | 'gradient';
}

const sizeConfig = {
  sm: {
    icon: 'w-6 h-6',
    svg: { width: 24, height: 24 },
    text: 'text-base',
    gap: 'gap-2'
  },
  md: {
    icon: 'w-8 h-8',
    svg: { width: 32, height: 32 },
    text: 'text-lg',
    gap: 'gap-2'
  },
  lg: {
    icon: 'w-12 h-12',
    svg: { width: 48, height: 48 },
    text: 'text-2xl',
    gap: 'gap-3'
  },
  xl: {
    icon: 'w-16 h-16',
    svg: { width: 64, height: 64 },
    text: 'text-3xl',
    gap: 'gap-4'
  }
};

export default function StreamyyyLogo({ 
  size = 'md', 
  showText = true, 
  className = '',
  iconOnly = false,
  variant = 'default'
}: StreamyyyLogoProps) {
  const config = sizeConfig[size];
  
  const getGradientId = () => `streamyyyGradient-${size}-${Math.random().toString(36).substr(2, 9)}`;
  const gradientId = getGradientId();
  
  const getTextClasses = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'gradient':
        return 'bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent';
      default:
        return 'text-foreground';
    }
  };

  const LogoIcon = () => (
    <div className={cn('relative', config.icon)}>
      <svg 
        width={config.svg.width}
        height={config.svg.height}
        viewBox="0 0 32 32" 
        className={config.icon}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        {/* Chat bubble background */}
        <rect 
          x="4" 
          y="6" 
          width="24" 
          height="18" 
          rx="4" 
          ry="4" 
          fill={variant === 'white' ? 'white' : `url(#${gradientId})`}
        />
        {/* Play button triangle */}
        <polygon 
          points="13,12 13,20 21,16" 
          fill={variant === 'white' ? '#6366f1' : 'white'}
        />
        {/* Chat bubble tail */}
        <path 
          d="M8 24 L12 20 L8 20 Z" 
          fill={variant === 'white' ? 'white' : `url(#${gradientId})`}
        />
      </svg>
    </div>
  );

  if (iconOnly) {
    return (
      <div className={cn('flex items-center', className)}>
        <LogoIcon />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', config.gap, className)}>
      <LogoIcon />
      {showText && (
        <span className={cn(
          config.text,
          'font-bold tracking-tight',
          getTextClasses()
        )}>
          Streamyyy
        </span>
      )}
    </div>
  );
}

// Export individual components for flexibility
export const StreamyyyIcon = ({ size = 'md', variant = 'default', className = '' }: Pick<StreamyyyLogoProps, 'size' | 'variant' | 'className'>) => (
  <StreamyyyLogo size={size} variant={variant} iconOnly showText={false} className={className} />
);

export const StreamyyyText = ({ size = 'md', variant = 'default', className = '' }: Pick<StreamyyyLogoProps, 'size' | 'variant' | 'className'>) => {
  const config = sizeConfig[size];
  
  const getTextClasses = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'gradient':
        return 'bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent';
      default:
        return 'text-foreground';
    }
  };

  return (
    <span className={cn(
      config.text,
      'font-bold tracking-tight',
      getTextClasses(),
      className
    )}>
      Streamyyy
    </span>
  );
};
