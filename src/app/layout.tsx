import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Hero from '@/components/Hero';
import ContentWrapper from '@/components/ContentWrapper';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tanuj Palaspagar - Software Developer',
  description: 'Portfolio website showcasing my work and experience as a software developer',
  icons: {
    icon: '/icon.svg?v=1',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-white h-full overflow-hidden`}>
        <ThemeSwitcher />
        
        {/* Mobile Layout (Portrait) - Fixed Viewport */}
        <div className="block lg:hidden h-screen flex flex-col overflow-hidden">
          {/* Hero Section - Fixed height on mobile */}
          <div className="flex-shrink-0 h-[40vh] px-4 py-2">
            <div className="flex items-center justify-center h-full">
              <Hero />
            </div>
          </div>
          
          {/* Content Section - Takes remaining space */}
          <div className="flex-1 px-4 pb-4 min-h-0">
            <div className="h-full bg-white dark:bg-gumroad-dark rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col overflow-hidden">
              <ContentWrapper />
            </div>
          </div>
        </div>

        {/* Desktop Layout (Landscape) */}
        <div className="hidden lg:flex min-h-screen w-full h-screen">
          {/* Hero Section - Fixed width on desktop */}
          <div className="w-[35%] xl:w-[30%] flex-shrink-0 sticky top-0 h-screen">
            <div className="w-full h-full flex items-center justify-center px-8">
              <Hero />
            </div>
          </div>
          
          {/* Content Section - Flexible width on desktop */}
          <div className="flex-1 flex items-start justify-center px-8 py-8 h-full">
            <div className="w-full h-[96vh] bg-white dark:bg-gumroad-dark rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-10 flex flex-col overflow-hidden">
              <ContentWrapper />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}