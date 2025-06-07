'use client';

import { motion } from 'framer-motion';

const socialLinks = [
  {
    name: 'Github',
    url: 'https://github.com/tanujp99',
    icon: (
      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/tanujp',
    icon: (
      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
    ),
  },
  {
    name: 'Email',
    url: 'mailto:tanujpalaspagar@outlook.com',
    icon: (
      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8l8 5 8-5v10z"/></svg>
    ),
  },
];

export default function Hero() {
  return (
    <section id="home" className="w-full min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-transparent py-8 sm:py-12 md:py-16">
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
                <span className="mt-0.5 flex-shrink-0">🚀</span> 
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
                <span className="mt-0.5 flex-shrink-0">⚡</span>
                <div>
                  <span className="block sm:inline">Worked as</span>
                  <span className="block sm:inline font-semibold text-light-accent dark:text-gumroad-pink hover:underline cursor-pointer">
                    {' '}Cloud Engineer / Backend Developer
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 text-neutral-700 dark:text-gray-400 hover:bg-light-accent hover:text-white dark:hover:bg-gumroad-pink dark:hover:text-white font-medium text-xs sm:text-sm md:text-base shadow-sm transition-all duration-200 border border-gray-300 dark:border-gray-700 hover:shadow-md hover:scale-105"
              >
                {social.icon}
                {social.name}
              </a>
            ))}
            <a
              href="/data/Tanuj_Palaspagar-resume.pdf"
              download
              className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-light-accent dark:bg-gumroad-pink text-white font-medium text-xs sm:text-sm md:text-base shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
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