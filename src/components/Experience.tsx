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
      <ul className="list-disc pl-6 marker:text-light-accent dark:marker:text-gumroad-pink text-neutral-800 dark:text-gray-300">
        {lines.map((line, idx) => (
          <li key={idx}>{line.replace(/^•\s*/, '')}</li>
        ))}
      </ul>
    );
  } else {
    // Mixed content
    return lines.map((line, idx) =>
      line.trim().startsWith('•') ? (
        <ul key={idx} className="list-disc pl-6 marker:text-light-accent dark:marker:text-gumroad-pink text-neutral-800 dark:text-gray-300">
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
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white"
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
                className="relative pl-8 pb-12 last:pb-0"
              >
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-light-accent dark:bg-gumroad-pink/30" />
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-light-accent dark:bg-gumroad-pink transform -translate-x-1/2" />

                <motion.div
                  className="bg-white dark:bg-white/5 backdrop-blur-md rounded-xl p-6 cursor-pointer border border-neutral-200 dark:border-neutral-800"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">{exp.position}</h3>
                      <p className="text-light-accent dark:text-gumroad-pink">{exp.company}</p>
                      <p className="text-neutral-500 dark:text-gray-400 text-sm">{exp.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500 dark:text-gray-400">{exp.period}</p>
                    </div>
                  </div>

                  {/* Animated arrow icon at bottom right */}
                  <motion.span
                    className="absolute bottom-3 right-4 text-light-accent dark:text-gumroad-pink opacity-70 pointer-events-none"
                    animate={{ rotate: isExpanded ? 180 : 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.span>

                  <motion.div
                    initial={false}
                    animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
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