import { useState } from "react";
import { TextPlaceholder } from "@/components/ui/text-placeholder";

/**
 * ContactForm Component
 * 
 * This component renders a contact form with validation.
 * It includes fields for name, email, subject, and message.
 * 
 * Customization:
 * - Update section title and description
 * - Modify form field labels and placeholders
 * - Adjust validation rules if needed
 * - Customize success and error messages
 */
export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hide previous messages
    setShowSuccess(false);
    setShowError(false);
    
    // Validate form
    if (validateForm()) {
      // Simulate form submission
      // In a real application, you would send the data to a server here
      console.log("Form submitted:", formData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }
  };
  
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <TextPlaceholder>Get In Touch</TextPlaceholder>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              <TextPlaceholder>Have questions? Fill out the form below and we'll get back to you shortly.</TextPlaceholder>
            </p>
          </div>
          
          {/* Contact Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <TextPlaceholder>Full Name</TextPlaceholder> <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <TextPlaceholder>Email Address</TextPlaceholder> <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            
            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <TextPlaceholder>Subject</TextPlaceholder>
              </label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors"
                placeholder="How can we help?"
              />
            </div>
            
            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <TextPlaceholder>Message</TextPlaceholder> <span className="text-red-500">*</span>
              </label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors`}
                placeholder="Your message here..."
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                <TextPlaceholder>Send Message</TextPlaceholder>
              </button>
            </div>
            
            {/* Form Success Message */}
            {showSuccess && (
              <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-3"></i>
                  <p><TextPlaceholder>Your message has been sent successfully! We'll get back to you soon.</TextPlaceholder></p>
                </div>
              </div>
            )}
            
            {/* Form Error Message */}
            {showError && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                  <p><TextPlaceholder>There was an error sending your message. Please try again.</TextPlaceholder></p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
