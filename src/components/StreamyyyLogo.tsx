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
  
  // Use a stable ID to prevent hydration mismatches
  const gradientId = `streamyyyGradient-${size}`;
  
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
            <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#ec4899', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id={`${gradientId}-screen`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#1e293b', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#0f172a', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        
        {/* TV Screen Frame */}
        <rect 
          x="3" 
          y="7" 
          width="26" 
          height="18" 
          rx="2" 
          ry="2" 
          fill={variant === 'white' ? '#f1f5f9' : `url(#${gradientId})`}
          stroke={variant === 'white' ? '#cbd5e1' : 'none'}
          strokeWidth="0.5"
        />
        
        {/* TV Screen */}
        <rect 
          x="5" 
          y="9" 
          width="22" 
          height="14" 
          rx="1" 
          ry="1" 
          fill={variant === 'white' ? '#0f172a' : `url(#${gradientId}-screen)`}
        />
        
        {/* Play Button */}
        <polygon 
          points="13,13 13,19 20,16" 
          fill={variant === 'white' ? '#6366f1' : '#ffffff'}
          opacity="0.9"
        />
        
        {/* TV Stand Base */}
        <rect 
          x="11" 
          y="25" 
          width="10" 
          height="2" 
          rx="1" 
          ry="1" 
          fill={variant === 'white' ? '#94a3b8' : `url(#${gradientId})`}
          opacity="0.8"
        />
        
        {/* TV Stand */}
        <rect 
          x="14" 
          y="23" 
          width="4" 
          height="4" 
          rx="0.5" 
          ry="0.5" 
          fill={variant === 'white' ? '#94a3b8' : `url(#${gradientId})`}
          opacity="0.8"
        />
        
        {/* Screen Reflection Effect */}
        <rect 
          x="5" 
          y="9" 
          width="11" 
          height="7" 
          rx="1" 
          ry="1" 
          fill="url(#reflectionGradient)"
          opacity="0.1"
        />
        
        <defs>
          <linearGradient id="reflectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.3}} />
            <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
          </linearGradient>
        </defs>
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
          'font-black tracking-wide font-mono',
          'drop-shadow-sm',
          'hover:tracking-wider transition-all duration-300',
          getTextClasses()
        )}>
          STREAMYYY
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
        return 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent';
      default:
        return 'text-foreground';
    }
  };

  return (
    <span className={cn(
      config.text,
      'font-black tracking-wide font-mono',
      'drop-shadow-sm',
      'hover:tracking-wider transition-all duration-300',
      getTextClasses(),
      className
    )}>
      STREAMYYY
    </span>
  );
};
