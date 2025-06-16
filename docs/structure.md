src/
├── app/
│   ├── globals.css          # Global styles and theme variables
│   ├── layout.tsx           # Root layout with theme provider and responsive containers
│   └── page.tsx            # Main page component with mobile/desktop layouts
├── components/
│   ├── Awards.tsx          # Displays awards and recognition with animated cards
│   ├── Contact.tsx         # Contact information and social media links
│   ├── ContentWrapper.tsx  # Manages tab navigation and content switching
│   ├── ErrorBoundary.tsx   # Error handling wrapper for components
│   ├── Experience.tsx      # Work experience timeline with expandable cards
│   ├── Hero.tsx           # Landing section with name, title and social links
│   ├── LoadingSpinner.tsx  # Animated loading indicator with theme support
│   ├── Navbar.tsx         # Navigation tabs with smooth transitions
│   ├── Profile.tsx        # GitHub stats, activity graph and year selector
│   ├── Projects.tsx       # Project showcase with expandable descriptions
│   ├── ThemedIcon.tsx     # Theme-aware SVG icon component
│   └── ThemeSwitcher.tsx  # Dark/light mode toggle with animations
├── context/
│   └── ThemeContext.tsx    # Theme state management and system preference detection
├── data/
│   ├── awards.json         # Awards and recognition data
│   ├── contact.json        # Contact information and social links
│   ├── experience.json     # Work experience data
│   └── projects.json       # Project showcase data
├── lib/                    # Utility functions and shared code
├── styles/                 # Additional style files
└── types/
    └── index.ts           # TypeScript type definitions

public/
├── data/
│   └── Tanuj_Palaspagar-resume.pdf  # Downloadable resume
├── favicon.ico            # Browser tab icon
└── icon.svg              # Main site icon

docs/
├── colors.md             # Theme color documentation
└── structure.md         # Project structure documentation

tailwind.config.js       # Tailwind CSS configuration and theme customization 