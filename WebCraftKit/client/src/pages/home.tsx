import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Slider } from "@/components/slider";
import { Testimonials } from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";

/**
 * Home Page Component
 * 
 * This component composes the main homepage layout using modular sections.
 * Each section can be customized, reordered, or removed as needed.
 * 
 * CUSTOMIZATION OPTIONS:
 * 1. Reorder sections by moving components around in the JSX
 * 2. Remove sections by deleting them or commenting them out
 * 3. Enable/disable optional sections in the config.ts file
 * 
 * DEVELOPER NOTES:
 * - To add a new section, import its component at the top and add it to the JSX below
 * - To create a multi-page site, add new pages in the client/src/pages folder
 *   and update the routes in App.tsx
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header Section - Navigation & Branding */}
      <Header />

      <main>
        {/* Hero Section - Main headline, description, and CTA */}
        <Hero />

        {/* Features Section - Highlight key product/service benefits */}
        <Features />

        {/* Image Slider Section - Showcase portfolio or products */}
        {config.features.imageSlider && <Slider />}

        {/* Testimonials Section - Client reviews and feedback */}
        {config.features.testimonials && <Testimonials />}

        {/* Contact Form Section - Allow visitors to reach out */}
        {config.features.contactForm && <ContactForm />}
      </main>

      {/* Footer Section - Site links and contact info */}
      <Footer />
    </div>
  );
}
