import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface StreamyyyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'white' | 'gradient';
  useForHeader?: boolean; // New prop to determine which logo to use
}

const sizeConfig = {
  sm: {
    icon: 'w-6 h-6',
    width: 24,
    height: 24,
    text: 'text-base',
    gap: 'gap-2'
  },
  md: {
    icon: 'w-8 h-8',
    width: 32,
    height: 32,
    text: 'text-lg',
    gap: 'gap-2'
  },
  lg: {
    icon: 'w-12 h-12',
    width: 48,
    height: 48,
    text: 'text-2xl',
    gap: 'gap-3'
  },
  xl: {
    icon: 'w-16 h-16',
    width: 64,
    height: 64,
    text: 'text-3xl',
    gap: 'gap-4'
  }
};

export default function StreamyyyLogo({ 
  size = 'md', 
  showText = true, 
  className = '',
  iconOnly = false,
  variant = 'default',
  useForHeader = false
}: StreamyyyLogoProps) {
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

  // Choose the appropriate logo based on usage
  const logoSrc = useForHeader ? '/streamyyy-logo-header.png' : '/streamyyy-logo-box.png';
  
  const LogoIcon = () => (
    <div className={cn('relative', config.icon)}>
      <Image
        src={logoSrc}
        alt="Streamyyy Logo"
        width={config.width}
        height={config.height}
        className={cn(
          config.icon,
          'object-contain',
          variant === 'white' && 'brightness-0 invert'
        )}
        priority
      />
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
export const StreamyyyIcon = ({ 
  size = 'md', 
  variant = 'default', 
  className = '', 
  useForHeader = false 
}: Pick<StreamyyyLogoProps, 'size' | 'variant' | 'className' | 'useForHeader'>) => (
  <StreamyyyLogo 
    size={size} 
    variant={variant} 
    iconOnly 
    showText={false} 
    className={className}
    useForHeader={useForHeader}
  />
);

export const StreamyyyText = ({ 
  size = 'md', 
  variant = 'default', 
  className = '' 
}: Pick<StreamyyyLogoProps, 'size' | 'variant' | 'className'>) => {
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