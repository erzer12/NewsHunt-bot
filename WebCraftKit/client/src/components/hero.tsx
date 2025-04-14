import { TextPlaceholder } from "@/components/ui/text-placeholder";

/**
 * Hero Component
 * 
 * This component is the main banner section at the top of the page.
 * It includes a headline, description, call-to-action buttons, and an image.
 * 
 * Customization:
 * - Replace the headline and description text
 * - Update CTA button text and links
 * - Replace the hero image path in the img tag
 */
export function Hero() {
  return (
    <section className="relative bg-white dark:bg-gray-900 py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              <TextPlaceholder>Welcome to the Future of Web Design</TextPlaceholder>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              <TextPlaceholder>Create stunning, customizable websites with our easy-to-use template. Perfect for businesses, portfolios, and personal sites.</TextPlaceholder>
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <TextPlaceholder>Get Started</TextPlaceholder>
              </a>
              <a href="#" className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <TextPlaceholder>Learn More</TextPlaceholder>
              </a>
            </div>
          </div>
          
          {/* Right Content (Image) */}
          <div className="mt-10 md:mt-0 md:w-1/2">
            <div className="relative">
              {/* Use SVG placeholder instead of image */}
              <div className="rounded-lg shadow-xl w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <TextPlaceholder>Hero Image</TextPlaceholder>
                </div>
              </div>
              {/* Corner accent element */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent-500 opacity-50 rounded-lg hidden md:block"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
