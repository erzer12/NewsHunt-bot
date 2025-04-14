# Dynamic Customizable Website Template

A modern, responsive website template built with React, TypeScript, and Tailwind CSS. This template is designed to be easily customizable without extensive coding knowledge.

## Features

- 📱 Fully responsive design that works on all devices
- 🌓 Dark/light mode toggle for better user experience
- 🧩 Modular components that can be easily rearranged
- ⚙️ Central configuration file for easy customization
- 📝 Contact form with validation
- 🖼️ Image slider with navigation controls
- 💬 Testimonials section
- 📊 Feature showcase section

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI components
- **Routing**: Wouter for lightweight routing
- **State Management**: React Query for data fetching
- **Form Handling**: React Hook Form for form validation
- **Backend**: Express.js server

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Customize the template by following the [Customization Guide](./CUSTOMIZATION_GUIDE.md)

## Project Structure

```
├── client/                # Frontend code
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and config
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main application component
│   │   ├── index.css      # Global styles
│   │   └── main.tsx       # Application entry point
│   └── index.html         # HTML template
├── server/                # Backend code
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage interface
│   └── vite.ts            # Vite server configuration
├── shared/                # Shared code between frontend and backend
│   └── schema.ts          # Data schemas and types
├── CUSTOMIZATION_GUIDE.md # Guide for customizing the template
├── README.md              # Project documentation
├── drizzle.config.ts      # Drizzle ORM configuration
├── package.json           # Project dependencies
├── tailwind.config.ts     # Tailwind CSS configuration
├── theme.json             # Theme configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Customization

This template is designed to be easily customizable. See the [Customization Guide](./CUSTOMIZATION_GUIDE.md) for detailed instructions on how to:

- Change colors, fonts, and styling
- Update content and images
- Add or remove sections
- Configure navigation and footer links
- Set up social media profiles
- Enable/disable features

## License

This project is available for personal and commercial use. Enjoy!