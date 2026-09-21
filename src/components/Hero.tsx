'use client';

import aboutData from '@/data/about.json';
import ScrambleName from './ScrambleName';

// The name scrambles into place letter by letter (see ScrambleName)
const FIRST_NAME = 'Tanuj';
const LAST_NAME = 'Palaspagar';

export default function Hero() {
  return (
    <section id="home" className="w-full min-h-screen flex items-center justify-center bg-transparent py-4 sm:py-12 md:py-16">
      <div className="w-full max-w-2xl flex flex-col items-start justify-center gap-2 sm:gap-4 px-4 sm:px-6 md:px-8">
        {/* Each line rises in turn (.hero-in, --i sets the order); see globals.css */}
        <div className="w-full">
          <span style={{ '--i': 0 } as React.CSSProperties} className="hero-in inline-block text-light-accent dark:text-dark-accent text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">Hey there, I'm-</span>
          <h1 aria-label={`${FIRST_NAME} ${LAST_NAME}.`} className="flex flex-row sm:flex-col gap-x-2 sm:gap-x-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-hero text-neutral-900 dark:text-white leading-tight mb-1 sm:mb-2">
            <ScrambleName firstName={FIRST_NAME} lastName={LAST_NAME} />
          </h1>
          <h2 style={{ '--i': 2 } as React.CSSProperties} className="hero-in text-lg sm:text-xl md:text-2xl lg:text-3xl text-heading text-neutral-900 dark:text-white mb-2 sm:mb-3">Software Developer Engineer.</h2>
          <p style={{ '--i': 3 } as React.CSSProperties} className="hero-in hidden sm:block text-sm sm:text-base md:text-lg lg:text-xl text-neutral-700 dark:text-gray-400 font-medium mb-4">
            A graduate developer with an interest in Computer Science.
          </p>
          
          <div style={{ '--i': 4 } as React.CSSProperties} className="hero-in space-y-1 sm:space-y-2 mb-3 sm:mb-6">
            <div className="text-xs sm:text-sm md:text-base text-neutral-700 dark:text-gray-300">
              <div className="flex items-start gap-2">
                {/* <span className="mt-0.5 flex-shrink-0">🚀</span>  */}
                <div className="whitespace-nowrap">
                  <span className="inline">Specialized in</span>
                  <span className="inline font-semibold text-light-accent dark:text-dark-accent">
                    {' '}Algorithms / Databases / Intelligent Systems
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-xs sm:text-sm md:text-base text-neutral-700 dark:text-gray-300">
              <div className="flex items-start gap-2">
                {/* <span className="mt-0.5 flex-shrink-0">⚡</span> */}
                <div className="whitespace-nowrap">
                  <span className="inline">Worked as</span>
                  <span className="inline font-semibold text-light-accent dark:text-dark-accent">
                    {' '}Cloud Engineer / Backend Developer
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ '--i': 5 } as React.CSSProperties} className="hero-in flex flex-wrap gap-2 sm:gap-3">
            {aboutData.hero && aboutData.hero.map((social, idx) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-white font-medium text-xs sm:text-sm md:text-base shadow-sm transition-all duration-200 border border-[var(--border-color)] hover:shadow-md"
              >
                <svg
                  className={`w-5 h-5 ${idx < 3 ? 'mr-0 sm:mr-1' : 'mr-1'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {Array.isArray(social.icon)
                    ? social.icon.map((d, i) => <path key={i} d={d} fill="currentColor" />)
                    : <path d={social.icon} fill="currentColor" />}
                </svg>
                {idx < 3 ? (
                  <span className="hidden sm:inline">{social.name}</span>
                ) : (
                  social.name
                )}
              </a>
            ))}
            <a
              href="/data/Tanuj_Palaspagar-resume.pdf"
              download
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-light-accent/20 text-light-accent font-semibold text-base shadow-sm transition-all duration-200 border-none hover:bg-light-accent hover:text-white dark:bg-dark-accent/20 dark:text-dark-accent dark:hover:bg-dark-accent dark:hover:text-white hover:shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}