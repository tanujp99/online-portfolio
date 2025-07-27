'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import experienceData from '@/data/experience.json';

const experiences = experienceData.experiences;

function renderDescription(description: string) {
  // Split by lines and check if they start with a bullet
  const lines = description.split('\n');
  const bulletLines = lines.filter(line => line.trim().startsWith('•'));
  const nonBulletLines = lines.filter(line => !line.trim().startsWith('•'));

  if (bulletLines.length === lines.length) {
    // All lines are bullets
    return (
      <ul className="list-disc pl-6 marker:text-light-accent dark:marker:text-dark-accent text-neutral-800 dark:text-gray-300">
        {lines.map((line, idx) => (
          <li key={idx}>{line.replace(/^•\s*/, '')}</li>
        ))}
      </ul>
    );
  } else {
    // Mixed content
    return lines.map((line, idx) =>
      line.trim().startsWith('•') ? (
        <ul key={idx} className="list-disc pl-6 marker:text-light-accent dark:marker:text-dark-accent text-neutral-800 dark:text-gray-300">
          <li>{line.replace(/^•\s*/, '')}</li>
        </ul>
      ) : (
        <p key={idx} className="text-neutral-800 dark:text-gray-300">{line}</p>
      )
    );
  }
}

export default function Experience() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section id="experience" className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl text-heading text-center mb-6 sm:mb-8 md:mb-12 text-neutral-900 dark:text-white"
        >
          Experience
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-4 sm:pl-6 pb-6 sm:pb-8 last:pb-0"
              >
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-light-accent dark:bg-dark-accent" />
                {/* Timeline dot */}
                <div className="absolute left-[1px] top-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-light-accent dark:bg-dark-accent transform -translate-x-1/2 shadow-sm" />

                <motion.div
                  className="bg-[var(--card-bg)] backdrop-blur-md rounded-2xl p-3 sm:p-4 cursor-pointer border border-[var(--border-color)] shadow-card transition-all duration-300"
                  whileHover={{ scale: 1.02}}
                  onClick={(e) => {
                    if (window.getSelection && window.getSelection() && window.getSelection()!.toString()) return;
                    setExpandedId(isExpanded ? null : exp.id);
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-3 mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">{exp.position}</h3>
                      <p className="text-light-accent dark:text-dark-accent font-medium">{exp.company}</p>
                      <p className="text-neutral-500 dark:text-gray-400 text-xs sm:text-sm">{exp.location}</p>
                    </div>
                    <div className="text-left sm:text-right flex items-center gap-1.5">
                      <p className="text-xs sm:text-sm text-[var(--foreground)] bg-[var(--button-bg)] px-2 py-0.5 rounded-lg">{exp.period}</p>
                    </div>
                  </div>

                  {/* Animated arrow icon at bottom right */}
                  <motion.span
                    className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-light-accent dark:text-dark-accent opacity-70 pointer-events-none"
                    animate={{ rotate: isExpanded ? 180 : 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5">
                      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </motion.span>

                  <motion.div
                    initial={false}
                    animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className={isExpanded ? '' : 'pointer-events-none select-none opacity-0'}>
                      {renderDescription(exp.fullDescription)}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}