'use client';

import React from 'react';
import { FaTrophy, FaMedal, FaAward, FaCode, FaCoins, FaGlobe } from 'react-icons/fa';
import awardsData from '@/data/awards.json';
import FlipCard from './FlipCard';
import Reveal from './Reveal';

const iconMap = {
  'Distinguished Delegate': FaTrophy,
  'Most Innovative Prototype': FaMedal,
  'National Top-12 Semi-Finalist': FaAward,
};

const leadershipIcons = {
  code: FaCode,
  treasurer: FaCoins,
  web: FaGlobe,
};

interface LeadershipRole {
  id: number;
  title: string;
  organization: string;
  date: string;
  icon: string;
  summary: string;
  details: string[];
  link?: string;
  linkLabel?: string;
}

const leadership: LeadershipRole[] = awardsData.leadership;

export default function Awards() {
  return (
    <section id="awards" className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl text-heading text-center mb-8 sm:mb-12 md:mb-16 text-neutral-900 dark:text-white"
        >
          Awards & Recognition
        </h2>

        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] max-w-[640] mx-auto gap-8"
        >
          {awardsData.awards.map((award) => (
            <Reveal
              key={award.id}
              className="bg-[var(--card-bg)] backdrop-blur-md rounded-xl shadow-panel p-4 sm:p-6"
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
            </Reveal>
          ))}
        </div>

        <h3
          className="text-xl sm:text-2xl text-heading text-center mt-12 sm:mt-16 mb-6 sm:mb-8 text-neutral-900 dark:text-white"
        >
          Leadership
        </h3>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-6">
          {leadership.map((role) => {
            const Icon = leadershipIcons[role.icon as keyof typeof leadershipIcons];
            return (
              <Reveal key={role.id} className="h-full min-h-[180px]">
                <FlipCard
                  label={`${role.title}, ${role.organization}`}
                  padding="p-4"
                  front={
                    <div className="pb-5">
                      {Icon && (
                        <div className="w-6 h-6 text-light-accent dark:text-dark-accent mb-3">
                          <Icon className="w-full h-full" />
                        </div>
                      )}
                      <h4 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">{role.title}</h4>
                      <p className="text-sm text-neutral-700 dark:text-gray-300 font-medium">{role.organization}</p>
                      <p className="text-xs text-neutral-500 dark:text-gray-400 mt-1">{role.date}</p>
                      <p className="text-sm text-neutral-700 dark:text-gray-300 mt-3">{role.summary}</p>
                    </div>
                  }
                  back={
                    <>
                      <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">{role.title}</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700 dark:text-gray-300 marker:text-light-accent dark:marker:text-dark-accent">
                        {role.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                      {role.link && (
                        <a
                          href={role.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto self-start inline-flex items-center px-3 py-1 rounded-full bg-light-accent dark:bg-dark-accent text-[var(--card-bg)] text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {role.linkLabel ?? 'Learn more'}
                        </a>
                      )}
                    </>
                  }
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
} 