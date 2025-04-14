# Website Template Customization Guide

Welcome to your new website template! This guide will help you customize the template to meet your specific needs. The template has been designed with easy customization in mind, with clear comments and documentation throughout the code.

## 🚀 Quick Start

1. **Configure basic information**: Edit `client/src/lib/config.ts` to update your company info, contact details, and basic site settings.
2. **Customize colors and style**: Edit `theme.json` to change the primary color scheme and overall appearance.
3. **Start the application**: Run the "Start application" workflow to preview your changes.

## 📁 File Structure

The main files you'll want to edit are:

- `client/src/lib/config.ts` - Central configuration file for site settings
- `client/src/components/` - Individual components (header, footer, etc.)
- `client/src/pages/` - Page layouts and content
- `theme.json` - Color scheme and theme settings

## ✏️ How to Customize Content

### Basic Configuration

The `config.ts` file is the main place to customize your site. It contains:

```typescript
export const config = {
  // Company/Brand Information
  companyName: "Your Company",
  tagline: "Creating stunning websites with ease",
  
  // Contact Information
  contactEmail: "contact@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, City, Country",
  
  // Feature Toggles
  features: {
    darkMode: true,        // Enable dark/light mode toggle
    imageSlider: true,     // Show portfolio/image slider section
    testimonials: true,    // Show testimonials/reviews section
    contactForm: true      // Show contact form section
  },
  
  // Navigation menu
  navigation: [
    { text: "Home", url: "#", active: true },
    { text: "About", url: "#", active: true },
    // etc.
  ],
  
  // Social media links
  socialLinks: {
    facebook: "https://facebook.com/yourcompany",
    twitter: "https://twitter.com/yourcompany",
    // etc.
  },
  
  // Styling options
  styling: {
    primaryColor: "",
    // etc.
  }
};
```

### Customizing Components

Each component has detailed comments explaining how to customize it. For example:

1. **Header**: Customize the navigation menu, logo, and dark mode toggle through the config file.
2. **Hero**: Update headline, description, and call-to-action buttons.
3. **Features**: Add, remove, or modify feature cards.
4. **Slider**: Change images and captions in the portfolio slider.
5. **Testimonials**: Update client reviews and ratings.
6. **Contact Form**: Modify form fields and validation rules.
7. **Footer**: Update company info, links, and social media icons.

## 🎨 Styling Customization

### Changing Colors

1. **Theme colors**: Edit the `theme.json` file to change the primary color and overall theme.
2. **Component-specific colors**: Each component uses CSS classes that reference the theme colors. You can override these in the component files.

### Typography and Layout

- **Fonts**: Update font families in the `styling` section of the config file.
- **Spacing**: Most components use Tailwind's spacing utilities which can be adjusted in each component.

## 🧩 Adding or Removing Sections

To add or remove entire sections from your homepage:

1. **Disable via config**: Set the appropriate feature toggle to `false` in the config file.
2. **Manual removal**: In `client/src/pages/home.tsx`, comment out or remove the component you don't want.
3. **Add new section**: Create a new component in the `components` folder, then import and add it to `home.tsx`.

## 📱 Responsive Design

The template is fully responsive with mobile-first design. Key features:

- **Responsive navigation**: Collapses to a mobile menu on smaller screens
- **Flexible grid layouts**: Components adjust from multi-column to single-column on mobile
- **Optimized images**: Image placeholders scale appropriately for different devices

## 🛠️ Advanced Customization

For more advanced customization:

1. **Multiple pages**: Add new pages in the `client/src/pages` folder and update `App.tsx` routing.
2. **Custom CSS**: Add custom styles to component files or create a new CSS file.
3. **Backend integration**: Update the API endpoints in `server/routes.ts` to connect to your backend.

## 📝 Need Help?

If you need further assistance, check the comments in individual component files for specific customization guidance. Each component has detailed documentation on how to modify it for your needs.

Happy customizing!