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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-hidden h-screen">
      <body className={`${inter.className} bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white overflow-hidden h-screen`}>
        <ThemeSwitcher />
        <div className="flex flex-col md:flex-row min-h-screen w-full h-screen">
          {/* Hero Section - Full width on mobile, fixed width on desktop */}
          <div className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4 flex-shrink-0 md:sticky md:top-0 md:h-screen">
            <div className="w-full h-full flex items-center justify-center px-4 md:px-8 py-8 md:py-0">
              <Hero />
            </div>
          </div>
          
          {/* Content Section - Full width on mobile, flexible on desktop */}
          <div className="w-full md:flex-1 flex items-start justify-center px-4 md:px-8 py-4 md:py-8 h-full">
            <div className="w-full h-full md:h-[96vh] bg-white dark:bg-gumroad-dark rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-4 md:p-10 flex flex-col overflow-hidden">
              <ContentWrapper />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 