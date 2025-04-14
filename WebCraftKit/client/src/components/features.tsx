import { TextPlaceholder } from "@/components/ui/text-placeholder";

/**
 * Features Component
 * 
 * This component displays a grid of feature cards with icons.
 * Each card highlights a specific product or service feature.
 * 
 * Customization:
 * - Update section title and description
 * - Customize each feature card (icon, title, description)
 * - Add or remove feature cards as needed (copy the card template)
 */
export function Features() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <TextPlaceholder>Powerful Features at Your Fingertips</TextPlaceholder>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            <TextPlaceholder>Everything you need to create a stunning website without any coding experience.</TextPlaceholder>
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          {/* <!-- Copy this feature card to add more --> */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 transition-transform duration-300 hover:transform hover:scale-105">
            <div className="text-primary-500 mb-4">
              <i className="fas fa-paint-brush text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <TextPlaceholder>Customizable Design</TextPlaceholder>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <TextPlaceholder>Change colors, fonts, and layouts with simple edits. No design experience needed.</TextPlaceholder>
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 transition-transform duration-300 hover:transform hover:scale-105">
            <div className="text-primary-500 mb-4">
              <i className="fas fa-mobile-alt text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <TextPlaceholder>Mobile Responsive</TextPlaceholder>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <TextPlaceholder>Your site automatically looks great on phones, tablets, and desktops.</TextPlaceholder>
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 transition-transform duration-300 hover:transform hover:scale-105">
            <div className="text-primary-500 mb-4">
              <i className="fas fa-rocket text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <TextPlaceholder>Fast Performance</TextPlaceholder>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <TextPlaceholder>Optimized code ensures quick loading times and smooth performance.</TextPlaceholder>
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 transition-transform duration-300 hover:transform hover:scale-105">
            <div className="text-primary-500 mb-4">
              <i className="fas fa-search text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <TextPlaceholder>SEO Optimized</TextPlaceholder>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <TextPlaceholder>Built-in SEO features help your site rank higher in search results.</TextPlaceholder>
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 transition-transform duration-300 hover:transform hover:scale-105">
            <div className="text-primary-500 mb-4">
              <i className="fas fa-cog text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <TextPlaceholder>Easy Configuration</TextPlaceholder>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <TextPlaceholder>Simple settings let you enable or disable features with a single line change.</TextPlaceholder>
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 transition-transform duration-300 hover:transform hover:scale-105">
            <div className="text-primary-500 mb-4">
              <i className="fas fa-shield-alt text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <TextPlaceholder>Secure & Reliable</TextPlaceholder>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <TextPlaceholder>Built with security best practices for peace of mind.</TextPlaceholder>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
