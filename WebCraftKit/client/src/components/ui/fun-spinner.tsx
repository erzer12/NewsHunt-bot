import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Fun Spinner Component
 * 
 * A collection of fun loading spinners with different styles and animations.
 * 
 * Customization:
 * - Choose from various spinner types
 * - Control size and colors
 * - Modify animation speed
 */

export interface FunSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The type of spinner to display
   */
  type?: 'pulse' | 'dots' | 'bounce' | 'orbit' | 'flip' | 'grid' | 'wave';
  
  /**
   * Size of the spinner in pixels
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Color variant of the spinner
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

export function FunSpinner({
  type = 'pulse',
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: FunSpinnerProps) {
  // Size classes mapping
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };
  
  // Color classes for various parts of spinners
  const variantClasses = {
    primary: 'text-primary-500 border-primary-500 bg-primary-100 dark:bg-primary-900/30',
    secondary: 'text-gray-500 border-gray-500 bg-gray-100 dark:bg-gray-800',
    success: 'text-green-500 border-green-500 bg-green-100 dark:bg-green-900/30',
    danger: 'text-red-500 border-red-500 bg-red-100 dark:bg-red-900/30',
    warning: 'text-yellow-500 border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    info: 'text-blue-500 border-blue-500 bg-blue-100 dark:bg-blue-900/30',
  };

  // Render the selected spinner type
  const renderSpinner = () => {
    switch (type) {
      case 'pulse':
        return (
          <div 
            className={cn(
              'relative animate-pulse-subtle rounded-full',
              sizeClasses[size],
              variantClasses[variant],
              className,
            )}
            {...props}
          >
            <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin" />
          </div>
        );
      
      case 'dots':
        return (
          <div 
            className={cn(
              'flex gap-1 items-center justify-center',
              className,
            )}
            {...props}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full',
                  {
                    'h-1 w-1': size === 'xs',
                    'h-2 w-2': size === 'sm',
                    'h-3 w-3': size === 'md',
                    'h-4 w-4': size === 'lg',
                    'h-5 w-5': size === 'xl',
                  },
                  variantClasses[variant].split(' ')[0],
                  'animate-bounce'
                )}
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        );
      
      case 'bounce':
        return (
          <div
            className={cn(
              'rounded-full border-4 border-t-transparent animate-bounce',
              sizeClasses[size],
              variantClasses[variant].split(' ')[1],
              className,
            )}
            {...props}
          />
        );
      
      case 'orbit':
        return (
          <div 
            className={cn(
              'relative',
              sizeClasses[size],
              className,
            )}
            {...props}
          >
            <div className={cn(
              'absolute inset-0 border-2 rounded-full border-current border-t-transparent animate-spin opacity-70',
              variantClasses[variant].split(' ')[0]
            )} />
            <div className={cn(
              'absolute inset-2 border-2 rounded-full border-current border-b-transparent animate-spin opacity-80 [animation-duration:1.5s]',
              variantClasses[variant].split(' ')[0]
            )} />
            <div className={cn(
              'absolute inset-4 border-2 rounded-full border-current border-l-transparent animate-spin opacity-90 [animation-duration:2s]',
              variantClasses[variant].split(' ')[0]
            )} />
          </div>
        );
      
      case 'flip':
        return (
          <div
            className={cn(
              'relative',
              sizeClasses[size],
              className,
            )}
            {...props}
          >
            <div className={cn(
              'absolute inset-0 animate-flip-x border-2 rounded',
              variantClasses[variant].split(' ')[1],
            )} />
            <div className={cn(
              'absolute inset-0 animate-flip-y border-2 rounded delay-500',
              variantClasses[variant].split(' ')[1],
            )} style={{ animationDelay: '250ms' }} />
          </div>
        );
      
      case 'grid':
        return (
          <div className={cn('grid grid-cols-3 gap-1', className)} {...props}>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded',
                  {
                    'h-1 w-1': size === 'xs',
                    'h-2 w-2': size === 'sm',
                    'h-3 w-3': size === 'md',
                    'h-4 w-4': size === 'lg',
                    'h-5 w-5': size === 'xl',
                  },
                  variantClasses[variant].split(' ')[0],
                  'animate-pulse-subtle'
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        );
      
      case 'wave':
        return (
          <div className={cn('flex space-x-1 items-center', className)} {...props}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'animate-wave',
                  {
                    'h-3 w-1': size === 'xs',
                    'h-5 w-1.5': size === 'sm',
                    'h-8 w-2': size === 'md',
                    'h-12 w-2.5': size === 'lg',
                    'h-16 w-3': size === 'xl',
                  },
                  variantClasses[variant].split(' ')[0],
                  'rounded'
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        );
      
      default:
        return (
          <div 
            className={cn(
              'animate-spin rounded-full border-2 border-current border-t-transparent',
              sizeClasses[size],
              variantClasses[variant].split(' ')[0],
              className,
            )}
            {...props}
          />
        );
    }
  };

  return renderSpinner();
}