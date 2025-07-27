'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import awardsData from '@/data/awards.json';

const iconMap = {
  'Distinguished Delegate': FaTrophy,
  'Most Innovative Prototype': FaMedal,
  'National Top-12 Semi-Finalist': FaAward,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Awards() {
  return (
    <section id="awards" className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl text-heading text-center mb-8 sm:mb-12 md:mb-16 text-neutral-900 dark:text-white"
        >
          Awards & Recognition
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {awardsData.awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[var(--card-bg)] backdrop-blur-md rounded-xl shadow-card p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 border border-[var(--border-color)]"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                {iconMap[award.title as keyof typeof iconMap] && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 text-light-accent dark:text-dark-accent mr-2 sm:mr-3">
                    {React.createElement(iconMap[award.title as keyof typeof iconMap])}
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-semibold text-light-accent dark:text-dark-accent">{award.title}</h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-sm sm:text-base text-neutral-700 dark:text-gray-300 font-medium">{award.organization}</p>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-gray-400">{award.date}</p>
                <p className="text-sm sm:text-base text-neutral-700 dark:text-gray-300 mt-3 sm:mt-4">{award.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 