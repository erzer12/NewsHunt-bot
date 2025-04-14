import { useState, useEffect, useRef } from "react";
import { TextPlaceholder } from "@/components/ui/text-placeholder";

/**
 * Image Slider Component
 * 
 * This component creates an interactive image carousel/slider.
 * It includes navigation buttons, indicators, and auto-play functionality.
 * 
 * Customization:
 * - Update section title and description
 * - Replace slide content (image URLs, titles, descriptions)
 * - Add or remove slides as needed
 * - Adjust the autoplay timing in the interval
 */
export function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = 3; // Update this if you add/remove slides

  // Handle slide navigation
  const goToSlide = (index: number) => {
    let newIndex = index;
    if (newIndex < 0) newIndex = totalSlides - 1;
    if (newIndex >= totalSlides) newIndex = 0;
    
    setCurrentSlide(newIndex);
  };

  // Setup auto-advance interval
  useEffect(() => {
    // Start the interval
    intervalRef.current = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
    
    // Clear interval on component unmount or when current slide changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSlide]);

  // Reset interval when user interacts with slider
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 5000);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <TextPlaceholder>Our Portfolio</TextPlaceholder>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            <TextPlaceholder>View our latest projects and case studies.</TextPlaceholder>
          </p>
        </div>
        
        {/* Image Slider */}
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-lg shadow-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1 */}
              <div className="min-w-full relative">
                {/* SVG placeholder instead of image */}
                <div className="w-full h-auto md:h-[450px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <TextPlaceholder>Project 1</TextPlaceholder>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold"><TextPlaceholder>Project Title 1</TextPlaceholder></h3>
                  <p className="text-gray-200"><TextPlaceholder>Short project description goes here</TextPlaceholder></p>
                </div>
              </div>
              
              {/* Slide 2 */}
              <div className="min-w-full relative">
                <div className="w-full h-auto md:h-[450px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <TextPlaceholder>Project 2</TextPlaceholder>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold"><TextPlaceholder>Project Title 2</TextPlaceholder></h3>
                  <p className="text-gray-200"><TextPlaceholder>Short project description goes here</TextPlaceholder></p>
                </div>
              </div>
              
              {/* Slide 3 */}
              <div className="min-w-full relative">
                <div className="w-full h-auto md:h-[450px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <TextPlaceholder>Project 3</TextPlaceholder>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold"><TextPlaceholder>Project Title 3</TextPlaceholder></h3>
                  <p className="text-gray-200"><TextPlaceholder>Short project description goes here</TextPlaceholder></p>
                </div>
              </div>
            </div>
            
            {/* Slider Controls */}
            <button 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-gray-800 flex items-center justify-center shadow-md hover:bg-white focus:outline-none"
              onClick={() => {
                goToSlide(currentSlide - 1);
                resetInterval();
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-gray-800 flex items-center justify-center shadow-md hover:bg-white focus:outline-none"
              onClick={() => {
                goToSlide(currentSlide + 1);
                resetInterval();
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            
            {/* Slider Indicators */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button 
                  key={index}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/60'}`}
                  onClick={() => {
                    goToSlide(index);
                    resetInterval();
                  }}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
