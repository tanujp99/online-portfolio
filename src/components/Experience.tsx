'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import experienceData from '@/data/experience.json';
import Reveal from './Reveal';

const experiences = experienceData.experiences;

// "MAY 2019 - JUL 2019" -> "May 2019 – July 2019", matching the awards' date style
const MONTH_NAMES: Record<string, string> = {
  JAN: 'January', FEB: 'February', MAR: 'March', APR: 'April', MAY: 'May', JUN: 'June',
  JUL: 'July', AUG: 'August', SEP: 'September', OCT: 'October', NOV: 'November', DEC: 'December',
};

function formatPeriod(period: string) {
  return period
    .split(' - ')
    .map((part) => {
      const [month, year] = part.trim().split(' ');
      if (month === 'PRESENT') return 'Present';
      return `${MONTH_NAMES[month] ?? month} ${year}`;
    })
    .join(' – ');
}

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
    <section id="experience" className="pt-6 sm:pt-10 md:pt-14 lg:pt-16 pb-12 sm:pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl text-heading text-center mb-6 sm:mb-10 md:mb-12 lg:mb-14 text-neutral-900 dark:text-white"
        >
          Experience
        </h2>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp) => {
            const isExpanded = expandedId === exp.id;
            return (
              <Reveal
                key={exp.id}
                from="left"
                className="relative pl-4 sm:pl-6 pb-6 sm:pb-8 last:pb-0"
              >
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-light-accent dark:bg-dark-accent" />
                {/* Timeline dot */}
                <div className="absolute left-[1px] top-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-light-accent dark:bg-dark-accent transform -translate-x-1/2 shadow-sm" />

                <motion.div
                  className={`bg-[var(--card-bg)] backdrop-blur-md rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-300 ${isExpanded ? 'shadow-panel-active' : 'shadow-panel'}`}
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
                      <p className="text-xs sm:text-sm text-[var(--foreground)] bg-[var(--button-bg)] px-2 py-0.5 rounded-lg">{formatPeriod(exp.period)}</p>
                    </div>
                  </div>

                  {/* Animated arrow icon at bottom right */}
                  <span
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-light-accent/10 dark:bg-dark-accent/15 text-light-accent dark:text-dark-accent flex items-center justify-center pointer-events-none"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 transition-transform duration-300 ease-out ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>

                  <motion.div
                    initial={false}
                    animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="mt-3 overflow-hidden"
                  >
                    {/* Details in their own box; the bottom margin leaves room for the arrow below it */}
                    <div className={`detail-box mb-6 ${isExpanded ? '' : 'pointer-events-none select-none opacity-0'}`}>
                      {renderDescription(exp.fullDescription)}
                    </div>
                  </motion.div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}