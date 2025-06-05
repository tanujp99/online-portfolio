'use client';

import { motion } from 'framer-motion';
import contactData from '@/data/contact.json';

const contactInfo = contactData;

export default function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white"
        >
          Contact
        </motion.h2>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-white/5 backdrop-blur-md rounded-xl p-8 border border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4 text-light-accent dark:text-gumroad-pink">Get in Touch</h3>
              <div className="space-y-4">
                <p className="flex items-center text-neutral-700 dark:text-gray-300">
                  <span className="mr-2">📍</span>
                  {contactInfo.location}
                </p>
                <p className="flex items-center text-neutral-700 dark:text-gray-300">
                  <span className="mr-2">📱</span>
                  {contactInfo.phone}
                </p>
                <p className="flex items-center text-neutral-700 dark:text-gray-300">
                  <span className="mr-2">✉️</span>
                  {contactInfo.email}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-light-accent dark:text-gumroad-pink">Connect</h3>
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
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
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