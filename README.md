# Service Status Tracker Web

A modern, responsive web application for managing service status tracking and incident reporting. Built with React, TypeScript, and Shadcn UI components.

## Features

- Dark/Light mode support
- Secure authentication system
- Real-time service status dashboard
- Incident management interface
- Team management with role-based access
- Responsive design for all devices
- Modern UI with Shadcn components

## Prerequisites

- Node.js >= 18.18.0
- npm or yarn
- Backend API running (see server README)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   # API Configuration
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Technology Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form
- **Authentication**: JWT with HTTP-only cookies
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Shadcn UI components
│   └── ...            # Custom components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and API client
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── App.tsx            # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3000 |

## Deployment

The web application is configured for deployment on platforms like Vercel, Netlify, or Render. Make sure to:

1. Set the appropriate environment variables
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

## Features in Detail

### Authentication
- Secure login/signup system
- Protected routes
- Role-based access control
- Persistent sessions

### Service Status Management
- Real-time status updates
- Historical status data
- Custom status types
- Service grouping

### Incident Management
- Create and track incidents
- Real-time incident updates
- Incident history
- Impact assessment

### Team Management
- Invite team members
- Role management
- Activity tracking
- Team permissions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Related Projects

- [Service Status Tracker API](../server/README.md) - Backend API
