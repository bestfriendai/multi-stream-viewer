import Image from 'next/image';
import { cn } from '@/lib/utils';

interface StreamyyyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'white' | 'gradient';
  useForHeader?: boolean; // New prop to determine which logo to use
}

const sizeConfig = {
  sm: {
    icon: 'w-6 h-6 sm:w-8 sm:h-8',
    headerIcon: 'w-12 h-3 sm:w-16 sm:h-4', // Responsive 4:1 aspect ratio for header logo
    width: 24,
    height: 24,
    headerWidth: 48,
    headerHeight: 12,
    text: 'text-responsive-sm',
    gap: 'gap-2'
  },
  md: {
    icon: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12',
    headerIcon: 'w-16 h-4 sm:w-20 sm:h-5 md:w-24 md:h-6', // Responsive 4:1 aspect ratio
    width: 32,
    height: 32,
    headerWidth: 64,
    headerHeight: 16,
    text: 'text-responsive-base',
    gap: 'gap-2 sm:gap-3'
  },
  lg: {
    icon: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
    headerIcon: 'w-24 h-6 sm:w-28 sm:h-7 md:w-32 md:h-8', // Responsive 4:1 aspect ratio
    width: 48,
    height: 48,
    headerWidth: 128,
    headerHeight: 32,
    text: 'text-responsive-lg',
    gap: 'gap-2 sm:gap-3 md:gap-4'
  },
  xl: {
    icon: 'w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20',
    headerIcon: 'w-28 h-7 sm:w-32 sm:h-8 md:w-36 md:h-9 lg:w-40 lg:h-10', // Responsive 4:1 aspect ratio
    width: 64,
    height: 64,
    headerWidth: 160,
    headerHeight: 40,
    text: 'text-responsive-xl',
    gap: 'gap-2 sm:gap-3 md:gap-4'
  },
  '2xl': {
    icon: 'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24',
    headerIcon: 'w-32 h-8 sm:w-36 sm:h-9 md:w-40 md:h-10 lg:w-48 lg:h-12', // Responsive 4:1 aspect ratio
    width: 80,
    height: 80,
    headerWidth: 192,
    headerHeight: 48,
    text: 'text-responsive-2xl',
    gap: 'gap-2 sm:gap-3 md:gap-4 lg:gap-5'
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

  const LogoIcon = () => {
    const iconClasses = useForHeader ? config.headerIcon : config.icon;
    const imageWidth = useForHeader ? config.headerWidth : config.width;
    const imageHeight = useForHeader ? config.headerHeight : config.height;

    return (
      <div className={cn('relative', iconClasses)}>
        <Image
          src={logoSrc}
          alt="Streamyyy Logo"
          width={imageWidth}
          height={imageHeight}
          className={cn(
            iconClasses,
            'object-contain',
            variant === 'white' && 'brightness-0 invert'
          )}
          priority
        />
      </div>
    );
  };

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
          'text-wrap-responsive',
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