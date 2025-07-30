'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import projectsData from '@/data/projects.json';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';

interface Project {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  githubLink?: string;
  isResearch?: boolean;
  paperLink?: string;
  showGithubLink?: boolean;
  imageLight?: string;
  imageDark?: string;
  imageAlt?: string;
  imageBgLight?: string;
  imageBgDark?: string;
}

const projects: Project[] = projectsData.projects;

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

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [copiedProject, setCopiedProject] = useState<number | null>(null);
  const { theme } = useTheme();

  return (
    <section id="projects" className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl text-heading text-center mb-8 sm:mb-12 md:mb-16 text-neutral-900 dark:text-white"
        >
          Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => {
            const isExpanded = selectedProject === project.id;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div
                  className="bg-[var(--card-bg)] backdrop-blur-md rounded-xl p-4 sm:p-6 cursor-pointer shadow-card"
                  whileHover={{ scale: 1.02 }}
                  onClick={(e) => {
                    if (window.getSelection && window.getSelection() && window.getSelection()!.toString()) return;
                    setSelectedProject(isExpanded ? null : project.id);
                  }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{project.title}</h3>
                  <p className="text-sm sm:text-base text-neutral-700 dark:text-gray-300 mb-4">{project.shortDescription}</p>
                  
                  {/* Research paper or image box at the same position for all projects */}
                  {project.isResearch ? (
                    <div className="mb-4 p-3 bg-gradient-to-r from-light-accent/10 to-light-accent/5 dark:from-dark-accent/10 dark:to-dark-accent/5 rounded-lg border border-light-accent/20 dark:border-dark-accent/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🎓</span>
                        <span className="text-sm font-semibold text-light-accent dark:text-dark-accent">Published Research</span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-gray-400 mb-2">
                        <strong>Journal:</strong> International Research Journal of Modernization in Engineering Technology and Science (IRJMETS)
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-gray-400 mb-3">
                        <strong>Citation:</strong> "Study of Machine Learning Algorithms for Credit Card Fraud Detection" - Vol 4, 2022
                      </p>
                      <div className="flex gap-2 relative">
                        <AnimatePresence>
                          {copiedProject === project.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.8 }}
                              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-neutral-900/75 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-lg z-10"
                            >
                              <div className="flex items-center gap-1">
                                <span>✓</span>
                                Copied!
                              </div>
                              {/* Arrow pointing down */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900/75"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {project.paperLink && (
                          <a
                            href={project.paperLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-light-accent dark:bg-dark-accent text-[var(--card-bg)] border border-light-accent dark:border-dark-accent rounded-md hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 transition-colors text-xs font-medium shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Read Paper
                          </a>
                        )}
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border-color)] rounded-md hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-white transition-colors text-xs font-medium shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              'Palaspagar, T. (2022). Study of Machine Learning Algorithms for Credit Card Fraud Detection. International Research Journal of Modernization in Engineering Technology and Science, 4.'
                            );
                            setCopiedProject(project.id);
                            setTimeout(() => setCopiedProject(null), 1000);
                          }}
                        >
                          Copy Citation
                        </button>
                      </div>
                    </div>
                  ) : (
                    project.imageLight && project.imageDark && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-light-accent/10 to-light-accent/5 dark:from-dark-accent/10 dark:to-dark-accent/5 rounded-lg border border-light-accent/20 dark:border-dark-accent/20 h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 2xl:h-60 flex items-center justify-center overflow-hidden">
                        <div
                          className="w-full h-full rounded-md flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: theme === 'dark' ? project.imageBgDark || '#161719' : project.imageBgLight || '#f8f8f5' }}
                        >
                          <Image
                            src={theme === 'dark'
                              ? require(`@/data/images/${project.imageDark}`)
                              : require(`@/data/images/${project.imageLight}`)}
                            alt={project.imageAlt || project.title}
                            fill={false}
                            className="object-contain w-full h-full"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                            sizes="(max-width: 768px) 100vw, 400px"
                            priority={project.id === 1}
                          />
                        </div>
                      </div>
                    )
                  )}

                  {/* Technologies section */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-light-accent/20 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-full text-xs sm:text-sm"
                      >
                        {tech}
                      </span>
                    ))}
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

                  {/* Expandable content */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="text-sm sm:text-base text-neutral-700 dark:text-gray-300 mb-4">
                      {renderDescription(project.fullDescription)}
                    </div>
                    {project.paperLink && (
                      <a
                        href={project.paperLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mr-4 text-light-accent dark:text-dark-accent hover:underline font-semibold text-sm sm:text-base"
                      >
                        📄 Read the Paper
                      </a>
                    )}
                    {project.showGithubLink && project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-accent dark:text-dark-accent hover:underline text-sm sm:text-base"
                      >
                        View on GitHub →
                      </a>
                    )}
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