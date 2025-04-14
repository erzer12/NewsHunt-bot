import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackToTop } from '@/components/back-to-top';
import { FunSpinner } from '@/components/ui/fun-spinner';
import { AnimatedButton } from '@/components/ui/animated-button';

/**
 * Pricing Page Component
 * 
 * This component displays pricing plans with toggle between monthly/annual billing.
 * Features a comparison table and FAQ section.
 * 
 * Customization:
 * - Update pricing tiers and features
 * - Modify FAQ items
 * - Adjust design, colors, and spacing
 */
export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
  // Sample pricing data
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Essential features for individuals and small projects',
      monthlyPrice: 9,
      annualPrice: 99,
      features: [
        '1 user',
        '5 projects',
        '10GB storage',
        'Basic analytics',
        'Email support'
      ],
      cta: 'Get Started',
      highlight: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Advanced features for professionals and growing teams',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        '5 users',
        'Unlimited projects',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom integrations'
      ],
      cta: 'Try Pro',
      highlight: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Premium features for large organizations',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Unlimited users',
        'Unlimited projects',
        '1TB storage',
        'Premium analytics',
        '24/7 support',
        'Dedicated account manager',
        'Custom development',
        'SLA guarantees'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];
  
  // FAQ data
  const faqItems = [
    {
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you\'ll be billed the prorated amount for the remainder of your billing cycle. When you downgrade, your new rate starts at the beginning of your next billing cycle.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all plans. If you\'re not satisfied with our service during this period, you can request a full refund. After 30 days, refunds are evaluated on a case-by-case basis.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and for annual plans, we can also accept wire transfers and company checks.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial for all our plans. No credit card is required to sign up for the trial. You can upgrade to a paid plan at any time during or after your trial period.'
    },
    {
      question: 'What\'s included in the storage limit?',
      answer: 'The storage limit includes all files, documents, images, and data stored within your account. We don\'t count temporary data or cache files toward your storage limit.'
    }
  ];
  
  const handleSelectPlan = (planId: string) => {
    setLoadingPlan(planId);
    // Simulate loading state
    setTimeout(() => {
      setSelectedPlan(planId);
      setLoadingPlan(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                Choose the perfect plan for your needs. No hidden fees or complex pricing structures.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center mb-12 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <span className={`text-sm mr-2 ${!isAnnual ? 'font-semibold text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  Monthly
                </span>
                <button 
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-14 h-7 flex items-center rounded-full p-1 ${isAnnual ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}
                >
                  <span 
                    className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`}
                  ></span>
                </button>
                <span className={`text-sm ml-2 ${isAnnual ? 'font-semibold text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  Annual <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs py-0.5 px-1.5 rounded-full">Save 20%</span>
                </span>
              </div>
            </div>
            
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={plan.id}
                  className={`relative rounded-2xl overflow-hidden ${
                    plan.highlight 
                      ? 'shadow-xl border-2 border-primary-500 dark:border-primary-400 transform md:-translate-y-4' 
                      : 'shadow-lg border border-gray-200 dark:border-gray-700'
                  } bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl animate-fadeIn`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  {plan.highlight && (
                    <div className="bg-primary-500 text-white py-1 px-3 text-sm text-center font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 h-12">
                      {plan.description}
                    </p>
                    
                    <div className="mb-6">
                      <div className="flex items-end">
                        <span className="text-4xl font-bold">
                          ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2 mb-1">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      </div>
                      {isAnnual && (
                        <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                          ${plan.monthlyPrice * 12 - plan.annualPrice} savings
                        </p>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <AnimatedButton
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-3 ${
                        plan.highlight 
                          ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                      }`}
                      loading={loadingPlan === plan.id}
                      variant={plan.highlight ? 'gradient' : 'outline'}
                    >
                      {plan.cta}
                    </AnimatedButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Feature Comparison */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Find the plan that's right for you and your team.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="py-4 px-6 text-left">Features</th>
                    {pricingPlans.map((plan) => (
                      <th 
                        key={plan.id}
                        className={`py-4 px-6 text-center ${
                          plan.highlight ? 'text-primary-600 dark:text-primary-400' : ''
                        }`}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">Users</td>
                    <td className="py-4 px-6 text-center">1</td>
                    <td className="py-4 px-6 text-center">5</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">Projects</td>
                    <td className="py-4 px-6 text-center">5</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">Storage</td>
                    <td className="py-4 px-6 text-center">10GB</td>
                    <td className="py-4 px-6 text-center">100GB</td>
                    <td className="py-4 px-6 text-center">1TB</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">API Access</td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">Priority Support</td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium">Custom Development</td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="border-b border-gray-200 dark:border-gray-700 pb-6 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <h3 className="text-xl font-medium mb-3">{item.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
                  </div>
                ))}
              </div>
              
              {/* Contact CTA */}
              <div className="mt-12 text-center">
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Still have questions? We're here to help.
                </p>
                <AnimatedButton
                  variant="gradient"
                  size="lg"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Support
                </AnimatedButton>
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