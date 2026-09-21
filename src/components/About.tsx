'use client';

import aboutData from '@/data/about.json';
import Reveal from './Reveal';
import { useId } from 'react';
import type { IconType } from 'react-icons';

// A filled circle in the icon's colour with the icon cut out of it, so whatever is behind shows through
function CutoutIcon({ icon: Icon, className = '' }: { icon: IconType; className?: string }) {
  const maskId = useId();
  return (
    <svg viewBox="0 0 24 24" className={`w-7 h-7 shrink-0 ${className}`} aria-hidden>
      <defs>
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <Icon x={6.5} y={6.5} size={11} color="black" />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="12" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}
import { FaEnvelope, FaLinkedin, FaGithub, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const aboutInfo = aboutData;

export default function About() {
  return (
    <section id="about" className="pt-6 sm:pt-10 md:pt-14 lg:pt-16 pb-12 sm:pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl text-heading text-center mb-6 sm:mb-10 md:mb-12 lg:mb-14 text-neutral-900 dark:text-white"
        >
          About
        </h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <Reveal
            className="bg-[var(--card-bg)] backdrop-blur-md rounded-card p-5 sm:p-6 shadow-panel"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-light-accent dark:text-dark-accent">Get in Touch</h3>
              <div className="detail-box space-y-2 sm:space-y-3">
                <p className="flex items-center text-sm sm:text-base text-[var(--foreground)]">
                  <CutoutIcon icon={FaMapMarkerAlt} className="mr-2 text-[#EF7D6E] dark:text-[#FFB4A9]" />
                  {aboutInfo.location}
                </p>
                <p className="flex items-center text-sm sm:text-base text-[var(--foreground)]">
                  <CutoutIcon icon={FaPhoneAlt} className="mr-2 text-[#5DB98A] dark:text-[#9DDBB0]" />
                  {aboutInfo.phone}
                </p>
                <p className="flex items-center text-sm sm:text-base text-[var(--foreground)]">
                  <CutoutIcon icon={FaEnvelope} className="mr-2 text-[#7A9EF0] dark:text-[#AFC6FF]" />
                  {aboutInfo.email}
                </p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6">
              <div className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-light-accent dark:text-dark-accent">Connect</div>
              {/* <div className="flex space-x-4 mb-6">
                {aboutInfo.social.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-light-accent dark:text-dark-accent hover:text-light-accent dark:hover:text-dark-accent transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6">
                      <svg
                        className="w-full h-full"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d={social.icon} />
                      </svg>
                    </div>
                  </motion.a>
                ))}
              </div> */}
              {/* Social Links */}
              <div className="detail-box flex flex-wrap justify-center gap-2">
                {aboutInfo.social.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 rounded-full bg-[var(--button-bg)] text-[var(--foreground)] hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-white font-medium text-xs sm:text-sm shadow-sm transition-all duration-200 border border-[var(--border-color)] hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
            
            </Reveal>
          </div>
        {/* Technologies Used Section */}
        <div className="max-w-2xl mx-auto mt-6">
          <Reveal
            className="bg-[var(--card-bg)] backdrop-blur-md rounded-card p-5 sm:p-6 shadow-panel"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-light-accent dark:text-dark-accent">This website is built with</h3>
            <div className="detail-box space-y-4">
                {/* Languages */}
                <div>
                  <div className="text-[var(--foreground)] mb-3 text-sm sm:text-base">Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {['TypeScript', 'CSS'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-[var(--button-bg)] text-[var(--foreground)] rounded-full text-xs sm:text-sm border border-[var(--border-color)] font-medium shadow-sm">{tech}</span>
                    ))}
                  </div>
                </div>
                {/* Frameworks & Libraries */}
                <div>
                  <div className="text-[var(--foreground)] mb-3 text-sm sm:text-base">Frameworks & Libraries</div>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js', 'React', 'Framer Motion'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-[var(--button-bg)] text-[var(--foreground)] rounded-full text-xs sm:text-sm border border-[var(--border-color)] font-medium shadow-sm">{tech}</span>
                    ))}
                  </div>
                </div>
                {/* Styling & Animation */}
                <div>
                  <div className="text-[var(--foreground)] mb-3 text-sm sm:text-base">Styling & Animation</div>
                  <div className="flex flex-wrap gap-2">
                    {['Tailwind CSS'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-[var(--button-bg)] text-[var(--foreground)] rounded-full text-xs sm:text-sm border border-[var(--border-color)] font-medium shadow-sm">{tech}</span>
                    ))}
                    <a 
                      href="https://ateliertriay.github.io/bricolage" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[var(--button-bg)] text-[var(--foreground)] rounded-full text-xs sm:text-sm border border-[var(--border-color)] font-medium shadow-sm hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-white transition-all duration-200"
                    >
                      Bricolage Grotesque
                    </a>
                  </div>
                </div>
                {/* Tooling & CI */}
                {/* <div>
                  <div className="text-[var(--foreground)] mb-3 text-sm sm:text-base">Tooling & CI</div>
                  <div className="flex flex-wrap gap-2">
                    {['ESLint', 'Node.js'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-[var(--button-bg)] text-[var(--foreground)] rounded-full text-xs sm:text-sm border border-[var(--border-color)] font-medium shadow-sm">{tech}</span>
                    ))}
                  </div>
                </div> */}
                {/* Hosted On
                <div>
                  <div className="text-[var(--foreground)] mb-3 text-sm sm:text-base">Hosted On</div>
                  <div className="flex flex-wrap gap-2">
                    {['Vercel'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-[var(--button-bg)] text-[var(--foreground)] rounded-full text-xs sm:text-sm border border-[var(--border-color)] font-medium shadow-sm">{tech}</span>
                    ))}
                  </div>
                </div> */}
                {/* Additional Technologies */}
                {/* <div>
                  <div className="text-[var(--foreground)] mb-3 text-sm sm:text-base">Additional Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Context API',
                      'JSON Data Management',
                      'Custom Hooks'
                    ].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-[var(--button-bg)] text-[var(--foreground)] rounded-full text-xs sm:text-sm border border-[var(--border-color)] font-medium shadow-sm">{tech}</span>
                    ))}
                  </div>
                </div> */}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
} 