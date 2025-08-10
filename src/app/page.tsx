'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Satellite, Calendar, Newspaper, Star, ArrowRight, Globe, Zap, Users, TrendingUp } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-blue-400 text-lg">Loading Space Explorer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-30 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 text-blue-400 opacity-20"
        >
          <Rocket className="w-16 h-16" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-32 right-20 text-purple-400 opacity-20"
        >
          <Satellite className="w-12 h-12" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-20 text-pink-400 opacity-20"
        >
          <Globe className="w-14 h-14" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-6 py-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-5 h-5 text-yellow-400" />
              </motion.div>
              <span className="text-blue-300 text-sm font-medium">Explore the Final Frontier</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Space Explorer
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Your gateway to the cosmos. Explore rockets, satellites, launches, and the latest space discoveries with interactive 3D models and real-time data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <Link href="/launches">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                View Launches
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <Link href="/rockets">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
              >
                <Satellite className="w-6 h-6 group-hover:animate-pulse" />
                Explore Rockets
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <Link href="/satellites">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25"
              >
                <Globe className="w-6 h-6 group-hover:animate-pulse" />
                Discover Satellites
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Zap, text: "Real-time Launch Data", color: "text-yellow-400" },
              { icon: Users, text: "Global Space Community", color: "text-green-400" },
              { icon: TrendingUp, text: "Latest Space News", color: "text-pink-400" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-3"
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-gray-300 text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* All Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Explore All Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover the complete range of space exploration tools and information
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Space Missions",
                description: "Track ongoing and planned space missions with detailed milestones and objectives",
                icon: Star,
                href: "/missions",
                color: "from-yellow-500 to-orange-500",
                hoverColor: "hover:from-yellow-400 hover:to-orange-400"
              },
              {
                title: "Organizations",
                description: "Learn about space agencies and organizations from around the world",
                icon: Users,
                href: "/organizations",
                color: "from-blue-500 to-cyan-500",
                hoverColor: "hover:from-blue-400 hover:to-cyan-400"
              },
              {
                title: "Analytics",
                description: "View comprehensive space exploration statistics and insights",
                icon: TrendingUp,
                href: "/analytics",
                color: "from-green-500 to-emerald-500",
                hoverColor: "hover:from-green-400 hover:to-emerald-400"
              },
              {
                title: "News & Updates",
                description: "Stay informed with the latest space exploration news and developments",
                icon: Newspaper,
                href: "/news",
                color: "from-purple-500 to-pink-500",
                hoverColor: "hover:from-purple-400 hover:to-pink-400"
              },
              {
                title: "Launch Sites",
                description: "Explore launch facilities and spaceports around the globe",
                icon: Globe,
                href: "/launches",
                color: "from-red-500 to-pink-500",
                hoverColor: "hover:from-red-400 hover:to-pink-400"
              },
              {
                title: "Space Events",
                description: "Discover upcoming space events and historical milestones",
                icon: Calendar,
                href: "/launches",
                color: "from-indigo-500 to-purple-500",
                hoverColor: "hover:from-indigo-400 hover:to-purple-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 hover:from-slate-600 hover:to-slate-700 transition-all duration-300 border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-xl"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-300 text-base mb-6 line-clamp-3">{feature.description}</p>
                
                <Link href={feature.href}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${feature.color} ${feature.hoverColor} text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    Explore
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {data && (
        <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('/stars.svg')]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Space Exploration Stats
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover the scale of human achievement in space exploration
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[
                { label: 'Organizations', value: data.stats.total_organizations, icon: Star, href: '/organizations', color: 'from-yellow-400 to-orange-400' },
                { label: 'Rockets', value: data.stats.total_rockets, icon: Rocket, href: '/rockets', color: 'from-blue-400 to-cyan-400' },
                { label: 'Satellites', value: data.stats.total_satellites, icon: Satellite, href: '/satellites', color: 'from-green-400 to-emerald-400' },
                { label: 'Total Launches', value: data.stats.total_launches, icon: Calendar, href: '/launches', color: 'from-purple-400 to-pink-400' },
                { label: 'Upcoming', value: data.stats.upcoming_launches, icon: Calendar, href: '/launches', color: 'from-red-400 to-pink-400' },
                { label: 'News Articles', value: data.stats.recent_news, icon: Newspaper, href: '/news', color: 'from-indigo-400 to-blue-400' },
                { label: 'Analytics', value: '📊', icon: TrendingUp, href: '/analytics', color: 'from-emerald-400 to-teal-400' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <Link href={stat.href}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 hover:from-slate-600 hover:to-slate-700 transition-all duration-300 border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-xl"
                    >
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-black text-white mb-3">{stat.value}</div>
                      <div className="text-gray-300 font-medium">{stat.label}</div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Launches */}
      {data && data.upcoming_launches.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                Upcoming Launches
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Countdown to the next chapter in space exploration
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.upcoming_launches.slice(0, 6).map((launch, index) => {
                const countdown = formatCountdown(launch.countdown_seconds);
                return (
                  <motion.div
                    key={launch.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl"
                  >
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{launch.name}</h3>
                    <p className="text-gray-400 mb-6 text-lg">{launch.rocket.organization.name} • {launch.rocket.name}</p>
                    
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-black text-blue-400 mb-2">{countdown.days}</div>
                        <div className="text-sm text-gray-400 font-medium">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-purple-400 mb-2">{countdown.hours}</div>
                        <div className="text-sm text-gray-400 font-medium">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-pink-400 mb-2">{countdown.minutes}</div>
                        <div className="text-sm text-gray-400 font-medium">Minutes</div>
                      </div>
                    </div>
                    
                    <Link href={`/launches/${launch.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        View Details
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="text-center mt-16">
              <Link href="/launches">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-12 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto"
                >
                  View All Launches
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Rockets */}
      {data && data.featured_rockets.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                Featured Rockets
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Engineering marvels that push the boundaries of human achievement
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featured_rockets.slice(0, 6).map((rocket, index) => (
                <motion.div
                  key={rocket.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 hover:from-slate-600 hover:to-slate-700 transition-all duration-300 border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-xl"
                >
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">{rocket.name}</h3>
                  <p className="text-gray-400 mb-4 text-lg">{rocket.organization.name}</p>
                  <p className="text-gray-300 text-base mb-6 line-clamp-2">{rocket.description}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-black text-blue-400 mb-2">{rocket.launch_count}</div>
                      <div className="text-sm text-gray-400 font-medium">Launches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-green-400 mb-2">{rocket.success_rate}%</div>
                      <div className="text-sm text-gray-400 font-medium">Success Rate</div>
                    </div>
                  </div>
                  
                  <Link href={`/rockets/${rocket.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link href="/rockets">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto"
                >
                  View All Rockets
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Satellites */}
      {data && data.featured_satellites.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
                Featured Satellites
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Orbiting marvels that expand our understanding of Earth and space
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featured_satellites.slice(0, 6).map((satellite, index) => (
                <motion.div
                  key={satellite.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl"
                >
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors">{satellite.name}</h3>
                  <p className="text-gray-400 mb-4 text-lg">{satellite.organization.name}</p>
                  <p className="text-gray-300 text-base mb-6 line-clamp-2">{satellite.purpose}</p>
                  
                  <div className="text-center mb-8">
                    <div className="text-3xl font-black text-green-400 mb-2">{satellite.age_in_days}</div>
                    <div className="text-sm text-gray-400 font-medium">Days in Orbit</div>
                  </div>
                  
                  <Link href={`/satellites/${satellite.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link href="/satellites">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-12 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto"
                >
                  View All Satellites
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent News */}
      {data && data.recent_news.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-6">
                Recent News
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Stay updated with the latest developments in space exploration
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.recent_news.slice(0, 6).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 hover:from-slate-600 hover:to-slate-700 transition-all duration-300 border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-gray-400 mb-3 text-lg">{article.source}</p>
                  <p className="text-gray-300 text-base mb-6 line-clamp-3">{article.summary}</p>
                  
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                  >
                    Read More
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link href="/news">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-12 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto"
                >
                  View All News
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Explore Space?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join thousands of space enthusiasts discovering the wonders of the cosmos. From rocket launches to satellite missions, your journey into space starts here.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/launches">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-white/25"
                >
                  <Rocket className="w-6 h-6" />
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/satellites">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-white/25"
                >
                  <Globe className="w-6 h-6" />
                  Explore Satellites
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/news">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300"
                >
                  <Newspaper className="w-6 h-6" />
                  Read Latest News
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
