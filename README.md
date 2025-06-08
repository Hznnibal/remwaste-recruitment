# Skip Selection Application

A modern, responsive React application for selecting waste removal skips, redesigned with a fresh UI/UX approach while maintaining core functionality.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## 🛠 Tech Stack

- **React 18** - Modern React with hooks and TypeScript
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Lucide React** - Beautiful, customizable SVG icons
- **ESLint** - Code linting and quality assurance

## 📁 Project Structure

```
src/
├── components/
│   └── SkipCard.tsx          # Reusable skip card component
├── pages/
│   └── SkipSelection.tsx     # Main skip selection page
├── App.tsx                   # Root application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles and Tailwind imports
```

## 🎨 Design Philosophy & UI/UX Decisions

### Visual Design

- **Modern Gradient Background**: Subtle blue-to-teal gradient creates depth without distraction
- **Card-Based Layout**: Each skip is presented in an elegant card with hover animations
- **Color System**: Professional blue primary (#2563EB), teal secondary (#0D9488), and orange accent (#EA580C)
- **Typography**: Clear hierarchy using system fonts with proper spacing

### User Experience

- **Progressive Loading**: Skeleton states and loading indicators provide feedback
- **Responsive Design**: Optimized layouts from mobile (1 column) to desktop (4 columns)
- **Visual Feedback**: Selected skips are highlighted with border and ring effects
- **Micro-interactions**: Subtle hover animations and transitions enhance engagement
- **Error Handling**: Graceful fallbacks with mock data when API fails

### Accessibility

- **Semantic HTML**: Proper heading structure and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Color Contrast**: WCAG compliant color combinations for readability
- **Focus Management**: Clear focus indicators for navigation

## 🔧 Features

### Core Functionality

- **Dynamic Data Loading**: Fetches skip data from WeWantWaste API
- **Skip Selection**: Click to select with visual feedback
- **Responsive Grid**: Adapts to different screen sizes
- **Error Recovery**: Fallback to mock data if API fails
- **Selection Logging**: Console output for debugging/integration

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable components
- **State Management**: React hooks for local state
- **API Integration**: Async data fetching with error handling
- **Performance**: Optimized renders and efficient re-renders

## 🌐 API Integration

The application integrates with the WeWantWaste API:

```
https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft
```

### Data Transformation

- Maps API response to consistent Skip interface
- Handles missing fields with sensible defaults
- Provides fallback mock data for demonstration

## 🎯 Future Enhancements

- **Search & Filters**: Filter by price, size, or availability
- **Booking Integration**: Complete skip booking workflow
- **User Accounts**: Save preferences and booking history
- **Advanced Animations**: Page transitions and loading states
- **Multi-language**: Internationalization support

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Development

This project follows modern React development practices:

- Functional components with hooks
- TypeScript for type safety
- ESLint for code quality
- Responsive design principles
- Accessible UI patterns

Additionally, AI tools such as Bolt and Claude were used to assist in ideation, code generation, and problem-solving during development.

Built as a demonstration of modern front-end development skills for recruitment purposes.
