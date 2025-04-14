import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";

export default function ServicesPage() {
  const services = config.pages.services;

  // Service icon components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'design':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'code':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'shopping':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'search':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="flex-grow">
        {/* Services Hero Section */}
        <section className="bg-white dark:bg-gray-900 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                We offer professional web development services to help your business succeed online.
              </p>
              <div className="h-1 w-20 bg-primary-500 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Main Services List */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {services.map((service, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 flex">
                  <div className="mr-6">
                    {getIcon(service.icon)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* How We Work Section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">How We Work</h2>
              
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                    <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      1
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">Discovery & Planning</h3>
                    <p className="text-gray-600 dark:text-gray-300">We begin by understanding your business, goals, and target audience. Together, we'll define the scope and requirements of your project.</p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                    <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      2
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">Design & Development</h3>
                    <p className="text-gray-600 dark:text-gray-300">Our team creates a custom design based on your requirements and builds a responsive, user-friendly website with modern technologies.</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                    <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      3
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">Testing & Deployment</h3>
                    <p className="text-gray-600 dark:text-gray-300">We thoroughly test your website across devices and browsers to ensure a perfect experience for all users before launching.</p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                    <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      4
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
                    <p className="text-gray-600 dark:text-gray-300">Our relationship doesn't end at launch. We provide maintenance, updates, and support to ensure your website continues to perform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Choose the perfect plan for your business needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-2">Basic</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$499</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">/ one-time</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">Perfect for small businesses just getting started.</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>5-page responsive website</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Contact form</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Mobile responsive design</span>
                    </li>
                    <li className="flex items-center text-gray-500">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>E-commerce functionality</span>
                    </li>
                    <li className="flex items-center text-gray-500">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Custom animations</span>
                    </li>
                  </ul>
                  <a href="/contact" className="mt-8 block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium text-center rounded-lg">
                    Get Started
                  </a>
                </div>
              </div>
              
              {/* Professional Plan */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border-2 border-primary-500 dark:border-primary-400 transform scale-105 z-10 overflow-hidden">
                <div className="bg-primary-500 text-white text-center py-2 text-sm font-bold uppercase">
                  Most Popular
                </div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-2">Professional</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$999</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">/ one-time</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">Ideal for growing businesses that need more features.</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>10-page responsive website</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Advanced contact forms</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Mobile responsive design</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Basic animations</span>
                    </li>
                    <li className="flex items-center text-gray-500">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>E-commerce functionality</span>
                    </li>
                  </ul>
                  <a href="/contact" className="mt-8 block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium text-center rounded-lg">
                    Get Started
                  </a>
                </div>
              </div>
              
              {/* Enterprise Plan */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$1,999</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">/ one-time</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">Complete solution for established businesses with complex needs.</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited pages</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Custom forms & workflows</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Mobile responsive design</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Custom animations</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>E-commerce functionality</span>
                    </li>
                  </ul>
                  <a href="/contact" className="mt-8 block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium text-center rounded-lg">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="mb-8 text-primary-100">
                Contact us today to discuss your project and how we can help bring your vision to life.
              </p>
              <a href="/contact" className="inline-block py-3 px-6 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}