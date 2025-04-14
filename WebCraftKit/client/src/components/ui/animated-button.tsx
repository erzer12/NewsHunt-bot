import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * AnimatedButton Component
 * 
 * An enhanced button component with micro-interactions:
 * - Ripple effect on click
 * - Hover scale and shadow effects
 * - Loading state animation
 * - Various style variants
 * 
 * Customization:
 * - Modify animation durations and easing functions
 * - Adjust colors, spacing, and sizing
 * - Add or customize variants
 */

// Define button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0.5 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow hover:shadow-md focus-visible:ring-primary-500",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow hover:shadow-md focus-visible:ring-red-500",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 hover:text-gray-900 focus-visible:ring-gray-400",
        secondary: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:ring-gray-400",
        ghost: "bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400",
        link: "bg-transparent text-primary-600 dark:text-primary-400 hover:underline focus-visible:ring-primary-500 p-0 h-auto",
        gradient: "bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700 shadow hover:shadow-md focus-visible:ring-primary-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1 text-xs rounded-md",
        lg: "h-12 px-6 py-3 text-lg rounded-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Define the ripple animation component
const Ripple = ({ x, y, size }: { x: number, y: number, size: number }) => (
  <span 
    className="absolute rounded-full bg-white/30 animate-ripple"
    style={{
      top: y - size / 2,
      left: x - size / 2,
      width: size,
      height: size,
    }}
  />
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number, y: number, size: number, id: number }[]>([]);
    const Comp = asChild ? Slot : "button";

    // Handle click to create ripple effect
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!loading && props.onClick) {
        props.onClick(e);
      }

      // Calculate ripple size and position
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleSize = Math.max(button.clientWidth, button.clientHeight) * 2;
      
      // Add new ripple
      const id = Date.now();
      setRipples([...ripples, { x, y, size: rippleSize, id }]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== id));
      }, 600);
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "opacity-80 cursor-not-allowed",
          "hover:scale-[1.02] transition-transform"
        )}
        ref={ref}
        onClick={handleClick}
        disabled={props.disabled || loading}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <Ripple key={ripple.id} x={ripple.x} y={ripple.y} size={ripple.size} />
        ))}
        
        {/* Loading spinner */}
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, buttonVariants };