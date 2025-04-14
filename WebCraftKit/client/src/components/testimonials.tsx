import { TextPlaceholder } from "@/components/ui/text-placeholder";

/**
 * Testimonials Component
 * 
 * This component displays a grid of client testimonials/reviews.
 * Each card includes a star rating, quote, and client information.
 * 
 * Customization:
 * - Update section title and description
 * - Customize each testimonial (quote, name, title)
 * - Adjust star ratings as needed
 * - Add or remove testimonial cards (copy the card template)
 */
export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <TextPlaceholder>What Our Clients Say</TextPlaceholder>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            <TextPlaceholder>Real feedback from satisfied customers.</TextPlaceholder>
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          {/* <!-- Copy this testimonial card to add more --> */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 relative">
            {/* Quote mark */}
            <div className="absolute top-6 right-8 text-gray-200 dark:text-gray-700">
              <i className="fas fa-quote-right text-4xl"></i>
            </div>
            
            {/* Stars */}
            <div className="flex mb-4">
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
            </div>
            
            {/* Testimonial text */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              <TextPlaceholder>"This template saved me countless hours of development time. I was able to customize it for my business in just a few hours. Highly recommended!"</TextPlaceholder>
            </p>
            
            {/* Client info */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4 flex items-center justify-center text-gray-600">
                <i className="fas fa-user text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white"><TextPlaceholder>John Smith</TextPlaceholder></h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm"><TextPlaceholder>CEO, Company Name</TextPlaceholder></p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 relative">
            <div className="absolute top-6 right-8 text-gray-200 dark:text-gray-700">
              <i className="fas fa-quote-right text-4xl"></i>
            </div>
            <div className="flex mb-4">
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              <TextPlaceholder>"The customer support is incredible. Whenever I had a question, they responded quickly and helped me customize the template perfectly."</TextPlaceholder>
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4 flex items-center justify-center text-gray-600">
                <i className="fas fa-user text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white"><TextPlaceholder>Sarah Johnson</TextPlaceholder></h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm"><TextPlaceholder>Marketing Director, Company Name</TextPlaceholder></p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 relative">
            <div className="absolute top-6 right-8 text-gray-200 dark:text-gray-700">
              <i className="fas fa-quote-right text-4xl"></i>
            </div>
            <div className="flex mb-4">
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star-half-alt text-yellow-400"></i>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              <TextPlaceholder>"As a small business owner with no coding experience, this template was a lifesaver. My website looks professional and gets compliments all the time."</TextPlaceholder>
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4 flex items-center justify-center text-gray-600">
                <i className="fas fa-user text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white"><TextPlaceholder>Michael Rodriguez</TextPlaceholder></h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm"><TextPlaceholder>Owner, Company Name</TextPlaceholder></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
