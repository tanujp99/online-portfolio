'use client';

import { useState, useEffect } from 'react';
import { FaGithub, FaMapMarkerAlt, FaLink, FaUsers, FaCode, FaStar, FaCodeBranch, FaTwitter, FaLinkedin, FaDiscord, FaReddit, FaSpotify, FaCoffee, FaPatreon, FaXbox, FaSteam } from 'react-icons/fa';
import Image from 'next/image';
import GitHubCalendar from 'react-github-calendar';
import { useTheme } from '../context/ThemeContext';
import ThemedIcon from './ThemedIcon';
import ActivityGraph from './ActivityGraph';
import { FaQuoteLeft, FaExternalLinkAlt, FaMicrochip, FaServer, FaStream, FaCloud, FaBrain, FaShieldAlt } from 'react-icons/fa';
import testimonialsData from '@/data/testimonials.json';
import experienceData from '@/data/experience.json';
import projectsData from '@/data/projects.json';
import awardsData from '@/data/awards.json';
import skillsData from '@/data/skills.json';
import CountUp from './CountUp';
import Reveal from './Reveal';

interface GitHubData {
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string;
  blog: string;
  login: string;
  twitter_username: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  homepage: string;
  topics: string[];
}

interface PinnedRepo {
  repo: string;
  owner: string;
  description: string;
  link: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
}

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company?: string;
  relationship: string;
  date: string;
  linkedinUrl: string;
  profileImagePath?: string; // Updated to use profileImagePath
  pullQuote?: string;
  recommendation: string;
  verified?: boolean;
}

// TODO: GitHub pinned repos are turned off for now; the Projects tab is used as the showcase instead.
// Flip this to true to fetch and show them again.
const SHOW_PINNED_REPOS = false;

const GITHUB_USERNAME = 'tanujp99';
const RECOMMENDATIONS_URL = 'https://www.linkedin.com/in/tanujp/details/recommendations/?detailScreenTabIndex=0';

// Stats are computed from the site's own data so they can't drift out of date
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function toMonthIndex(value: string, now: Date) {
  const text = value.trim();
  if (text === 'PRESENT') return now.getFullYear() * 12 + now.getMonth();
  const [month, year] = text.split(' ');
  return Number(year) * 12 + MONTHS.indexOf(month);
}

// Whole years across roles flagged "industry", with overlapping roles counted once
function yearsInIndustry(now = new Date()) {
  const spans = (experienceData.experiences as { period: string; industry?: boolean }[])
    .filter((role) => role.industry)
    .map((role) => {
      const [from, to] = role.period.split(' - ');
      return [toMonthIndex(from, now), toMonthIndex(to, now) + 1];
    })
    .sort((a, b) => a[0] - b[0]);

  let months = 0;
  let coveredUntil = -Infinity;
  for (const [start, end] of spans) {
    const from = Math.max(start, coveredUntil);
    if (end > from) months += end - from;
    coveredUntil = Math.max(coveredUntil, end);
  }
  return Math.floor(months / 12);
}

const papers = (projectsData.projects as { isResearch?: boolean }[]).filter((project) => project.isResearch).length;

function buildStats(publicRepos: number | null) {
  return [
    { value: yearsInIndustry(), suffix: '+', label: 'Years in Industry' },
    { value: publicRepos, label: 'Public Repos' },
    { value: awardsData.awards.length, label: 'Awards' },
    { value: papers, label: papers === 1 ? 'Research Paper' : 'Research Papers' },
  ];
}

const skillIcons = {
  chip: FaMicrochip,
  server: FaServer,
  stream: FaStream,
  cloud: FaCloud,
  brain: FaBrain,
  shield: FaShieldAlt,
};

// Starts the expand-arrow nudge (see .nudge-once in globals.css) once the arrow is fully on screen
const NUDGES_DONE_KEY = 'testimonials-opened';
let nudgeObserver: IntersectionObserver | null = null;

function nudgeWhenSeen(el: HTMLElement | null) {
  if (!el || typeof IntersectionObserver === 'undefined') return;
  nudgeObserver ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('nudge-now');
        nudgeObserver?.unobserve(entry.target);
      });
    },
    { threshold: 1 },
  );
  nudgeObserver.observe(el);
}

let cachedProfile: GitHubData | null = null;
let cachedPinnedRepos: PinnedRepo[] = [];
let dataFetched = false;

export default function Profile() {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<GitHubData | null>(cachedProfile);
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>(cachedPinnedRepos);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarLoading, setCalendarLoading] = useState(true);
  const testimonials: Testimonial[] = testimonialsData.testimonials;
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null);
  // The arrows keep nudging until the visitor opens any testimonial, remembered across visits
  const [nudgesDone, setNudgesDone] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(NUDGES_DONE_KEY)) setNudgesDone(true);
    } catch {}
  }, []);

  const stopNudges = () => {
    setNudgesDone(true);
    try {
      localStorage.setItem(NUDGES_DONE_KEY, '1');
    } catch {}
  };

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 7 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchData = async () => {
      if (dataFetched && cachedProfile) {
        setProfile(cachedProfile);
        setPinnedRepos(cachedPinnedRepos);
        return;
      }

      try {
        const fetchJson = async (url: string) => {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`${url} responded with ${response.status}`);
          return response.json();
        };

        // Fetched independently so a failing pinned-repos service can't take down the profile
        const fetchGitHubData = async () => {
          const [profileResult, pinnedReposResult] = await Promise.allSettled([
            fetchJson(`https://api.github.com/users/${GITHUB_USERNAME}`),
            SHOW_PINNED_REPOS ? fetchJson('https://pinned.berrysauce.dev/get/tanujp99') : Promise.resolve([])
          ]);

          if (profileResult.status === 'fulfilled') {
            cachedProfile = profileResult.value;
            setProfile(profileResult.value);
          } else {
            console.error('Error fetching GitHub profile:', profileResult.reason);
          }

          if (pinnedReposResult.status === 'fulfilled' && Array.isArray(pinnedReposResult.value)) {
            cachedPinnedRepos = pinnedReposResult.value.map((repo: any): PinnedRepo => ({
              repo: repo.name,
              owner: repo.author,
              description: repo.description,
              link: `https://github.com/${repo.author}/${repo.name}`,
              language: repo.language,
              languageColor: repo.languageColor,
              stars: repo.stars,
              forks: repo.forks,
            }));
            setPinnedRepos(cachedPinnedRepos);
          } else if (pinnedReposResult.status === 'rejected') {
            console.error('Error fetching pinned repos:', pinnedReposResult.reason);
          }

          dataFetched = cachedProfile !== null;
        };

        await fetchGitHubData();
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setPinnedRepos([]);
      }
    };

    fetchData();
  }, []);

  function handleYearChange(year: number) {
    if (year >= Math.min(...availableYears) && year <= Math.max(...availableYears)) {
      setSelectedYear(year);
    }
  }

  return (
    <section id="profile" className="py-8 sm:py-12 md:py-16 overflow-y-auto">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="w-36 h-36 rounded-full border-4 border-[var(--border-color)] shadow-inner bg-[var(--card-bg)] flex items-center justify-center overflow-hidden">
            <Image
              src={require('@/data/images/me.jpeg')}
              alt="Profile Picture"
              width={144}
              height={144}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>
        </div>
        <div className="space-y-8">

          {/* Stats & Skills */}
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-panel">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
                {buildStats(profile?.public_repos ?? null).map((stat) => (
                  <div key={stat.label} className="p-3 rounded-xl bg-light-accent/5 dark:bg-dark-accent/5">
                    <div className="text-2xl sm:text-3xl text-hero text-light-accent dark:text-dark-accent">
                      {stat.value === null ? '–' : <CountUp value={stat.value} suffix={stat.suffix} />}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--foreground)] mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mt-8 mb-5 text-center">What I work with</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                {skillsData.groups.map((group) => {
                  const Icon = skillIcons[group.icon as keyof typeof skillIcons];
                  return (
                    <div key={group.name} className="h-full rounded-xl bg-black/[0.04] dark:bg-white/[0.05] p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-9 h-9 shrink-0 rounded-full bg-black/[0.05] dark:bg-white/[0.07] text-light-accent dark:text-dark-accent flex items-center justify-center">
                          {Icon && <Icon className="w-4 h-4" />}
                        </span>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{group.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                          <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--button-bg)] text-[var(--foreground)] border border-[var(--border-color)] font-medium text-xs sm:text-sm shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LinkedIn Recommendations Section */}
          <div className="max-w-4xl mx-auto">
              <div className="backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-panel">
                <div className="flex items-center gap-3 mb-6 text-center justify-center">
                <FaLinkedin className="text-2xl text-[#0077B5]" />
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white  text-center">
                  Testimonials
                </h2>
                {/* <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full">
                  Verified
                </span> */}
              </div>

              <div className="space-y-4">
                {testimonials.map((testimonial) => {
                  const isExpanded = expandedTestimonial === testimonial.id;
                  const canExpand = testimonial.recommendation.length > 150;
                  const toggle = () => {
                    stopNudges();
                    setExpandedTestimonial(isExpanded ? null : testimonial.id);
                  };
                  return (
                    <Reveal key={testimonial.id}>
                      <div
                        className={`relative rounded-xl bg-black/[0.04] dark:bg-white/[0.05] p-4 ${canExpand ? 'cursor-pointer' : ''}`}
                        onClick={() => {
                          if (!canExpand) return;
                          if (window.getSelection && window.getSelection() && window.getSelection()!.toString()) return;
                          toggle();
                        }}
                      >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <a
                              href={testimonial.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group shrink-0"
                              title={`View ${testimonial.name} on LinkedIn`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-light-accent to-light-accent/70 dark:from-dark-accent dark:to-dark-accent/70 flex items-center justify-center group-hover:ring-2 group-hover:ring-[#0077B5] transition">
                                {testimonial.profileImagePath ? (
                                  <Image
                                    src={require(`@/data/images/${testimonial.profileImagePath}`)}
                                    alt={`${testimonial.name} profile picture`}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-semibold">
                                    {testimonial.name.split(' ').map((n: string) => n[0]).join('')}
                                  </span>
                                )}
                              </div>
                            </a>
                            <div className="min-w-0">
                              <a
                                href={testimonial.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-neutral-900 dark:text-white hover:text-[#0077B5] dark:hover:text-[#0077B5] transition"
                                title={`View ${testimonial.name} on LinkedIn`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {testimonial.name}
                              </a>
                              <p className="text-sm text-neutral-600 dark:text-gray-400">
                                {testimonial.title}{testimonial.company && ` at ${testimonial.company}`}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-gray-500">
                                {testimonial.relationship}
                              </p>
                            </div>
                          </div>
                          {/* The date doubles as the link to where the recommendation lives */}
                          <a
                            href={RECOMMENDATIONS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Read it on LinkedIn"
                            className="shrink-0 self-start ml-[60px] sm:ml-0 inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-gray-400 hover:text-[#0077B5] dark:hover:text-[#4ba3d9] transition-colors"
                          >
                            <FaLinkedin className="w-3.5 h-3.5" />
                            {testimonial.date}
                          </a>
                        </div>

                        {/* Pull quote, swapped for the whole recommendation when opened */}
                        <blockquote key={isExpanded ? 'full' : 'quote'} className="relative pl-7 fade-in">
                          <FaQuoteLeft className="absolute left-0 top-1 w-4 h-4 text-light-accent/50 dark:text-dark-accent/50" />
                          {isExpanded || !testimonial.pullQuote ? (
                            <p className={`${canExpand ? 'pr-10' : ''} text-sm sm:text-base text-neutral-700 dark:text-gray-300 leading-relaxed whitespace-pre-line`}>
                              {testimonial.recommendation}
                            </p>
                          ) : (
                            <p className={`${canExpand ? 'pr-10' : ''} text-base sm:text-lg font-medium leading-snug text-neutral-900 dark:text-white`}>
                              {testimonial.pullQuote}
                            </p>
                          )}
                        </blockquote>

                        {canExpand && (
                          <button
                            ref={nudgeWhenSeen}
                            type="button"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Show less' : `Read the full recommendation from ${testimonial.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggle();
                            }}
                            className={`nudge-once ${nudgesDone ? 'nudge-stop' : ''} absolute bottom-3 right-3 w-8 h-8 rounded-full bg-light-accent/10 dark:bg-dark-accent/15 text-light-accent dark:text-dark-accent flex items-center justify-center hover:bg-light-accent/20 dark:hover:bg-dark-accent/25 transition-colors`}
                          >
                            <svg
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            >
                              <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              {/* Call to Action */}
              {/* <div className="mt-6 text-center">
                <a
                  href="https://www.linkedin.com/in/tanujp/details/recommendations/?detailScreenTabIndex=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#0077B5]/90 transition-colors font-medium"
                >
                  <FaLinkedin />
                  View All Recommendations on LinkedIn
                </a>
              </div> */}
            </div>
          </div>

          {/* Contribution Calendar Section */}
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--card-bg)] backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-panel">
              <div className="flex flex-col lg:flex-row items-center justify-center">
                {/* Stacked layout: title above, grid, legend below, all centered */}
                <div className="flex flex-col items-center w-full">
                  {/* Title */}
                  <div className="mb-2 text-sm text-[var(--foreground)]">
                    Contributions in {selectedYear}
                  </div>
                  
                  {/* Calendar Grid with constrained width for desktop scrolling */}
                  <div className="w-full">
                    {/* Mobile: natural overflow, Desktop: constrained width with scrollbar */}
                    <div className="overflow-x-auto custom-scrollbar lg:max-w-[480px] lg:mx-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                      <div className="inline-block pb-4 lg:pb-2 min-w-full lg:min-w-[480px]">
                        <GitHubCalendar
                          username="tanujp99"
                          colorScheme={theme}
                          blockSize={10}
                          blockMargin={3}
                          fontSize={12}
                          year={selectedYear}
                          hideTotalCount
                          hideColorLegend
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span>Less</span>
                    <span className="flex gap-1">
                      <span className="inline-block w-4 h-4 rounded bg-[#ebedf0] dark:bg-[#161b22] border border-[#d1d5da] dark:border-[#30363d]"></span>
                      <span className="inline-block w-4 h-4 rounded bg-[#9be9a8] dark:bg-[#0e4429] border border-[#d1d5da] dark:border-[#30363d]"></span>
                      <span className="inline-block w-4 h-4 rounded bg-[#40c463] dark:bg-[#006d32] border border-[#d1d5da] dark:border-[#30363d]"></span>
                      <span className="inline-block w-4 h-4 rounded bg-[#30a14e] dark:bg-[#26a641] border border-[#d1d5da] dark:border-[#30363d]"></span>
                      <span className="inline-block w-4 h-4 rounded bg-[#216e39] dark:bg-[#39d353] border border-[#d1d5da] dark:border-[#30363d]"></span>
                    </span>
                    <span>More</span>
                  </div>
                </div>

                {/* Year Selector - Desktop */}
                <div className="hidden lg:flex flex-col items-center justify-center">
                  {Array.from({ length: 7 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <button
                        key={year}
                        className={`px-3 py-1 my-1 rounded-md text-sm font-medium transition-colors duration-150 w-14 h-7 flex items-center justify-center ${
                          selectedYear === year 
                            ? 'bg-light-accent text-white dark:bg-dark-accent dark:text-white' 
                            : 'bg-[var(--button-bg)] text-[var(--foreground)] hover:bg-light-accent/10 dark:hover:bg-dark-accent/20'
                        }`}
                        onClick={() => setSelectedYear(year)}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>

                {/* Year Selector - Mobile */}
                <div className="lg:hidden w-full">
                  <div className="w-36 mx-auto">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleYearChange(selectedYear - 1)}
                        disabled={selectedYear <= Math.min(...availableYears)}
                        className="p-1.5 rounded-md hover:bg-[var(--button-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Previous year"
                      >
                        <svg className="w-4 h-4 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-[var(--foreground)] min-w-[60px] text-center">
                        {selectedYear}
                      </span>
                      <button
                        onClick={() => handleYearChange(selectedYear + 1)}
                        disabled={selectedYear >= Math.max(...availableYears)}
                        className="p-1.5 rounded-md hover:bg-[var(--button-bg)] disabled:opacity-15 disabled:cursor-not-allowed transition-colors"
                        title="Next year"
                      >
                        <svg className="w-4 h-4 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* README Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--card-bg)] backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-panel">
              <div className="prose dark:prose-invert max-w-none">
                {/* GitHub Profile Trophy */}
                <div className="flex justify-center mb-8">
                  <img
                    src={
                      theme=== 'light' 
                        ? "https://github-trophies.vercel.app/?username=tanujp99&rank=SECRET,SSS,SS,S,AAA,AA&theme=false&column=3&margin-w=32&margin-h=15&no-bg=true" 
                        : "https://github-trophies.vercel.app/?username=tanujp99&rank=SECRET,SSS,SS,S,AAA,AA&theme=apprentice&column=3&margin-w=32&margin-h=15&no-bg=false&no-frame=true"
                    }
                    alt="GitHub Profile Trophy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full max-w-[450px]"
                  />
                </div>

                {/* Activity Graph */}
                <div className="mb-8">
                  <ActivityGraph username={GITHUB_USERNAME} name={profile?.name ?? 'Tanuj Palaspagar'} theme={theme} />
                </div>

                {/* Profile Views Counter */}
                <div className="flex justify-center">
                  <img
                    src={theme === 'light' 
                      ? "https://komarev.com/ghpvc/?username=tanujp99&color=c30b4e&style=flat&label=Profile+Visits" 
                      : "https://komarev.com/ghpvc/?username=tanujp99&color=ff90e8&style=flat&label=Profile+Visits"}
                    alt="Profile Views"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pinned Repositories */}
          {SHOW_PINNED_REPOS && pinnedRepos.length > 0 && (
            <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--card-bg)] backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-panel">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Pinned</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pinnedRepos.map((repo) => (
                  <a
                    key={repo.repo}
                    href={repo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] hover:border-light-accent dark:hover:border-dark-accent transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{repo.repo}</h3>
                      {repo.language && (
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-neutral-600 dark:text-gray-400">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-700 dark:text-gray-300 mb-2">{repo.description}</p>
                    <div className="flex gap-4 text-sm text-neutral-600 dark:text-gray-400">
                      {repo.stars !== undefined && (
                        <span>★ {repo.stars}</span>
                      )}
                      {repo.forks !== undefined && (
                        <span>🍴 {repo.forks}</span>
                      )}
                    </div>
                  </a>
                ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}