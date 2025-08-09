'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Building2, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Rocket {
  id: number;
  name: string;
  description: string;
  mass: number;
  height: number;
  diameter: number;
  payload_capacity: number;
  stages: number;
  status: string;
  organization?: {
    id: number;
    name: string;
  };
  launches?: Array<{
    id: number;
    name: string;
    status: string;
    launch_date: string;
  }>;
}

export default function RocketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [rocket, setRocket] = useState<Rocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [rocketId, setRocketId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setRocketId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!rocketId) return;
    
    fetch(`http://localhost:3001/api/v1/rockets/${rocketId}`)
      .then(res => res.json())
      .then(data => {
        setRocket(data.rocket || data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rocket:', error);
        setLoading(false);
      });
  }, [rocketId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!rocket) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Rocket not found</h1>
          <Link href="/rockets">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Back to Rockets
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <Link href="/rockets">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Rockets
            </motion.button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {rocket.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{rocket.organization?.name || 'Unknown Organization'}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                rocket.status === 'active' ? 'bg-green-500/20 text-green-400' :
                rocket.status === 'retired' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {rocket.status}
              </span>
            </div>
            <p className="text-xl text-gray-300 max-w-4xl">
              {rocket.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rocket Details */}
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
                <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Mass</div>
                      <div className="text-white font-semibold">{rocket.mass.toLocaleString()} kg</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Height</div>
                      <div className="text-white font-semibold">{rocket.height} m</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Diameter</div>
                      <div className="text-white font-semibold">{rocket.diameter} m</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Payload Capacity</div>
                      <div className="text-white font-semibold">{rocket.payload_capacity.toLocaleString()} kg</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-red-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Stages</div>
                      <div className="text-white font-semibold">{rocket.stages}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-indigo-400" />
                    <div>
                      <div className="text-gray-400 text-sm">Organization</div>
                      <div className="text-white font-semibold">{rocket.organization?.name || 'Unknown Organization'}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Launches */}
              {rocket.launches && rocket.launches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-slate-800 rounded-lg p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Launch History</h2>
                  <div className="space-y-4">
                    {rocket.launches.map((launch) => (
                      <Link key={launch.id} href={`/launches/${launch.id}`}>
                        <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{launch.name}</h3>
                              <div className="text-sm text-gray-400">
                                {new Date(launch.launch_date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                launch.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                launch.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {launch.status}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </Link>
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
                <h3 className="text-xl font-bold mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm">Organization</div>
                    <div className="text-white font-semibold">{rocket.organization?.name || 'Unknown Organization'}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Status</div>
                    <div className="text-white font-semibold">{rocket.status}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Total Launches</div>
                    <div className="text-white font-semibold">{rocket.launches?.length || 0}</div>
                  </div>
                </div>

                {rocket.organization && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <Link href={`/organizations/${rocket.organization.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                      >
                        View Organization
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 