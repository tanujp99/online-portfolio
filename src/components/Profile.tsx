'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaGithub, FaMapMarkerAlt, FaLink, FaUsers, FaCode, FaStar, FaCodeBranch, FaTwitter, FaLinkedin, FaDiscord, FaReddit, FaSpotify, FaCoffee, FaPatreon, FaXbox, FaSteam } from 'react-icons/fa';
import Image from 'next/image';
import GitHubCalendar from 'react-github-calendar';
import { useTheme } from '../context/ThemeContext';
import ThemedIcon from './ThemedIcon';
import LoadingSpinner from './LoadingSpinner';

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
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 4000));
        
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[rgb(var(--border-color))] overflow-hidden flex items-center justify-center">
                  <ThemedIcon className="w-20 h-20" />
                </div>
                {/* <div className="absolute -bottom-1 -right-1 bg-[rgb(var(--card-bg))] rounded-full p-1 border border-[rgb(var(--border-color))]">
                  <span className="text-xl">🦄</span>
                </div> */}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    {profile.name}
                  </h1>
                  <span className="text-sm text-neutral-600 dark:text-gray-400">({profile.login})</span>
                </div>
                <p className="text-neutral-700 dark:text-gray-300 mb-4">{profile.bio}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-gray-400">
                    <FaUsers className="text-light-accent dark:text-gumroad-pink" />
                    <span>{profile.followers} followers · {profile.following} following</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-gray-400">
                      <FaMapMarkerAlt className="text-light-accent dark:text-gumroad-pink" />
                      {profile.location}
                    </div>
                  )}
                  {profile.blog && (
                    <a
                      href={profile.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-gumroad-pink"
                    >
                      <FaLink className="text-light-accent dark:text-gumroad-pink" />
                      {profile.blog}
                    </a>
                  )}
                  {profile.twitter_username && (
                    <a
                      href={`https://twitter.com/${profile.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-gumroad-pink"
                    >
                      <FaTwitter className="text-light-accent dark:text-gumroad-pink" />
                      @{profile.twitter_username}
                    </a>
                  )}
                </div>
              </div>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--card-bg))] hover:bg-[rgb(var(--border-color))] rounded-lg border border-[rgb(var(--border-color))] text-neutral-700 dark:text-gray-300 transition-colors"
              >
                <FaGithub className="text-light-accent dark:text-gumroad-pink" />
                Follow
              </a>
              </div>
            </div>
          </div>

          {/* Contribution Calendar Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50">
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
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50">
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

              {/* Social Links */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <a href="https://github.com/tanujp99" target="_blank" rel="noopener noreferrer">
                  <img alt="GitHub followers" src="https://img.shields.io/github/followers/tanujp99?label=Github&style=social" />
                </a>
                <a href="https://www.linkedin.com/in/tanujp/" target="_blank" rel="noopener noreferrer">
                  <img alt="LinkedIn URL" src="https://img.shields.io/twitter/url?label=LinkedIn&logo=linkedin&style=social&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Ftanujp%2F" />
                </a>
                <a href="https://twitter.com/tanujpalaspagar" target="_blank" rel="noopener noreferrer">
                  <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/tanujp99?label=Twitter&style=social" />
                </a>
                <a href="https://instagram.com/tanujpalaspagar" target="_blank" rel="noopener noreferrer">
                  <img alt="Twitter URL" src="https://img.shields.io/twitter/url?label=instagram&logo=instagram&style=social&url=https%3A%2F%2Finstagram.com%2Ftanujp99" />
                </a>
                <a href="https://discord.com/users/your-discord-id" target="_blank" rel="noopener noreferrer">
                  <img alt="Discord" src="https://img.shields.io/twitter/url?label=CarmineCrown%236263&logo=discord&style=social&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Ftanujp%2F" />
                </a>
                <a href="http://live.xbox.com/Profile?Gamertag=%3CCarmineCrown%3E" target="_blank" rel="noopener noreferrer">
                  <img alt="Twitter URL" src="https://img.shields.io/twitter/url?label=Xbox&logo=xbox&style=social&url=http%3A%2F%2Flive.xbox.com%2FProfile%3FGamertag%3D%253CCarmineCrown%253E" />
                </a>
                <a href="https://steamcommunity.com/id/carminecrown/" target="_blank" rel="noopener noreferrer">
                  <img alt="Twitter URL" src="https://img.shields.io/twitter/url?label=steam&logo=steam&style=social&url=http%3A%2F%2Fsteamcommunity.com%2Fid%2Ftanujp%2F" />
                </a>
                <a href="https://www.reddit.com/user/CarmineCrown" target="_blank" rel="noopener noreferrer">
                  <img alt="Reddit User Karma" src="https://img.shields.io/reddit/user-karma/combined/carminecrown?label=%E2%80%8Eu%2Fcarminecrown&style=social" />
                </a>
                <a href="https://www.reddit.com/user/tanujp" target="_blank" rel="noopener noreferrer">
                  <img alt="Reddit User Karma" src="https://img.shields.io/reddit/user-karma/combined/tanujp?label=%E2%80%8F%E2%80%8F%E2%80%8E%20%E2%80%8Eu%2Ftanujp&style=social" />
                </a>
                <a href="https://open.spotify.com/user/kpp010?si=VB36HuQZQ8-qG0p5Eyu3Lg" target="_blank" rel="noopener noreferrer">
                  <img alt="Spotify URL" src="https://img.shields.io/twitter/url?label=spotify&logo=spotify&style=social&url=https%3A%2F%2Fopen.spotify.com%2Fuser%2Fkpp010%3Fsi%3DVB36HuQZQ8-qG0p5Eyu3Lg" />
                </a>
                <a href="https://paypal.me/ptanuj" target="_blank" rel="noopener noreferrer">
                  <img alt="Donate to buy me a cup of coffee" src="https://img.shields.io/twitter/url?label=paypal&logo=paypal&style=social&url=https%3A%2F%2Fpaypal.me%2Ftanujp99" />
                </a>
                <a href="https://patreon.com/user?0=u&1=%3D&2=6&3=7&4=8&5=2&6=1&7=0&8=1&9=4&utm_medium=social&utm_source=twitter&utm_campaign=creatorshare" target="_blank" rel="noopener noreferrer">
                  <img alt="Support me on Patreon" src="https://img.shields.io/twitter/url?label=patreon&logo=patreon&style=social&url=https%3A%2F%2Fpatreon.com%2Fuser%3F0%3Du%261%3D%253D%262%3D6%263%3D7%264%3D8%265%3D2%266%3D1%267%3D0%268%3D1%269%3D4%26utm_medium%3Dsocial%26utm_source%3Dtwitter%26utm_campaign%3Dcreatorshare" />
                </a>
              </div>

              {/* Profile Views Counter */}
              {/* 487260 */}
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
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-200/50 dark:border-neutral-800/50">
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