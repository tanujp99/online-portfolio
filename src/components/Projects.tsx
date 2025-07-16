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

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  return (
    <section id="projects" className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-neutral-900 dark:text-white"
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
                  className="bg-white dark:bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 cursor-pointer border border-neutral-200 dark:border-neutral-800"
                  whileHover={{ scale: 1.02 }}
                  onClick={(e) => {
                    if (window.getSelection && window.getSelection().toString()) return;
                    setSelectedProject(isExpanded ? null : project.id);
                  }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{project.title}</h3>
                  <p className="text-sm sm:text-base text-neutral-700 dark:text-gray-300 mb-4">{project.shortDescription}</p>
                  
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    {project.isResearch && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-light-accent dark:bg-gumroad-pink text-white dark:text-gumroad-dark rounded-full text-xs sm:text-sm">
                        Research Paper
                      </span>
                    )}
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-light-accent/20 dark:bg-gumroad-pink/20 text-light-accent dark:text-gumroad-pink rounded-full text-xs sm:text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Animated arrow icon at bottom right */}
                  <motion.span
                    className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-light-accent dark:text-gumroad-pink opacity-70 pointer-events-none"
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
                        className="inline-block mr-4 text-light-accent dark:text-gumroad-pink hover:underline font-semibold text-sm sm:text-base"
                      >
                        📄 Read the Paper
                      </a>
                    )}
                    {project.showGithubLink && project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-accent dark:text-gumroad-pink hover:underline text-sm sm:text-base"
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