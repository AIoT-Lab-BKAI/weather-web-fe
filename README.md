# Weather Web Frontend (WW-FE)

A modern weather data visualization and management platform built with React, TypeScript, and Vite. This application provides an intuitive interface for weather data analysis, forecasting, and administrative management.

## 🌦️ Features

- **Weather Data Visualization**: Interactive charts and maps for weather data analysis
- **User Authentication**: Secure login/signup with Google OAuth integration
- **Admin Dashboard**: Comprehensive administrative interface for data management
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Real-time Data**: Integration with weather APIs for live data updates
- **Data Export**: Report generation and data export capabilities

## 🚀 Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Radix UI** - Accessible component primitives
- **Ant Design** - Enterprise-class UI components
- **Material-UI** - React components implementing Google's Material Design
- **Lucide React** - Beautiful & consistent icon toolkit

### State Management & Data Fetching
- **TanStack Query (React Query)** - Powerful data synchronization
- **TanStack Router** - Type-safe routing solution
- **Axios** - HTTP client for API requests

### Charts & Visualization
- **MUI X Charts** - Advanced charting components
- **React Markdown** - Markdown rendering support

### Development Tools
- **ESLint** - Code linting with modern configurations
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite Plugin React SWC** - Fast refresh with SWC

## 📁 Project Structure

```
src/
├── app/                    # Application core
│   ├── boundary.tsx        # Error boundaries
│   ├── provider.tsx        # Global providers
│   └── router.tsx          # Route configuration
├── components/             # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── customized/        # Custom component variants
│   ├── error/             # Error handling components
│   ├── fallback/          # Loading and fallback states
│   ├── icons/             # Icon components
│   ├── logos/             # Brand logos
│   └── ui/                # Base UI components
├── config/                # Configuration files
│   └── env.client.ts      # Environment variables
├── constants/             # Application constants
├── features/              # Feature-based modules
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication
│   ├── informational/     # About/Contact pages
│   ├── landing/           # Landing page
│   ├── test/              # Testing utilities
│   └── weather-map/       # Weather visualization
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── services/              # API services
├── storage/               # Local storage utilities
└── types/                 # TypeScript type definitions
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ww-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_APP_API_URL=your_api_endpoint_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |

## 🗺️ Routing Structure

The application uses TanStack Router for type-safe routing:

- `/` - Landing page
- `/login`, `/signup` - Authentication pages
- `/admin/*` - Administrative dashboard
  - `/admin/dashboard` - Main dashboard
  - `/admin/profile` - User profile management
  - `/admin/report` - Data reports
- `/about`, `/contact` - Informational pages
- `/test` - Development testing area
- `/weather-map` - Weather visualization (coming soon)

## 🔐 Authentication

The application supports multiple authentication methods:
- Email/Password authentication
- Google OAuth integration
- Protected routes with role-based access control

## 🎨 UI Components

### Base Components
- **Button** - Primary action buttons
- **Card** - Content containers
- **Input** - Form inputs with validation
- **Table** - Data display tables
- **Tabs** - Tabbed navigation

### Custom Components
- **Protected Route** - Authentication wrapper
- **Suspense Fallback** - Loading states
- **Error Boundaries** - Error handling

## 🌐 API Integration

The application includes robust API integration:
- **ApiService** - Main API client with interceptors
- **MockApiService** - Development and testing
- **Error Handling** - Comprehensive error management
- **Token Management** - Automatic authentication token handling

## 🔧 Configuration

### Environment Variables
- `VITE_APP_API_URL` - Backend API endpoint

### TypeScript Configuration
- `tsconfig.app.json` - Application TypeScript config
- `tsconfig.node.json` - Node.js TypeScript config
- Strict type checking enabled

### ESLint Configuration
Modern ESLint setup with:
- TypeScript-aware rules
- React-specific linting
- Automatic code formatting

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build locally**
   ```bash
   npm run preview
   ```

3. **Deploy to your hosting platform**
   The `dist` folder contains the production build ready for deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write descriptive commit messages
- Ensure responsive design compatibility
- Add appropriate loading states

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all TypeScript types are properly defined
   - Check for missing dependencies

2. **API Connection Issues**
   - Verify `VITE_APP_API_URL` environment variable
   - Check network connectivity

3. **Authentication Problems**
   - Clear browser local storage
   - Verify API token validity

## 📄 License

This project is part of the Weather Web application suite. Please refer to the main repository for licensing information.

## 🔗 Related Projects

- **Backend API** - Weather data processing and storage
- **Data Pipeline** - Weather data ingestion and processing
- **Mobile App** - Companion mobile application

---

Built with ❤️ using modern web technologies for weather data professionals.
