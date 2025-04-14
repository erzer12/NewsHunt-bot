import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactForm } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AnimatedInput } from "@/components/ui/animated-input";
import { AnimatedButton } from "@/components/ui/animated-button";

export default function ContactPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/contact", data);
      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        reset();
        toast({
          title: "Message sent successfully",
          description: "We'll get back to you as soon as possible.",
          variant: "default",
        });
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="flex-grow">
        {/* Contact Hero Section */}
        <section className="bg-white dark:bg-gray-900 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Have questions or need assistance? We're here to help!
              </p>
              <div className="h-1 w-20 bg-primary-500 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Contact Information */}
              <div className="md:w-1/3">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-1">{config.contactEmail}</p>
                      <p className="text-sm text-gray-500">For general inquiries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-1">{config.phone}</p>
                      <p className="text-sm text-gray-500">Mon-Fri from 9am to 5pm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300">{config.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    {Object.entries(config.socialLinks).map(([platform, url], index) => (
                      <a 
                        key={`social-${index}`}
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 p-2 rounded-full shadow-sm"
                      >
                        {platform === 'facebook' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                          </svg>
                        )}
                        {platform === 'twitter' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        )}
                        {platform === 'instagram' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        )}
                        {platform === 'linkedin' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                          </svg>
                        )}
                        {platform === 'youtube' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="md:w-2/3">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                  
                  {submitted ? (
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg mb-6">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>Your message has been sent successfully! We'll get back to you soon.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="animate-fadeIn" style={{ animationDelay: '0ms' }}>
                          <AnimatedInput
                            id="name"
                            label="Full Name"
                            error={errors.name?.message}
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            }
                            {...register("name")}
                          />
                        </div>
                        
                        {/* Email Field */}
                        <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
                          <AnimatedInput
                            id="email"
                            type="email"
                            label="Email Address"
                            error={errors.email?.message}
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            }
                            {...register("email")}
                          />
                        </div>
                      </div>
                      
                      {/* Subject Field */}
                      <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                        <AnimatedInput
                          id="subject"
                          label="Subject"
                          icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          }
                          {...register("subject")}
                        />
                      </div>
                      
                      {/* Message Field */}
                      <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
                        <div className={`relative rounded-md border ${
                            errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } overflow-hidden transition-all duration-200 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:shadow-[0_0_0_1px] focus-within:shadow-primary-500/30 bg-white dark:bg-gray-800`}>
                          
                          {/* Icon */}
                          <div className="absolute top-3 left-3 text-gray-400 transition-colors duration-200 focus-within:text-primary-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          
                          {/* Label */}
                          <div className="pl-10 pt-2 text-xs font-medium text-primary-500 dark:text-primary-400">
                            Message <span className="text-red-500">*</span>
                          </div>
                          
                          <textarea 
                            id="message" 
                            {...register("message")}
                            rows={5} 
                            className="w-full pl-10 pr-4 pt-6 pb-3 bg-transparent text-gray-900 dark:text-white focus:outline-none transition-all"
                            placeholder="Your message here..."
                          ></textarea>
                        </div>
                        {errors.message && (
                          <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.message.message}</p>
                        )}
                      </div>
                      
                      {/* Submit Button */}
                      <div className="flex justify-end animate-fadeIn" style={{ animationDelay: '400ms' }}>
                        <AnimatedButton
                          type="submit"
                          disabled={submitting}
                          loading={submitting}
                          size="lg"
                          variant="gradient"
                        >
                          {submitting ? "Sending..." : "Send Message"}
                        </AnimatedButton>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Visit Us</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Our office is located in the heart of the city.
              </p>
            </div>
            
            <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg shadow-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="sr-only">Map placeholder</span>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Find answers to common questions about our services.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
              {/* FAQ Item 1 */}
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2">How long does it take to build a website?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The timeline depends on the complexity of your project. A simple website can be completed in 2-3 weeks, while more complex sites may take 1-2 months or more.
                </p>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2">Do you offer website maintenance services?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, we offer ongoing maintenance and support packages to keep your website up-to-date, secure, and functioning optimally.
                </p>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2">Can you help with search engine optimization (SEO)?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Absolutely! All our websites are built with SEO best practices in mind, and we offer additional SEO services to improve your search engine rankings.
                </p>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2">Do you offer e-commerce solutions?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, we can build custom e-commerce websites with features like product catalogs, shopping carts, secure payment processing, and order management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}