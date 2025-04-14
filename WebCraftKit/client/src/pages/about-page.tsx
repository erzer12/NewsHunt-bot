import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";

export default function AboutPage() {
  const { title, subtitle, teamMembers } = config.pages.about;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="flex-grow">
        {/* About Hero Section */}
        <section className="bg-white dark:bg-gray-900 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {subtitle}
              </p>
              <div className="h-1 w-20 bg-primary-500 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Company Story Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  DynamicWeb was founded in 2020 with a mission to simplify web development 
                  for businesses of all sizes. We believe that a great website should be 
                  both beautiful and functional, while being easy to customize and maintain.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our team of experienced developers and designers work together to create 
                  templates and tools that make web development accessible to everyone, 
                  from small business owners to professional developers.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  We're passionate about helping businesses succeed online through 
                  effective web presence and digital strategy.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-xl h-80 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="sr-only">Office building illustration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-gray-600 dark:text-gray-300">
                The principles that guide our work and relationships.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We never compromise on quality. Every template and component is thoroughly tested and optimized.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We embrace new technologies and approaches to provide cutting-edge solutions.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe the web should be accessible to everyone, regardless of their abilities or devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Meet the people behind DynamicWeb.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-200 dark:bg-gray-700 h-60 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="sr-only">{member.name} photo</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-3">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
                  </div>
                </div>
              ))}
              
              {/* Additional team member */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-200 dark:bg-gray-700 h-60 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="sr-only">Team member photo</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">David Lee</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-3">Technical Lead</p>
                  <p className="text-gray-600 dark:text-gray-300">Specialized in web performance optimization and modern JavaScript frameworks.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}