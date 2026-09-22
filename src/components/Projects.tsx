'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import projectsData from '@/data/projects.json';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import FlipCard from './FlipCard';
import { FaGraduationCap } from 'react-icons/fa';
import Reveal from './Reveal';

interface Project {
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
  journal?: string;
  citation?: string;
  mainButton?: string;
  citationButton?: string;
  citationContent?: string;
  citationLink?: string; // if set, the citation-style button opens this link instead of copying citationContent
  presentButton?: string | boolean;
  presentContent?: string;
  presentSlug?: string; // routes the demo link through /go/<slug>, which checks the demo is up first
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
          <li key={idx} dangerouslySetInnerHTML={{ __html: line.replace(/^•\s*/, '') }} />
        ))}
      </ul>
    );
  } else {
    // Mixed content
    return lines.map((line, idx) =>
      line.trim().startsWith('•') ? (
        <ul key={idx} className="list-disc pl-6 marker:text-light-accent dark:marker:text-dark-accent text-neutral-800 dark:text-gray-300">
          <li dangerouslySetInnerHTML={{ __html: line.replace(/^•\s*/, '') }} />
        </ul>
      ) : (
        <p key={idx} className="text-neutral-800 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: line }} />
      )
    );
  }
}

// From 2xl, cards share rows. In each row the tag area takes the height of the row's tallest tag block,
// so every picture's bottom edge and every first row of tags line up across the row; the spare height
// goes under the description. Re-measured whenever the grid changes width.
const ALIGN_FROM_PX = 1536;

function useRowAlignedTags() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let lastWidth = -1;

    const align = () => {
      const cards = Array.from(grid.children) as HTMLElement[];
      const tags = cards.map((card) => card.querySelector<HTMLElement>('[data-tags]'));
      tags.forEach((t) => t && (t.style.minHeight = ''));
      if (!window.matchMedia(`(min-width: ${ALIGN_FROM_PX}px)`).matches) return;
      // cards in the same row share offsetTop (unlike getBoundingClientRect, it ignores the reveal animation)
      const rows = new Map<number, HTMLElement[]>();
      cards.forEach((card, i) => {
        const t = tags[i];
        if (!t) return;
        rows.set(card.offsetTop, [...(rows.get(card.offsetTop) ?? []), t]);
      });
      rows.forEach((row) => {
        const tallest = Math.max(...row.map((t) => t.offsetHeight));
        row.forEach((t) => (t.style.minHeight = `${tallest}px`));
      });
    };

    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === lastWidth) return;
      lastWidth = entry.contentRect.width;
      align();
    });
    observer.observe(grid);
    document.fonts?.ready.then(align);
    return () => observer.disconnect();
  }, []);

  return gridRef;
}

export default function Projects() {
  const [copiedProject, setCopiedProject] = useState<number | null>(null);
  const gridRef = useRowAlignedTags();
  const { theme } = useTheme();

  return (
    <section id="projects" className="pt-6 sm:pt-10 md:pt-14 lg:pt-16 pb-12 sm:pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl text-heading text-center mb-6 sm:mb-10 md:mb-12 lg:mb-14 text-neutral-900 dark:text-white"
        >
          Projects
        </h2>

        <div ref={gridRef} className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-8">
          {projects.map((project, index) => {
            return (
              // From 2xl the cards sit two or more to a row. There each card is at least 4/3 as tall as it is
              // wide (3:4), measured from its own width; taller content still wins. The picture box
              // keeps its size on every card.
              <Reveal key={index} className="relative h-full 2xl:[container-type:inline-size]">
                <div className="h-full 2xl:min-h-[133.33cqw]">
                  <FlipCard
                    group="projects"
                    label={project.title}
                    front={
                      <>
                        {/* On 2xl this part takes the spare height, so the picture and tags below line up across a row */}
                        <div className="2xl:grow">
                          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{project.title}</h3>
                          <p className="text-sm sm:text-base text-neutral-700 dark:text-gray-300 mb-4">{project.shortDescription}</p>
                        </div>

                        {/* Research paper or image box: same position and the same size on every card */}
                        {project.isResearch ? (
                          <div className="mb-4 p-3 bg-gradient-to-r from-light-accent/10 to-light-accent/5 dark:from-dark-accent/10 dark:to-dark-accent/5 rounded-box border border-light-accent/20 dark:border-dark-accent/20 h-56 [@media(max-width:374px)]:h-[19rem] sm:h-44 md:h-48 lg:h-52 xl:h-56 2xl:h-60 shrink-0 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                              <FaGraduationCap className="w-5 h-5 text-[#3F51B5] dark:text-[#7986CB]" aria-hidden />
                              <span className="text-sm font-semibold text-light-accent dark:text-dark-accent">Published Research</span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-gray-400 mb-2">
                              <strong>Journal:</strong> {project.journal}
                            </p>
                            <p className="text-xs text-neutral-600 dark:text-gray-400 mb-3">
                              <strong>Citation:</strong> {project.citation}
                            </p>
                            <div className="flex gap-2 relative">
                              <AnimatePresence>
                                {copiedProject === index && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-neutral-900/75 text-white px-3 py-1.5 rounded-inset text-xs font-medium shadow-lg z-10"
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
                              {project.paperLink && project.mainButton && (
                                <a
                                  href={project.paperLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="pill-button"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {project.mainButton}
                                </a>
                              )}
                              {project.presentButton && typeof project.presentButton === 'string' && (project.presentSlug || project.presentContent) && (
                                <a
                                  href={project.presentSlug ? `/go/${project.presentSlug}` : project.presentContent}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="pill-button"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {project.presentButton}
                                </a>
                              )}
                              {project.citationButton && project.citationLink && (
                                <a
                                  href={project.citationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="pill-link"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {project.citationButton}
                                </a>
                              )}
                              {project.citationButton && !project.citationLink && project.citationContent && (
                                <button
                                  className="pill-link"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(project.citationContent!);
                                    setCopiedProject(index);
                                    setTimeout(() => setCopiedProject(null), 1000);
                                  }}
                                >
                                  {project.citationButton}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          project.imageLight && project.imageDark && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-light-accent/10 to-light-accent/5 dark:from-dark-accent/10 dark:to-dark-accent/5 rounded-box border border-light-accent/20 dark:border-dark-accent/20 h-56 [@media(max-width:374px)]:h-[19rem] sm:h-44 md:h-48 lg:h-52 xl:h-56 2xl:h-60 flex items-center justify-center overflow-hidden relative">
                              <div
                                className="w-full h-full rounded-inset flex items-center justify-center overflow-hidden"
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
                                  priority={index === 0}
                                />
                              </div>
                              {/* Present button in bottom left corner */}
                              {project.presentButton && typeof project.presentButton === 'string' && (project.presentSlug || project.presentContent) && (
                                <div className="absolute bottom-5 left-5">
                                  <a
                                    href={project.presentSlug ? `/go/${project.presentSlug}` : project.presentContent}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pill-button"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {project.presentButton}
                                  </a>
                                </div>
                              )}
                            </div>
                          )
                        )}

                        {/* Technologies section; on 2xl its height is matched across the row (useRowAlignedTags) */}
                        <div data-tags className="flex flex-wrap content-start gap-1.5 sm:gap-2 mb-4">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="chip-accent"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </>
                    }
                    back={
                      <>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{project.title}</h3>
                        <div className="detail-box py-2 pl-0 pr-2 sm:py-2 sm:pl-0 sm:pr-2 text-sm text-neutral-700 dark:text-gray-300 mb-3 space-y-1">
                          {renderDescription(project.fullDescription)}
                        </div>
                        <div className="mt-auto pr-8 flex flex-wrap gap-2">
                          {project.paperLink && (
                            <a
                              href={project.paperLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pill-button"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Read the Paper
                            </a>
                          )}
                          {project.showGithubLink && project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pill-button"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View on GitHub
                            </a>
                          )}
                        </div>
                      </>
                    }
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
