'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Calendar, MapPin, Satellite, Building2, Clock } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Launch {
  id: number;
  name: string;
  description: string;
  launch_date: string;
  launch_site: string;
  status: string;
  outcome: string;
  countdown_seconds: number;
  days_until_launch: number;
  rocket: {
    id: number;
    name: string;
    description: string;
    organization: {
      id: number;
      name: string;
    };
  };
  satellites: Array<{
    id: number;
    name: string;
    purpose: string;
    organization: {
      id: number;
      name: string;
    };
  }>;
}

export default function LaunchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [launchId, setLaunchId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLaunchId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!launchId) return;
    
    fetch(`http://localhost:3001/api/v1/launches/${launchId}`)
      .then(res => res.json())
      .then(data => {
        setLaunch(data.launch || data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching launch:', error);
        setLoading(false);
      });
  }, [launchId]);

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

  if (!launch) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Launch not found</h1>
          <Link href="/launches">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Back to Launches
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const countdown = formatCountdown(launch.countdown_seconds);
  const isUpcoming = launch.countdown_seconds > 0;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <Link href="/launches">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Launches
            </motion.button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {launch.name}
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl">
              {launch.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Launch Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-slate-800 rounded-lg p-8 mb-8"
              >
                <h2 className="text-2xl font-bold mb-6">Mission Details</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Launch Date</div>
                      <div className="text-white font-semibold">
                        {new Date(launch.launch_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Launch Site</div>
                      <div className="text-white font-semibold">{launch.launch_site}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Rocket</div>
                      <div className="text-white font-semibold">{launch.rocket.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Organization</div>
                      <div className="text-white font-semibold">{launch.rocket.organization.name}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6 text-red-400" />
                    <div className="text-gray-400 text-sm">Status</div>
                  </div>
                  <div className="flex gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      launch.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                      launch.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      launch.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {launch.status}
                    </span>
                    {launch.outcome && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-500/20 text-gray-400">
                        {launch.outcome}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Countdown */}
              {isUpcoming && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-slate-800 rounded-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Countdown to Launch</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-2">{countdown.days}</div>
                      <div className="text-gray-400">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-400 mb-2">{countdown.hours}</div>
                      <div className="text-gray-400">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-pink-400 mb-2">{countdown.minutes}</div>
                      <div className="text-gray-400">Minutes</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Satellites */}
              {launch.satellites && launch.satellites.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-slate-800 rounded-lg p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Payload</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {launch.satellites.map((satellite, index) => (
                      <div key={satellite.id} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Satellite className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">{satellite.organization.name}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{satellite.name}</h3>
                        <p className="text-gray-300 text-sm">{satellite.purpose}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-slate-800 rounded-lg p-6 sticky top-24"
              >
                <h3 className="text-xl font-bold mb-4">Rocket Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm">Rocket Name</div>
                    <div className="text-white font-semibold">{launch.rocket.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Organization</div>
                    <div className="text-white font-semibold">{launch.rocket.organization.name}</div>
                  </div>
                  {launch.rocket.description && (
                    <div>
                      <div className="text-gray-400 text-sm">Description</div>
                      <div className="text-white text-sm">{launch.rocket.description}</div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <Link href={`/rockets/${launch.rocket.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      View Rocket Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 