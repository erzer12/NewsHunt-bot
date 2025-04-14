import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackToTop } from '@/components/back-to-top';
import { AnimatedButton } from '@/components/ui/animated-button';
import { FunSpinner } from '@/components/ui/fun-spinner';

/**
 * Portfolio/Showcase Page Component
 * 
 * This component displays a grid of portfolio items with filtering capabilities
 * and detailed project modal views.
 * 
 * Customization:
 * - Update portfolio items with your own projects
 * - Modify category filters
 * - Adjust design, colors, and spacing
 */
export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);
  
  // Sample portfolio data
  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: 'Modern E-commerce Platform',
      description: 'A comprehensive e-commerce solution with advanced product filtering, user reviews, and secure payment processing.',
      longDescription: 'This modern e-commerce platform was built to provide a seamless shopping experience. It features advanced product filtering, user reviews, wish lists, and secure payment processing. The responsive design ensures a great experience on all devices, while the admin dashboard provides powerful tools for inventory management and sales analytics. Built with React, Node.js, and MongoDB.',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGVjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
      date: 'January 2024',
      client: 'RetailPlus Inc.',
      link: 'https://example.com/project-1'
    },
    {
      id: 2,
      title: 'Financial Dashboard',
      description: 'Interactive data visualization dashboard for financial analysis, featuring real-time updates and customizable reports.',
      longDescription: 'This financial dashboard provides powerful data visualization tools for financial analysis. It features real-time data updates, interactive charts, customizable reports, and export options. The dashboard helps financial analysts track market trends, analyze investment performance, and make data-driven decisions. Developed with Vue.js, D3.js, and Firebase.',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGFzaGJvYXJkfGVufDB8fDB8fHww',
      technologies: ['Vue.js', 'D3.js', 'Firebase', 'TypeScript'],
      date: 'November 2023',
      client: 'FinTech Solutions',
      link: 'https://example.com/project-2'
    },
    {
      id: 3,
      title: 'Fitness Tracking Mobile App',
      description: 'Cross-platform mobile application for fitness tracking, workout planning, and progress monitoring.',
      longDescription: 'This fitness tracking app helps users achieve their health goals by providing tools for tracking workouts, planning exercise routines, and monitoring progress. Features include customizable workout plans, exercise demonstrations, progress tracking with visual charts, and social sharing capabilities. Built with React Native and Firebase, it delivers a seamless experience across iOS and Android platforms.',
      category: 'mobile',
      image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zml0bmVzcyUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D',
      technologies: ['React Native', 'Firebase', 'Redux', 'HealthKit'],
      date: 'August 2023',
      client: 'FitLife Solutions',
      link: 'https://example.com/project-3'
    },
    {
      id: 4,
      title: 'AI-Powered Content Creation Tool',
      description: 'Machine learning application that generates and optimizes marketing content based on audience preferences.',
      longDescription: 'This AI-powered content creation tool leverages machine learning to help marketers generate and optimize content. The tool analyzes audience preferences, trending topics, and engagement patterns to suggest content ideas and improvements. It features a user-friendly interface, templates for different content types, and analytics to track performance. Built with Python, TensorFlow, and React.',
      category: 'ai',
      image: 'https://images.unsplash.com/photo-1677442135132-181faa065560?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFpJTIwdG9vbHxlbnwwfHwwfHx8MA%3D%3D',
      technologies: ['Python', 'TensorFlow', 'React', 'AWS'],
      date: 'October 2023',
      client: 'ContentGenius Inc.',
      link: 'https://example.com/project-4'
    },
    {
      id: 5,
      title: 'Smart Home Automation System',
      description: 'IoT solution that enables remote control and automation of home devices with voice command integration.',
      longDescription: 'This smart home automation system connects and controls various home devices through a centralized interface. It enables users to automate routines, control devices remotely, and monitor energy usage. The system integrates with popular voice assistants and features machine learning capabilities that adapt to user preferences over time. Developed using Node.js, MQTT, and React Native.',
      category: 'iot',
      image: 'https://images.unsplash.com/photo-1558002038-1055e2dae1b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGlvdHxlbnwwfHwwfHx8MA%3D%3D',
      technologies: ['Node.js', 'MQTT', 'React Native', 'Raspberry Pi'],
      date: 'July 2023',
      client: 'SmartLife Technologies',
      link: 'https://example.com/project-5'
    },
    {
      id: 6,
      title: 'Virtual Reality Training Simulator',
      description: 'Immersive VR training environment for industrial safety procedures with performance tracking.',
      longDescription: 'This virtual reality training simulator creates immersive learning experiences for industrial safety procedures. It features realistic scenarios that allow workers to practice emergency responses and safety protocols in a risk-free environment. The system includes performance tracking, feedback mechanisms, and certification capabilities. Developed using Unity, C#, and Oculus SDK, it provides an effective alternative to traditional training methods.',
      category: 'vr',
      image: 'https://images.unsplash.com/photo-1622979135664-93772ba7b4be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fHww',
      technologies: ['Unity', 'C#', 'Oculus SDK', 'AWS'],
      date: 'December 2023',
      client: 'IndustrySafe Solutions',
      link: 'https://example.com/project-6'
    }
  ];
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'ai', name: 'AI & Machine Learning' },
    { id: 'iot', name: 'IoT Solutions' },
    { id: 'vr', name: 'VR/AR Experiences' }
  ];
  
  // Filter portfolio items based on selected category
  const filteredItems = selectedCategory && selectedCategory !== 'all'
    ? portfolioItems.filter(item => item.category === selectedCategory)
    : portfolioItems;
  
  const handleCategoryChange = (categoryId: string) => {
    setIsLoading(true);
    setSelectedCategory(categoryId);
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  const openProjectModal = (project: PortfolioItem) => {
    setActiveProject(project);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };
  
  const closeProjectModal = () => {
    setActiveProject(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">
                Our Portfolio
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                Explore our latest projects and see how we've helped our clients achieve their goals with innovative solutions.
              </p>
            </div>
          </div>
        </section>
        
        {/* Portfolio Filter */}
        <section className="py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id || (category.id === 'all' && !selectedCategory)
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Portfolio Grid */}
        <section className="py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center my-20">
                <FunSpinner type="orbit" size="lg" variant="primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, index) => (
                  <div 
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fadeIn"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                    onClick={() => openProjectModal(item)}
                  >
                    <div className="aspect-w-16 aspect-h-9 w-full h-48 relative overflow-hidden group cursor-pointer">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          View Project
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 rounded-full">
                          {categories.find(c => c.id === item.category)?.name.replace(' Development', '').replace(' Experiences', '').replace(' Solutions', '').replace(' & Machine Learning', '')}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.slice(0, 3).map((tech, i) => (
                          <span 
                            key={i}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {item.technologies.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
                            +{item.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredItems.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No projects found in this category.
                </p>
                <AnimatedButton
                  onClick={() => handleCategoryChange('all')}
                  className="mt-4"
                  variant="outline"
                >
                  View All Projects
                </AnimatedButton>
              </div>
            )}
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-primary-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                We'd love to hear about your ideas and help you bring them to life. Let's create something amazing together.
              </p>
              <AnimatedButton
                variant="gradient"
                size="lg"
                onClick={() => window.location.href = '/contact'}
              >
                Get in Touch
              </AnimatedButton>
            </div>
          </div>
        </section>
      </main>
      
      {/* Project Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={closeProjectModal}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-50 transition-opacity"></div>
            
            <div 
              className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl transform transition-all animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 z-10"
                onClick={closeProjectModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="w-full h-64 md:h-80 relative">
                <img 
                  src={activeProject.image} 
                  alt={activeProject.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{activeProject.title}</h2>
                  <span className="inline-block px-3 py-1 bg-primary-500 text-white text-sm rounded-full">
                    {categories.find(c => c.id === activeProject.category)?.name}
                  </span>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {activeProject.longDescription}
                    </p>
                    
                    <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {activeProject.technologies.map((tech, i) => (
                        <span 
                          key={i}
                          className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Client</h3>
                      <p className="text-gray-600 dark:text-gray-300">{activeProject.client}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2">Completion Date</h3>
                      <p className="text-gray-600 dark:text-gray-300">{activeProject.date}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2">Project Link</h3>
                      <a 
                        href={activeProject.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Visit Project
                      </a>
                    </div>
                    
                    <AnimatedButton
                      variant="gradient"
                      className="w-full mt-8"
                      onClick={() => {
                        closeProjectModal();
                        window.location.href = '/contact';
                      }}
                    >
                      Discuss a Similar Project
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
      <BackToTop />
    </div>
  );
}

// Portfolio item type definition
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  image: string;
  technologies: string[];
  date: string;
  client: string;
  link: string;
}