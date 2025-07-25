import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Hero from '@/components/Hero';
import ContentWrapper from '@/components/ContentWrapper';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { ThemeProvider } from '../context/ThemeContext';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tanujp.com'),
  title: 'Tanuj Palaspagar - Software Developer Engineer',
  description: 'Portfolio website of Tanuj Palaspagar, a Software Developer Engineer specializing in Algorithms, Databases, and Intelligent Systems.',
  keywords: ['Software Developer', 'Cloud Engineer', 'Backend Developer', 'Algorithms', 'Databases', 'Intelligent Systems'],
  authors: [{ name: 'Tanuj Palaspagar' }],
  openGraph: {
    title: 'Tanuj Palaspagar - Software Developer Engineer',
    description: 'Portfolio website of Tanuj Palaspagar, a Software Developer Engineer specializing in Algorithms, Databases, and Intelligent Systems.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))] h-full overflow-hidden antialiased`}>
        <ThemeProvider>
          <ThemeSwitcher />
          
          {/* Mobile Layout (Portrait) - Refined spacing */}
          <div className="block lg:hidden h-full flex flex-col overflow-hidden">
            {/* Hero Section - Better proportions */}
            <div className="flex-shrink-0 h-[25%] px-6 py-6">
              <div className="flex items-center justify-center h-full">
                <Hero />
              </div>
            </div>
            
            {/* Content Section - Refined container */}
            <div className="flex-1 px-6 pb-6 min-h-0">
              <div className="h-full bg-[rgb(var(--card-bg))] backdrop-blur-xl rounded-2xl border border-[rgb(var(--border-color))] p-5 flex flex-col overflow-hidden shadow-xl">
                <ContentWrapper />
              </div>
            </div>
          </div>

          {/* Desktop Layout (Landscape) - Refined spacing */}
          <div className="hidden lg:flex min-h-screen w-full h-screen">
            {/* Hero Section - Better proportions */}
            <div className="w-[38%] xl:w-[35%] flex-shrink-0 sticky top-0 h-screen">
              <div className="w-full h-full flex items-center justify-center px-8 xl:px-12">
                <Hero />
              </div>
            </div>
            
            {/* Content Section - Refined container */}
            <div className="flex-1 flex items-start justify-center px-8 xl:px-12 py-8 xl:py-12 h-full">
              <div className="w-full h-[calc(100vh-64px)] xl:h-[calc(100vh-96px)] bg-[rgb(var(--card-bg))] backdrop-blur-xl rounded-2xl border border-[rgb(var(--border-color))] p-8 flex flex-col overflow-hidden shadow-xl">
                <ContentWrapper />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}