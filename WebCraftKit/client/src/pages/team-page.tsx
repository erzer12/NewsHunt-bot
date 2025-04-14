import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackToTop } from '@/components/back-to-top';
import { FunSpinner } from '@/components/ui/fun-spinner';

/**
 * Team/About Page Component
 * 
 * This component showcases team members, company values, and mission/vision.
 * Features animated sections and interactive team member cards.
 * 
 * Customization:
 * - Update team members with your own team information
 * - Modify company values, mission, and vision
 * - Adjust design, colors, and spacing
 */
export default function TeamPage() {
  const [loadingMember, setLoadingMember] = useState<number | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [activeSpinnerType, setActiveSpinnerType] = useState<string>('pulse');
  
  // Company founding year for dynamic age calculation
  const foundingYear = 2015;
  const currentYear = new Date().getFullYear();
  const companyAge = currentYear - foundingYear;
  
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'Founder & CEO',
      bio: 'Alex founded the company with a vision to create innovative digital solutions that make a difference. With over 15 years of experience in technology and business development, they bring strategic leadership and technical expertise to the team.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 2,
      name: 'Jamie Rivera',
      role: 'Lead Developer',
      bio: 'Jamie oversees all technical development, ensuring that our solutions are built with the highest standards of quality and performance. Their expertise in software architecture and emerging technologies drives our innovation roadmap.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 3,
      name: 'Morgan Chen',
      role: 'UX/UI Designer',
      bio: 'Morgan brings creativity and user-centered thinking to all our projects. Their talent for designing intuitive and visually compelling interfaces ensures that our solutions are not just functional but also delightful to use.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDB8fDB8fHww',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 4,
      name: 'Taylor Wilson',
      role: 'Product Manager',
      bio: 'Taylor ensures that our products meet market needs and exceed client expectations. Their strategic thinking and ability to balance technical constraints with business objectives help us deliver solutions that truly add value.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 5,
      name: 'Jordan Patel',
      role: 'Marketing Director',
      bio: 'Jordan leads our marketing and communications efforts, helping us connect with our audience and share our vision. Their expertise in digital marketing and brand storytelling amplifies our presence in the market.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDB8fDB8fHww',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 6,
      name: 'Casey Rodriguez',
      role: 'Customer Success Manager',
      bio: 'Casey ensures that our clients receive exceptional support and achieve their desired outcomes with our solutions. Their dedication to client satisfaction and problem-solving abilities make them an invaluable part of our team.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDB8fDB8fHww',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    }
  ];
  
  // Company values
  const companyValues = [
    {
      id: 1,
      title: 'Innovation',
      description: 'We constantly explore new technologies and approaches to solve complex problems in creative ways.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Quality',
      description: 'We are committed to excellence in everything we do, from code to design to client interactions.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Collaboration',
      description: 'We believe in the power of diverse perspectives and work together to create solutions greater than the sum of their parts.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Adaptability',
      description: 'We embrace change and continuously evolve our skills and practices to stay ahead in a rapidly changing world.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];
  
  // Function to simulate loading state when clicking on team members
  const handleMemberClick = (memberId: number) => {
    setLoadingMember(memberId);
    
    // Cycle through spinner types for fun
    const spinnerTypes = ['pulse', 'dots', 'bounce', 'orbit', 'flip', 'grid', 'wave'];
    const currentIndex = spinnerTypes.indexOf(activeSpinnerType);
    const nextIndex = (currentIndex + 1) % spinnerTypes.length;
    setActiveSpinnerType(spinnerTypes[nextIndex]);
    
    // Simulate loading state
    setTimeout(() => {
      setLoadingMember(null);
      // In a real app, you might navigate to a team member detail page or open a modal
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-300 dark:bg-primary-800 rounded-full opacity-20 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">
                Our Team
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                Meet the passionate people behind our success. We're a diverse team of experts dedicated to delivering exceptional solutions.
              </p>
            </div>
          </div>
        </section>
        
        {/* About Us Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Founded in {foundingYear}, our company has been at the forefront of digital innovation for {companyAge} years. What began as a small team with big ideas has grown into a dynamic organization that continues to push boundaries and set new standards in our industry.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Throughout our journey, we've maintained our commitment to excellence, embracing new technologies and methodologies while staying true to our core values. Our team's diverse expertise and shared passion for innovation have been the driving forces behind our continued growth and success.
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-primary-600 dark:text-primary-400">{companyAge}+</span>
                    <span className="text-gray-600 dark:text-gray-300">Years of Experience</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-primary-600 dark:text-primary-400">200+</span>
                    <span className="text-gray-600 dark:text-gray-300">Projects Completed</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-primary-600 dark:text-primary-400">40+</span>
                    <span className="text-gray-600 dark:text-gray-300">Team Members</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <span className="block text-3xl font-bold text-primary-600 dark:text-primary-400">15+</span>
                    <span className="text-gray-600 dark:text-gray-300">Countries Served</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-96 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <div className="absolute inset-0 flex justify-center items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRlYW0lMjBtZWV0aW5nfGVufDB8fDB8fHww" 
                    alt="Team meeting" 
                    className="w-3/4 h-3/4 object-cover rounded-lg shadow-xl transform -rotate-2"
                  />
                </div>
                <div className="absolute inset-0 flex justify-center items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHRlYW0lMjBjb2RpbmclMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D" 
                    alt="Office environment" 
                    className="w-3/4 h-3/4 object-cover rounded-lg shadow-xl transform rotate-3 translate-x-16 translate-y-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <div className="mb-4 text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our mission is to empower businesses through innovative digital solutions that solve real-world problems. We strive to create technology that makes a difference, helping our clients achieve their goals while contributing to a more efficient, connected, and sustainable future.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <div className="mb-4 text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We envision a world where technology enhances human potential, making life better, work smarter, and connections stronger. We aim to be at the forefront of this transformation, recognized globally as leaders in creating digital solutions that are as human-centered as they are technologically advanced.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Company Values Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fadeIn" style={{ animationDelay: '600ms' }}>
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-gray-600 dark:text-gray-300">
                These core principles guide everything we do, from how we develop our products to how we interact with our clients and each other.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyValues.map((value, index) => (
                <div 
                  key={value.id}
                  className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-all duration-300 transform ${
                    hoveredValue === value.id ? 'scale-105 shadow-lg' : ''
                  } animate-fadeIn cursor-pointer`}
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                  onMouseEnter={() => setHoveredValue(value.id)}
                  onMouseLeave={() => setHoveredValue(null)}
                >
                  <div className={`text-primary-600 dark:text-primary-400 transition-transform duration-300 ${
                    hoveredValue === value.id ? 'scale-110' : ''
                  }`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mt-4 mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Members Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our diverse team of experts brings a wealth of knowledge and experience to every project.
              </p>
              
              <div className="flex justify-center space-x-2 mb-8">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="text-sm mb-2">Current Spinner:</div>
                  <div className="flex justify-center items-center">
                    <FunSpinner type={activeSpinnerType as any} size="md" variant="primary" />
                  </div>
                  <div className="text-xs text-center mt-2 text-primary-600 dark:text-primary-400 font-semibold">
                    {activeSpinnerType}
                  </div>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="text-sm mb-2">Click any team member to cycle spinners!</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={member.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fadeIn cursor-pointer"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                  onClick={() => handleMemberClick(member.id)}
                >
                  <div className="relative">
                    <div className="aspect-w-4 aspect-h-3">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {loadingMember === member.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <FunSpinner type={activeSpinnerType as any} size="lg" variant="primary" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {member.bio}
                    </p>
                    
                    <div className="flex space-x-4">
                      <a 
                        href={member.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a 
                        href={member.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </a>
                      <a 
                        href={member.socialLinks.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Join Us CTA */}
        <section className="py-16 bg-primary-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                We're always looking for talented people to join our team. Check out our open positions and become part of our story.
              </p>
              <div className="inline-block relative group">
                <a 
                  href="/careers" 
                  className="inline-block py-3 px-8 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transition-all duration-300 relative z-10"
                >
                  View Open Positions
                </a>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg blur opacity-50 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
}