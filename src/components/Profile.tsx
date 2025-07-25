'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaGithub, FaMapMarkerAlt, FaLink, FaUsers, FaCode, FaStar, FaCodeBranch, FaTwitter, FaLinkedin, FaDiscord, FaReddit, FaSpotify, FaCoffee, FaPatreon, FaXbox, FaSteam } from 'react-icons/fa';
import Image from 'next/image';
import GitHubCalendar from 'react-github-calendar';
import { useTheme } from '../context/ThemeContext';
import ThemedIcon from './ThemedIcon';
import LoadingSpinner from './LoadingSpinner';
import { FaQuoteLeft, FaExternalLinkAlt } from 'react-icons/fa';
import testimonialsData from '@/data/testimonials.json';

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
  company: string;
  relationship: string;
  date: string;
  linkedinUrl: string;
  profileImagePath?: string; // Updated to use profileImagePath
  recommendation: string;
  verified?: boolean;
}

let cachedProfile: GitHubData | null = null;
let cachedPinnedRepos: PinnedRepo[] = [];
let dataFetched = false;

export default function Profile() {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<GitHubData | null>(cachedProfile);
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>(cachedPinnedRepos);
  const [loading, setLoading] = useState(!dataFetched);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarLoading, setCalendarLoading] = useState(true);
  const testimonials: Testimonial[] = testimonialsData.testimonials;
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 7 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchData = async () => {
      if (dataFetched && cachedProfile) {
        setProfile(cachedProfile);
        setPinnedRepos(cachedPinnedRepos);
        setLoading(false);
        return;
      }

      try {
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
        
        const fetchGitHubData = async () => {
          const [profileResponse, pinnedReposResponse] = await Promise.all([
            fetch('https://api.github.com/users/tanujp99'),
            fetch('https://gh-pinned-repos.egoist.dev/api?username=tanujp99')
          ]);
          
          const profileData = await profileResponse.json();
          const pinnedReposData = await pinnedReposResponse.json();
          
          cachedProfile = profileData;
          cachedPinnedRepos = Array.isArray(pinnedReposData) ? pinnedReposData : [];
          dataFetched = true;
          
          setProfile(profileData);
          setPinnedRepos(cachedPinnedRepos);
        };

        await Promise.all([minLoadingTime, fetchGitHubData()]);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setPinnedRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="profile" className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner />
      </section>
    );
  }

  if (!profile) {
    return (
      <section id="profile" className="py-8 sm:py-12 md:py-16 overflow-y-auto h-full">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <p className="text-neutral-700 dark:text-gray-300">Failed to load GitHub profile</p>
          </div>
        </div>
      </section>
    );
  }

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
          <div className="w-36 h-36 rounded-full border-4 border-gray-200 dark:border-gray-700 shadow-inner bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >

          {/* Skills & Technologies Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50 shadow dark:shadow-none">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 text-center">Skills & Technologies</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Backend Development */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-light-accent dark:text-gumroad-pink flex items-center gap-2">
                    <span>🔧</span> Backend Development
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Java', 'Spring Boot', 'Python', 'Node.js', 'GraphQL', 'REST APIs', 'Microservices'].map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-neutral-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium text-sm shadow-sm transition-all duration-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cloud & Infrastructure */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-light-accent dark:text-gumroad-pink flex items-center gap-2">
                    <span>☁️</span> Cloud & Infrastructure
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'GitLab CI/CD', 'Apache Airflow', 'Linux'].map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-neutral-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium text-sm shadow-sm transition-all duration-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Data & Analytics */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-light-accent dark:text-gumroad-pink flex items-center gap-2">
                    <span>📊</span> Data & Analytics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Machine Learning', 'TensorFlow', 'Python', 'SQL Server', 'AWS Kinesis', 'RedShift', 'QuickSight'].map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-neutral-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium text-sm shadow-sm transition-all duration-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Database Technologies */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-light-accent dark:text-gumroad-pink flex items-center gap-2">
                    <span>🗄️</span> Database Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['SQL Server', 'PostgreSQL', 'MySQL', 'RedShift', 'Database Design', 'ETL Pipelines'].map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-neutral-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium text-sm shadow-sm transition-all duration-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DevOps & Tools */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-light-accent dark:text-gumroad-pink flex items-center gap-2">
                    <span>🛠️</span> DevOps & Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Git', 'Maven', 'Jenkins', 'Packer', 'Prometheus', 'Grafana', 'Istio'].map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-neutral-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-medium text-sm shadow-sm transition-all duration-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specialized Skills */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-light-accent dark:text-gumroad-pink flex items-center gap-2">
                    <span>🎯</span> Specialized Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['IoT Development', 'Arduino', 'Computer Vision', 'MATLAB', 'System Architecture', 'Algorithm Design'].map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-neutral-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium text-sm shadow-sm transition-all duration-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-neutral-300/50 dark:border-neutral-700/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-light-accent/5 dark:bg-gumroad-pink/5 rounded-lg">
                    <div className="text-2xl font-bold text-light-accent dark:text-gumroad-pink">6+</div>
                    <div className="text-sm text-neutral-600 dark:text-gray-400">Years Experience</div>
                  </div>
                  <div className="p-3 bg-light-accent/5 dark:bg-gumroad-pink/5 rounded-lg">
                    <div className="text-2xl font-bold text-light-accent dark:text-gumroad-pink">15+</div>
                    <div className="text-sm text-neutral-600 dark:text-gray-400">Technologies</div>
                  </div>
                  <div className="p-3 bg-light-accent/5 dark:bg-gumroad-pink/5 rounded-lg">
                    <div className="text-2xl font-bold text-light-accent dark:text-gumroad-pink">3</div>
                    <div className="text-sm text-neutral-600 dark:text-gray-400">Major Awards</div>
                  </div>
                  <div className="p-3 bg-light-accent/5 dark:bg-gumroad-pink/5 rounded-lg">
                    <div className="text-2xl font-bold text-light-accent dark:text-gumroad-pink">1</div>
                    <div className="text-sm text-neutral-600 dark:text-gray-400">Research Paper</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Recommendations Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50 shadow dark:shadow-none">
              <div className="flex items-center gap-3 mb-6 text-center">
                <FaLinkedin className="text-2xl text-[#0077B5]" />
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  LinkedIn Recommendations
                </h2>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full">
                  Verified
                </span>
              </div>

              <div className="space-y-4">
                {testimonials.map((testimonial, index) => {
                  const isExpanded = expandedTestimonial === testimonial.id;
                  const preview = testimonial.recommendation.slice(0, 150);
                  const shouldTruncate = testimonial.recommendation.length > 150;
                  return (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative"
                    >
                      <motion.div
                        className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl p-4 border border-neutral-200/50 dark:border-neutral-800/50 cursor-pointer transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        onClick={(e) => {
                          if (window.getSelection && window.getSelection() && window.getSelection()!.toString()) return;
                          setExpandedTestimonial(isExpanded ? null : testimonial.id);
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                              <a
                                href={testimonial.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                                title={`View ${testimonial.name} on LinkedIn`}
                                onClick={e => e.stopPropagation()}
                              >
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-light-accent to-light-accent/70 dark:from-gumroad-pink dark:to-gumroad-pink/70 flex items-center justify-center group-hover:ring-2 group-hover:ring-[#0077B5] transition">
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
                              <div>
                                <a
                                  href={testimonial.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-neutral-900 dark:text-white hover:text-[#0077B5] dark:hover:text-[#0077B5] transition"
                                  title={`View ${testimonial.name} on LinkedIn`}
                                  onClick={e => e.stopPropagation()}
                                >
                                  {testimonial.name}
                                </a>
                                <p className="text-sm text-neutral-600 dark:text-gray-400">
                                  {testimonial.title} at {testimonial.company}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-gray-500">
                                  {testimonial.relationship}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500 dark:text-gray-500">
                              {testimonial.date}
                            </span>
                          </div>
                        </div>

                        {/* Animated arrow icon at bottom right */}
                        <motion.span
                          className="absolute bottom-2 right-3 text-light-accent dark:text-gumroad-pink opacity-70 pointer-events-none"
                          animate={{ rotate: isExpanded ? 180 : 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <div className="w-4 h-4">
                            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                              <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </motion.span>

                        {/* Recommendation Content */}
                        <div className="relative">
                          <FaQuoteLeft className="absolute -top-1 -left-1 text-light-accent/20 dark:text-gumroad-pink/20 text-lg" />
                          <div className="pl-6">
                            <p className="text-neutral-700 dark:text-gray-300 leading-relaxed">
                              {isExpanded || !shouldTruncate 
                                ? testimonial.recommendation
                                : `${preview}...`
                              }
                            </p>
                            {shouldTruncate && (
                              <button
                                onClick={() => setExpandedTestimonial(isExpanded ? null : testimonial.id)}
                                className="mt-2 text-light-accent dark:text-gumroad-pink hover:underline text-sm font-medium"
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Verification Badge */}
                        {testimonial.verified && (
                          <div className="mt-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/50">
                            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-gray-500">
                              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-[8px]">✓</span>
                              </div>
                              <span>Verified LinkedIn recommendation</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Call to Action */}
              <div className="mt-6 text-center">
                <a
                  href="https://www.linkedin.com/in/tanujp/details/recommendations/?detailScreenTabIndex=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#0077B5]/90 transition-colors font-medium"
                >
                  <FaLinkedin />
                  View All Recommendations on LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Contribution Calendar Section */}
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50 shadow dark:shadow-none">
              <div className="flex flex-col lg:flex-row items-center justify-center">
                {/* Stacked layout: title above, grid, legend below, all centered */}
                <div className="flex flex-col items-center w-full">
                  {/* Title */}
                  <div className="mb-2 text-sm text-neutral-600 dark:text-gray-400">
                    Contributions in {selectedYear}
                  </div>
                  {/* Calendar Grid */}
                  <div className="overflow-x-auto custom-scrollbar w-full flex flex-col lg:items-center justify-center" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="inline-block pb-4 lg:pb-0">
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
                        className={`px-3 py-1 my-1 rounded text-sm font-medium transition-colors duration-150 ${
                          selectedYear === year 
                            ? 'bg-light-accent text-white dark:bg-gumroad-pink dark:text-white' 
                            : 'bg-transparent text-[rgb(var(--foreground-rgb))] hover:bg-light-accent/10 dark:hover:bg-gumroad-pink/20'
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
                        className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Previous year"
                      >
                        <svg className="w-4 h-4 text-neutral-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-neutral-700 dark:text-gray-300 min-w-[60px] text-center">
                        {selectedYear}
                      </span>
                      <button
                        onClick={() => handleYearChange(selectedYear + 1)}
                        disabled={selectedYear >= Math.max(...availableYears)}
                        className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Next year"
                      >
                        <svg className="w-4 h-4 text-neutral-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50 shadow dark:shadow-none">
              <div className="prose dark:prose-invert max-w-none">
                {/* GitHub Profile Trophy */}
                <div className="flex justify-center mb-8">
                  <img
                    src={
                      theme=== 'light' 
                        ? "https://github-profile-trophy.vercel.app/?username=tanujp99&rank=SECRET,SSS,SS,S,AAA,AA&theme=false&column=3&margin-w=32&margin-h=15&no-bg=true" 
                        : "https://github-profile-trophy.vercel.app/?username=tanujp99&rank=SECRET,SSS,SS,S,AAA,AA&theme=apprentice&column=3&margin-w=32&margin-h=15&no-bg=false&no-frame=true"
                    }
                    alt="GitHub Profile Trophy"
                    className="w-full max-w-[450px]"
                  />
                </div>

                {/* Activity Graph */}
                <div className="mb-8">
                  <img
                    src={
                      theme === 'light'
                        ? 'https://github-readme-activity-graph.vercel.app/graph?username=tanujp99&bg_color=FAFAFA&color=212121&title_color=212121&line=a3cfb4&point=c30b4e&area_color=E3F2FD'
                        : 'https://github-readme-activity-graph.vercel.app/graph?username=tanujp99&theme=material'
                    }
                    alt="Activity Graph"
                    className="w-full rounded-2xl"
                    style={{ clipPath: 'inset(2px)' }}
                  />
                </div>

                {/* Profile Views Counter */}
                <div className="flex justify-center">
                  <img
                    src={theme === 'light' 
                      ? "https://komarev.com/ghpvc/?username=tanujp99&color=c30b4e&style=flat&label=Profile+Visits" 
                      : "https://komarev.com/ghpvc/?username=tanujp99&color=ff90e8&style=flat&label=Profile+Visits"}
                    alt="Profile Views"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pinned Repositories */}
          {pinnedRepos.length > 0 && (
            <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50 shadow dark:shadow-none">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Pinned</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pinnedRepos.map((repo) => (
                  <a
                    key={repo.repo}
                    href={repo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-[rgb(var(--card-bg))] rounded-lg border border-[rgb(var(--border-color))] hover:border-light-accent dark:hover:border-gumroad-pink transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{repo.repo}</h3>
                      {repo.language && (
                        <span className="text-xs px-2 py-1 rounded-full bg-[rgb(var(--card-bg))] border border-[rgb(var(--border-color))] text-neutral-600 dark:text-gray-400">
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
        </motion.div>
      </div>
    </section>
  );
}