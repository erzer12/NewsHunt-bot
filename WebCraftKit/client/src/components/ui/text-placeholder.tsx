import { ReactNode } from "react";

type TextPlaceholderProps = {
  children: ReactNode;
  className?: string;
};

/**
 * TextPlaceholder Component
 * 
 * This component wraps content in a span element with special styling
 * to indicate that the text is customizable.
 * 
 * Usage:
 * <TextPlaceholder>Your customizable text here</TextPlaceholder>
 * 
 * Customization:
 * - Find all TextPlaceholder components in the code
 * - Replace the content within them with your own text
 * - You can remove the TextPlaceholder wrapper once you're done customizing
 */
export function TextPlaceholder({ children, className = "" }: TextPlaceholderProps) {
  return (
    <span className={`inline-block border-b border-dashed border-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-all duration-200 ${className}`} title="Customizable text - replace with your content">
      {children}
    </span>
  );
}
