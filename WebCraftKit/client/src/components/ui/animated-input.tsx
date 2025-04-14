import React, { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * AnimatedInput Component
 * 
 * An enhanced input component with micro-interactions:
 * - Label floats when input is focused or has content
 * - Highlight animation when focused
 * - Subtle scale effect when interacting
 * - Error state styling
 * 
 * Customization:
 * - Modify animation durations and easing functions
 * - Adjust colors, spacing, and sizing
 * - Change the focus animation style
 */
export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    
    // Check if input has content
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasContent(e.target.value.length > 0);
      if (props.onChange) props.onChange(e);
    };

    // Handling focus and blur
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (props.onBlur) props.onBlur(e);
    };

    return (
      <div className="relative">
        <div
          className={cn(
            "relative rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden transition-all duration-200 bg-white dark:bg-gray-800",
            isFocused && "border-primary-500 dark:border-primary-400 shadow-[0_0_0_1px] shadow-primary-500/30",
            error && "border-red-500 dark:border-red-500",
            isFocused && "scale-[1.01]",
            className
          )}
        >
          {/* Background animation for focus state */}
          <div 
            className={cn(
              "absolute inset-0 bg-primary-50 dark:bg-primary-900/20 opacity-0 transition-opacity duration-300 ease-out",
              isFocused && "opacity-100"
            )} 
          />
          
          {/* Input with label */}
          <div className="relative flex items-center">
            {icon && (
              <div className={cn(
                "ml-3 text-gray-400 transition-colors duration-200",
                isFocused && "text-primary-500 dark:text-primary-400"
              )}>
                {icon}
              </div>
            )}
            
            <input
              className={cn(
                "w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-transparent focus:outline-none relative z-10 transition-all",
                icon && "pl-2"
              )}
              placeholder={label}
              ref={ref}
              {...props}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            
            {/* Floating label */}
            <label
              className={cn(
                "absolute left-4 text-gray-500 dark:text-gray-400 origin-0 transition-all duration-200 ease-out pointer-events-none",
                icon && "left-10",
                (isFocused || hasContent || props.value) ? 
                  "transform -translate-y-3 scale-75 text-xs top-2 text-primary-500 dark:text-primary-400" : 
                  "transform translate-y-0 top-1/2 -translate-y-1/2"
              )}
            >
              {label}
            </label>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm mt-1 animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };