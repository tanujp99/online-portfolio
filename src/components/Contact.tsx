'use client';

import { motion } from 'framer-motion';
import contactData from '@/data/contact.json';

const contactInfo = contactData;

export default function Contact() {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-neutral-900 dark:text-white"
        >
          Contact
        </motion.h2>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-light-accent dark:text-gumroad-pink">Get in Touch</h3>
              <div className="space-y-3 sm:space-y-4">
                <p className="flex items-center text-sm sm:text-base text-neutral-700 dark:text-gray-300">
                  <span className="mr-2">📍</span>
                  {contactInfo.location}
                </p>
                <p className="flex items-center text-sm sm:text-base text-neutral-700 dark:text-gray-300">
                  <span className="mr-2">📱</span>
                  {contactInfo.phone}
                </p>
                <p className="flex items-center text-sm sm:text-base text-neutral-700 dark:text-gray-300">
                  <span className="mr-2">✉️</span>
                  {contactInfo.email}
                </p>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-light-accent dark:text-gumroad-pink">Connect</h3>
              <div className="flex space-x-4">
                {contactInfo.social.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-light-accent dark:text-gumroad-pink hover:text-light-accent dark:hover:text-gumroad-pink transition-colors duration-200"
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 