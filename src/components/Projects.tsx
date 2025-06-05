'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import projectsData from '@/data/projects.json';

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
}

const projects: Project[] = projectsData.projects;

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-16 text-neutral-900 dark:text-white"
        >
          Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const isExpanded = selectedProject === project.id;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <motion.div
                  className="bg-white dark:bg-white/5 backdrop-blur-md rounded-xl p-6 cursor-pointer border border-neutral-200 dark:border-neutral-800"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedProject(isExpanded ? null : project.id)}
                >
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{project.title}</h3>
                  <p className="text-neutral-700 dark:text-gray-300 mb-4">{project.shortDescription}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-light-accent/20 dark:bg-gumroad-pink/20 text-light-accent dark:text-gumroad-pink rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.isResearch && (
                    <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                      Research Paper
                    </span>
                  )}

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
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <p className="text-neutral-700 dark:text-gray-300 whitespace-pre-line mb-4">
                      {project.fullDescription}
                    </p>
                    {project.paperLink && (
                      <a
                        href={project.paperLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mr-4 text-light-accent dark:text-gumroad-pink hover:underline font-semibold"
                      >
                        📄 Read the Paper
                      </a>
                    )}
                    {project.showGithubLink && project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-accent dark:text-gumroad-pink hover:underline"
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