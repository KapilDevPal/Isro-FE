'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Satellite, Calendar, Newspaper, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface DashboardData {
  stats: {
    total_organizations: number;
    total_rockets: number;
    total_satellites: number;
    total_launches: number;
    upcoming_launches: number;
    recent_news: number;
  };
  upcoming_launches: Array<{
    id: number;
    name: string;
    launch_date: string;
    countdown_seconds: number;
    days_until_launch: number;
    rocket: {
      id: number;
      name: string;
      organization: {
        id: number;
        name: string;
      };
    };
  }>;
  recent_news: Array<{
    id: number;
    title: string;
    source: string;
    published_at: string;
    summary: string;
    image_url: string;
    url: string;
  }>;
  featured_rockets: Array<{
    id: number;
    name: string;
    description: string;
    image_url: string;
    launch_count: number;
    success_rate: number;
    organization: {
      id: number;
      name: string;
    };
  }>;
  featured_satellites: Array<{
    id: number;
    name: string;
    purpose: string;
    image_url: string;
    age_in_days: number;
    organization: {
      id: number;
      name: string;
    };
  }>;
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/dashboard')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, []);

  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { days, hours, minutes };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('/stars.png')] opacity-20 animate-pulse"></div>
        </div>
        
        {/* Floating Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
          >
            Space Explorer
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Your gateway to the cosmos. Explore rockets, satellites, launches, and the latest space discoveries with interactive 3D models and real-time data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/launches">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Rocket className="w-5 h-5" />
                View Launches
              </motion.button>
            </Link>
            
            <Link href="/rockets">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Satellite className="w-5 h-5" />
                Explore Rockets
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      {data && (
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-center mb-12"
            >
              Space Exploration Stats
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[
                { label: 'Organizations', value: data.stats.total_organizations, icon: Star },
                { label: 'Rockets', value: data.stats.total_rockets, icon: Rocket },
                { label: 'Satellites', value: data.stats.total_satellites, icon: Satellite },
                { label: 'Total Launches', value: data.stats.total_launches, icon: Calendar },
                { label: 'Upcoming', value: data.stats.upcoming_launches, icon: Calendar },
                { label: 'News Articles', value: data.stats.recent_news, icon: Newspaper },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors">
                    <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-300">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Launches */}
      {data && data.upcoming_launches.length > 0 && (
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-center mb-12"
            >
              Upcoming Launches
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.upcoming_launches.slice(0, 6).map((launch, index) => {
                const countdown = formatCountdown(launch.countdown_seconds);
                return (
                  <motion.div
                    key={launch.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
                  >
                    <h3 className="text-xl font-semibold mb-2">{launch.name}</h3>
                    <p className="text-gray-400 mb-4">{launch.rocket.organization.name} • {launch.rocket.name}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{countdown.days}</div>
                        <div className="text-sm text-gray-400">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{countdown.hours}</div>
                        <div className="text-sm text-gray-400">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400">{countdown.minutes}</div>
                        <div className="text-sm text-gray-400">Minutes</div>
                      </div>
                    </div>
                    
                    <Link href={`/launches/${launch.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/launches">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View All Launches
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Rockets */}
      {data && data.featured_rockets.length > 0 && (
        <section className="py-20 bg-slate-800">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-center mb-12"
            >
              Featured Rockets
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featured_rockets.map((rocket, index) => (
                <motion.div
                  key={rocket.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-slate-700 rounded-lg overflow-hidden hover:bg-slate-600 transition-colors"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Rocket className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{rocket.name}</h3>
                    <p className="text-gray-400 mb-4">{rocket.organization.name}</p>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-blue-400">{rocket.launch_count} launches</span>
                      <span className="text-green-400">{rocket.success_rate}% success</span>
                    </div>
                    <Link href={`/rockets/${rocket.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        Explore Rocket
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent News */}
      {data && data.recent_news.length > 0 && (
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-center mb-12"
            >
              Latest Space News
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.recent_news.slice(0, 6).map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors"
                >
                  <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{news.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{news.source}</p>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{news.summary}</p>
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-2"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
