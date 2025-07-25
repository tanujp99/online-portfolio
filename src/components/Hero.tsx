'use client';

import { motion } from 'framer-motion';
import aboutData from '@/data/about.json';

export default function Hero() {
  return (
    <section id="home" className="w-full min-h-screen flex items-center justify-center bg-transparent py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-2xl flex flex-col items-start justify-center gap-4 px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <span className="text-light-accent dark:text-gumroad-pink text-base sm:text-lg md:text-xl font-semibold mb-2 block">Hey there, I'm-</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-neutral-900 dark:text-white leading-tight mb-2">
            Tanuj<br />Palaspagar<span className="text-light-accent dark:text-gumroad-pink">.</span>
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-3">Software Developer Engineer.</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-700 dark:text-gray-400 font-medium mb-4">
            A graduate developer with an interest in Computer Science.
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="text-xs sm:text-sm md:text-base text-neutral-700 dark:text-gray-300">
              <div className="flex items-start gap-2">
                {/* <span className="mt-0.5 flex-shrink-0">🚀</span>  */}
                <div>
                  <span className="block sm:inline">Specialized in</span>
                  <span className="block sm:inline font-semibold text-light-accent dark:text-gumroad-pink">
                    {' '}Algorithms / Databases / Intelligent Systems
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-xs sm:text-sm md:text-base text-neutral-700 dark:text-gray-300">
              <div className="flex items-start gap-2">
                {/* <span className="mt-0.5 flex-shrink-0">⚡</span> */}
                <div>
                  <span className="block sm:inline">Worked as</span>
                  <span className="block sm:inline font-semibold text-light-accent dark:text-gumroad-pink">
                    {' '}Cloud Engineer / Backend Developer
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {aboutData.hero && aboutData.hero.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 text-neutral-700 dark:text-gray-400 hover:bg-light-accent hover:text-white dark:hover:bg-gumroad-pink dark:hover:text-white font-medium text-xs sm:text-sm md:text-base shadow-sm transition-all duration-200 border border-gray-300 dark:border-gray-700 hover:shadow-md hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {Array.isArray(social.icon)
                    ? social.icon.map((d, i) => <path key={i} d={d} fill="currentColor" />)
                    : <path d={social.icon} fill="currentColor" />}
                </svg>
                {social.name}
              </a>
            ))}
            <a
              href="/data/Tanuj_Palaspagar-resume.pdf"
              download
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-light-accent/20 text-light-accent font-semibold text-base shadow-sm transition-all duration-200 border-none hover:bg-light-accent hover:text-white dark:bg-gumroad-pink/20 dark:text-gumroad-pink dark:hover:bg-gumroad-pink dark:hover:text-white hover:shadow-md hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}