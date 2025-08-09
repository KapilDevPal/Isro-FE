'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, MapPin, Search, Filter, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Launch {
  id: number;
  name: string;
  launch_date: string;
  launch_site: string;
  status: string;
  outcome: string;
  mission_objective: string;
  countdown_seconds: number;
  days_until_launch: number;
  is_upcoming: boolean;
  is_past: boolean;
  rocket: {
    id: number;
    name: string;
    organization: {
      id: number;
      name: string;
    };
  };
  satellites: Array<{
    id: number;
    name: string;
    purpose: string;
  }>;
}

interface LaunchesData {
  launches: Launch[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export default function LaunchesPage() {
  const [data, setData] = useState<LaunchesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLaunches();
  }, [currentPage, statusFilter, typeFilter]);

  const fetchLaunches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '12',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter === 'upcoming') params.append('type', 'upcoming');
      if (typeFilter === 'past') params.append('type', 'past');

      const response = await fetch(`http://localhost:3001/api/v1/launches?${params}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching launches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLaunches();
  };

  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { days, hours, minutes };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'delayed':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-loading rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Space Launches
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track upcoming launches, explore past missions, and stay updated with the latest space exploration activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search launches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="delayed">Delayed</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Launches</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Launches Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="space-loading rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          ) : data && data.launches.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.launches.map((launch, index) => (
                  <motion.div
                    key={launch.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-all duration-300 card-hover"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-700">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white line-clamp-2">
                          {launch.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(launch.status)}`}>
                          {launch.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Rocket className="w-4 h-4" />
                          <span>{launch.rocket.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{launch.launch_site}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(launch.launch_date)}</span>
                      </div>
                    </div>

                    {/* Countdown or Outcome */}
                    <div className="p-6">
                      {launch.is_upcoming ? (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-blue-400 mb-3">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">Countdown</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {(() => {
                              const countdown = formatCountdown(launch.countdown_seconds);
                              return (
                                <>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">{countdown.days}</div>
                                    <div className="text-xs text-gray-400">Days</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{countdown.hours}</div>
                                    <div className="text-xs text-gray-400">Hours</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-pink-400">{countdown.minutes}</div>
                                    <div className="text-xs text-gray-400">Minutes</div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <span className="font-semibold">Outcome:</span>
                            <span className={launch.outcome === 'success' ? 'text-green-400' : 'text-red-400'}>
                              {launch.outcome || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Mission Objective */}
                      {launch.mission_objective && (
                        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                          {launch.mission_objective}
                        </p>
                      )}

                      {/* Satellites */}
                      {launch.satellites.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-2">Payload:</p>
                          <div className="space-y-1">
                            {launch.satellites.slice(0, 2).map((satellite) => (
                              <p key={satellite.id} className="text-sm text-gray-300">
                                • {satellite.name}
                              </p>
                            ))}
                            {launch.satellites.length > 2 && (
                              <p className="text-sm text-gray-400">
                                +{launch.satellites.length - 2} more
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* View Details Button */}
                      <Link href={`/launches/${launch.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.total_pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-gray-300">
                    Page {currentPage} of {data.pagination.total_pages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(data.pagination.total_pages, currentPage + 1))}
                    disabled={currentPage === data.pagination.total_pages}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Rocket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No launches found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 