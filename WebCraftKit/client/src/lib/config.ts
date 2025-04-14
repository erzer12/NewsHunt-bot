/**
 * Website Configuration File
 * 
 * This is the central place to customize your website settings.
 * Simply edit the values below to personalize the site to your needs.
 * 
 * QUICK START GUIDE:
 * 1. Replace all placeholder text (like "Your Company" and "contact@email.com")
 * 2. Enable/disable features by changing true/false values
 * 3. Update social media links with your actual profiles
 * 4. Add any custom settings you need at the bottom of this file
 * 
 * TIP: After making changes, save the file and the website will automatically update.
 */

export const config = {
  // ===== BASIC INFORMATION =====
  // Replace these with your actual information
  companyName: "DynamicWeb",  // Your business or website name
  tagline: "Creating stunning websites with ease", // Short slogan/tagline
  
  // ===== CONTACT DETAILS =====
  contactEmail: "contact@dynamicweb.com", // Your contact email address
  phone: "+1 (555) 123-4567",        // Your contact phone number
  address: "123 Main Street, San Francisco, CA 94105", // Your business address
  
  // ===== FEATURE TOGGLES =====
  // Set to true to enable, false to disable various features
  features: {
    darkMode: true,        // Enable dark/light mode toggle
    imageSlider: true,     // Show portfolio/image slider section
    testimonials: true,    // Show testimonials/reviews section
    contactForm: true,     // Show contact form section
    authentication: true,  // Enable user authentication
    dashboard: true,       // Enable user dashboard
    blog: true,            // Enable blog section
    newsletter: true       // Enable newsletter signup
  },
  
  // ===== NAVIGATION =====
  // Customize your navigation menu items
  navigation: [
    { text: "Home", url: "/", active: true },
    { text: "About", url: "/about", active: true },
    { text: "Services", url: "/services", active: true },
    { text: "Team", url: "/team", active: true },
    { text: "Portfolio", url: "/portfolio", active: true },
    { text: "Pricing", url: "/pricing", active: true },
    { text: "Contact", url: "/contact", active: true }
  ],
  
  // ===== AUTHENTICATION URLS =====
  // Authentication related paths
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/api/logout",
    dashboard: "/dashboard",
    profile: "/dashboard/profile"
  },
  
  // ===== SOCIAL MEDIA =====
  // Update with your actual social media profile URLs
  socialLinks: {
    facebook: "https://facebook.com/dynamicweb",
    twitter: "https://twitter.com/dynamicweb",
    instagram: "https://instagram.com/dynamicweb",
    linkedin: "https://linkedin.com/company/dynamicweb",
    youtube: "https://youtube.com/c/dynamicweb",
  },
  
  // ===== STYLING OPTIONS =====
  // Customize appearance (these will override theme.json settings)
  styling: {
    // Primary color (hex, rgb, or color name) - leave empty to use theme.json
    primaryColor: "#3b82f6", // Blue
    // Secondary accent color - leave empty to use default
    accentColor: "#10b981",  // Green
    // Font family for headings - leave empty to use default
    headingFont: "Poppins, sans-serif",  
    // Font family for body text - leave empty to use default
    bodyFont: "Inter, sans-serif"      
  },
  
  // ===== PAGES CONFIGURATION =====
  // Settings for different pages
  pages: {
    home: {
      heroTitle: "Your Vision, Our Expertise",
      heroSubtitle: "Creating beautiful, functional websites that drive results and elevate your brand.",
      ctaPrimary: "Get Started",
      ctaSecondary: "Learn More"
    },
    about: {
      title: "About Us",
      subtitle: "Our story and mission",
      teamMembers: [
        {
          name: "Jane Doe",
          role: "CEO & Founder",
          image: "/team-member-1.jpg",
          bio: "With over 15 years of experience in web development and design."
        },
        {
          name: "John Smith",
          role: "Creative Director",
          image: "/team-member-2.jpg",
          bio: "Award-winning designer with a passion for user experience."
        }
      ]
    },
    services: [
      {
        title: "Web Design",
        description: "Custom website design tailored to your brand and business goals.",
        icon: "design"
      },
      {
        title: "Web Development",
        description: "Fast, responsive, and accessible websites built with modern technologies.",
        icon: "code"
      },
      {
        title: "E-Commerce",
        description: "Online stores that drive sales and provide excellent customer experience.",
        icon: "shopping"
      },
      {
        title: "SEO Services",
        description: "Improve your search engine rankings and drive more traffic to your site.",
        icon: "search"
      }
    ],
    blog: {
      postsPerPage: 6,
      featuredCategories: ["Web Design", "Development", "Business"]
    }
  },
  
  // ===== FOOTER LINKS =====
  // Additional link sections for the footer
  footerLinks: {
    resources: [
      { text: "Documentation", url: "/resources/docs" },
      { text: "Tutorials", url: "/resources/tutorials" },
      { text: "Blog", url: "/blog" },
      { text: "Support", url: "/support" }
    ],
    legal: [
      { text: "Privacy Policy", url: "/legal/privacy" },
      { text: "Terms of Service", url: "/legal/terms" },
      { text: "Cookie Policy", url: "/legal/cookies" }
    ]
  }
};
