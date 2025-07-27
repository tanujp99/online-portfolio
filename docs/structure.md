# Project Structure

src/
├── app/
│   ├── globals.css          # Global styles with Bricolage Grotesque variable font setup
│   ├── layout.tsx           # Root layout with font provider and responsive containers
│   └── page.tsx            # Main page component with mobile/desktop layouts
├── components/
│   ├── About.tsx           # About section with contact info and tech stack
│   ├── Awards.tsx          # Displays awards and recognition with animated cards
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
│   ├── about.json          # About section data and contact information
│   ├── awards.json         # Awards and recognition data
│   ├── experience.json     # Work experience data
│   ├── images/             # Project and profile images
│   │   ├── me.jpeg
│   │   ├── project-hls-dark.png
│   │   ├── project-hls-light.png
│   │   ├── project-spp-dark.png
│   │   ├── project-spp-light.png
│   │   ├── project-swm-dark.png
│   │   ├── project-swm-light.png
│   │   ├── rec-abhishek.jpeg
│   │   ├── rec-kasi.jpeg
│   │   └── rec-yash.jpeg
│   ├── projects.json       # Project showcase data
│   └── testimonials.json   # Testimonials and recommendations data
├── lib/                    # Utility functions and shared code
├── styles/                 # Additional style files
└── types/
    └── index.ts           # TypeScript type definitions

public/
├── data/
│   └── Tanuj_Palaspagar-resume.pdf  # Downloadable resume
├── favicon.ico            # Browser tab icon
├── fonts/                 # Font files
│   └── BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf  # Variable font file
└── icon.svg              # Main site icon

docs/
├── colors.md             # Theme color documentation
└── structure.md         # Project structure documentation
